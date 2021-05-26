window.addEventListener('DOMContentLoaded', () => {


    new jsOverlay({ imgGallery: '.ctclig-image-list', containerHt: 700, containerWd: 900, });
    document.querySelector('body').style.overflow = '';

    Array.from(document.querySelectorAll('.ctcl-image-gallery')).map(x => {

        Array.from(x.querySelectorAll('.ctclig-image-list div img')).map(y => {
            y.addEventListener('mouseover', e => {
                x.querySelector('.ctclig-main-image').style.backgroundImage = `url("${e.target.src}")`;
                x.querySelector('.ctclig-main-image').setAttribute('data-img-num', e.target.getAttribute('data-image-num'));
            })



        });

        x.querySelector('.ctclig-main-image').addEventListener('click', e => {
            x.querySelector(`#ctclif-gal-img-${e.target.getAttribute('data-ts')}-${e.target.getAttribute('data-img-num')}`).click();
        });
    })


})