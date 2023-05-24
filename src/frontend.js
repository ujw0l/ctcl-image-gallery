import {ctclImgGal} from 'ctcl-image-gallery/ctcl-image-gallery.js'
import { ctcOverlayViewer } from 'ctc-gallery-viewer';  

window.addEventListener('DOMContentLoaded', ()=>{

    new ctclImgGal('.ctcl-gallery',{ 
        imageEvent:'mousemove' , 
        callBack: el=> {
        el.style.opacity ='';
        el.querySelector('.ctclig-main-image').addEventListener('click',e=>e.target.parentElement.querySelector(`img[data-img-num='${e.target.getAttribute('data-num')}']`).click()  );    
       setTimeout(()=> new ctcOverlayViewer(`#ctcl-gallery-${el.getAttribute('data-clntid')} .ctclig-image-list`),5000);
    }
    });

    
    

})