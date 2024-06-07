/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {

	keywords: [__('Gallery', 'ctcl-image-gallery'), __('image gallery', 'ctcl-image-gallery')],

	attributes: {
        galItems: { type: 'Array', default: [] },
        mainImage: { type: 'String', default: '' },
        clntId: { type: 'String', default: '' },
        mainImgWd: { type: 'Number', default: 450 },
        mainImgHt: { type: 'Number', default: 700 },
        mainImgFinalWd: { type: 'Number', default: 450 },
        mainImgFinalHt: { type: 'Number', default: 700 },
    },
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
