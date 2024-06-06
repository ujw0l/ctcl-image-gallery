

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

	const firstLoad = useRef(true);
	const elRef = useRef(false);

	
	setAttributes({ clntId: clientId });
	useEffect(() => {

        let galCont =   document.querySelector(`#ctcl-img-gal-${attributes.clntId}`);
		let ctclElem =   galCont.querySelector('.ctclig-main-image');
		
		if (null != ctclElem) {
			setAttributes({ mainImgFinalWd: ctclElem.offsetWidth });
			setAttributes({ mainImgFinalHt: ctclElem.offsetHeight })
		}
	
		
		if( firstLoad.current ){

			firstLoad.current = false;	
			if(null != galCont.querySelector('.ctclig-main-image')){
				
				galCont.querySelector('.ctclig-main-image').remove();
				galCont.querySelector('.ctclig-image-cont').remove();
				
			}
			 0 < attributes.galItems.length &&	new ctclImgGal( `#ctcl-img-gal-${attributes.clntId}`, {  mainImgHt: attributes.mainImgFinalHt , mainImgWd:attributes.mainImgFinalWd, imageEvent:'mousemove' , callBack: el=> el.style.opacity = ''});
		}else{
			let mainImgDiv = galCont.querySelector('.ctclig-main-image');
            mainImgDiv.style.height = attributes.mainImgHt+'px';
			mainImgDiv.style.width = attributes.mainImgWd+'px';
			galCont.querySelector('.ctclig-image-cont').style.width = mainImgDiv.offsetWidth+'px';

			
		}
		
		
		
	}, [attributes.mainImgHt, attributes.mainImgWd, attributes.galItems])


	return (
		<div { ...useBlockProps() }>
			<div className='ctcl-image-gallery-block' id={`ctcl-img-gal-${attributes.clntId}`} ref={elRef} data-height={attributes.mainImageHt} data-width={attributes.mainImageWd} style={{opacity:'0', height:attributes.mainImageHt+'px', width:attributes.mainImageWd+'px'  }} >

 {
	  0 < attributes.galItems.length && attributes.galItems.map((x,i)=> <img key = {i} id={ `ctclif-gal-img-${attributes.clntId}-${i}`} data-ts= {`${attributes.clntId}`}  data-image-num= {i}  style = {{ width: '70px', height: '70px', margin: '2px'}} className= 'ctclg-gal-img' onMouseOver= {() => setAttributes({ mainImage: x.url })} title= {x.caption} src= {x.url}  /> )
 }

 
			</div>


			<div  style={ { border: '1px solid rgb(61, 148, 218)', backgroundColor: 'rgba(255,255,255,1)', } }>
			<MediaUploadCheck>
					<MediaUpload
					 title={ __('Select  images for gallery ', 'ctcl-image-gallery')}
					 multiple={ true}
					 value= {attributes.galItems.map(x => x.id)}
					 gallery= {true}
					 onSelect={ gal => {
					
						
                        setAttributes({ galItems: gal });
                        setAttributes({ mainImage: gal[0].url });
						firstLoad.current = true;
                    }}
						allowedTypes={['image']}
						render={({ open }) => (

							<div  style= {{ width: '100%', backgroundColor: 'rgba(255,255,,255,1)', color: 'rgb(61, 148, 218)', padding: '10px' }}>
							<h4 className= 'dashicons-before dashicons-cover-image'>{__(' Image Gallery ','ctcl-image-gallery')}</h4>
							<Button style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)'}} className= {"ctclig-media-button dashicons-before dashicons-cover-image"}  onClick={open}>{__(" Select Images", "ctcl-image-gallery")}</Button>
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


