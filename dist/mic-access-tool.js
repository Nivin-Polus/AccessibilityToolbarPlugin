!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.MicAccessTool=t():e.MicAccessTool=t()}(self,(()=>(()=>{"use strict";function e(e){this.init=e||{},this.removedImages=[],this.imagesHidden=!1,this.isMuted=!1,this.initializeAccessibilityToolbox(),this.initBlueFilter(),this.initRemoveImages(),this.initAudioRemoval(),this.initReadAloud()}function t(e,t={},o=""){const n=document.createElement(e);for(const[e,o]of Object.entries(t))n.setAttribute(e,o);return o&&(n.innerText=o),n}function o(e,o=""){const n={class:e};return o&&(n.id=o),t("div",n)}function n(e,o,n){return t("img",{src:e,alt:o,class:n})}return e.prototype.createToolbox=function(){const e=o("toolbox hidden","toolbox"),i=o("toolbox-image-container"),s=n("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Accessibility Logo","toolbox-image");i.appendChild(s),e.appendChild(i);const d=o("toolbox-header"),c=function(e,o,n=""){return t(`h${2}`,{class:n},"Accessibility Toolbox")}(0,0,"toolbox-title");d.appendChild(c);const l=o("toolbox-body");[{id:"blue-filter-btn",text:"Blue Filter",iconClass:'<i class="fas fa-adjust"></i>'},{id:"remove-images-btn",text:"Remove Images",iconClass:'<i class="fa-regular fa-image"></i>'}].forEach((({id:e,text:o,iconClass:n})=>{const i=function(e,o,n=""){const i=t("button",{class:"toolbox-button",id:e});if(n){const e=document.createElement("span");e.innerHTML=n,i.appendChild(e)}const s=document.createTextNode(o);return i.appendChild(s),i}(e,o,n);l.appendChild(i)})),e.appendChild(d),e.appendChild(l),document.body.appendChild(e)},e.prototype.createSideButton=function(){const e=o("side-button","openToolboxButton"),t=n("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Open Toolbox","side-button-image");e.appendChild(t),document.body.appendChild(e)},e.prototype.initializeAccessibilityToolbox=function(){this.createToolbox(),this.createSideButton();const e=document.getElementById("toolbox"),t=document.getElementById("openToolboxButton");t.addEventListener("click",(t=>{t.stopPropagation(),e.classList.toggle("visible")})),document.addEventListener("click",(o=>{e.contains(o.target)||t.contains(o.target)||e.classList.remove("visible")}))},e.prototype.initBlueFilter=function(){const e=o("blue-overlay");document.body.appendChild(e);const t=document.getElementById("blue-filter-btn");t&&t.addEventListener("click",(()=>{e.classList.toggle("active")}))},e.prototype.initRemoveImages=function(){const e=document.getElementById("remove-images-btn");e&&e.addEventListener("click",this.toggleImages.bind(this))},e.prototype.toggleImages=function(){this.imagesHidden?(this.removedImages.forEach((({img:e,parent:t,nextSibling:o})=>{o?t.insertBefore(e,o):t.appendChild(e)})),this.removedImages=[]):document.querySelectorAll("img:not(.toolbox-image):not(.side-button-image)").forEach((e=>{this.removedImages.push({img:e,parent:e.parentNode,nextSibling:e.nextSibling}),e.parentNode.removeChild(e)})),this.imagesHidden=!this.imagesHidden},e.prototype.initAudioRemoval=function(){const e=document.getElementById("remove-audio-btn");e&&e.addEventListener("click",this.audioRemoval.bind(this))},e.prototype.audioRemoval=function(){const e=document.querySelectorAll("audio, video");this.isMuted=!this.isMuted,e.forEach((e=>{e.muted=this.isMuted}))},e.prototype.initReadAloud=function(){const e=document.getElementById("read-aloud-btn");e&&e.addEventListener("click",this.readAloud.bind(this))},e.prototype.readAloud=function(){const e=new SpeechSynthesisUtterance,t=document.querySelectorAll("h1, h2, h3, p, a, button");t.forEach((o=>{o.addEventListener("click",(()=>{e.text=o.innerText||o.value||"",e.text&&(t.forEach((e=>e.style.backgroundColor="")),o.style.backgroundColor="yellow",speechSynthesis.speak(e),e.onend=()=>{o.style.backgroundColor=""})}))}))},document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelectorAll(".toolbox-button");e.forEach((t=>{t.addEventListener("click",(()=>{e.forEach((e=>e.style.backgroundColor="rgba(255, 255, 255, 0.3)")),t.style.backgroundColor="rgba(52, 88, 185, 1)"}))}))})),document.addEventListener("DOMContentLoaded",(()=>{new e,function(){const e=document.createElement("link");e.rel="stylesheet",e.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",e.type="text/css",document.head.appendChild(e)}()})),{}})()));