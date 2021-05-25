
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
    keywords: [__('image gallery', 'ctc-lite'), __('product album', 'ctcl-image-gallery')],
    example: {},
    attributes: {
        galItems: { type: 'Array', default: [] },
        mainImage: { type: 'String', default: '' },
        timeStamp: { type: 'String', default: Date.now() },
        mainImgWd: { type: 'Number', default: 450 },
        mainImgHt: { type: 'Number', default: 700 }
    },

    edit: ({ attributes, setAttributes }) => {

        useEffect(() => {

            Array.from(document.querySelectorAll('.ctclg-gal-img')).map(x => {
                /*
                x.addEventListener('mouseover', e => {
                    document.querySelector(`#ctcl-ig-main-img-${e.target.getAttribute('data-ts')}`).setAttribute('data-img-num', e.target.getAttribute('data-image-num'));
                });
                */

                let elem = document.querySelector(`#ctcl-ig-main-img-${attributes.timeStamp}`);

                console.log(elem.offsetHeight, elem.offsetWidth);

            });

        }, [attributes.mainImgHt, attributes.mainImageWd])


        useEffect(() => {


        }, [attributes.galItems])

        return el('div', { className: 'ctcl-image-gallery-block' },

            el('div', {},
                0 < attributes.mainImage.length ? el('div', { 'data-img-num': '0', 'data-ts': `${attributes.timeStamp}`, className: 'ctclig-main-image', id: `ctcl-ig-main-img-${attributes.timeStamp}`, style: { width: `${attributes.mainImgWd}px`, height: `${attributes.mainImgHt}px`, backgroundImage: `url("${attributes.mainImage}")` } }) : '',
                el('div', { className: 'ctclig-image-list', style: { width: '100%', height: '74px', overflowX: 'auto', overflowY: 'hidden' } },
                    el('div', { style: { width: `${attributes.galItems.length * 74}px`, marginLeft: 'auto', marginRight: 'auto', display: 'block' } },
                        1 < attributes.galItems.length ? attributes.galItems.map((x, i) => el('img', { className: 'ctclg-gal-img', id: `ctclif-gal-img-${attributes.timeStamp}-${i}`, 'data-ts': `${attributes.timeStamp}`, 'data-image-num': `${i}`, style: { width: '70px', height: '70px', margin: '2px' }, onMouseOver: () => { setAttributes({ mainImage: x.url }) }, key: i, title: x.caption, src: x.url })) : ''),
                )),
            el('div', { style: { border: '1px solid rgba(0,0,0,1)', backgroundColor: 'rgba(255,255,255,1)', } },

                el(MediaUpload, {
                    title: __('Select  product images for gallery ', 'ctcl-image-gallery'),
                    multiple: true,
                    value: attributes.galItems.map(x => x.id),
                    gallery: true,
                    onSelect: gal => {
                        setAttributes({ galItems: gal });
                        setAttributes({ mainImage: gal[0].url });
                    },
                    render: ({ open }) => el('div', { style: { width: '100%', backgroundColor: 'rgba(255,255,,255,1)', color: 'rgba(0,0,0,1)', padding: '10px' } },
                        el('h4', { className: 'dashicons-before dashicons-format-gallery' }, __('Product Image Gallery ')),

                        el(Button, { style: { marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgba(0,0,0,1)', border: '1px solid rgba(0,0,0,1)' }, className: "ctclig-media-button dashicons-before dashicons-format-gallery", onClick: open }, __(" Select Images", "ctcl-image-gallery")),
                    ),
                }),

                el(InspectorControls, null,
                    el(PanelBody, null,
                        el(RangeControl, {
                            label: __('Image width in pixel (px)', 'ctc-gal'),
                            min: 75,
                            max: window.innerWidth,
                            onChange: val => setAttributes({ mainImgWd: val }),
                            value: attributes.mainImageWd,
                        }),

                        el(RangeControl, {
                            label: __('Image height in pixel(px)', 'ctc-gal'),
                            min: 75,
                            max: window.innerHeight,
                            onChange: val => setAttributes({ mainImgHt: val }),
                            value: attributes.mainImageHt,
                        })

                    ))

            ),


        )


    },
    save: () => el('div', { className: 'ctcl-image-gallery' }),



});