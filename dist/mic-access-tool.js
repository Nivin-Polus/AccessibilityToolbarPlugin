!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.MicAccessTool=t():e.MicAccessTool=t()}(self,(()=>(()=>{"use strict";function e(e){this.init=e||{},this.removedImages=[],this.imagesHidden=!1,this.isMuted=!1,this.initializeAccessibilityToolbox(),this.initBlueFilter(),this.initRemoveImages(),this.initAudioRemoval(),this.initReadAloud(),this.initFontSizeAdjustment(),this.initHighlightButtons(),this.initStopAnimationsButton(),this.initZoomToggleFeature()}function t(e,t={},o=""){const n=document.createElement(e);for(const[e,o]of Object.entries(t))n.setAttribute(e,o);return o&&(n.innerText=o),n}function o(e,o,n=""){const i=t("button",{class:"toolbox-button",id:e});if(n){const e=document.createElement("span");e.innerHTML=n,i.appendChild(e)}const s=document.createTextNode(o);return i.appendChild(s),i}function n(e,o=""){const n={class:e};return o&&(n.id=o),t("div",n)}function i(e,o,n){return t("img",{src:e,alt:o,class:n})}function s(e,o,n=""){return t(`h${e}`,{class:n},o)}return e.prototype.createToolbox=function(){const e=n("toolbox hidden","toolbox"),t=n("toolbox-image-container"),a=i("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Accessibility Logo","toolbox-image");t.appendChild(a),e.appendChild(t);const l=n("toolbox-header"),d=s(2,"Accessibility Toolbox","toolbox-title");l.appendChild(d);const c=n("toolbox-body");[{id:"blue-filter-btn",text:"Blue Filter",iconClass:'<i class="fas fa-adjust"></i>'},{id:"read-aloud-btn",text:"Read Aloud",iconClass:'<i class="fas fa-volume-up"></i>'},{id:"remove-images-btn",text:"Remove Images",iconClass:'<i class="fa-regular fa-image"></i>'},{id:"remove-audio-btn",text:"Remove Audio",iconClass:'<i class="fas fa-microphone-slash"></i>'},{id:"increase-text-btn",text:"Increase Text",iconClass:'<i class="fas fa-text-height"></i>'},{id:"decrease-text-btn",text:"Decrease Text",iconClass:'<i class="fas fa-text-width"></i>'},{id:"highlight-links-btn",text:"Highlight Links",iconClass:'<i class="fas fa-link"></i>'},{id:"highlight-headers-btn",text:"Highlight Headers",iconClass:'<i class="fas fa-heading"></i>'},{id:"stop-animations-btn",text:"Stop Animations",iconClass:'<i class="fas fa-ban"></i>'},{id:"zoom-toggle-btn",text:"Zoom",iconClass:'<i class="fas fa-search"></i>'}].forEach((({id:e,text:t,iconClass:n})=>{const i=o(e,t,n);c.appendChild(i)})),e.appendChild(l),e.appendChild(c),document.body.appendChild(e)},e.prototype.createSideButton=function(){const e=n("side-button","openToolboxButton"),t=i("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Open Toolbox","side-button-image");e.appendChild(t),document.body.appendChild(e)},e.prototype.initializeAccessibilityToolbox=function(){this.createToolbox(),this.createSideButton();const e=document.getElementById("toolbox"),t=document.getElementById("openToolboxButton");t.addEventListener("click",(t=>{t.stopPropagation(),e.classList.toggle("visible")})),document.addEventListener("click",(o=>{e.contains(o.target)||t.contains(o.target)||e.classList.remove("visible")}))},e.prototype.initBlueFilter=function(){const e=n("blue-overlay");document.body.appendChild(e);const t=document.getElementById("blue-filter-btn");t&&t.addEventListener("click",(()=>{e.classList.toggle("active")}))},e.prototype.initRemoveImages=function(){const e=document.getElementById("remove-images-btn");e&&e.addEventListener("click",this.toggleImages.bind(this))},e.prototype.toggleImages=function(){this.imagesHidden?(this.removedImages.forEach((({img:e,parent:t,nextSibling:o})=>{o?t.insertBefore(e,o):t.appendChild(e)})),this.removedImages=[]):document.querySelectorAll("img:not(.toolbox-image):not(.side-button-image)").forEach((e=>{this.removedImages.push({img:e,parent:e.parentNode,nextSibling:e.nextSibling}),e.parentNode.removeChild(e)})),this.imagesHidden=!this.imagesHidden},e.prototype.initAudioRemoval=function(){const e=document.getElementById("remove-audio-btn");e&&e.addEventListener("click",this.audioRemoval.bind(this))},e.prototype.audioRemoval=function(){const e=document.querySelectorAll("audio, video");this.isMuted=!this.isMuted,e.forEach((e=>{e.muted=this.isMuted}))},e.prototype.initReadAloud=function(){const e=document.getElementById("read-aloud-btn");if(e){let t=!1;e.addEventListener("click",(()=>{t?(this.disableDefaultClickToRead(),t=!1,this.stopReadAloud()):(document.getElementById("read-aloud-toolbar")||this.createReadAloudToolbar(),this.enableDefaultClickToRead(),t=!0)}))}},e.prototype.createReadAloudToolbar=function(){const e=n("read-aloud-toolbar","read-aloud-toolbar"),t=n("toolbar-header"),i=s(2,"Read Aloud Settings","toolbar-title"),a=o("close-toolbar","✖");a.addEventListener("click",(()=>{e.remove(),this.disableDefaultClickToRead()})),t.appendChild(i),t.appendChild(a),e.appendChild(t);const l=n("toolbar-controls"),d=o("cursor-read-btn","Cursor Read Aloud");d.innerHTML='<i class="fas fa-mouse-pointer"></i> Cursor Read Aloud',d.addEventListener("click",this.enableCursorReadAloud.bind(this));const c=o("previous-line-btn","Previous Line");c.innerHTML='<i class="fas fa-arrow-left"></i> ',c.addEventListener("click",this.readPreviousLine.bind(this));const r=o("play-read-btn","▶");r.innerHTML='<i class="fas fa-play"></i>',r.addEventListener("click",this.playReadAloud.bind(this));const h=o("stop-read-btn","⏹");h.innerHTML='<i class="fas fa-stop"></i>',h.addEventListener("click",this.stopReadAloud.bind(this));const p=o("next-line-btn","Next Line");p.innerHTML='<i class="fas fa-arrow-right"></i> ',p.addEventListener("click",this.readNextLine.bind(this));const u=document.createElement("div");u.className="sliders-container";const m=document.createElement("div");m.className="slider-wrapper";const g=document.createElement("label");g.setAttribute("for","volume-slider"),g.textContent="Volume:",m.appendChild(g);const b=document.createElement("input");b.type="range",b.id="volume-slider",b.min="0",b.max="1",b.step="0.1",b.value=this.currentVolume||1,b.addEventListener("input",(e=>{this.currentVolume=parseFloat(e.target.value),console.log(`Volume updated to: ${this.currentVolume}`)})),m.appendChild(b);const f=document.createElement("div");f.className="slider-wrapper";const y=document.createElement("label");y.setAttribute("for","speed-slider"),y.textContent="Speed:",f.appendChild(y);const x=document.createElement("input");x.type="range",x.id="speed-slider",x.min="0.5",x.max="2",x.step="0.1",x.value=this.currentSpeed||1,x.addEventListener("input",(e=>{this.currentSpeed=parseFloat(e.target.value),console.log(`Speed updated to: ${this.currentSpeed}`)})),f.appendChild(x),u.appendChild(m),u.appendChild(f),f.appendChild(x),l.appendChild(d),l.appendChild(c),l.appendChild(r),l.appendChild(h),l.appendChild(p),l.appendChild(u),e.appendChild(l),document.body.appendChild(e)},e.prototype.highlightText=function(e,t,o){const n=e.textContent,i=n.slice(t,t+o);e.textContent="";const s=document.createElement("span");s.textContent=i,s.style.backgroundColor="yellow",e.appendChild(s),setTimeout((()=>{e.textContent=n}),500)},e.prototype.enableDefaultClickToRead=function(){document.querySelectorAll("h1, h2, h3, p, a, button").forEach((e=>{e.addEventListener("click",this.readElementContent.bind(this))}))},e.prototype.disableDefaultClickToRead=function(){document.querySelectorAll("h1, h2, h3, p, a, button").forEach((e=>{e.removeEventListener("click",this.readElementContent.bind(this))}))},e.prototype.readElementContent=function(e){const t=e.target,o=t.innerText||t.value||"",n=new SpeechSynthesisUtterance(o);n.volume=this.currentVolume||1,n.rate=this.currentSpeed||1;const i=o.split(" ");let s=0;n.onboundary=e=>{if("word"===e.name){const o=e.charIndex,n=i[s].length;this.highlightText(t,o,n),s++}},n.onend=()=>{t.innerHTML=o},speechSynthesis.speak(n)},e.prototype.playReadAloud=function(){const e=document.body.innerText,t=new SpeechSynthesisUtterance(e);t.volume=this.currentVolume||1,t.rate=this.currentSpeed||1;const o=e.split(" ");let n=0;t.onboundary=e=>{if("word"===e.name){const t=e.charIndex,i=o[n].length;this.highlightText(document.body,t,i),n++}},t.onend=()=>{document.body.textContent=e},speechSynthesis.speak(t)},e.prototype.enableCursorReadAloud=function(){document.querySelectorAll("h1, h2, h3, p, a, button").forEach((e=>{let t;e.addEventListener("mouseenter",(()=>{t=setTimeout((()=>{const t=new SpeechSynthesisUtterance(e.innerText||e.value||"");t.volume=this.currentVolume||1,t.rate=this.currentSpeed||1,this.highlightText(e,0,e.innerText.length),speechSynthesis.speak(t)}),1e3)})),e.addEventListener("mouseleave",(()=>{clearTimeout(t),speechSynthesis.cancel()}))}))},e.prototype.readPreviousLine=function(){if(!this.currentParagraphIndex||this.currentParagraphIndex<=0)return void(this.currentParagraphIndex=0);this.currentParagraphIndex--;const e=document.querySelectorAll("p");e[this.currentParagraphIndex]&&this.speakText(e[this.currentParagraphIndex].innerText)},e.prototype.readNextLine=function(){const e=document.querySelectorAll("p");this.currentParagraphIndex||(this.currentParagraphIndex=0),this.currentParagraphIndex<e.length-1&&(this.currentParagraphIndex++,e[this.currentParagraphIndex]&&this.speakText(e[this.currentParagraphIndex].innerText))},e.prototype.speakText=function(e){const t=new SpeechSynthesisUtterance(e);t.volume=this.currentVolume||1,t.rate=this.currentSpeed||1,speechSynthesis.cancel(),speechSynthesis.speak(t)},e.prototype.stopReadAloud=function(){speechSynthesis.cancel()},document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelectorAll(".toolbox-button");e.forEach((t=>{t.addEventListener("click",(()=>{e.forEach((e=>e.style.backgroundColor="rgba(255, 255, 255, 0.3)")),t.style.backgroundColor="rgba(52, 88, 185, 1)"}))}))})),e.prototype.initFontSizeAdjustment=function(){const e=document.getElementById("increase-text-btn"),t=document.getElementById("decrease-text-btn");e&&e.addEventListener("click",this.adjustFontSize.bind(this,"increase")),t&&t.addEventListener("click",this.adjustFontSize.bind(this,"decrease"))},e.prototype.adjustFontSize=function(e){document.querySelectorAll("body *:not(.toolbox):not(.toolbox *)").forEach((t=>{const o=window.getComputedStyle(t),n=parseFloat(o.fontSize);let i;"increase"===e?i=Math.min(n+2,36):"decrease"===e&&(i=Math.max(n-2,12)),t.style.fontSize=`${i}px`}))},e.prototype.initHighlightButtons=function(){const e=document.getElementById("highlight-links-btn");e&&e.addEventListener("click",(()=>this.highlightContent("links")));const t=document.getElementById("highlight-headers-btn");t&&t.addEventListener("click",(()=>this.highlightContent("headers")));const o=document.getElementById("highlight-images-btn");o&&o.addEventListener("click",(()=>this.highlightContent("images")))},e.prototype.highlightContent=function(e){const t=`highlight-${e}`;let o;if("links"===e)o="a";else if("headers"===e)o="h1, h2, h3, h4, h5, h6";else{if("images"!==e)return void console.warn("Invalid type for highlightContent");o="img"}const n=document.querySelectorAll(o);0!==n.length?(n.forEach((o=>{if("images"===e)if(o.parentNode.classList.contains(t)){const e=o.parentNode;e.replaceWith(...e.childNodes)}else{const e=document.createElement("div");e.className=t,o.parentNode.insertBefore(e,o),e.appendChild(o);const n=o.alt||"No title available",i=document.createElement("span");i.textContent=n,e.appendChild(i)}else o.classList.toggle(t)})),console.log(`${n.length} ${e} elements toggled for highlighting.`)):console.warn(`No ${e} found to highlight.`)},e.prototype.stopAnimations=function(){const e=document.body.classList.toggle("disable-animations");localStorage.setItem("animationsDisabled",e),e?console.log("Animations and transitions disabled."):console.log("Animations and transitions re-enabled.")},e.prototype.restoreAnimationState=function(){"true"===localStorage.getItem("animationsDisabled")&&(document.body.classList.add("disable-animations"),console.log("Restored: Animations are disabled."))},e.prototype.initStopAnimationsButton=function(){const e=document.getElementById("stop-animations-btn");e&&e.addEventListener("click",this.stopAnimations.bind(this))},e.prototype.initialApp=function(){this.restoreAnimationState(),console.log("Accessibility toolbox initialized.")},e.prototype.initZoomToggleFeature=function(){this.zoomStates=[1,1.25,1.5],this.zoomIndex=0;const e=document.getElementById("zoom-toggle-btn");e&&e.addEventListener("click",this.toggleZoom.bind(this))},e.prototype.toggleZoom=function(){this.zoomIndex=(this.zoomIndex+1)%this.zoomStates.length;const e=this.zoomStates[this.zoomIndex];this.applyZoom(e)},e.prototype.applyZoom=function(e){document.querySelectorAll("body > *:not(#toolbox):not(#openToolboxButton)").forEach((t=>{t.style.transform=`scale(${e})`,t.style.transformOrigin="0 0",t.style.width=100/e+"%"})),console.log(`Zoom level applied: ${e}`)},e.prototype.restoreZoomState=function(){const e=parseFloat(localStorage.getItem("zoomLevel"))||1;this.applyZoom(e),this.zoomIndex=this.zoomStates.indexOf(e),-1===this.zoomIndex&&(this.zoomIndex=0)},e.prototype.saveZoomState=function(e){localStorage.setItem("zoomLevel",e),console.log(`Zoom level saved: ${e}`)},e.prototype.applyZoom=function(e){document.querySelectorAll("body > *:not(#toolbox):not(#openToolboxButton):not(img)").forEach((t=>{t.style.transform=`scale(${e})`,t.style.transformOrigin="0 0",t.style.width=100/e+"%"})),this.saveZoomState(e),console.log(`Zoom level applied: ${e}`)},document.addEventListener("DOMContentLoaded",(()=>{new e,function(){const e=document.createElement("link");e.rel="stylesheet",e.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",e.type="text/css",document.head.appendChild(e)}()})),{}})()));