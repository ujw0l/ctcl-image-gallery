

import { useEffect, useRef } from 'react';
import {ctclImgGal} from 'ctcl-image-gallery/ctcl-image-gallery.js'
import { RangeControl,PanelBody, Button } from '@wordpress/components';


/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps,InspectorControls, MediaUploadCheck,MediaUpload } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({clientId,attributes,setAttributes}) { 

	const elRef = useRef('');

	//setAttributes({ clntId: clientId });
	useEffect(() => {
		let ctclElem = document.querySelector(`#ctcl-ig-main-img-${attributes.clntId}`);
		
		if (null != ctclElem) {
			setAttributes({ mainImgFinalWd: ctclElem.offsetWidth });
			setAttributes({ mainImgFinalHt: ctclElem.offsetHeight })
		}
	}, [attributes.mainImgHt, attributes.mainImgWd, attributes.galItems])


	return (
		<div { ...useBlockProps() }>
			<div className='ctcl-image-gallery-block' ref={elRef} >

				{ 0 < attributes.mainImage.length  && <div data-img-num= '0' data-ts= {attributes.clntId} className= {'ctclig-main-image'} id= {`ctcl-ig-main-img-${attributes.clntId}`} style={ { width: `${attributes.mainImgWd}px`, height: `${attributes.mainImgHt}px`, backgroundImage: `url("${attributes.mainImage}")`}} ></div>	}
 {

	 
	  0 < attributes.galItems.length && <div  className= {'ctclig-image-list'} style={ { width: `${attributes.mainImgFinalWd}px`, height: '74px', overflowX: 'auto', overflowY: 'hidden', marginLeft: 'auto', marginRight: 'auto', display: 'block' } }>
		<div style={ { width: `${attributes.galItems.length * 76}px`, overflowX:'auto', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>{
		 attributes.galItems.map((x,i)=> <img key = {i} id={ `ctclif-gal-img-${attributes.clntId}-${i}`} data-ts= {`${attributes.clntId}`}  data-image-num= {i}  style = {{border: '1px solid rgba(0,0,0,1)', width: '70px', height: '70px', margin: '2px'}} className= 'ctclg-gal-img' onMouseOver= {() => setAttributes({ mainImage: x.url })} title= {x.caption} src= {x.url}  /> )
		}</div>
		</div>

 }
			</div>


			<div  style={ { border: '1px solid rgb(61, 148, 218)', backgroundColor: 'rgba(255,255,255,1)', } }>
			<MediaUploadCheck>
					<MediaUpload
					 title={ __('Select  product images for gallery ', 'ctcl-image-gallery')}
					 multiple={ true}
					 value= {attributes.galItems.map(x => x.id)}
					 gallery= {true}
					 onSelect={ gal => {
                        setAttributes({ galItems: gal });
                        setAttributes({ mainImage: gal[0].url });
                    }}
						allowedTypes={['image']}
						render={({ open }) => (

							<div  style= {{ width: '100%', backgroundColor: 'rgba(255,255,,255,1)', color: 'rgb(61, 148, 218)', padding: '10px' }}>
							<h4 className= 'dashicons-before dashicons-format-gallery'>{__('Product Image Gallery ','ctcl-image-gallery')}</h4>
							<Button style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)'}} className= {"ctclig-media-button dashicons-before dashicons-format-gallery"}  onClick={open}>{__(" Select Images", "ctcl-image-gallery")}</Button>
						</div>
						)}
					/>
				</MediaUploadCheck>
</div>

 <InspectorControls>
<PanelBody>
<RangeControl 

label= {__('Image width in pixel (px)',  "ctcl-image-gallery")}
                            min= {148}
                            max= {window.innerWidth}
                            onChange={ val => setAttributes({ mainImgWd: val })}
                            value= {attributes.mainImageWd}


/>


<RangeControl 

label= {__('Image height in pixel(px)', "ctcl-image-gallery")}
                            min= {148}
                            max ={ window.innerHeight}
                            onChange= {val => setAttributes({ mainImgHt: val })}
                            value= {attributes.mainImageHt}


/>

</PanelBody>


 </InspectorControls>

			</div>
		
	);
}


