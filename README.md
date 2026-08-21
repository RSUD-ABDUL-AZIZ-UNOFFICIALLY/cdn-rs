# CDN‑RS

> A lightweight Node.js/Express CDN for images, files, videos and documents.

## Overview

`cdn-rs` is a small Express server that exposes a set of REST endpoints to serve static assets from the `public/` directory. It supports on‑the‑fly image resizing via **sharp** and sets appropriate cache headers for each media type.

```
public/
├─ imagekit/   # images (served via /api/cdn/image)
├─ filekit/    # generic files (served via /api/cdn/file)
├─ video/      # video files (served via /api/cdn/video)
└─ defaultDir/ # documents (served via /api/cdn/document)
```

## Prerequisites

- Node.js 20+ (LTS)
- npm or yarn
- Optional: Docker (for containerized deployment)

## Installation

```bash
# clone the repo
git clone https://github.com/RSUD-ABDUL-AZIZ-UNOFFICIALLY/cdn-rs
cd cdn-rs

# install dependencies
npm install
```

## Configuration

Create a `.env` file at the project root or export the following variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `3110` |
| `DIR` | Directory for documents (relative to project root) | `./public/defaultDir` |
| `NODE_ENV` | Environment mode | `development` |

Example `.env`:

```
PORT=3110
DIR=./public/defaultDir
```

## Running the Server

```bash
# Development (auto‑reload with nodemon)
npm run dev

# Production
npm start
```

The server will be available at `http://localhost:3110`.

## API Endpoints

| Endpoint | Method | Description | Query Params | Response |
|----------|--------|-------------|--------------|----------|
| `/api/cdn/image/:imageName` | `GET` | Serve an image. Supports optional resizing via `w` and `h`. | `w` (width), `h` (height) | `image/png` (or original format) |
| `/api/cdn/file/*` | `GET` | Serve a static file. | – | File content |
| `/api/cdn/video/*` | `GET` | Serve a video file. | – | Video content |
| `/api/cdn/document/*` | `GET` | Serve a document from `DIR`. | – | Document content |
| `/api/cdn/*` | `GET` | Additional routes defined in `routes/index.js`. | – | – |

### Image Resizing Example

```
GET /api/cdn/image/logo.png?w=200&h=100
```

The server will resize `logo.png` to 200×100 pixels using **sharp** and return the image.

## Development

- **Linting**: `npm run lint`
- **Testing**: `npm test` (currently no tests)
- **Formatting**: `npm run format`

Feel free to add more routes or middleware as needed.

## Contributing

Pull requests are welcome. Please open an issue first to discuss major changes.

## License

MIT © 2026
