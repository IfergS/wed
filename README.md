# Our Monthsary — Interactive Storybook

A frontend-only romantic storybook built with semantic HTML, custom CSS, vanilla JavaScript, GSAP, and ScrollTrigger.

## Run it locally

Because the story uses external font/icon/animation CDNs and remote placeholder photos, serve it over HTTP instead of opening `index.html` directly.

### Option 1: Python

```powershell
python -m http.server 8080
```

Then open <http://localhost:8080>.

### Option 2: Node

```powershell
npx serve .
```

## Personalize it

Edit [`js/config.js`](js/config.js) to change:

- Both names
- Monthsary date and month count
- The private love-letter copy
- The final chapter message
- Gallery captions and image URLs
- Optional local music

To add music, put a playable file at `assets/music/romantic-music.mp3` and set `musicSrc` in `js/config.js` to `assets/music/romantic-music.mp3`.

The gallery is intentionally data-driven. The current eight local photos live in `assets/image` and are referenced from `js/config.js`. Replace those paths with your own filenames whenever you want to swap the memories.

## Notes

- GSAP and ScrollTrigger are loaded from a CDN when the page has internet access. The page still has a CSS/IntersectionObserver fallback if they are unavailable.
- The placeholder scenes use layered gradients and CSS silhouettes so the page remains visually complete before personal photos are added.
- All primary interactions are keyboard reachable, and `prefers-reduced-motion` is respected.
