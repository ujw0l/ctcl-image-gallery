/* Original library APIs with the reference gallery integration. */
import { ctclImgGal as OriginalGallery } from '../../vendor/ctcl-image-gallery/ctcl-image-gallery';
import { ctcOverlayViewer as OriginalViewer } from '../../vendor/ctc-gallery-viewer/ctc_overlay';
import { __, sprintf } from '@wordpress/i18n';

function button(label, content, action) {
 const el = document.createElement('button'); el.type = 'button'; el.className = 'ctc-control'; el.setAttribute('aria-label', label); el.textContent = content; el.addEventListener('click', action); return el;
}
function announce(el, index, images) {
 el.dataset.ctcIndex = index;
 el.dispatchEvent(new CustomEvent('ctc:change', { bubbles: true, detail: { index, total: images.length, caption: images[index].title || '', alt: images[index].alt || '' } }));
}
export class ctclImgGal extends OriginalGallery {
 createGal(el, options = {}) {
  const images = [...el.querySelectorAll('img')]; if (!images.length) return;
  const list = document.createElement('div'); list.className = 'ctclig-image-list';
  const main = document.createElement('div'); main.className = 'ctclig-main-image'; main.setAttribute('role', 'group');
  main.style.aspectRatio = `${options.mainImgWd || el.dataset.width || 700} / ${options.mainImgHt || el.dataset.height || 450}`;
  const strip = document.createElement('div'); strip.className = 'ctclig-image-cont';
  let current = 0;
  const select = index => {
   current = (index + images.length) % images.length; index = current;
   main.style.backgroundImage = `url(${JSON.stringify(images[index].src)})`; main.setAttribute('aria-label', images[index].alt || images[index].title || sprintf(__('Image %d', 'ctcl-image-gallery'), index + 1));
   strip.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
   announce(el, index, images);
   const active = strip.children[index];
   if (active) strip.scrollTo({ left: active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  images.forEach((image, index) => {
   image.style.display = 'none'; const thumbnail = button(image.alt || sprintf(__('Show image %d', 'ctcl-image-gallery'), index + 1), '', () => select(index)); thumbnail.className = 'ctc-thumbnail';
   const clone = image.cloneNode(); clone.removeAttribute('id'); clone.style.display = ''; clone.alt = ''; clone.loading = 'lazy'; thumbnail.append(clone); strip.append(thumbnail);
  });
  const navigation = document.createElement('div'); navigation.className = 'ctc-lightbox-navigation';
  const previous = button(__('Previous image', 'ctcl-image-gallery'), '‹', () => select(current - 1));
  const next = button(__('Next image', 'ctcl-image-gallery'), '›', () => select(current + 1));
  previous.classList.add('ctc-lightbox-previous'); next.classList.add('ctc-lightbox-next');
  previous.disabled = next.disabled = images.length < 2;
  strip.setAttribute('role', 'group'); strip.setAttribute('aria-label', __('Image previews', 'ctcl-image-gallery'));
  navigation.append(previous, strip, next);
  list.append(main, navigation); el.append(list); el.style.height = 'auto'; el.style.aspectRatio = 'auto'; select(0); options.callBack?.(el);
 }
}
export class ctcOverlayViewer extends OriginalViewer {
 prepareGal(el) {
  if (el.dataset.ctcViewer) return; el.dataset.ctcViewer = 'true';
  const images = [...el.querySelectorAll('img')];
  images.forEach((image, index) => {
   image.tabIndex = 0; image.setAttribute('role', 'button'); image.setAttribute('aria-haspopup', 'dialog'); image.setAttribute('aria-label', image.alt || image.title || sprintf(__('Open image %d', 'ctcl-image-gallery'), index + 1));
   image.addEventListener('click', () => this.createOverlay(image, index, images));
   image.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); image.click(); } });
  });
 }
 createOverlay(image, index, images) {
  if (document.getElementById('gallery-overlay')) return;
  this.opener = image; this.overflow = document.body.style.overflow;
  this.images = images; this.current = index; this.zoom = 1; this.pan = { x: 0, y: 0 };
  const overlay = document.createElement('div'); overlay.id = 'gallery-overlay'; overlay.className = `ctc-viewer${images.length === 1 ? ' ctc-viewer-single' : ''}`;
  overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', __('Image viewer', 'ctcl-image-gallery')); overlay.tabIndex = -1;
  const header = document.createElement('header'); header.className = 'ctc-viewer-header';
  const title = document.createElement('span'); title.className = 'ctc-viewer-title'; title.textContent = __('Gallery', 'ctcl-image-gallery');
  const tools = document.createElement('div'); tools.id = 'toolbar-div'; tools.setAttribute('role', 'group'); tools.setAttribute('aria-label', __('Image tools', 'ctcl-image-gallery'));
  const close = this.viewerButton(__('Close viewer', 'ctcl-image-gallery'), 'close', () => this.closeOverlay(overlay)); close.id = 'overlay-close-btn';
  header.append(title, tools, close);
  const canvas = document.createElement('div'); canvas.className = 'ctc-viewer-canvas';
  const full = document.createElement('img'); full.id = 'loaded-img'; full.draggable = false;
  const caption = document.createElement('div'); caption.id = 'img-title-info'; caption.setAttribute('aria-live', 'polite'); caption.setAttribute('aria-atomic', 'true');
  const imageFrame = document.createElement('div'); imageFrame.className = 'ctc-viewer-image-frame'; imageFrame.tabIndex = 0; imageFrame.append(full, caption);
  const loading = document.createElement('p'); loading.className = 'ctc-viewer-loading'; loading.setAttribute('role', 'status'); loading.textContent = __('Loading image…', 'ctcl-image-gallery');
  canvas.append(imageFrame, loading);
  const dock = document.createElement('div'); dock.className = 'ctc-viewer-dock';
  overlay.append(header, canvas, dock); document.body.append(overlay); document.body.style.overflow = 'hidden';
  this.createToolbar(overlay, images, full, index);
  if (images.length > 1) this.createSidebar(overlay, images, full, index);
  canvas.addEventListener('click', event => { if (event.target === canvas) this.closeOverlay(overlay); });
  let start;
  canvas.addEventListener('pointerdown', event => {
   if (event.target !== full) return;
   start = { x: event.clientX, y: event.clientY, panX: this.pan.x, panY: this.pan.y };
   if (this.zoom > 1) { canvas.setPointerCapture(event.pointerId); event.preventDefault(); }
  });
  canvas.addEventListener('pointermove', event => {
   if (!start || this.zoom === 1) return;
   this.pan = { x: start.panX + event.clientX - start.x, y: start.panY + event.clientY - start.y };
   this.applyZoom(overlay);
  });
  const finish = event => {
   if (!start) return;
   const dx = event.clientX - start.x, dy = event.clientY - start.y;
   if (this.zoom === 1 && event.pointerType !== 'mouse' && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    this.stopSlideshow(overlay); this.loadImg((this.current + (dx < 0 ? 1 : -1) + images.length) % images.length, images, overlay, full);
   }
   start = null;
  };
  canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', () => { start = null; });
  this.visibilityHandler = () => { if (document.hidden) this.stopSlideshow(overlay); };
  document.addEventListener('visibilitychange', this.visibilityHandler);
  this.loadImg(index, images, overlay, full); close.focus();
 }
 viewerButton(label, icon, action) {
  const paths = {
   close: 'M6 6l12 12M18 6L6 18', previous: 'M15 5l-7 7 7 7', next: 'M9 5l7 7-7 7',
   plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', play: 'M8 5l11 7-11 7Z', pause: 'M8 5v14M16 5v14',
   first: 'M5 5v14M17 5l-7 7 7 7', last: 'M19 5v14M7 5l7 7-7 7',
  };
  const control = button(label, '', action); control.title = label;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', paths[icon]); path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.7'); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
  svg.append(path); control.append(svg); return control;
 }
 createToolbar(overlay, images, full) {
  const tools = overlay.querySelector('#toolbar-div'); if (tools.children.length) return;
  const zoomOut = this.viewerButton(__('Zoom out', 'ctcl-image-gallery'), 'minus', () => this.changeZoom(-0.25, overlay)); zoomOut.id = 'img-zoom-out';
  const reset = button(__('Reset zoom', 'ctcl-image-gallery'), '100%', () => { this.stopSlideshow(overlay); this.zoom = 1; this.pan = { x: 0, y: 0 }; this.applyZoom(overlay); }); reset.id = 'ctc-zoom-reset';
  const zoomIn = this.viewerButton(__('Zoom in', 'ctcl-image-gallery'), 'plus', () => this.changeZoom(0.25, overlay)); zoomIn.id = 'img-zoom-in';
  tools.append(zoomOut, reset, zoomIn);
  if (images.length < 2) return;
  const play = this.viewerButton(__('Start slideshow', 'ctcl-image-gallery'), 'play', () => {
   if (this.slideTimer) return this.stopSlideshow(overlay);
   play.setAttribute('aria-pressed', 'true'); play.setAttribute('aria-label', __('Pause slideshow', 'ctcl-image-gallery')); play.title = __('Pause slideshow', 'ctcl-image-gallery');
   play.querySelector('path').setAttribute('d', 'M8 5v14M16 5v14');
   this.slideTimer = setInterval(() => this.loadImg((this.current + 1) % images.length, images, overlay, full), 4000);
  }); play.id = 'gal-slide-show'; play.setAttribute('aria-pressed', 'false'); tools.append(play);
  const navigate = direction => { this.stopSlideshow(overlay); this.loadImg((this.current + direction + images.length) % images.length, images, overlay, full); };
  const previous = this.viewerButton(__('Previous image', 'ctcl-image-gallery'), 'previous', () => navigate(-1)); previous.id = 'gal-prev-img';
  const next = this.viewerButton(__('Next image', 'ctcl-image-gallery'), 'next', () => navigate(1)); next.id = 'gal-next-img';
  overlay.querySelector('.ctc-viewer-canvas').append(previous, next);
 }
 stopSlideshow(overlay) {
  clearInterval(this.slideTimer); this.slideTimer = null;
  const play = overlay.querySelector('#gal-slide-show'); if (!play) return;
  play.setAttribute('aria-pressed', 'false'); play.setAttribute('aria-label', __('Start slideshow', 'ctcl-image-gallery')); play.title = __('Start slideshow', 'ctcl-image-gallery'); play.querySelector('path').setAttribute('d', 'M8 5l11 7-11 7Z');
 }
 changeZoom(delta, overlay) { this.stopSlideshow(overlay); this.zoom = Math.min(3, Math.max(1, this.zoom + delta)); this.applyZoom(overlay); }
 applyZoom(overlay) {
  const image = overlay.querySelector('#loaded-img'), canvas = overlay.querySelector('.ctc-viewer-canvas');
  if (image.naturalWidth && image.naturalHeight) {
   const padding = window.getComputedStyle(canvas);
   const availableWidth = Math.max(1, canvas.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight));
   const availableHeight = Math.max(1, canvas.clientHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom));
   const scale = Math.min(1, availableWidth / image.naturalWidth, availableHeight / image.naturalHeight);
   const frame = overlay.querySelector('.ctc-viewer-image-frame'); frame.style.width = `${image.naturalWidth * scale}px`; frame.style.height = `${image.naturalHeight * scale}px`;
   image.style.width = '100%'; image.style.height = '100%';
  }
  const maxX = Math.max(0, (image.offsetWidth * this.zoom - canvas.clientWidth) / 2 + 24);
  const maxY = Math.max(0, (image.offsetHeight * this.zoom - canvas.clientHeight) / 2 + 24);
  this.pan.x = Math.max(-maxX, Math.min(maxX, this.pan.x)); this.pan.y = Math.max(-maxY, Math.min(maxY, this.pan.y));
  image.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
  overlay.dataset.zoomed = String(this.zoom > 1); overlay.querySelector('#ctc-zoom-reset').textContent = `${Math.round(this.zoom * 100)}%`;
  overlay.querySelector('#img-zoom-out').disabled = this.zoom === 1; overlay.querySelector('#img-zoom-in').disabled = this.zoom === 3;
 }
 loadImg(index, images, overlay, image) {
  if (!images[index] || !overlay.isConnected) return;
  this.current = index; this.zoom = 1; this.pan = { x: 0, y: 0 }; this.applyZoom(overlay);
  const metadata = overlay.querySelector('#img-title-info'); metadata.replaceChildren();
  const count = document.createElement('span'); count.className = 'ctc-position ctc-image-count'; count.textContent = `${index + 1} / ${images.length}`;
  const caption = document.createElement('span'); caption.className = 'ctc-caption'; caption.textContent = images[index].title || ''; metadata.hidden = !caption.textContent; metadata.append(caption); const frame = metadata.parentElement; frame.querySelector(':scope > .ctc-image-count')?.remove(); frame.append(count);
  const loading = overlay.querySelector('.ctc-viewer-loading'); loading.hidden = false; loading.classList.remove('ctc-viewer-error'); loading.textContent = __('Loading image…', 'ctcl-image-gallery');
  image.style.opacity = '0'; image.alt = images[index].alt || '';
  image.onload = () => { if (!overlay.isConnected) return; loading.hidden = true; image.style.opacity = '1'; this.applyZoom(overlay); };
  image.onerror = () => { if (!overlay.isConnected) return; loading.classList.add('ctc-viewer-error'); loading.textContent = __('Unable to load this image. Choose another thumbnail.', 'ctcl-image-gallery'); };
  image.src = images[index].src; if (image.complete && image.naturalWidth > 0) image.onload();
  this.scrollToPrev(index);
 }
 createSidebar(overlay, images, full, selected) {
  const dock = overlay.querySelector('.ctc-viewer-dock'); dock.style.setProperty('--ctc-dock-width', `${Math.min(images.length, 10) * 74 + 120}px`);
  const strip = document.createElement('div'); strip.id = 'gal-sidebar'; strip.setAttribute('role', 'group'); strip.setAttribute('aria-label', __('Gallery thumbnails', 'ctcl-image-gallery'));
  images.forEach((image, index) => {
   const thumb = button(image.alt || sprintf(__('Show image %d', 'ctcl-image-gallery'), index + 1), '', () => { this.stopSlideshow(overlay); this.loadImg(index, images, overlay, full); }); thumb.className = 'img-preview';
   const clone = image.cloneNode(); ['style', 'id', 'role', 'tabindex', 'aria-label', 'aria-haspopup'].forEach(name => clone.removeAttribute(name)); clone.alt = ''; clone.loading = 'lazy'; thumb.append(clone); strip.append(thumb);
  });
  const first = this.viewerButton(__('First image', 'ctcl-image-gallery'), 'first', () => { this.stopSlideshow(overlay); this.loadImg(0, images, overlay, full); }); first.id = 'gal-first-img';
  const last = this.viewerButton(__('Last image', 'ctcl-image-gallery'), 'last', () => { this.stopSlideshow(overlay); this.loadImg(images.length - 1, images, overlay, full); }); last.id = 'gal-last-img';
  dock.append(first, strip, last); this.scrollToPrev(selected);
 }
 scrollToPrev(index) {
  const strip = document.querySelector('#gallery-overlay #gal-sidebar'); if (!strip) return;
  [...strip.children].forEach((thumb, i) => thumb.setAttribute('aria-pressed', String(i === index)));
  const active = strip.children[index]; if (!active) return;
  strip.scrollTo({ left: active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
 }
 adjustApp() { const overlay = document.getElementById('gallery-overlay'); if (overlay) this.applyZoom(overlay); }
 onKeyStroke(event) {
  const overlay = document.getElementById('gallery-overlay'); if (!overlay) return;
  const controls = { Escape: '#overlay-close-btn', ArrowLeft: '#gal-prev-img', ArrowRight: '#gal-next-img', ArrowUp: '#img-zoom-in', ArrowDown: '#img-zoom-out', Home: '#gal-first-img', End: '#gal-last-img' };
  if (controls[event.key]) { event.preventDefault(); overlay.querySelector(controls[event.key])?.click(); }
  if (event.key === 'Tab') {
   const controls = [...overlay.querySelectorAll('button:not(:disabled)')]; const first = controls[0], last = controls[controls.length - 1];
   if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
   else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
 }
 closeOverlay(overlay) {
  this.stopSlideshow(overlay); document.removeEventListener('visibilitychange', this.visibilityHandler);
  overlay.remove(); document.body.style.overflow = this.overflow; this.opener?.focus({ preventScroll: true });
 }
}
