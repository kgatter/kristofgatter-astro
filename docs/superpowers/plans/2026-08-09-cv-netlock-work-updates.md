# CV Page + PDF + Netlock Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Kristof's CV as a web page at `/cv` in his preferred two-column layout, generate the downloadable `public/KristofGatterCV.pdf` from that same page, and add the Netlock position to /work using his provided copy.

**Architecture:** One source of truth: `src/pages/cv/index.astro`, a published Astro page using the site's Layout/fonts, laid out like the pre-2025 CV (two-column grid: company + dates + role left, bullets right; contact block top-right). A `@media print` stylesheet turns the same page into a clean A4 document; `cv/build-cv.sh` builds the site, serves `dist/`, and prints `/cv` to `public/KristofGatterCV.pdf` with headless Chrome. The /work page gets a "My CV" button (→ `/cv`, where a "Download as PDF" button lives) and a new Netlock `work-item` section on top.

**Tech Stack:** Astro 5 static site, pnpm, headless Google Chrome (`--print-to-pdf`), no test framework (verification = `pnpm build` + browser checks + reading the generated PDF).

**Layout reference:** the current `public/KristofGatterCV.pdf` in git (the old two-column CV). It gets overwritten by the regenerated PDF in Task 2 — that's fine, git history preserves it.

---

## Decisions

1. ✅ **Layout:** Two-column layout from the old CV, applied to both the `/cv` web page and the printed PDF. Content comes from the 2026 AI-friendly CV (plus Netlock). The DOM stays in linear semantic order (company → role → bullets), so PDF text extraction remains machine-readable even with the visual two-column grid. *(If Kristof would rather keep a strictly single-column AI-friendly PDF while the web page stays two-column, only the print CSS needs changing — flag at review.)*
2. ✅ **Shapr3D end date:** "July 2025 – April 2026" (confirmed).
3. ✅ **Netlock URL:** `https://www.netlock.com/` (confirmed).
4. ⚠️ **Netlock job title:** Kristof's temp copy says **"Principal Design Engineer"**; his first message said "Senior UX / UI Developer and Design Lead". The plan uses **Principal Design Engineer** everywhere (newer message wins). Confirm at review.
5. ⚠️ **Netlock copy is "temp txt for now":** the /work description and the CV bullets derived from it are Kristof's own words but explicitly temporary — he reviews before deploying.
6. ⚠️ **Illustration images (Netlock + Shapr3D):** Kristof will provide them → save as `public/images/work/netlock.png` and `public/images/work/shapr3d.png`. For either one that hasn't arrived by execution time, ship the no-illustration variant (omit the `<div class="illustration">` block) and note it in the PR.
7. ⚠️ **Shapr3D /work description:** DRAFT written by the agent from the CV bullets (Task 5) — Kristof reviews/rewrites before deploying.
8. ✅ **/work buttons:** "Request a Portfolio" (green, unchanged) + "My CV" (purple → `/cv`). The PDF download button ("Download as PDF", with `download` attribute) lives on `/cv`; the direct URL `/KristofGatterCV.pdf` also keeps working. This satisfies "PDF still downloadable" without three buttons on /work.

---

## File Structure

