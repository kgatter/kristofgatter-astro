# Kristof Gatter

I build digital products that feel right and make sense.

This repo is the source of [kristofgatter.com](https://www.kristofgatter.com), my portfolio. If you are reading this, you are probably interested in me professionally, so here is the short version.

I'm a Digital Product Designer, currently Principal Design Engineer at [Netlock](https://www.netlock.com/), a Hungarian certificate authority and one of the EU's qualified trust service providers. I own design there end-to-end: the design language built from the brand, one shared component library mirrored in Sketch, and the marketing site. I also ship product directly, with a fleet of AI agents handling much of the execution under my direction and review.

Digital product development works best as a closely integrated, agile process. That closeness no longer ends at the team level: with today's tooling, delivering a feature end-to-end and defining things directly in code is now simply part of a designer's job.

## Where to look

- [Work](https://www.kristofgatter.com/work): selected projects, from Netlock and Shapr3D back to Small Improvements
- [CV](https://www.kristofgatter.com/cv): my full CV, also available as a [two-page PDF](https://www.kristofgatter.com/KristofGatterCV.pdf)
- [Mentoring](https://www.kristofgatter.com/mentoring): workshops, teaching and mentoring experience
- Contact: [mail@kristofgatter.com](mailto:mail@kristofgatter.com)

## About the site

Astro static site, deployed on Vercel. The CV is a single source page (`src/pages/cv/index.astro`) with a print stylesheet; `cv/build-cv.sh` prints it to `public/KristofGatterCV.pdf` with headless Chrome, so the web page and the PDF never drift apart. Dark mode follows the device setting.

The Graphik webfonts are licensed to me by Commercial Type and are not free to reuse.
