# Images guide (Frontend)

This project loads homepage images from:

- `public/images/...`
- referenced in code as `/images/<file>` (no `public` prefix)

## Replace the placeholder images

We included placeholder images so the UI won't look broken. You can replace them with real ones using the **same filenames**:

- `hero.jpg` (recommended: 1600×900, 16:9)
- `services.jpg` (recommended: 1200×800)
- `testimonials.jpg` (recommended: 1200×800)
- `cta.jpg` (recommended: 1200×800)
- `cat-design.jpg`, `cat-dev.jpg`, `cat-writing.jpg`, `cat-video.jpg` (recommended: 800×600)

### Where to download
Use any royalty‑free source (examples):
- Unsplash / Pexels (search: “freelancer”, “laptop work”, “team meeting”, “design desk”)
- Keep images under ~500KB each if possible (helps Vercel load speed)

### How to place
Put your files here:

`frontend/public/images/<filename>.jpg`

Then refresh the page. Paths like `/images/hero.jpg` will work automatically.
