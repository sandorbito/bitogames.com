# bitogames.com

Official website of BITO GAMES — independent studio crafting native Linux games.

🟢 **Live:** https://bitogames.com

## Stack

- Static HTML / CSS / JavaScript (no build step, no framework)
- Hosted on GitHub Pages
- Matrix rain canvas animation
- Custom domain via Porkbun DNS

## Local preview

```bash
python3 -m http.server 8765
# then open http://localhost:8765
```

## Structure

| File | Purpose |
|---|---|
| `index.html` | Single-page site |
| `style.css` | Matrix-green theme, glitch effects, responsive |
| `matrix.js` | Canvas-based falling katakana rain |
| `script.js` | Email signup form handling |
| `CNAME` | GitHub Pages custom domain binding |

---

*Made on Linux, for Linux.*
