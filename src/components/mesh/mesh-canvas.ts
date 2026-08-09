import {
  MESH_GRID,
  MESH_GRID_COLS,
  MESH_GRID_PAD,
  MESH_GRID_ROWS,
} from "./mesh-grid";

export type MeshMotion = "lively" | "calm";
const PRESETS: Record<MeshMotion, { amp: number; speed: number; zoom: number }> =
  {
    lively: { amp: 0.05, speed: 0.8, zoom: 1.0 },
    calm: { amp: 0.016, speed: 0.3, zoom: 1.6 },
  };

const MAX_DPR = 1.5;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uResolution;
uniform vec4 uCover;
uniform float uTime;
uniform float uAmp;
uniform float uSpeed;
uniform float uZoom;
uniform vec2 uShift;
uniform float uEnergy;
uniform vec3 uSurface;
uniform float uMix;

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 uv = frag / uResolution;
  float t = uTime;
  float amp = uAmp * (1.0 + uEnergy * 2.0);
  vec2 warp = uResolution * amp * (
    vec2(sin(uv.y * 3.0 + t * uSpeed), cos(uv.x * 3.0 + t * uSpeed * 0.85)) +
    0.5 * vec2(sin(uv.x * 5.0 + t * uSpeed * 1.4), cos(uv.y * 5.0 + t * uSpeed * 1.2))
  );
  vec2 center = 0.5 * uResolution;
  vec2 base = center + (frag - center) / uZoom;
  vec2 p = base + warp + uShift;

  float expand = smoothstep(0.0, 0.75, uMix);
  vec2 focus = uCover.xy + vec2(0.63, 0.30) * uCover.zw;
  p = focus + (p - focus) * (1.0 - 0.55 * expand);

  vec2 tuv = clamp((p - uCover.xy) / uCover.zw, 0.0, 1.0);
  vec3 mesh = texture2D(uTex, tuv).rgb;

  float luma = dot(mesh, vec3(0.299, 0.587, 0.114));
  vec3 tinted = uSurface + vec3((luma - 0.45) * 0.14);
  float dilute = smoothstep(0.2, 1.0, uMix);
  gl_FragColor = vec4(mix(mesh, tinted, dilute), 1.0);
}
`;

const SCROLL_SHIFT = 0.35;
const SCROLL_PAN_ZOOM = 0.35;
const ENERGY_PER_PX = 1 / 60;
const ENERGY_DECAY = 0.94;
const SURFACE_TAU = 0.8;

export interface MeshSurfaceControl {
  color: [number, number, number];
  mix: number;
}

export interface MeshCanvasOptions {
  motion?: MeshMotion;
  scrollPan?: boolean;
  surfaceControl?: { current: MeshSurfaceControl };
}

function gridBytes(): Uint8Array {
  const bytes = new Uint8Array(MESH_GRID_COLS * MESH_GRID_ROWS * 4);
  for (let r = 0; r < MESH_GRID_ROWS; r++) {
    for (let c = 0; c < MESH_GRID_COLS; c++) {
      const n = parseInt(
        MESH_GRID[r + MESH_GRID_PAD][c + MESH_GRID_PAD].slice(1),
        16,
      );
      const i = (r * MESH_GRID_COLS + c) * 4;
      bytes[i] = (n >> 16) & 255;
      bytes[i + 1] = (n >> 8) & 255;
      bytes[i + 2] = n & 255;
      bytes[i + 3] = 255;
    }
  }
  return bytes;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function mountMeshCanvas(
  canvas: HTMLCanvasElement,
  { motion = "lively", scrollPan = false, surfaceControl }: MeshCanvasOptions = {},
): (() => void) | null {
  const gl =
    canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    }) ?? canvas.getContext("experimental-webgl");
  if (!(gl instanceof WebGLRenderingContext)) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = vs && fs ? gl.createProgram() : null;
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    MESH_GRID_COLS,
    MESH_GRID_ROWS,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    gridBytes(),
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const uResolution = gl.getUniformLocation(program, "uResolution");
  const uCover = gl.getUniformLocation(program, "uCover");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uShift = gl.getUniformLocation(program, "uShift");
  const uEnergy = gl.getUniformLocation(program, "uEnergy");
  const uSurface = gl.getUniformLocation(program, "uSurface");
  const uMix = gl.getUniformLocation(program, "uMix");

  const preset = PRESETS[motion];
  gl.uniform1f(gl.getUniformLocation(program, "uAmp"), preset.amp);
  gl.uniform1f(gl.getUniformLocation(program, "uSpeed"), preset.speed);
  gl.uniform1f(
    gl.getUniformLocation(program, "uZoom"),
    preset.zoom + (scrollPan ? SCROLL_PAN_ZOOM : 0),
  );
  gl.uniform2f(uShift, 0, 0);
  gl.uniform1f(uEnergy, 0);
  gl.uniform3f(uSurface, 1, 1, 1);
  gl.uniform1f(uMix, 0);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uResolution, w, h);
    const s = Math.max(w / MESH_GRID_COLS, h / MESH_GRID_ROWS);
    const drawnW = MESH_GRID_COLS * s;
    const drawnH = MESH_GRID_ROWS * s;
    gl.uniform4f(uCover, (w - drawnW) / 2, (h - drawnH) / 2, drawnW, drawnH);
  };
  resize();

  const start = performance.now();
  let raf = 0;
  let visible = true;
  let inView = true;

  let prevScrollY = window.scrollY;
  let energy = 0;
  const surface = surfaceControl
    ? {
        color: [...surfaceControl.current.color] as [number, number, number],
        mix: surfaceControl.current.mix,
      }
    : null;
  let lastFrame = performance.now();

  const draw = () => {
    const now = performance.now();
    const dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;
    gl.uniform1f(uTime, (now - start) / 1000);
    if (scrollPan) {
      const range = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(window.scrollY / range, 1);
      gl.uniform2f(uShift, -progress * SCROLL_SHIFT * canvas.width, 0);

      const velocity = Math.abs(window.scrollY - prevScrollY);
      prevScrollY = window.scrollY;
      energy = Math.max(
        Math.min(velocity * ENERGY_PER_PX, 1),
        energy * ENERGY_DECAY,
      );
      gl.uniform1f(uEnergy, energy);
    }
    if (surfaceControl && surface) {
      const target = surfaceControl.current;
      const k = 1 - Math.exp(-dt / SURFACE_TAU);
      surface.mix += (target.mix - surface.mix) * k;
      for (let i = 0; i < 3; i++) {
        surface.color[i] += (target.color[i] - surface.color[i]) * k;
      }
      gl.uniform3f(
        uSurface,
        surface.color[0] / 255,
        surface.color[1] / 255,
        surface.color[2] / 255,
      );
      gl.uniform1f(uMix, surface.mix);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const loop = () => {
    draw();
    raf = requestAnimationFrame(loop);
  };
  const setRunning = () => {
    cancelAnimationFrame(raf);
    if (visible && inView) {
      resize();
      raf = requestAnimationFrame(loop);
    }
  };

  const ro = new ResizeObserver(() => {
    resize();
    draw();
  });
  ro.observe(canvas);

  const onVisibility = () => {
    visible = document.visibilityState === "visible";
    setRunning();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    setRunning();
  });
  io.observe(canvas);

  draw();
  setRunning();

  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
    io.disconnect();
    ro.disconnect();
    gl.deleteTexture(tex);
    gl.deleteBuffer(buf);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
}
