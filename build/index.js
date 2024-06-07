(()=>{"use strict";var e,t={632:()=>{const e=window.wp.blocks,t=window.wp.i18n,a=window.React;class l{constructor(e,t){Array.from(document.querySelectorAll(e)).map((e=>{this.createGal(e,t)}))}createGal(e,t){let a=null!=t&&null!=t.imageEvent?t.imageEvent:"click",l=null!=t&&null!=t.mainImgWd?t.mainImgWd:e.offsetWidth,i=null!=t&&null!=t.mainImgHt?t.mainImgHt:e.offsetHeight,n=document.createElement("div");n.classList.add("ctclig-image-list"),e.appendChild(n);let r=document.createElement("div");r.classList.add("ctclig-main-image"),r.style=`width:${l}px; height :${i}px ;background: url("") center center / contain no-repeat rgb(255, 255, 255,0.5); margin-left:auto;margin-right:auto;display: block;`,r.innerHTML=`<span style='font-size:${l/30}px;position:relative; top: ${i/2-5}px; left: ${l/2-5}px ;' >Loading ...</span>`,n.appendChild(r);let m=document.createElement("div");m.style.width=`${l}px`,m.classList.add("ctclig-image-cont"),m.style.overflowX="auto",m.style.overflowY="hidden",m.style.marginLeft="auto",m.style.marginRight="auto",m.style.display="block";let c=document.createElement("div");c.style.width="0px",c.style.marginLeft="auto",c.style.marginRight="auto",c.style.display="block",m.appendChild(c),n.appendChild(m),Array.from(e.querySelectorAll("img")).map(((e,t)=>{e.style.display="none";let l=new Image;l.src=e.src,l.addEventListener("load",(e=>{""!=r.innerHTML&&(r.innerHTML="",r.setAttribute("data-num",t),r.style.backgroundImage=`url("${e.target.src}")`);let l=e.target.width/e.target.height*70;c.style.width=`${parseFloat(c.style.width)+l+4}px`,e.target.style.width=`${l}px`,e.target.setAttribute("data-img-num",t),e.target.style.height="70px",e.target.style.margin="2px",e.target.style.display="",e.target.addEventListener(a,(e=>{r.setAttribute("data-num",t),r.style.backgroundImage=`url("${e.target.src}")`,e.target.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})})),c.appendChild(e.target)}))})),e.style.height=`${i+100}px`,null!=t&&null!=t.callBack&&t.callBack(e)}}const i=window.wp.components,n=window.wp.blockEditor,r=JSON.parse('{"u2":"ctcl-image-gallery/ctcl-image-gallery"}');(0,e.registerBlockType)(r.u2,{keywords:[(0,t.__)("Gallery","ctcl-image-gallery"),(0,t.__)("image gallery","ctcl-image-gallery")],attributes:{galItems:{type:"Array",default:[]},mainImage:{type:"String",default:""},clntId:{type:"String",default:""},mainImgWd:{type:"Number",default:450},mainImgHt:{type:"Number",default:700},mainImgFinalWd:{type:"Number",default:450},mainImgFinalHt:{type:"Number",default:700}},edit:function({clientId:e,attributes:r,setAttributes:m}){const c=(0,a.useRef)(!0),g=(0,a.useRef)(!1);return m({clntId:e}),(0,a.useEffect)((()=>{let e=document.querySelector(`#ctcl-img-gal-${r.clntId}`),t=e.querySelector(".ctclig-main-image");if(null!=t&&(m({mainImgFinalWd:t.offsetWidth}),m({mainImgFinalHt:t.offsetHeight})),c.current)c.current=!1,null!=e.querySelector(".ctclig-main-image")&&(e.querySelector(".ctclig-main-image").remove(),e.querySelector(".ctclig-image-cont").remove()),0<r.galItems.length&&new l(`#ctcl-img-gal-${r.clntId}`,{mainImgHt:r.mainImgFinalHt,mainImgWd:r.mainImgFinalWd,imageEvent:"mousemove",callBack:e=>e.style.opacity=""});else{let t=e.querySelector(".ctclig-main-image");t.style.height=r.mainImgHt+"px",t.style.width=r.mainImgWd+"px",e.querySelector(".ctclig-image-cont").style.width=t.offsetWidth+"px"}}),[r.mainImgHt,r.mainImgWd,r.galItems]),(0,a.createElement)("div",{...(0,n.useBlockProps)()},(0,a.createElement)("div",{className:"ctcl-image-gallery-block",id:`ctcl-img-gal-${r.clntId}`,ref:g,"data-height":r.mainImageHt,"data-width":r.mainImageWd,style:{opacity:"0",height:r.mainImageHt+"px",width:r.mainImageWd+"px"}},0<r.galItems.length&&r.galItems.map(((e,t)=>(0,a.createElement)("img",{key:t,id:`ctclif-gal-img-${r.clntId}-${t}`,"data-ts":`${r.clntId}`,"data-image-num":t,style:{width:"70px",height:"70px",margin:"2px"},className:"ctclg-gal-img",onMouseOver:()=>m({mainImage:e.url}),title:e.caption,src:e.url})))),(0,a.createElement)("div",{style:{border:"1px solid rgb(61, 148, 218)",backgroundColor:"rgba(255,255,255,1)"}},(0,a.createElement)(n.MediaUploadCheck,null,(0,a.createElement)(n.MediaUpload,{title:(0,t.__)("Select  images for gallery ","ctcl-image-gallery"),multiple:!0,value:r.galItems.map((e=>e.id)),gallery:!0,onSelect:e=>{m({galItems:e}),m({mainImage:e[0].url}),c.current=!0},allowedTypes:["image"],render:({open:e})=>(0,a.createElement)("div",{style:{width:"100%",backgroundColor:"rgba(255,255,,255,1)",color:"rgb(61, 148, 218)",padding:"10px"}},(0,a.createElement)("h4",{className:"dashicons-before dashicons-cover-image"},(0,t.__)(" Image Gallery ","ctcl-image-gallery")),(0,a.createElement)(i.Button,{style:{marginLeft:"auto",marginRight:"auto",display:"block",color:"rgb(61, 148, 218)",border:"1px solid rgb(61, 148, 218)"},className:"ctclig-media-button dashicons-before dashicons-cover-image",onClick:e},(0,t.__)(" Select Images","ctcl-image-gallery")))}))),(0,a.createElement)(n.InspectorControls,null,(0,a.createElement)(i.PanelBody,null,(0,a.createElement)(i.RangeControl,{label:(0,t.__)("Image width in pixel (px)","ctcl-image-gallery"),min:148,max:window.innerWidth,onChange:e=>m({mainImgWd:e}),value:r.mainImageWd}),(0,a.createElement)(i.RangeControl,{label:(0,t.__)("Image height in pixel(px)","ctcl-image-gallery"),min:148,max:window.innerHeight,onChange:e=>m({mainImgHt:e}),value:r.mainImageHt}))))},save:function({attributes:e}){return(0,a.createElement)("div",{...n.useBlockProps.save()},0<e.galItems.length&&(0,a.createElement)("div",{id:`ctcl-gallery-${e.clntId}`,"data-clntid":e.clntId,style:{marginLeft:"auto",marginRight:"auto",display:"block",opacity:"0",width:e.mainImgFinalWd+"px",height:e.mainImgFinalHt+"px"},className:"ctcl-gallery","data-width":e.mainImgWd,"data-height":e.mainImgHt},e.galItems.map(((t,l)=>(0,a.createElement)("img",{className:"ctclg-gal-img",id:`ctclif-gal-img-${e.clntId}-${l}`,"data-ts":`${e.clntId}`,"data-image-num":l,style:{margin:"2px"},key:l,title:t.caption,src:t.url})))))}})}},a={};function l(e){var i=a[e];if(void 0!==i)return i.exports;var n=a[e]={exports:{}};return t[e](n,n.exports,l),n.exports}l.m=t,e=[],l.O=(t,a,i,n)=>{if(!a){var r=1/0;for(o=0;o<e.length;o++){for(var[a,i,n]=e[o],m=!0,c=0;c<a.length;c++)(!1&n||r>=n)&&Object.keys(l.O).every((e=>l.O[e](a[c])))?a.splice(c--,1):(m=!1,n<r&&(r=n));if(m){e.splice(o--,1);var g=i();void 0!==g&&(t=g)}}return t}n=n||0;for(var o=e.length;o>0&&e[o-1][2]>n;o--)e[o]=e[o-1];e[o]=[a,i,n]},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={826:0,431:0};l.O.j=t=>0===e[t];var t=(t,a)=>{var i,n,[r,m,c]=a,g=0;if(r.some((t=>0!==e[t]))){for(i in m)l.o(m,i)&&(l.m[i]=m[i]);if(c)var o=c(l)}for(t&&t(a);g<r.length;g++)n=r[g],l.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return l.O(o)},a=globalThis.webpackChunkctcl_image_gallery=globalThis.webpackChunkctcl_image_gallery||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})();var i=l.O(void 0,[431],(()=>l(632)));i=l.O(i)})();