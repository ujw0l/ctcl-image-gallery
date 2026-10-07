import { ctclImgGal, ctcOverlayViewer } from './libraries';
import { __, sprintf } from '@wordpress/i18n';
function initialize(stage) {
 if (stage.dataset.ctcInitialized) return;
 const images = [...stage.querySelectorAll(':scope > img')];
 if (!images.length) return;
 stage.dataset.ctcInitialized = 'true';
 window.ctcGallerySequence = (window.ctcGallerySequence || 0) + 1;
 stage.id = `ctc-stage-${window.ctcGallerySequence}`;
 const shell = stage.parentElement;
 shell.classList.add('ctc-gallery-shell'); stage.classList.add('ctc-gallery-stage'); stage.style.opacity = '1';
 const width = Number(stage.dataset.width) || parseFloat(stage.style.width) || 700;
 const height = Number(stage.dataset.height) || parseFloat(stage.style.height) || 450;
 stage.style.maxWidth = '100%'; stage.style.width = `${width}px`; stage.style.height = ''; stage.style.aspectRatio = `${width} / ${height}`;
 try {
  const count = document.createElement('span'); count.className = 'ctc-position ctc-image-count'; count.setAttribute('aria-live', 'polite'); count.setAttribute('aria-atomic', 'true');
  const caption = document.createElement('span'); caption.className = 'ctc-caption';
  const update = ({ index = 0, total = images.length, caption: title = images[0].title || '' } = {}) => {
   count.textContent = sprintf(__('%1$d / %2$d', 'ctcl-image-gallery'), index + 1, total); caption.textContent = title;
   if (caption.parentElement?.classList.contains('ctc-image-meta')) caption.parentElement.hidden = !title;
  };
  update(); stage.addEventListener('ctc:change', event => update(event.detail));
  new ctclImgGal(`#${stage.id}`, { mainImgWd: width, mainImgHt: height });
  const mainImage = stage.querySelector('.ctclig-main-image');
  const metadata = document.createElement('aside'); metadata.className = 'ctc-image-meta'; metadata.hidden = !caption.textContent;
  metadata.append(caption); mainImage.append(metadata, count); mainImage.setAttribute('role', 'button'); mainImage.tabIndex = 0;
  mainImage.setAttribute('aria-haspopup', 'dialog');
  const label = () => mainImage.setAttribute('aria-label', sprintf(__('Open image %d in fullscreen', 'ctcl-image-gallery'), (Number(stage.dataset.ctcIndex) || 0) + 1));
  label(); stage.addEventListener('ctc:change', label);
  const openViewer = () => {
   window.ctcGalleryViewer ||= new ctcOverlayViewer('#ctcl-overlay-library-root');
   window.ctcGalleryViewer.createOverlay(mainImage, Number(stage.dataset.ctcIndex) || 0, images);
  };
  mainImage.addEventListener('click', openViewer);
  mainImage.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openViewer(); } });
  stage.addEventListener('keydown', event => {
   if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !event.altKey && !event.metaKey && !event.ctrlKey) {
    event.preventDefault(); const thumbs = [...stage.querySelectorAll('.ctc-thumbnail')]; const current = Number(stage.dataset.ctcIndex) || 0;
    thumbs[(current + (event.key === 'ArrowRight' ? 1 : -1) + thumbs.length) % thumbs.length]?.click();
   }
  });
 } catch (error) {
  stage.querySelectorAll(':scope > div').forEach(el => el.remove()); stage.classList.add('ctc-simple-gallery'); stage.style.height = ''; stage.style.aspectRatio = 'auto'; images.forEach(image => { image.style.display = ''; });
 }
}
export function boot() {
 const start = () => document.querySelectorAll('.wp-block-ctcl-image-gallery-ctcl-image-gallery .ctcl-gallery').forEach(initialize);
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
}
