import { useBlockProps } from '@wordpress/block-editor';
import { keys, dimensions } from './media';
export default function GallerySave({ kind, attributes: a }) {
 const items = a[keys[kind]] || [];
 const [width, height] = dimensions(kind, a);
 const masonry = kind === 'masonry-gallery';
 const className = { 'carousel-gallery': 'ctc-carousel', 'image-carousel': 'ctc-image-carousel', 'lightbox-gallery': 'ctcl-gallery', 'masonry-gallery': 'mas-gal-gallery' }[kind];
 const props = useBlockProps.save({ className: `ctc-gallery-shell ctc-surface-${a.surface}`, style: { '--ctc-radius': `${a.cornerRadius}px`, '--ctc-fit': a.imageFit } });
 return <div {...props}>
  {items.length > 0 && <div className={`${className} ctc-gallery-stage${masonry && a.activateOverlay ? ' ctc-gal-overlay' : ''}`} data-ctc-kind={kind} data-autoplay={a.autoPlay || false} data-autoplay-interval={a.autoPlayInterval || 4000} data-gut-wd={a.gutWidth || 0} data-width={width} data-height={height} role="region" aria-label={a.galleryLabel} style={masonry ? { '--ctc-gap': `${a.gutWidth}px` } : { width: `${width}px`, maxWidth: '100%', aspectRatio: `${width} / ${height}` }}>
   {items.map((image, index) => <img key={image.id || index} src={image.url} alt={image.alt || ''} title={image.caption || ''} width={image.width || undefined} height={image.height || undefined} decoding="async" loading={index === 0 && !masonry ? 'eager' : 'lazy'} className={masonry && a.zoomOnHover ? 'ctc-gal-zoom-on-hover' : undefined} style={masonry ? { width: `${a.brkWidth}%`, boxShadow: a.addShadEff ? `0 ${a.boxShadWd}px ${a.boxShadWd * 3}px ${a.shadowCol || 'rgba(15,23,42,0.15)'}` : undefined } : undefined} />)}
  </div>}
 </div>;
}
