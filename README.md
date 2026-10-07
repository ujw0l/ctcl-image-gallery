# CTCL Image Gallery

A WordPress gallery block with a large main image, thumbnail navigation, centered captions, and an independent image-count badge. Version **2.3.0** adopts the CTC Gallery lightbox design and opens the selected image in a fullscreen viewer using the original `ctc_overlay.js` library.

## Requirements

- WordPress 6.6 or later; tested-up-to metadata: 7.1.3.
- PHP 7.4 or later.
- No CTC Lite dependency.

## Install and use

Upload the plugin ZIP through **Plugins → Add New → Upload Plugin**, activate it, and insert **CTCL Image Gallery** from the Media category. Choose images, adjust the layout in the sidebar, and publish. Click the main image to open the viewer.

The editor provides an interactive preview, image reordering, caption and alternative-text controls, and settings for dimensions, corners, surface, and image fit. Existing CTCL block names, attributes, and historical saved markup are retained.

## Viewer

The CTC overlay includes zoom, panning, slideshow playback, image navigation, and a thumbnail dock. Use arrow keys to navigate and zoom, Home/End to jump, and Escape to close. The original libraries and licenses are retained in `vendor/`.

## Development and validation

Run `npm install` and `npm run build`. Compiled WordPress assets are tracked in `build/`. See [DEVELOPMENT.md](DEVELOPMENT.md) and [THIRD-PARTY.md](THIRD-PARTY.md).

Validation covered the production build, standalone browser navigation and overlay interactions, and WordPress 7.1.3 core registration, attributes, asset paths, and script dependencies. Full integration in a running WordPress site was not verified because the local database was unavailable.

See [readme.txt](readme.txt) for installation details, keyboard controls, and the release history. Bundled screenshots represent earlier versions.
