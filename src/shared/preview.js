import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { createBlock, serialize } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

// Render the real save output and execute the frontend bundle in its own document.
export default function GalleryPreview({ kind, name, attributes, clientId, onFocus }) {
 const frame = useRef();
 const [height, setHeight] = useState(480);
 const [viewerOpen, setViewerOpen] = useState(false);
 const [theme, setTheme] = useState({ styles: '', font: 'inherit', color: 'inherit', direction: 'ltr' });
 const assets = window.ctclGalleryPreviewAssets?.[kind];
 const escape = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
 useEffect(() => {
  const owner = frame.current?.ownerDocument;
  if (!owner) return;
  const host = frame.current.closest('.editor-styles-wrapper') || frame.current.parentElement;
  const typography = owner.defaultView.getComputedStyle(host);
  // Preserve theme/global styles available in the canvas; leave wp-admin UI styles out.
  const styles = [...owner.querySelectorAll('style[id*="global-styles"], style[id*="editor-inline-css"], link[rel="stylesheet"][href*="/themes/"]')].map(node => node.outerHTML).join('\n');
  setTheme({ styles, font: typography.fontFamily, color: typography.color, direction: typography.direction });
 }, [kind]);
 const srcDoc = useMemo(() => {
  if (!assets) return '';
  const markup = serialize(createBlock(name, attributes));
  const scripts = assets.scripts.map(url => `<script src="${escape(url)}"></script>`).join('');
  // These are HTML closing tags, not JavaScript string escapes. Escaping the slash
  // here makes HTML consume the remaining document as the first script's contents.
  return `<!doctype html><html dir="${escape(theme.direction)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${theme.styles}<link rel="stylesheet" href="${escape(assets.style)}"><style>html,body{margin:0;padding:0;width:100%;background:transparent}body{font-family:${theme.font};color:${theme.color}}.ctc-gallery-shell{margin:0 auto;padding:0}</style></head><body class="editor-styles-wrapper">${markup}<script>const report=()=>parent.postMessage({type:'ctc-gallery-preview-size',id:${JSON.stringify(clientId)},height:Math.ceil(document.body.getBoundingClientRect().height),viewerOpen:!!document.querySelector('.ctc-viewer')},${JSON.stringify(window.location.origin)});new ResizeObserver(report).observe(document.body);new MutationObserver(report).observe(document.body,{childList:true,subtree:true});addEventListener('load',report);</script>${scripts}</body></html>`;
 }, [name, attributes, assets, clientId, theme]);
 useEffect(() => {
  const receive = event => {
   if (event.source !== frame.current?.contentWindow || event.data?.type !== 'ctc-gallery-preview-size' || event.data.id !== clientId) return;
   const measured = Number(event.data.height); if (Number.isFinite(measured)) setHeight(Math.min(100000, Math.max(120, measured)));
   setViewerOpen(event.data.viewerOpen === true);
  };
  const hostWindow = frame.current?.ownerDocument.defaultView || window;
  hostWindow.addEventListener('message', receive); return () => hostWindow.removeEventListener('message', receive);
 }, [clientId]);
 if (!assets) return <p className="ctc-editor-hint">{__('Reload the editor to load the interactive gallery preview.', 'ctcl-image-gallery')}</p>;
 return <iframe ref={frame} onFocus={onFocus} className={`ctc-live-preview${viewerOpen ? ' ctc-live-preview-expanded' : ''}`} title={__('Interactive gallery preview', 'ctcl-image-gallery')} sandbox="allow-scripts allow-same-origin" srcDoc={srcDoc} style={{ height: viewerOpen ? '100%' : `${height}px` }} />;
}
