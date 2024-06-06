import {ctclImgGal} from 'ctcl-image-gallery/ctcl-image-gallery.js'
 
window.addEventListener('DOMContentLoaded', ()=>{

    new ctclImgGal('.ctcl-gallery',{ 
        imageEvent:'mousemove' , 
        callBack: el=> el.style.opacity ='',
        
    });

})