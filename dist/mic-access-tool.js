!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.MicAccessTool=t():e.MicAccessTool=t()}(self,(()=>(()=>{"use strict";function e(e){this.init=e||{},this.removedImages=[],this.imagesHidden=!1,this.isMuted=!1,this.initializeAccessibilityToolbox(),this.initBlueFilter(),this.initRemoveImages(),this.initAudioRemoval(),this.initReadAloud()}function t(e,t={},o=""){const i=document.createElement(e);for(const[e,o]of Object.entries(t))i.setAttribute(e,o);return o&&(i.innerText=o),i}function o(e,o=""){const i={class:e};return o&&(i.id=o),t("div",i)}function i(e,o,i){return t("img",{src:e,alt:o,class:i})}return e.prototype.createToolbox=function(){const e=o("toolbox hidden","toolbox"),n=o("toolbox-image-container"),d=i("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Accessibility Logo","toolbox-image");n.appendChild(d);const s=o("toolbox-header"),c=function(e,o,i=""){return t(`h${2}`,{class:i},"Accessibility Toolbox")}(0,0,"toolbox-title");s.appendChild(c);const l=o("toolbox-body");[{id:"blue-filter-btn",text:"Blue Filter"},{id:"read-aloud-btn",text:"Read Aloud"},{id:"remove-images-btn",text:"Remove Images"},{id:"remove-audio-btn",text:"Remove Audio"}].forEach((({id:e,text:o})=>{const i=function(e,o){return t("button",{class:"toolbox-button",id:e},o)}(e,o);l.appendChild(i)})),e.appendChild(n),e.appendChild(s),e.appendChild(l),document.body.appendChild(e)},e.prototype.createSideButton=function(){const e=o("side-button","openToolboxButton"),t=i("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Open Toolbox","");e.appendChild(t),document.body.appendChild(e)},e.prototype.initializeAccessibilityToolbox=function(){this.createToolbox(),this.createSideButton();const e=document.getElementById("toolbox");document.getElementById("openToolboxButton").addEventListener("click",(()=>{e.classList.toggle("visible")}))},e.prototype.initBlueFilter=function(){const e=o("blue-overlay");document.body.appendChild(e);const t=document.getElementById("blue-filter-btn");t&&t.addEventListener("click",(()=>{e.classList.toggle("active")}))},e.prototype.initRemoveImages=function(){const e=document.getElementById("remove-images-btn");e&&e.addEventListener("click",this.toggleImages.bind(this))},e.prototype.toggleImages=function(){this.imagesHidden?(this.removedImages.forEach((({img:e,parent:t,nextSibling:o})=>{o?t.insertBefore(e,o):t.appendChild(e)})),this.removedImages=[]):document.querySelectorAll("img").forEach((e=>{this.removedImages.push({img:e,parent:e.parentNode,nextSibling:e.nextSibling}),e.parentNode.removeChild(e)})),this.imagesHidden=!this.imagesHidden},e.prototype.initAudioRemoval=function(){const e=document.getElementById("remove-audio-btn");e&&e.addEventListener("click",this.audioRemoval.bind(this))},e.prototype.audioRemoval=function(){const e=document.querySelectorAll("audio, video");this.isMuted=!this.isMuted,e.forEach((e=>{e.muted=this.isMuted}))},e.prototype.initReadAloud=function(){const e=document.getElementById("read-aloud-btn");e&&e.addEventListener("click",this.readAloud.bind(this))},e.prototype.readAloud=function(){const e=new SpeechSynthesisUtterance,t=document.querySelectorAll("h1, h2, h3, p, a, button");t.forEach((o=>{o.addEventListener("click",(()=>{e.text=o.innerText||o.value||"",e.text&&(t.forEach((e=>e.style.backgroundColor="")),o.style.backgroundColor="yellow",speechSynthesis.speak(e),e.onend=()=>{o.style.backgroundColor=""})}))}))},document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelectorAll(".toolbox-button");e.forEach((t=>{t.addEventListener("click",(()=>{e.forEach((e=>e.classList.remove("active"))),t.classList.add("active")}))}))})),document.addEventListener("DOMContentLoaded",(()=>{new e})),{}})()));