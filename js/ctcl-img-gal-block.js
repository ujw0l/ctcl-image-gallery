
const { useEffect } = React;
const { InspectorControls, MediaUploadCheck,MediaUpload } = wp.blockEditor;
const { RangeControl,PanelBody, Button } = wp.components;
const { __ } = wp.i18n;
const ctclEl= wp.element.createElement;
const { registerBlockType } = wp.blocks;

/**
 *  @since 1.0.0
 *
 * Register order prosseing block
 */

registerBlockType('ctcl-image-gallery/ctcl-image-gallery', {

    title: __('CTC Lite Image Gallery', 'ctcl-image-gallery'),
    icon: 'format-gallery',
    description: __("CTC Lite block to create image gallery", "ctcl-image-gallery"),
    category: 'media',
    keywords: [__('image gallery', 'ctcl-image-gallery'), __('product album', 'ctcl-image-gallery')],
    example: {},
    attributes: {
        galItems: { type: 'Array', default: [] },
        mainImage: { type: 'String', default: '' },
        clntId: { type: 'String', default: '' },
        mainImgWd: { type: 'Number', default: 450 },
        mainImgHt: { type: 'Number', default: 700 },
        mainImgFinalWd: { type: 'Number', default: 450 },
        mainImgFinalHt: { type: 'Number', default: 700 },
    },

    edit: ({ attributes, setAttributes, clientId }) => {
        setAttributes({ clntId: clientId });
        useEffect(() => {
            let ctclElem = document.querySelector(`#ctcl-ig-main-img-${attributes.clntId}`);
            if (null != ctclElem) {
                setAttributes({ mainImgFinalWd: ctclElem.offsetWidth });
                setAttributes({ mainImgFinalHt: ctclElem.offsetHeight })
            }


        }, [attributes.mainImgHt, attributes.mainImgWd, attributes.galItems])


        return ctclEl('div', { className: 'ctcl-image-gallery-block' },


            0 < attributes.mainImage.length ? ctclEl('div', { 'data-img-num': '0', 'data-ts': `${attributes.clntId}`, className: 'ctclig-main-image', id: `ctcl-ig-main-img-${attributes.clntId}`, style: { width: `${attributes.mainImgWd}px`, height: `${attributes.mainImgHt}px`, backgroundImage: `url("${attributes.mainImage}")` } }) : '',
            0 < attributes.galItems.length ? ctclEl('div', { className: 'ctclig-image-list', style: { width: `${attributes.mainImgFinalWd}px`, height: '74px', overflowX: 'auto', overflowY: 'hidden', marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
                ctclEl('div', { style: { width: `${attributes.galItems.length * 74}px`, marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
                    attributes.galItems.map((x, i) => ctclEl('img', { className: 'ctclg-gal-img', id: `ctclif-gal-img-${attributes.clntId}-${i}`, 'data-ts': `${attributes.clntId}`, 'data-image-num': `${i}`, style: { border: '1px solid rgba(0,0,0,1)', width: '70px', height: '70px', margin: '2px' }, onMouseOver: () => { setAttributes({ mainImage: x.url }) }, key: i, title: x.caption, src: x.url }))),
            ) : '',
            ctclEl('div', { style: { border: '1px solid rgb(61, 148, 218)', backgroundColor: 'rgba(255,255,255,1)', } },

                ctclEl(MediaUpload, {
                    title: __('Select  product images for gallery ', 'ctcl-image-gallery'),
                    multiple: true,
                    value: attributes.galItems.map(x => x.id),
                    gallery: true,
                    onSelect: gal => {
                        setAttributes({ galItems: gal });
                        setAttributes({ mainImage: gal[0].url });
                    },
                    render: ({ open }) => ctclEl('div', { style: { width: '100%', backgroundColor: 'rgba(255,255,,255,1)', color: 'rgb(61, 148, 218)', padding: '10px' } },
                        ctclEl('h4', { className: 'dashicons-before dashicons-format-gallery' }, __('Product Image Gallery ')),

                        ctclEl(Button, { style: { marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)' }, className: "ctclig-media-button dashicons-before dashicons-format-gallery", onClick: open }, __(" Select Images", "ctcl-image-gallery")),
                    ),
                }),

                ctclEl(InspectorControls, null,
                    ctclEl(PanelBody, null,
                        ctclEl(RangeControl, {
                            label: __('Image width in pixel (px)', 'ctc-gal'),
                            min: 148,
                            max: window.innerWidth,
                            onChange: val => setAttributes({ mainImgWd: val }),
                            value: attributes.mainImageWd,
                        }),

                        ctclEl(RangeControl, {
                            label: __('Image height in pixel(px)', 'ctc-gal'),
                            min: 148,
                            max: window.innerHeight,
                            onChange: val => setAttributes({ mainImgHt: val }),
                            value: attributes.mainImageHt,
                        })

                    ))

            ),


        )


    },
    save: ({ attributes }) => ctclEl('div', { className: 'ctcl-image-gallery' },

        0 < attributes.mainImage.length ? ctclEl('div', { 'data-img-num': '0', 'data-ts': `${attributes.clntId}`, className: 'ctclig-main-image', id: `ctcl-ig-main-img-${attributes.clntId}`, style: { width: `${attributes.mainImgWd}px`, height: `${attributes.mainImgHt}px`, backgroundImage: `url("${attributes.mainImage}")` } }) : '',
        0 < attributes.galItems.length ? ctclEl('div', { className: 'ctclig-image-list', style: { width: `${attributes.mainImgFinalWd}px`, height: '95px', overflowX: 'auto', overflowY: 'hidden', marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
            ctclEl('div', { style: { width: `${attributes.galItems.length * 74}px`, marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
                attributes.galItems.map((x, i) => ctclEl('img', { className: 'ctclg-gal-img', id: `ctclif-gal-img-${attributes.clntId}-${i}`, 'data-ts': `${attributes.clntId}`, 'data-image-num': `${i}`, style: { border: '1px solid rgba(0,0,0,1)', width: '70px', height: '70px', margin: '2px' }, onMouseOver: () => { setAttributes({ mainImage: x.url }) }, key: i, title: x.caption, src: x.url }))),
        ) : '',
    ),
});