- **Create** `src/pages/cv/index.astro` — the CV page (published at `/cv`), all content + two-column CSS + print CSS in one file, following the site's existing single-file page pattern.
- **Create** `cv/build-cv.sh` — builds the site, serves `dist/`, prints `http://localhost:8123/cv/` to `public/KristofGatterCV.pdf`.
- **Overwrite** `public/KristofGatterCV.pdf` — generated artifact, committed.
- **Modify** `src/pages/work/index.astro` — "My CV" button in header (~line 43–46); new Netlock and Shapr3D `work-item` sections right after `</header>` (~line 48), in that order (newest first, matching the page's reverse-chronological order).
- **Create** (assets from Kristof): `public/images/work/netlock.png`, `public/images/work/shapr3d.png`.

---

### Task 1: The `/cv` page

**Files:**
- Create: `src/pages/cv/index.astro`

- [ ] **Step 1: Create `src/pages/cv/index.astro` with the complete content below**

Content = the 2026 CV (transcribed from `/Users/kgatter/Documents/Job Search/Kristof Gatter CV Updated.pdf`) + Netlock entry (bullets derived from Kristof's temp copy) + Shapr3D closed at April 2026. Layout = old two-column CV. Header identity line and "(Budapest, 1986)" come from the old layout.

```astro
---
import Layout from "../../layouts/Layout.astro";
---

<Layout title="Kristof Gatter CV — Digital Product Designer">
  <main>
    <nav class="no-print">
      <a class="backlink" href="/">
        <svg width="21px" height="16px" viewBox="0 0 21 16"
          ><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
            ><g transform="translate(-55.000000, -50.000000)" fill="#000000"
              ><polygon
                points="76 56.8056164 59.4577827 56.8056164 64.5029478 51.6722974 62.8597354 50 55 58 62.8597354 66 64.5029478 64.3277026 59.4577827 59.1943836 76 59.1943836"
              ></polygon></g
            ></g
          ></svg
        >
        <span>Kristof Gatter <b>Digital Product Designer</b> / CV</span>
      </a>
    </nav>

    <header class="cv-header">
      <div>
        <p>Reuven I. Kristof Gatter (Budapest, 1986)</p>
        <p>Digital Product Designer <b>Curriculum Vitae</b></p>
      </div>
      <p class="contact">
        <a href="mailto:mail@kristofgatter.com">mail@kristofgatter.com</a><br />
        <a href="https://www.kristofgatter.com">www.kristofgatter.com</a><br />
        +49 176 84736084
      </p>
    </header>

    <section class="intro">
      <p>
        Hi there! I’m a Product Designer who thrives on creating simple
        solutions for complex software. Most of my recent work has been in B2B
        SaaS, simplifying dense workflows, designing scalable systems, and
        collaborating closely with engineering teams.
      </p>
      <p>
        As a “coding designer” at heart, I’m comfortable moving seamlessly
        between product strategy, interface design, and technical
        implementation. Alongside my core design work, I frequently facilitate
        user research, lead stakeholder workshops, and mentor teams on product
        thinking.
      </p>
      <a
        class="kgbutton no-print"
        href="/KristofGatterCV.pdf"
        download="Kristof Gatter CV.pdf">Download as PDF</a
      >
    </section>

    <h2>Work Experience as an Employee</h2>

    <section class="job">
      <div class="who">
        <h3>Netlock</h3>
        <p class="stint">
          April 2026 –<br />
          <b>Principal Design Engineer</b>
        </p>
      </div>
      <!-- Bullets derived from Kristof's temp copy — review before deploying -->
      <ul>
        <li>
          Turned the brand into a working design language, so the product, the
          enrollment flow, the login screens and the transactional emails read
          as one company.
        </li>
        <li>
          Built the design system on top of it: one component library instead
          of dozens of near-duplicates, with a round-trip into a native Sketch
          library that keeps design and engineering on the same components.
        </li>
        <li>
          Design and ship production features end-to-end: plans and billing,
          the organization admin console, certificate management.
        </li>
        <li>Own the marketing site.</li>
        <li>
          Run much of the execution through a fleet of AI agents I direct and
          review.
        </li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>Shapr3D</h3>
        <p class="stint">
          July 2025 – April 2026<br />
          <b>Product Designer</b>
        </p>
      </div>
      <ul>
        <li>Built UI prototypes for Web, MacOS, iPadOS, and Windows.</li>
        <li>Developed UI components directly in code (SwiftUI, React).</li>
        <li>
          Contributed to features including in-app sharing and view-only CAD
          workspace.
        </li>
        <li>
          Established ongoing usability testing practices and scenario-based
          design.
        </li>
        <li>
          Facilitated cross-functional workshops with Marketing, UX Research,
          and Product to map user scenarios for further design work.
        </li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>Sparetech</h3>
        <p class="stint">
          March 2024 – July 2025<br />
          <b>Lead Product Designer</b>
        </p>
        <p class="stint">
          November 2022 – February 2024<br />
          <b>Senior Product Designer</b>
        </p>
      </div>
      <ul>
        <li>
          Shipped a full design system with Storybook as the single source of
          truth for Design and Engineering.
        </li>
        <li>
          Defined a unified Design Vision covering UX reviews, personas, and
          prototypes with refreshed information architecture and visual
          identity.
        </li>
        <li>Mentored junior designers to promotion level.</li>
        <li>
          Co-created Team Values and internal guides with the Design Team and
          Head of Product.
        </li>
        <li>
          Facilitated and defined processes for cross-functional collaboration
          between Engineering, Design, and Product.
        </li>
        <li>
          Led feature development end-to-end: shaping features, Figma
          prototypes, production code, usability tests, and analyzing
          quantitative usage data.
        </li>
        <li>
          Established best practices for continuous usability testing and early
          code-built prototype testing.
        </li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>workstreams.ai</h3>
        <p class="stint">
          March 2022 – October 2022<br />
          <b>Senior Product Designer</b>
        </p>
      </div>
      <ul>
        <li>
          Oversaw the introduction of a new design language incl. a full UI
          redesign
        </li>
        <li>
          Started the execution of a new design system incl. documentation of
          UI components
        </li>
        <li>
          Worked on feature development (new subscription management page,
          team management and invitation flow, etc.) incl. shipping production
          code in React and SCSS
        </li>
        <li>Introduced scenario-based design practice</li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>(Sabbatical)</h3>
        <p class="stint">August 2021 – March 2022</p>
      </div>
    </section>

    <section class="job">
      <div class="who">
        <h3>GotPhoto</h3>
        <p class="stint">
          November 2019 – July 2021<br />
          <b>Product Design Lead</b>
        </p>
        <p class="stint">
          August 2019 – October 2019<br />
          <b>Freelance Product Design Consultant</b>
        </p>
      </div>
      <ul>
        <li>
          Set up a design team, defined responsibilities, and managed
          day-to-day operations.
        </li>
        <li>
          Directed product strategy by testing and challenging assumptions
          about customer behavior.
        </li>
        <li>
          Documented complex user journeys and scenarios for strategic
          decision-making.
        </li>
        <li>Mentored junior designers, frontend developers, and QA.</li>
        <li>
          Contributed directly to UI development and streamlined the design
          process.
        </li>
        <li>Advised C-level leadership on product design and strategy.</li>
        <li>
          Built a new shop client in four months and defined a new UI design
          language.
        </li>
        <li>
          Overhauled information architecture with documentation and
          established a lightweight Storybook design system with automated
          approval workflow.
        </li>
        <li>
          Assembled a feature team for administration UI overhaul, improving UX
          and new-user satisfaction.
        </li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>Small Improvements</h3>
        <p class="stint">
          Jun 2015 – Jul 2016<br />
          <b>UX/UI Developer &amp; Designer</b>
        </p>
      </div>
      <ul>
        <li>
          Contributed code in AngularJS and React for Responsive UI Transition
          Dev Team.
        </li>
        <li>Introduced systematic user testing and UX design principles.</li>
        <li>Led a UI/UX overhaul of the 360° Feedback feature.</li>
      </ul>
    </section>

    <h2>Self-Employed Experience</h2>

    <section class="job">
      <div class="who">
        <h3>improveme.io</h3>
        <p class="stint">
          May 2023 – Present<br />
          <b>Co-Founder, Product Designer and UI Developer</b>
        </p>
      </div>
      <ul>
        <li>
          Initiated a software project to democratize HR-driven feedback
          processes.
        </li>
        <li>
          Developed UI using React (Next.js, shadcn/Radix UI) and bootstrapped
          a working web-app.
        </li>
        <li>Designed and managed end-to-end product development.</li>
        <li>
          Successfully tested the prototype with students at the University of
          Amsterdam.
        </li>
        <li>Currently maintains project as a hobby.</li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>Hackerbay</h3>
        <p class="stint">
          Aug 2018 – Jul 2019<br />
          <b>Freelance Product Design Consultant</b>
        </p>
      </div>
      <ul>
        <li>
          Principal designer on in-house SaaS MVP and multiple e-commerce
          projects for large international / DACH brands
        </li>
        <li>
          Created wireframes, low- and high-fidelity prototypes, and user
          flows.
        </li>
        <li>
          Facilitated workshops with developers and stakeholders. Conducted
          usability testing and coordinated development priorities.
        </li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>Modulor</h3>
        <p class="stint">
          March 2018 – July 2019<br />
          <b>Freelance UX/UI Consultant</b>
        </p>
      </div>
      <ul>
        <li>
          Mapped customer journeys and redesigned online furniture
          configurator.
        </li>
        <li>Improved shopping experience on touch devices.</li>
        <li>
          Facilitated and conducted on-site usability testing with actual store
          customers.
        </li>
        <li>
          Developed a concept for full online shop revamp, including sales
          funnels and usability improvements.
        </li>
        <li>
          Contributed directly to UI development and championed agile,
          cross-functional processes.
        </li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>Ignore Gravity, Beluga Strategic Design, WIRED Campus</h3>
        <p class="stint">
          August 2016 – July 2019<br />
          <b>Design Consultant, Resident Workshop Designer</b>
        </p>
      </div>
      <ul>
        <li>
          Facilitated workshops for clients ranging from automotive companies
          to energy-sector startups.
        </li>
        <li>
          Supported participants with storytelling, pitch presentations, and
          product mock-ups.
        </li>
        <li>Led teams of designers on multiple occasions.</li>
      </ul>
    </section>

    <section class="job">
      <div class="who">
        <h3>Universität der Künste Berlin (UdK Berlin)</h3>
        <p class="stint">
          May 2013 – April 2017<br />
          <b>Lecturer, Coding for Designers</b>
        </p>
      </div>
      <ul>
        <li>
          Developed and taught a web design and coding course tailored to
          design students.
        </li>
        <li>
          Built a presentation app and unique methodology for teaching
          purposes.
        </li>
      </ul>
    </section>

    <div class="closing">
      <section>
        <h2>Education</h2>
        <p>
          <b>University of the Arts Berlin (UdK Berlin)</b><br />
          2007 – 2014: Dipl.-Designer (equivalent to MA)<br />
          Grade: “very good”
        </p>
        <p>
          <b>Deutsche Schule Budapest</b><br />
          2005: Abitur
        </p>
      </section>
      <section>
        <h2>Skills &amp; Tools</h2>
        <p>
          <b>UX / Product Design Toolset:</b> Wireframing, Prototypes (both
          figma and code), Design Systems, Usability Testing, Scenario-based
          Design, User Flows, Personas, Information Architecture, Workshops,
          Cross-functional Collaboration, Product Strategy, Mentoring.
        </p>
        <p>
          <b>Software I use regularly:</b> Figma, Storybook, Git, VSCode,
          XCode, Claude Code
        </p>
        <p>
          <b>Familiar with:</b> React, Next.js, SwiftUI, shadcn/Radix
          UI/base-ui, HTML/CSS
        </p>
        <p>
          <b>Product Management Methodologies:</b> Shape-Up, End-to-End
          Product Development, Continuous Usability Testing, Scenario-based
          Design, <i>True</i> Agile
        </p>
      </section>
    </div>
  </main>
</Layout>

<style>
  main,
  nav {
    display: block;
    margin: 0 auto;
    padding-top: 2em;
  }

  main {
    max-width: 52em;
    padding: 0 1em 10em;
    font-size: var(--fontSizeS);
    letter-spacing: -0.01em;
    line-height: 1.5;
  }

  .cv-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2em;
    margin: 2em 0 3em;

    & p {
      font-size: var(--fontSizeM);
      max-width: none;
      margin-bottom: 0.2em;
    }
    & .contact {
      font-size: var(--fontSizeS);
      text-align: right;
      line-height: 1.6;
      & a {
        color: var(--black);
        text-decoration: none;
      }
    }
    @media (max-width: 684px) {
      flex-direction: column;
      & .contact {
        text-align: left;
      }
    }
  }

  .intro {
    margin-bottom: 4em;
    & p {
      font-size: var(--fontSizeM);
      max-width: 33em;
    }
    & .kgbutton {
      margin-top: 1em;
    }
  }

  h2 {
    font-size: var(--fontSizeM);
    margin: 3em 0 1.5em;
  }

  .job {
    display: grid;
    grid-template-columns: 15em 1fr;
    column-gap: 2.5em;
    margin-bottom: 2.5em;

    @media (max-width: 684px) {
      grid-template-columns: 1fr;
      row-gap: 0.7em;
    }

    & h3 {
      font-size: var(--fontSizeS);
      font-weight: 500;
      margin: 0 0 0.7em;
    }
    & .stint {
      font-size: var(--fontSizeS);
      max-width: none;
      margin-bottom: 0.7em;
      & b {
        font-weight: 500;
      }
    }
    & ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    & li {
      position: relative;
      padding-left: 1.2em;
      margin-bottom: 0.4em;
      &::before {
        content: "•";
        position: absolute;
        left: 0.1em;
      }
    }
  }

  .closing {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3em;
    margin-top: 4em;

    @media (max-width: 684px) {
      grid-template-columns: 1fr;
    }
    & h2 {
      margin-top: 0;
    }
    & p {
      font-size: var(--fontSizeS);
      max-width: none;
      margin-bottom: 1em;
    }
  }

  @media print {
    @page {
      size: A4;
      margin: 16mm 14mm;
    }
    .no-print {
      display: none !important;
    }
    main {
      /* Redefining the site's font-size custom props here cascades to all
         descendants without needing global selectors. */
      --fontSizeM: 12px;
      --fontSizeS: 9.5px;
      max-width: 100%;
      padding: 0;
      font-size: var(--fontSizeS);
    }
    .cv-header {
      margin-top: 0;
    }
    .intro {
      margin-bottom: 2em;
    }
    .job,
    .closing section {
      break-inside: avoid;
    }
    h2 {
      break-after: avoid;
    }
    .cv-header .contact a,
    .intro a {
      text-decoration: none;
    }
  }
</style>
```

- [ ] **Step 2: Verify the web page**

Run `pnpm dev`, open `http://localhost:4321/cv`. Check: two-column job grid at desktop width; single column at 375px; Graphik font loads; backlink navigates home; "Download as PDF" button present (it downloads the *old* PDF until Task 2 regenerates it — expected); Netlock entry first with "Principal Design Engineer"; Shapr3D shows "July 2025 – April 2026". Stop the dev server.

- [ ] **Step 3: Verify the print layout in the browser**

With the dev server running, use headless Chrome or the browser's print preview on `/cv`: nav and download button hidden, two-column layout intact, ~2–3 A4 pages, no job split across pages.

- [ ] **Step 4: Commit**

```bash
git add src/pages/cv/index.astro
git commit -m "feat: add /cv page in two-column layout with Netlock position"
```

---

### Task 2: PDF generation script

**Files:**
- Create: `cv/build-cv.sh`
- Overwrite: `public/KristofGatterCV.pdf` (generated)

- [ ] **Step 1: Create `cv/build-cv.sh`**

```bash
#!/usr/bin/env bash
# Regenerates public/KristofGatterCV.pdf by printing the built /cv page
# with headless Chrome. Run from anywhere: ./cv/build-cv.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8123

pnpm build

python3 -m http.server "$PORT" --directory dist &>/dev/null &
SERVER_PID=$!
trap 'kill $SERVER_PID' EXIT
sleep 1

"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$PWD/public/KristofGatterCV.pdf" \
  "http://localhost:$PORT/cv/"

echo "Wrote public/KristofGatterCV.pdf"
```

- [ ] **Step 2: Make it executable and run it**

```bash
chmod +x cv/build-cv.sh && ./cv/build-cv.sh
```

Expected: `astro build` completes, then a Chrome log line, then `Wrote public/KristofGatterCV.pdf`. `ls -la public/KristofGatterCV.pdf` shows a fresh timestamp.

- [ ] **Step 3: Verify the PDF**

Read `public/KristofGatterCV.pdf` with the Read tool. Check: (a) two-column layout matching the old CV's structure, (b) Netlock entry first ("Principal Design Engineer", April 2026 –), (c) Shapr3D closed at April 2026, (d) Graphik letterforms (not fallback), (e) no nav/download button, no browser header/footer, (f) no job entry split across a page break, (g) extracted text reads in sensible linear order (company → role → bullets).

- [ ] **Step 4: Commit**

```bash
git add cv/build-cv.sh public/KristofGatterCV.pdf
git commit -m "feat: generate CV PDF from /cv page via headless Chrome"
```

---

### Task 3: "My CV" button on /work

**Files:**
- Modify: `src/pages/work/index.astro:43-46` (header block) and the `<style>` header rules (~line 436)

- [ ] **Step 1: Add the button after "Request a Portfolio"**

The header currently ends with:

```html
        <a
          href="mailto:mail@kristofgatter.com?subject=Requesting a Portfolio&body=I'm interested in more of your work. Please send me a PDF portfolio."
          class="kgbutton">Request a Portfolio</a
        >
```

Immediately after that `</a>`, add:

```html
        <a href="/cv" class="kgbutton purple">My CV</a>
```

- [ ] **Step 2: Space the two buttons apart**

In the same file's `<style>` block, change the `.kgbutton` rule inside `header`:

```css
    & .kgbutton {
      margin-bottom: 0;
      margin-right: 0.5em;
      @media (max-width: 684px) {
        margin-bottom: 0.5em;
      }
    }
```

- [ ] **Step 3: Verify in the browser**

`pnpm dev` → `http://localhost:4321/work`: buttons sit side by side (wrap cleanly at 375px), "My CV" navigates to `/cv`, and on `/cv` the "Download as PDF" button downloads the regenerated PDF. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/work/index.astro
git commit -m "feat: link CV page from work page header"
```

---

### Task 4: Netlock work item on /work

**Files:**
- Modify: `src/pages/work/index.astro` — insert new section between `</header>` (line 48) and the Sparetech `<section class="work-item">` (line 49)
- Create (asset from Kristof): `public/images/work/netlock.png`

- [ ] **Step 1: Obtain the illustration asset**

Kristof confirmed he will provide a Netlock work image (same style as the others: product UI screenshot / device mockup, ~1600px wide PNG). Ask him for the file (or its path) and save it as `public/images/work/netlock.png`. **Only if it hasn't arrived by execution time**, use Variant B below (no illustration) and leave a follow-up note in the PR description.

- [ ] **Step 2: Insert the Netlock section as the first work item**

Copy below is Kristof's own temp text, verbatim except paragraph breaks (`<br /><br />`, matching the GotPhoto item's pattern). Insert immediately after `</header>` (Variant A, with image):

```html
    <section class="work-item">
      <h1>Principal Design Engineer @ Netlock (2026 —)</h1>
      <div class="description">
        <p>
          Netlock is a Hungarian certificate authority and one of the EU's
          qualified trust service providers. Their platform lets you verify
          your identity once, have a qualified certificate issued, and then
          use it to sign documents, approve contracts and seal media files —
          with signatures that carry the same legal weight as handwritten ones
          across the EU. Because Netlock issues the certificates itself, the
          entire chain sits inside one product instead of being rented from a
          third party.
          <br /><br />
          I turned the brand into a working design language, so the product, the
          enrollment flow, the login screens and the transactional emails now read
          as one company. The design system came out of that: one component library
          instead of dozens of near-duplicates, with a round-trip into a native
          Sketch library that keeps design and engineering on the same components.
          I also own the marketing site.
          <br /><br />
          Alongside that I design and ship production features myself — plans and
          billing, the organization admin console, certificate management. Much
          of the execution runs through a fleet of AI agents I direct and review.
        </p>
        <a class="work-link" href="https://www.netlock.com/" target="_blank"
          >Netlock <svg width="20px" height="20px" viewBox="0 0 100 100"
            ><g
              ><path
                d="m83.301 79.699c0 2-1.6016 3.6016-3.6016 3.6016h-59.398c-2 0-3.6016-1.6016-3.6016-3.6016v-59.398c0-2 1.6016-3.6016 3.6016-3.6016h23.398v-7.1992h-23.398c-6 0-10.801 4.8008-10.801 10.801v59.398c0 6 4.8008 10.801 10.801 10.801h59.398c6 0 10.801-4.8008 10.801-10.801v-23.398h-7.1992z"
              ></path><path
                d="m56.301 9.5v7.1992h21.898l-28.301 28.301 5.1016 5.1016 28.301-28.301v21.898h7.1992v-34.199z"
              ></path></g
            ></svg
          ></a
        >
      </div>
      <div class="illustration">
        <img
          width="100%"
          alt="Netlock product UI"
          src="/images/work/netlock.png"
        />
      </div>
    </section>
```

Variant B (image not yet available): identical markup but omit the entire `<div class="illustration">…</div>` block. The `.description` div (`flex: 1 1 50%`) then grows to fill the row.

- [ ] **Step 3: Verify in the browser**

`pnpm dev` → `http://localhost:4321/work`: Netlock section appears first (above Sparetech), matches the visual pattern of the other work items, the external link icon animates on hover, and (Variant A) the zoom-on-focus script applies (scroll the section >50% into view at ≥684px width → image scales up). Check 375px width: description stacks below illustration. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/work/index.astro public/images/work/netlock.png
git commit -m "feat: add Netlock position to work page"
```

(Drop the image path from `git add` if using Variant B.)

---

### Task 5: Shapr3D work item on /work

**Files:**
- Modify: `src/pages/work/index.astro` — insert new section between the Netlock section (added in Task 4) and the Sparetech `<section class="work-item">`
- Create (asset from Kristof): `public/images/work/shapr3d.png`

- [ ] **Step 1: Obtain the illustration asset**

Ask Kristof for a Shapr3D work image (same style as the others: product UI screenshot / device mockup, ~1600px wide PNG) and save it as `public/images/work/shapr3d.png`. **Only if it hasn't arrived by execution time**, use Variant B below (no illustration) and leave a follow-up note in the PR description.

- [ ] **Step 2: Insert the Shapr3D section between Netlock and Sparetech**

The description is a DRAFT composed from Kristof's CV bullets (decision #7 — he reviews before deploying). Variant A, with image:

```html
    <section class="work-item">
      <h1>Product Designer @ Shapr3D (2025 — 2026)</h1>
      <div class="description">
        <p>
          <!-- DRAFT copy — Kristof to review before deploying -->
          Shapr3D is a professional multiplatform CAD app used by engineers
          and industrial designers on iPad, Mac, Windows and the web. As a
          Product Designer I built UI prototypes across all four platforms and
          developed UI components directly in code, in SwiftUI and React.
          <br /><br />
          I contributed to features including in-app sharing and the view-only
          CAD workspace, helped establish ongoing usability testing and
          scenario-based design practices, and facilitated cross-functional
          workshops with Marketing, UX Research and Product to map the user
          scenarios that fed further design work.
        </p>
        <a class="work-link" href="https://www.shapr3d.com/" target="_blank"
          >Shapr3D <svg width="20px" height="20px" viewBox="0 0 100 100"
            ><g
              ><path
                d="m83.301 79.699c0 2-1.6016 3.6016-3.6016 3.6016h-59.398c-2 0-3.6016-1.6016-3.6016-3.6016v-59.398c0-2 1.6016-3.6016 3.6016-3.6016h23.398v-7.1992h-23.398c-6 0-10.801 4.8008-10.801 10.801v59.398c0 6 4.8008 10.801 10.801 10.801h59.398c6 0 10.801-4.8008 10.801-10.801v-23.398h-7.1992z"
              ></path><path
                d="m56.301 9.5v7.1992h21.898l-28.301 28.301 5.1016 5.1016 28.301-28.301v21.898h7.1992v-34.199z"
              ></path></g
            ></svg
          ></a
        >
      </div>
      <div class="illustration">
        <img
          width="100%"
          alt="Shapr3D UI on iPad and desktop"
          src="/images/work/shapr3d.png"
        />
      </div>
    </section>
```

Variant B (image not yet available): identical markup but omit the entire `<div class="illustration">…</div>` block.

- [ ] **Step 3: Verify in the browser**

`pnpm dev` → `http://localhost:4321/work`: order is Netlock → Shapr3D → Sparetech → improveme.io …; the Shapr3D section matches the visual pattern (hover animation on the link icon, zoom-on-focus on the image at ≥684px, stacked layout at 375px). Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/work/index.astro public/images/work/shapr3d.png
git commit -m "feat: add Shapr3D position to work page"
```

(Drop the image path from `git add` if using Variant B.)

---

### Task 6: Final verification

- [ ] **Step 1: Full build**

```bash
pnpm build
```

Expected: `astro check` reports 0 errors (warnings/hints are pre-existing and acceptable), `astro build` completes with "Complete!".

- [ ] **Step 2: Verify the built site end-to-end**

```bash
pnpm preview
```

Check `http://localhost:4321/work` (Netlock + Shapr3D sections in order, both header buttons), `http://localhost:4321/cv` (two-column page, download button), and `http://localhost:4321/KristofGatterCV.pdf` (regenerated PDF with Netlock entry). Stop the preview server.

- [ ] **Step 3: Wrap up the branch**

Use the superpowers:finishing-a-development-branch skill — work is on worktree branch `claude/portfolio-cv-updates-89c500`; offer merge to `master` / PR options. The PR/merge description must list the open decisions (#4 job title, #5 temp copy, #6 image if Variant B was used) so Kristof reviews before deploying.
