
const { useEffect } = React;
const { MediaUploadCheck } = wp.blockEditor;
const { RangeControl, } = wp.components;
/**
 *  @since 1.0.0
 *
 * Register order prosseing block
 */

registerBlockType('ctcl-image-gallery/ctcl-image-gallery', {

    title: __('CTC Lite Image Gallery', 'ctcl-image-gallery'),
    icon: 'format-gallery',
    description: __("CTC Lite block to create product image gallery", "ctcl-image-gallery"),
    category: 'ctc-lite-blocks',
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
            let elem = document.querySelector(`#ctcl-ig-main-img-${attributes.clntId}`);
            if (null != elem) {
                setAttributes({ mainImgFinalWd: elem.offsetWidth });
                setAttributes({ mainImgFinalHt: elem.offsetHeight })
            }


        }, [attributes.mainImgHt, attributes.mainImgWd, attributes.galItems])


        return el('div', { className: 'ctcl-image-gallery-block' },


            0 < attributes.mainImage.length ? el('div', { 'data-img-num': '0', 'data-ts': `${attributes.clntId}`, className: 'ctclig-main-image', id: `ctcl-ig-main-img-${attributes.clntId}`, style: { width: `${attributes.mainImgWd}px`, height: `${attributes.mainImgHt}px`, backgroundImage: `url("${attributes.mainImage}")` } }) : '',
            2 <= attributes.galItems.length ? el('div', { className: 'ctclig-image-list', style: { width: `${attributes.mainImgFinalWd}px`, height: '74px', overflowX: 'auto', overflowY: 'hidden', marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
                el('div', { style: { width: `${attributes.galItems.length * 74}px`, marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
                    attributes.galItems.map((x, i) => el('img', { className: 'ctclg-gal-img', id: `ctclif-gal-img-${attributes.clntId}-${i}`, 'data-ts': `${attributes.clntId}`, 'data-image-num': `${i}`, style: { border: '1px solid rgba(0,0,0,1)', width: '70px', height: '70px', margin: '2px' }, onMouseOver: () => { setAttributes({ mainImage: x.url }) }, key: i, title: x.caption, src: x.url }))),
            ) : '',
            el('div', { style: { border: '1px solid rgb(61, 148, 218)', backgroundColor: 'rgba(255,255,255,1)', } },

                el(MediaUpload, {
                    title: __('Select  product images for gallery ', 'ctcl-image-gallery'),
                    multiple: true,
                    value: attributes.galItems.map(x => x.id),
                    gallery: true,
                    onSelect: gal => {
                        setAttributes({ galItems: gal });
                        setAttributes({ mainImage: gal[0].url });
                    },
                    render: ({ open }) => el('div', { style: { width: '100%', backgroundColor: 'rgba(255,255,,255,1)', color: 'rgb(61, 148, 218)', padding: '10px' } },
                        el('h4', { className: 'dashicons-before dashicons-format-gallery' }, __('Product Image Gallery ')),

                        el(Button, { style: { marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)' }, className: "ctclig-media-button dashicons-before dashicons-format-gallery", onClick: open }, __(" Select Images", "ctcl-image-gallery")),
                    ),
                }),

                el(InspectorControls, null,
                    el(PanelBody, null,
                        el(RangeControl, {
                            label: __('Image width in pixel (px)', 'ctc-gal'),
                            min: 148,
                            max: window.innerWidth,
                            onChange: val => setAttributes({ mainImgWd: val }),
                            value: attributes.mainImageWd,
                        }),

                        el(RangeControl, {
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
    save: ({ attributes }) => el('div', { className: 'ctcl-image-gallery' },

        0 < attributes.mainImage.length ? el('div', { 'data-img-num': '0', 'data-ts': `${attributes.clntId}`, className: 'ctclig-main-image', id: `ctcl-ig-main-img-${attributes.clntId}`, style: { width: `${attributes.mainImgFinalWd}px`, height: `${attributes.mainImgFinalHt}px`, backgroundImage: `url("${attributes.mainImage}")` } }) : '',
        el('div', { className: 'ctclig-image-list', style: { width: `${attributes.mainImgFinalWd}px`, height: '74px', overflowX: 'auto', overflowY: 'hidden', marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
            el('div', { style: { width: `${attributes.galItems.length * 74}px`, marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
                1 < attributes.galItems.length ? attributes.galItems.map((x, i) => el('img', { className: 'ctclg-gal-img', id: `ctclif-gal-img-${attributes.clntId}-${i}`, 'data-ts': `${attributes.clntId}`, 'data-image-num': `${i}`, style: { border: '1px solid rgba(0,0,0,1)', width: '70px', height: '70px', margin: '2px' }, onMouseOver: () => { setAttributes({ mainImage: x.url }) }, key: i, title: x.caption, src: x.url })) : ''),
        )),
});