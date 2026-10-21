# 158.258 XML Lab

A responsive book catalogue that loads `book.xml` with the Fetch API, parses
the response with `DOMParser`, and renders each book's ID, title, author, and
price.

## Files

- `index.html` - page structure
- `styles.css` - responsive presentation
- `app.js` - fetching, XML parsing, validation, and rendering
- `book.xml` - well-formed XML book catalogue
- `favicon.svg` - site icon

## Run locally

The Fetch API does not reliably load local files when `index.html` is opened
directly. Start a local web server from this folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

Open **Settings > Pages** in the repository and deploy from the `main` branch
using the repository root.
