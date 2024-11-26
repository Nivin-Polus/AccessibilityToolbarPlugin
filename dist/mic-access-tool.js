!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MicAccessTool=e():t.MicAccessTool=e()}(self,(()=>(()=>{"use strict";function t(t){this.init=t||{},this.removedImages=[],this.imagesHidden=!1,this.isMuted=!1,this.initializeAccessibilityToolbox(),this.initBlueFilter(),this.initRemoveImages(),this.initAudioRemoval(),this.initReadAloud(),this.initFontSizeAdjustment(),this.initHighlightButtons(),this.initStopAnimationsButton(),this.initZoomToggleFeature(),this.initNightModeFeature(),this.initTextSpacingFeature(),this.initLineHeightFeature(),this.initCursorSizeAdjustment(),this.initKeyboardNavigation(),this.initAccessibleFontToggle()}function e(t,e={},n=""){const o=document.createElement(t);for(const[t,n]of Object.entries(e))o.setAttribute(t,n);return n&&(o.innerText=n),o}function n(t,n,o=""){const i=e("button",{class:"toolbox-button",id:t});if(o){const t=document.createElement("span");t.innerHTML=o,i.appendChild(t)}const s=document.createTextNode(n);return i.appendChild(s),i}function o(t,n=""){const o={class:t};return n&&(o.id=n),e("div",o)}function i(t,n,o){return e("img",{src:t,alt:n,class:o})}function s(t,n,o=""){return e(`h${t}`,{class:o},n)}return t.prototype.createToolbox=function(){const t=o("toolbox hidden","toolbox"),e=o("toolbox-image-container"),a=i("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Accessibility Logo","toolbox-image");e.appendChild(a),t.appendChild(e);const l=o("toolbox-header"),c=s(2,"Accessibility Toolbox","toolbox-title");l.appendChild(c);const d=o("toolbox-body");[{id:"blue-filter-btn",text:"Blue Filter",iconClass:'<i class="fas fa-adjust"></i>'},{id:"read-aloud-btn",text:"Read Aloud",iconClass:'<i class="fas fa-volume-up"></i>'},{id:"remove-images-btn",text:"Remove Images",iconClass:'<i class="fa-regular fa-image"></i>'},{id:"remove-audio-btn",text:"Remove Audio",iconClass:'<i class="fas fa-microphone-slash"></i>'},{id:"increase-text-btn",text:"Increase Text",iconClass:'<i class="fas fa-text-height"></i>'},{id:"decrease-text-btn",text:"Decrease Text",iconClass:'<i class="fas fa-text-width"></i>'},{id:"highlight-links-btn",text:"Highlight Links",iconClass:'<i class="fas fa-link"></i>'},{id:"highlight-headers-btn",text:"Highlight Headers",iconClass:'<i class="fas fa-heading"></i>'},{id:"stop-animations-btn",text:"Stop Animations",iconClass:'<i class="fas fa-ban"></i>'},{id:"zoom-toggle-btn",text:"Zoom",iconClass:'<i class="fas fa-search"></i>'},{id:"night-mode-btn",text:"Night Mode",iconClass:'<i class="fas fa-moon"></i>'},{id:"cursor-size-btn",text:"Change Cursor Size",iconClass:'<i class="fas fa-mouse-pointer"></i>'}].forEach((({id:t,text:e,iconClass:o})=>{const i=n(t,e,o);d.appendChild(i)})),t.appendChild(l),t.appendChild(d),document.body.appendChild(t),this.resetButtonStates()},t.prototype.createSideButton=function(){const t=o("side-button","openToolboxButton"),e=i("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Open Toolbox","side-button-image");t.appendChild(e),document.body.appendChild(t)},t.prototype.initializeAccessibilityToolbox=function(){this.createToolbox(),this.createSideButton();const t=document.getElementById("toolbox"),e=document.getElementById("openToolboxButton");e.addEventListener("click",(e=>{e.stopPropagation(),t.classList.toggle("visible")})),document.addEventListener("click",(n=>{t.contains(n.target)||e.contains(n.target)||t.classList.remove("visible")}))},t.prototype.initBlueFilter=function(){const t=o("blue-overlay");document.body.appendChild(t);const e=document.getElementById("blue-filter-btn");e&&e.addEventListener("click",(()=>{t.classList.toggle("active"),this.setActiveButton("blue-filter-btn")}))},t.prototype.initRemoveImages=function(){const t=document.getElementById("remove-images-btn");t&&t.addEventListener("click",(()=>{this.toggleImages(),this.setActiveButton("remove-images-btn")}))},t.prototype.toggleImages=function(){this.imagesHidden?(this.removedImages.forEach((({img:t,parent:e,nextSibling:n})=>{n?e.insertBefore(t,n):e.appendChild(t)})),this.removedImages=[]):document.querySelectorAll("img:not(.toolbox-image):not(.side-button-image)").forEach((t=>{this.removedImages.push({img:t,parent:t.parentNode,nextSibling:t.nextSibling}),t.parentNode.removeChild(t)})),this.imagesHidden=!this.imagesHidden},t.prototype.initAudioRemoval=function(){const t=document.getElementById("remove-audio-btn");t&&t.addEventListener("click",(()=>{this.audioRemoval(),this.setActiveButton("remove-audio-btn")}))},t.prototype.audioRemoval=function(){const t=document.querySelectorAll("audio, video");this.isMuted=!this.isMuted,t.forEach((t=>{t.muted=this.isMuted}))},t.prototype.initReadAloud=function(){const t=document.getElementById("read-aloud-btn");if(t){let e=!1;t.addEventListener("click",(()=>{e?(this.disableDefaultClickToRead(),e=!1,this.stopReadAloud()):(document.getElementById("read-aloud-toolbar")||this.createReadAloudToolbar(),this.enableDefaultClickToRead(),e=!0)}))}},t.prototype.createReadAloudToolbar=function(){const t=o("read-aloud-toolbar","read-aloud-toolbar"),e=o("toolbar-header"),i=s(2,"Read Aloud Settings","toolbar-title"),a=n("close-toolbar","✖");a.addEventListener("click",(()=>{t.remove(),this.disableDefaultClickToRead()})),e.appendChild(i),e.appendChild(a),t.appendChild(e);const l=o("toolbar-controls"),c=n("cursor-read-btn","Cursor Read Aloud");c.innerHTML='<i class="fas fa-mouse-pointer"></i> Cursor Read Aloud',c.addEventListener("click",this.enableCursorReadAloud.bind(this));const d=n("previous-line-btn","Previous Line");d.innerHTML='<i class="fas fa-arrow-left"></i> ',d.addEventListener("click",this.readPreviousLine.bind(this));const r=n("play-read-btn","▶");r.innerHTML='<i class="fas fa-play"></i>',r.addEventListener("click",this.playReadAloud.bind(this));const u=n("stop-read-btn","⏹");u.innerHTML='<i class="fas fa-stop"></i>',u.addEventListener("click",this.stopReadAloud.bind(this));const h=n("next-line-btn","Next Line");h.innerHTML='<i class="fas fa-arrow-right"></i> ',h.addEventListener("click",this.readNextLine.bind(this));const p=document.createElement("div");p.className="sliders-container";const g=document.createElement("div");g.className="slider-wrapper";const m=document.createElement("label");m.setAttribute("for","volume-slider"),m.textContent="Volume:",g.appendChild(m);const b=document.createElement("input");b.type="range",b.id="volume-slider",b.min="0",b.max="1",b.step="0.1",b.value=this.currentVolume||1,b.addEventListener("input",(t=>{this.currentVolume=parseFloat(t.target.value),console.log(`Volume updated to: ${this.currentVolume}`)})),g.appendChild(b);const y=document.createElement("div");y.className="slider-wrapper";const v=document.createElement("label");v.setAttribute("for","speed-slider"),v.textContent="Speed:",y.appendChild(v);const f=document.createElement("input");f.type="range",f.id="speed-slider",f.min="0.5",f.max="2",f.step="0.1",f.value=this.currentSpeed||1,f.addEventListener("input",(t=>{this.currentSpeed=parseFloat(t.target.value),console.log(`Speed updated to: ${this.currentSpeed}`)})),y.appendChild(f),p.appendChild(g),p.appendChild(y),y.appendChild(f),l.appendChild(c),l.appendChild(d),l.appendChild(r),l.appendChild(u),l.appendChild(h),l.appendChild(p),t.appendChild(l),document.body.appendChild(t)},t.prototype.highlightText=function(t,e,n){const o=t.textContent,i=o.slice(e,e+n);t.textContent="";const s=document.createElement("span");s.textContent=i,s.style.backgroundColor="yellow",t.appendChild(s),setTimeout((()=>{t.textContent=o}),500)},t.prototype.enableDefaultClickToRead=function(){document.querySelectorAll("h1, h2, h3, p, a, button").forEach((t=>{t.addEventListener("click",this.readElementContent.bind(this))}))},t.prototype.disableDefaultClickToRead=function(){document.querySelectorAll("h1, h2, h3, p, a, button").forEach((t=>{t.removeEventListener("click",this.readElementContent.bind(this))}))},t.prototype.readElementContent=function(t){const e=t.target,n=e.innerText||e.value||"",o=new SpeechSynthesisUtterance(n);o.volume=this.currentVolume||1,o.rate=this.currentSpeed||1;const i=n.split(" ");let s=0;o.onboundary=t=>{if("word"===t.name){const n=t.charIndex,o=i[s].length;this.highlightText(e,n,o),s++}},o.onend=()=>{e.innerHTML=n},speechSynthesis.speak(o)},t.prototype.playReadAloud=function(){const t=document.body.innerText,e=new SpeechSynthesisUtterance(t);e.volume=this.currentVolume||1,e.rate=this.currentSpeed||1;const n=t.split(" ");let o=0;e.onboundary=t=>{if("word"===t.name){const e=t.charIndex,i=n[o].length;this.highlightText(document.body,e,i),o++}},e.onend=()=>{document.body.textContent=t},speechSynthesis.speak(e)},t.prototype.enableCursorReadAloud=function(){document.querySelectorAll("h1, h2, h3, p, a, button").forEach((t=>{let e;t.addEventListener("mouseenter",(()=>{e=setTimeout((()=>{const e=new SpeechSynthesisUtterance(t.innerText||t.value||"");e.volume=this.currentVolume||1,e.rate=this.currentSpeed||1,this.highlightText(t,0,t.innerText.length),speechSynthesis.speak(e)}),1e3)})),t.addEventListener("mouseleave",(()=>{clearTimeout(e),speechSynthesis.cancel()}))}))},t.prototype.readPreviousLine=function(){if(!this.currentParagraphIndex||this.currentParagraphIndex<=0)return void(this.currentParagraphIndex=0);this.currentParagraphIndex--;const t=document.querySelectorAll("p");t[this.currentParagraphIndex]&&this.speakText(t[this.currentParagraphIndex].innerText)},t.prototype.readNextLine=function(){const t=document.querySelectorAll("p");this.currentParagraphIndex||(this.currentParagraphIndex=0),this.currentParagraphIndex<t.length-1&&(this.currentParagraphIndex++,t[this.currentParagraphIndex]&&this.speakText(t[this.currentParagraphIndex].innerText))},t.prototype.speakText=function(t){const e=new SpeechSynthesisUtterance(t);e.volume=this.currentVolume||1,e.rate=this.currentSpeed||1,speechSynthesis.cancel(),speechSynthesis.speak(e)},t.prototype.stopReadAloud=function(){speechSynthesis.cancel()},document.addEventListener("DOMContentLoaded",(()=>{const t=document.querySelectorAll(".toolbox-button");t.forEach((e=>{e.addEventListener("click",(()=>{t.forEach((t=>t.style.backgroundColor="rgba(255, 255, 255, 0.3)")),e.style.backgroundColor="rgba(52, 88, 185, 1)"}))}))})),t.prototype.initFontSizeAdjustment=function(){const t=document.getElementById("increase-text-btn"),e=document.getElementById("decrease-text-btn");t&&t.addEventListener("click",(()=>{this.adjustFontSize("increase"),this.setActiveButton("increase-text-btn")})),e&&e.addEventListener("click",(()=>{this.adjustFontSize("decrease"),this.setActiveButton("decrease-text-btn")}))},t.prototype.adjustFontSize=function(t){document.querySelectorAll("body *:not(.toolbox):not(.toolbox *)").forEach((e=>{const n=window.getComputedStyle(e),o=parseFloat(n.fontSize);let i;"increase"===t?i=Math.min(o+2,36):"decrease"===t&&(i=Math.max(o-2,12)),e.style.fontSize=`${i}px`}))},t.prototype.initHighlightButtons=function(){const t=document.getElementById("highlight-links-btn");t&&t.addEventListener("click",(()=>{this.highlightContent("links"),this.setActiveButton("highlight-links-btn")}));const e=document.getElementById("highlight-headers-btn");e&&e.addEventListener("click",(()=>{this.highlightContent("headers"),this.setActiveButton("highlight-headers-btn")}));const n=document.getElementById("highlight-images-btn");n&&n.addEventListener("click",(()=>{this.highlightContent("images"),this.setActiveButton("highlight-images-btn")}))},t.prototype.highlightContent=function(t){const e=`highlight-${t}`;let n;if("links"===t)n="a";else if("headers"===t)n="h1, h2, h3, h4, h5, h6";else{if("images"!==t)return void console.warn("Invalid type for highlightContent");n="img"}const o=document.querySelectorAll(n);0!==o.length?(o.forEach((n=>{if("images"===t)if(n.parentNode.classList.contains(e)){const t=n.parentNode;t.replaceWith(...t.childNodes)}else{const t=document.createElement("div");t.className=e,n.parentNode.insertBefore(t,n),t.appendChild(n);const o=n.alt||"No title available",i=document.createElement("span");i.textContent=o,t.appendChild(i)}else n.classList.toggle(e)})),console.log(`${o.length} ${t} elements toggled for highlighting.`)):console.warn(`No ${t} found to highlight.`)},t.prototype.stopAnimations=function(){const t=document.body.classList.toggle("disable-animations");localStorage.setItem("animationsDisabled",t),t?(console.log("Animations and transitions disabled."),this.setActiveButton("stop-animations-btn")):(console.log("Animations and transitions re-enabled."),this.setActiveButton(null))},t.prototype.restoreAnimationState=function(){"true"===localStorage.getItem("animationsDisabled")?(document.body.classList.add("disable-animations"),console.log("Restored: Animations are disabled."),this.setActiveButton("stop-animations-btn")):this.setActiveButton(null)},t.prototype.initStopAnimationsButton=function(){const t=document.getElementById("stop-animations-btn");t&&t.addEventListener("click",this.stopAnimations.bind(this))},t.prototype.initialApp=function(){this.restoreAnimationState(),console.log("Accessibility toolbox initialized.")},t.prototype.initZoomToggleFeature=function(){this.zoomStates=[1,1.25,1.5],this.zoomIndex=0;const t=document.getElementById("zoom-toggle-btn");t&&t.addEventListener("click",this.toggleZoom.bind(this))},t.prototype.toggleZoom=function(){this.zoomIndex=(this.zoomIndex+1)%this.zoomStates.length;const t=this.zoomStates[this.zoomIndex];this.applyZoom(t),1===t?this.setActiveButton(null):this.setActiveButton("zoom-toggle-btn")},t.prototype.applyZoom=function(t){document.querySelectorAll("body > *:not(#toolbox):not(#openToolboxButton):not(img)").forEach((e=>{e.style.transform=`scale(${t})`,e.style.transformOrigin="0 0",e.style.width=100/t+"%"})),this.saveZoomState(t),console.log(`Zoom level applied: ${t}`)},t.prototype.restoreZoomState=function(){const t=parseFloat(localStorage.getItem("zoomLevel"))||1;this.applyZoom(t),this.zoomIndex=this.zoomStates.indexOf(t),-1===this.zoomIndex&&(this.zoomIndex=0),1!==t&&this.setActiveButton("zoom-toggle-btn")},t.prototype.saveZoomState=function(t){localStorage.setItem("zoomLevel",t),console.log(`Zoom level saved: ${t}`)},t.prototype.initNightModeFeature=function(){const t=document.getElementById("night-mode-btn");t&&t.addEventListener("click",(()=>{this.toggleNightMode()})),"true"===localStorage.getItem("nightMode")?(document.body.classList.add("night-mode"),this.setActiveButton("night-mode-btn")):this.setActiveButton(null)},t.prototype.toggleNightMode=function(){const t=document.body.classList.toggle("night-mode");localStorage.setItem("nightMode",t),t?this.setActiveButton("night-mode-btn"):this.setActiveButton(null),console.log(`Night Mode ${t?"enabled":"disabled"}.`)},t.prototype.initTextSpacingFeature=function(){const t=document.getElementById("text-spacing-btn");t&&t.addEventListener("click",(()=>{this.toggleTextSpacing("text-spacing-btn")}))},t.prototype.toggleTextSpacing=function(t){const e=document.querySelectorAll("body *:not(.toolbox):not(.toolbox *)"),n=["normal","0.1em","0.2em","0.3em"];void 0===this.currentTextSpacingIndex&&(this.currentTextSpacingIndex=0),this.currentTextSpacingIndex=(this.currentTextSpacingIndex+1)%n.length;const o=n[this.currentTextSpacingIndex];e.forEach((t=>{t.style.letterSpacing=o})),"normal"===o?this.setActiveButton(null):this.setActiveButton(t),console.log(`Text spacing set to: ${o}`)},t.prototype.initLineHeightFeature=function(){const t=document.getElementById("line-height-btn");t&&t.addEventListener("click",(()=>{this.toggleLineHeight("line-height-btn")}))},t.prototype.toggleLineHeight=function(t){const e=document.querySelectorAll("body *:not(.toolbox):not(.toolbox *)"),n=["normal","1.5","2","2.5"];void 0===this.currentLineHeightIndex&&(this.currentLineHeightIndex=0),this.currentLineHeightIndex=(this.currentLineHeightIndex+1)%n.length;const o=n[this.currentLineHeightIndex];e.forEach((t=>{t.style.lineHeight=o})),"normal"===o?this.setActiveButton(null):this.setActiveButton(t),console.log(`Line height set to: ${o}`)},t.prototype.initCursorSizeAdjustment=function(){const t=document.getElementById("cursor-size-btn");t&&t.addEventListener("click",(()=>{this.toggleCursorSize("cursor-size-btn")}))},t.prototype.toggleCursorSize=function(t){const e=[{size:"normal",cursor:"auto",label:"Normal",icon:'<i class="fas fa-mouse-pointer"></i>'},{size:"medium",cursor:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="40" width="27.5" viewBox="0 0 320 512"><path fill="%23e0e0e0" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>\') 40 40, auto',label:"Medium",icon:'<i class="fas fa-expand-alt"></i>'},{size:"large",cursor:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="60" width="37.5" viewBox="0 0 320 512"><path fill="%23e0e0e0" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>\') 70 70, auto',label:"Large",icon:'<i class="fas fa-expand"></i>'},{size:"medium",cursor:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="40" width="27.5" viewBox="0 0 320 512"><path fill="%23000000" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>\') 20 20, auto',label:"Medium Black",icon:'<i class="fas fa-circle"></i>'},{size:"large",cursor:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="60" width="37.5" viewBox="0 0 320 512"><path fill="%23000000" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>\') 30 30, auto',label:"Large Black",icon:'<i class="fas fa-circle-notch"></i>'}];this.currentCursorSizeIndex||(this.currentCursorSizeIndex=0),this.currentCursorSizeIndex=(this.currentCursorSizeIndex+1)%e.length;const n=e[this.currentCursorSizeIndex];document.documentElement.style.cursor=n.cursor;const o=document.getElementById(t);o&&(o.innerHTML=`${n.icon} Cursor Size: ${n.label}`),"normal"===n.size?this.setActiveButton(null):this.setActiveButton(t),console.log(`Cursor size set to: ${n.size}`)},t.prototype.initKeyboardNavigation=function(){const t=document.getElementById("keyboard-navigation-btn");t&&t.addEventListener("click",(()=>{this.keyboardNavigationActive=!this.keyboardNavigationActive,this.setActiveButton("keyboard-navigation-btn"),this.keyboardNavigationActive?(this.enableKeyboardNavigation(),this.showKeyboardNavigationPopup()):(this.disableKeyboardNavigation(),this.hideKeyboardNavigationPopup())}))},t.prototype.enableKeyboardNavigation=function(){console.log("Keyboard Navigation Enabled"),document.addEventListener("keydown",this.handleKeyboardNavigation.bind(this))},t.prototype.disableKeyboardNavigation=function(){console.log("Keyboard Navigation Disabled"),document.removeEventListener("keydown",this.handleKeyboardNavigation.bind(this))},t.prototype.handleKeyboardNavigation=function(t){const e=Array.from(document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')).filter((t=>!t.disabled&&null!==t.offsetParent));let n=e.indexOf(document.activeElement);const o={ArrowDown:()=>{t.preventDefault(),n=(n+1)%e.length,e[n].focus()},ArrowUp:()=>{t.preventDefault(),n=(n-1+e.length)%e.length,e[n].focus()},Enter:()=>{document.activeElement&&document.activeElement.click()},Escape:()=>{this.disableKeyboardNavigation(),this.hideKeyboardNavigationPopup(),this.setActiveButton(null)},KeyB:()=>document.getElementById("blue-filter-btn").click(),KeyI:()=>document.getElementById("remove-images-btn").click(),KeyA:()=>document.getElementById("remove-audio-btn").click(),KeyR:()=>document.getElementById("read-aloud-btn").click(),KeyP:()=>document.getElementById("increase-text-btn").click(),KeyM:()=>document.getElementById("decrease-text-btn").click(),KeyH:()=>document.getElementById("highlight-links-btn").click(),KeyS:()=>document.getElementById("stop-animations-btn").click(),KeyZ:()=>document.getElementById("zoom-toggle-btn").click(),KeyN:()=>document.getElementById("night-mode-btn").click(),KeyT:()=>document.getElementById("text-spacing-btn").click(),KeyL:()=>document.getElementById("line-height-btn").click(),KeyC:()=>document.getElementById("cursor-size-btn").click()};o[t.code]&&o[t.code]()},t.prototype.showKeyboardNavigationPopup=function(){if(document.getElementById("keyboard-navigation-popup"))return;const t=o("keyboard-popup","keyboard-navigation-popup"),n=o("popup-header"),i=s(3,"Keyboard Shortcuts","popup-title"),a=e("button",{class:"close-popup-btn"},"✖");a.addEventListener("click",this.hideKeyboardNavigationPopup.bind(this)),n.appendChild(i),n.appendChild(a);const l=o("popup-body"),c=e("ul",{class:"shortcut-list"});[{key:"ArrowDown",text:"Navigate to next element"},{key:"ArrowUp",text:"Navigate to previous element"},{key:"Enter",text:"Activate selected element"},{key:"B",text:"Blue Filter"},{key:"I",text:"Remove Images"},{key:"A",text:"Remove Audio"},{key:"R",text:"Read Aloud"},{key:"P",text:"Increase Text Size"},{key:"M",text:"Decrease Text Size"},{key:"H",text:"Highlight Links"},{key:"S",text:"Stop Animations"},{key:"Z",text:"Zoom"},{key:"N",text:"Night Mode"},{key:"T",text:"Adjust Text Spacing"},{key:"L",text:"Adjust Line Height"},{key:"C",text:"Change Cursor Size"}].forEach((({key:t,text:n})=>{const o=e("li",{class:"shortcut-item"});o.innerHTML=`<strong>${t}</strong>: ${n}`,c.appendChild(o)})),l.appendChild(c),t.appendChild(n),t.appendChild(l),document.body.appendChild(t)},t.prototype.hideKeyboardNavigationPopup=function(){const t=document.getElementById("keyboard-navigation-popup");t&&t.remove()},t.prototype.setActiveButton=function(t){const e=document.getElementById(t);e&&("true"===e.dataset.active?(e.style.backgroundColor="rgba(255, 255, 255, 0.3)",e.dataset.active="false"):(e.style.backgroundColor="rgba(52, 88, 185, 1)",e.dataset.active="true"))},t.prototype.resetButtonStates=function(){document.querySelectorAll(".toolbox-button").forEach((t=>{t.style.backgroundColor="rgba(255, 255, 255, 0.3)",t.dataset.active="false"}))},t.prototype.initAccessibleFontToggle=function(){const t=document.getElementById("accessible-font-btn");t&&t.addEventListener("click",(()=>{this.toggleAccessibleFont(),this.setActiveButton("accessible-font-btn")}))},t.prototype.toggleAccessibleFont=function(){const t=document.body.classList.toggle("accessible-font");console.log("Accessible font "+(t?"enabled":"disabled"))},document.addEventListener("DOMContentLoaded",(()=>{new t,function(){const t=document.createElement("link");t.rel="stylesheet",t.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",t.type="text/css",document.head.appendChild(t)}()})),{}})()));