import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, BlockControls } from '@wordpress/block-editor';
import { Button, PanelBody, RangeControl, ToggleControl, SelectControl, TextControl, ToolbarGroup, ToolbarButton, ColorPalette } from '@wordpress/components';
import { keys, titles, mergeMedia, dimensions } from './media';
import GalleryPreview from './preview';

export default function GalleryEdit({ kind, attributes: a, setAttributes, clientId, isSelected }) {
 const { selectBlock } = useDispatch('core/block-editor');
 const selectGallery = () => selectBlock(clientId);
 const key = keys[kind], items = a[key] || [], masonry = kind === 'masonry-gallery';
 const [width, height] = dimensions(kind, a);
 const change = list => setAttributes({ [key]: list, ...(masonry ? { mediaIds: list.map(item => item.id) } : {}) });
 useEffect(() => { if (a.clntId !== clientId) setAttributes({ clntId: clientId }); }, [clientId, a.clntId]);
 const move = (index, direction) => { const list = [...items]; [list[index], list[index + direction]] = [list[index + direction], list[index]]; change(list); };
 const update = (index, values) => change(items.map((item, i) => i === index ? { ...item, ...values } : item));
 const choose = (render, append = false) => <MediaUploadCheck><MediaUpload allowedTypes={['image']} multiple gallery={!append} value={append ? [] : items.map(item => item.id).filter(Boolean)} onSelect={media => change(mergeMedia(items, media, append))} render={({ open }) => render({ open: () => { selectGallery(); open(); } })} /></MediaUploadCheck>;
 const setSize = (axis, value) => {
  const name = kind === 'carousel-gallery' ? (axis === 'width' ? 'carouselWidth' : 'carouselHeight') : kind === 'image-carousel' ? (axis === 'width' ? 'carWidth' : 'carHeight') : (axis === 'width' ? 'mainImgWd' : 'mainImgHt');
  setAttributes({ [name]: value });
 };
 return <div {...useBlockProps({ className: `ctc-editor${items.length ? ' ctc-editor-has-gallery' : ''}` })}>
  <BlockControls><ToolbarGroup>{choose(({ open }) => <ToolbarButton icon="format-gallery" label={__('Edit gallery', 'ctcl-image-gallery')} onClick={open} />)}</ToolbarGroup></BlockControls>
  <InspectorControls>
   <PanelBody title={__('Layout', 'ctcl-image-gallery')}>
    {masonry ? <><RangeControl label={__('Image width (%)', 'ctcl-image-gallery')} min={15} max={100} value={a.brkWidth} onChange={brkWidth => setAttributes({ brkWidth })} /><RangeControl label={__('Space between images (px)', 'ctcl-image-gallery')} min={0} max={48} value={a.gutWidth} onChange={gutWidth => setAttributes({ gutWidth })} /></> : <><RangeControl label={__('Maximum width (px)', 'ctcl-image-gallery')} min={280} max={1600} value={width} onChange={value => setSize('width', value)} /><RangeControl label={__('Image height (px)', 'ctcl-image-gallery')} min={180} max={1000} value={height} onChange={value => setSize('height', value)} /></>}
    <RangeControl label={__('Corner radius (px)', 'ctcl-image-gallery')} min={0} max={40} value={a.cornerRadius} onChange={cornerRadius => setAttributes({ cornerRadius })} />
    <SelectControl label={__('Surface', 'ctcl-image-gallery')} value={a.surface} options={[{ label: __('Soft', 'ctcl-image-gallery'), value: 'soft' }, { label: __('Minimal', 'ctcl-image-gallery'), value: 'minimal' }, { label: __('Midnight', 'ctcl-image-gallery'), value: 'midnight' }]} onChange={surface => setAttributes({ surface })} />
    {!masonry && <SelectControl label={__('Image fit', 'ctcl-image-gallery')} value={a.imageFit} options={[{ label: __('Fill frame', 'ctcl-image-gallery'), value: 'cover' }, { label: __('Show full image', 'ctcl-image-gallery'), value: 'contain' }]} onChange={imageFit => setAttributes({ imageFit })} />}
   </PanelBody>
   {(kind === 'carousel-gallery' || masonry) && <PanelBody title={__('Interaction', 'ctcl-image-gallery')}>
    {kind === 'carousel-gallery' ? <><ToggleControl label={__('Autoplay', 'ctcl-image-gallery')} help={__('Continues during mouse interaction. Pauses for keyboard navigation and hidden tabs. Respects reduced motion.', 'ctcl-image-gallery')} checked={a.autoPlay} onChange={autoPlay => setAttributes({ autoPlay })} />{a.autoPlay && <RangeControl label={__('Slide interval (milliseconds)', 'ctcl-image-gallery')} min={2000} max={12000} step={500} value={a.autoPlayInterval} onChange={autoPlayInterval => setAttributes({ autoPlayInterval })} />}</> : <><ToggleControl label={__('Subtle hover zoom', 'ctcl-image-gallery')} checked={a.zoomOnHover} onChange={zoomOnHover => setAttributes({ zoomOnHover, zoomOnHoverClass: zoomOnHover ? 'ctc-gal-zoom-on-hover' : '' })} /><ToggleControl label={__('Open fullscreen viewer', 'ctcl-image-gallery')} checked={a.activateOverlay} onChange={activateOverlay => setAttributes({ activateOverlay, overlayClass: activateOverlay ? 'ctc-gal-overlay' : '' })} /><ToggleControl label={__('Image shadows', 'ctcl-image-gallery')} checked={a.addShadEff} onChange={addShadEff => setAttributes({ addShadEff })} />{a.addShadEff && <><RangeControl label={__('Shadow depth', 'ctcl-image-gallery')} min={0} max={24} value={a.boxShadWd} onChange={boxShadWd => setAttributes({ boxShadWd })} /><ColorPalette value={a.shadowCol} onChange={shadowCol => setAttributes({ shadowCol: shadowCol || '' })} /></>}</>}
   </PanelBody>}
   <PanelBody title={__('Accessibility', 'ctcl-image-gallery')} initialOpen={false}><TextControl label={__('Gallery label', 'ctcl-image-gallery')} value={a.galleryLabel} onChange={galleryLabel => setAttributes({ galleryLabel })} help={__('Describe this collection for screen readers.', 'ctcl-image-gallery')} /></PanelBody>
   {items.length > 0 && <PanelBody title={__('Image details', 'ctcl-image-gallery')} initialOpen={false}>{items.map((item, index) => <div className="ctc-image-details" key={item.id || index}><img src={item.url} alt="" /><TextControl label={sprintf(__('Image %d: alternative text', 'ctcl-image-gallery'), index + 1)} value={item.alt || ''} onChange={alt => update(index, { alt })} /><TextControl label={__('Caption', 'ctcl-image-gallery')} value={item.caption || ''} onChange={caption => update(index, { caption })} /></div>)}</PanelBody>}
  </InspectorControls>
  {(isSelected || !items.length) && <div className="ctc-editor-header"><span className="ctc-editor-mark" aria-hidden="true">◈</span><div><span className="ctc-eyebrow">CTC GALLERY</span><h3>{titles[kind]}</h3></div>{items.length > 0 && <span className="ctc-count">{sprintf(__('%d images', 'ctcl-image-gallery'), items.length)}</span>}</div>}
  {items.length === 0 ? <div className="ctc-empty"><div className="ctc-empty-art" aria-hidden="true"><span>◧</span><span>▨</span><span>◩</span></div><h4>{__('A beautiful home for your images', 'ctcl-image-gallery')}</h4><p>{__('Choose a collection from your media library. Shape the layout, then make it yours.', 'ctcl-image-gallery')}</p>{choose(({ open }) => <Button variant="primary" onClick={open}>{__('Choose images', 'ctcl-image-gallery')}</Button>)}</div> : <>
   <GalleryPreview kind={kind} name={{ 'carousel-gallery': 'ctc-gallery/carousel-gallery', 'image-carousel': 'ctc-gallery/imgage-carousel', 'lightbox-gallery': 'ctcl-image-gallery/ctcl-image-gallery', 'masonry-gallery': 'ctc-gallery/masonry-gallery' }[kind]} attributes={a} clientId={clientId} onFocus={selectGallery} />
   <div className="ctc-editor-actions"><p>{__('Your collection', 'ctcl-image-gallery')}<span>{isSelected ? __('Reorder or remove images below', 'ctcl-image-gallery') : sprintf(__('%d images', 'ctcl-image-gallery'), items.length)}</span></p><div className="ctc-collection-buttons">{choose(({ open }) => <Button variant="secondary" onClick={open}>{__('Edit collection', 'ctcl-image-gallery')}</Button>)}{choose(({ open }) => <Button variant="primary" onClick={open}>{__('Add images', 'ctcl-image-gallery')}</Button>, true)}</div></div>
   {isSelected && <>
   <div className="ctc-filmstrip">{items.map((item, i) => <div className="ctc-filmstrip-item" key={item.id || i}><img src={item.url} alt={item.alt || ''} /><span>{String(i + 1).padStart(2, '0')}</span><div><Button icon="arrow-left-alt2" label={__('Move earlier', 'ctcl-image-gallery')} disabled={i === 0} onClick={() => move(i, -1)} /><Button icon="arrow-right-alt2" label={__('Move later', 'ctcl-image-gallery')} disabled={i === items.length - 1} onClick={() => move(i, 1)} /><Button icon="no-alt" label={__('Remove image', 'ctcl-image-gallery')} isDestructive onClick={() => change(items.filter((_, index) => i !== index))} /></div></div>)}</div>
   </>}
   {isSelected && kind === 'image-carousel' && items.length < 3 && <p className="ctc-editor-hint">{__('Add three or more images for the layered carousel. Smaller collections display as a simple gallery.', 'ctcl-image-gallery')}</p>}
  </>}
 </div>;
}
