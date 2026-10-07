/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({attributes}) {
	return (
		<div { ...useBlockProps.save() }    >
		
			
{
			0 < attributes.galItems.length && 	<div id={`ctcl-gallery-${attributes.clntId}`} data-clntid={attributes.clntId} style={ {   marginLeft:'auto', marginRight : 'auto',display:'block',    opacity:'0' , width: attributes.mainImgFinalWd+'px' , height:attributes.mainImgFinalHt+'px' } } className = 'ctcl-gallery' data-width = {attributes.mainImgWd}  data-height={attributes.mainImgHt}  > 
			{
			 attributes.galItems.map((x,i)=><img  className = 'ctclg-gal-img' id={`ctclif-gal-img-${attributes.clntId}-${i}`} data-ts= { `${attributes.clntId}`} data-image-num= {i} style= {{ margin: '2px'}}  key= {i} title= {x.caption} src= {x.url}    />)
			}
			</div>
}

		</div>
	);
}
