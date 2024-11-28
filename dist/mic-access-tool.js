!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MicAccessTool=e():t.MicAccessTool=e()}(self,(()=>(()=>{"use strict";function t(t){this.init=t||{},this.removedImages=[],this.imagesHidden=!1,this.isMuted=!1,this.initializeAccessibilityToolbox(),this.initBlueFilter(),this.initRemoveImages(),this.initAudioRemoval(),this.initFontSizeAdjustment(),this.initHighlightButtons(),this.initStopAnimationsButton(),this.initZoomToggleFeature(),this.initNightModeFeature(),this.initTextSpacingFeature(),this.initLineHeightFeature(),this.initCursorSizeAdjustment(),this.initKeyboardNavigation(),this.initAccessibleFontToggle(),this.initResetFeature(),this.initContrastFeature()}function e(t,e={},o=""){const n=document.createElement(t);for(const[t,o]of Object.entries(e))n.setAttribute(t,o);return o&&(n.innerText=o),n}function o(t,o,n=""){const i=e("button",{class:"toolbox-button",id:t});if(n){const t=document.createElement("span");t.innerHTML=n,i.appendChild(t)}const s=document.createTextNode(o);return i.appendChild(s),i}function n(t,o=""){const n={class:t};return o&&(n.id=o),e("div",n)}function i(t,o,n){return e("img",{src:t,alt:o,class:n})}function s(t,o,n=""){return e(`h${t}`,{class:n},o)}return t.prototype.createToolbox=function(){const t=n("toolbox hidden","toolbox"),e=n("toolbox-image-container"),a=i("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Accessibility Logo","toolbox-image");e.appendChild(a),t.appendChild(e);const l=n("toolbox-header"),c=s(2,"Accessibility Toolbox","toolbox-title");l.appendChild(c);const r=n("toolbox-body");[{id:"blue-filter-btn",text:"Blue Filter",iconClass:'<i class="fas fa-adjust"></i>'},{id:"read-aloud-btn",text:"Read Aloud",iconClass:'<i class="fas fa-volume-up"></i>'},{id:"remove-images-btn",text:"Remove Images",iconClass:'<i class="fa-regular fa-image"></i>'},{id:"remove-audio-btn",text:"Remove Audio",iconClass:'<i class="fas fa-microphone-slash"></i>'},{id:"increase-text-btn",text:"Increase Text",iconClass:'<i class="fas fa-text-height"></i>'},{id:"decrease-text-btn",text:"Decrease Text",iconClass:'<i class="fas fa-text-width"></i>'},{id:"highlight-links-btn",text:"Highlight Links",iconClass:'<i class="fas fa-link"></i>'},{id:"highlight-headers-btn",text:"Highlight Headers",iconClass:'<i class="fas fa-heading"></i>'},{id:"stop-animations-btn",text:"Stop Animations",iconClass:'<i class="fas fa-ban"></i>'},{id:"zoom-toggle-btn",text:"Zoom",iconClass:'<i class="fas fa-search"></i>'},{id:"night-mode-btn",text:"Night Mode",iconClass:'<i class="fas fa-moon"></i>'},{id:"cursor-size-btn",text:"Change Cursor Size",iconClass:'<i class="fas fa-mouse-pointer"></i>'},{id:"text-spacing-btn",text:"Text Spacing",iconClass:'<i class="fas fa-text-width"></i>'},{id:"line-height-btn",text:"Line Height",iconClass:'<i class="fas fa-text-height"></i>'},{id:"accessible-font-btn",text:"Accessible Font",iconClass:'<i class="fas fa-font"></i>'},{id:"contrast-btn",text:"Contrast Modes",iconClass:'<i class="fas fa-adjust"></i>'},{id:"reset-btn",text:"Reset",iconClass:'<i class="fas fa-undo"></i>'}].forEach((({id:t,text:e,iconClass:n})=>{const i=o(t,e,n);r.appendChild(i)})),t.appendChild(l),t.appendChild(r),document.body.appendChild(t),this.resetButtonStates()},t.prototype.createSideButton=function(){const t=n("side-button","openToolboxButton"),e=i("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s","Open Toolbox","side-button-image");t.appendChild(e),document.body.appendChild(t)},t.prototype.initializeAccessibilityToolbox=function(){this.createToolbox(),this.createSideButton();const t=document.getElementById("toolbox"),e=document.getElementById("openToolboxButton");e.addEventListener("click",(e=>{e.stopPropagation(),t.classList.toggle("visible")})),document.addEventListener("click",(o=>{t.contains(o.target)||e.contains(o.target)||t.classList.remove("visible")}))},t.prototype.initBlueFilter=function(){const t=n("blue-overlay");document.body.appendChild(t);const e=document.getElementById("blue-filter-btn");e&&e.addEventListener("click",(()=>{t.classList.toggle("active"),this.setActiveButton("blue-filter-btn")}))},t.prototype.initRemoveImages=function(){const t=document.getElementById("remove-images-btn");t&&t.addEventListener("click",(()=>{this.toggleImages(),this.setActiveButton("remove-images-btn")}))},t.prototype.toggleImages=function(){this.imagesHidden?(this.removedImages.forEach((({img:t,parent:e,nextSibling:o})=>{o?e.insertBefore(t,o):e.appendChild(t)})),this.removedImages=[]):document.querySelectorAll("img:not(.toolbox-image):not(.side-button-image)").forEach((t=>{this.removedImages.push({img:t,parent:t.parentNode,nextSibling:t.nextSibling}),t.parentNode.removeChild(t)})),this.imagesHidden=!this.imagesHidden},t.prototype.initAudioRemoval=function(){const t=document.getElementById("remove-audio-btn");t&&t.addEventListener("click",(()=>{this.audioRemoval(),this.setActiveButton("remove-audio-btn")}))},t.prototype.audioRemoval=function(){const t=document.querySelectorAll("audio, video");this.isMuted=!this.isMuted,t.forEach((t=>{t.muted=this.isMuted}))},t.prototype.initReadAloud=function(){const t=document.getElementById("read-aloud-btn");t&&t.addEventListener("click",(()=>{this.toggleReadAloud("read-aloud-btn")})),"true"===localStorage.getItem("readAloudActive")&&(this.enableDefaultClickToRead(),this.createReadAloudToolbar(),this.setActiveButton("read-aloud-btn",!0))},t.prototype.toggleReadAloud=function(t){const e=document.getElementById("read-aloud-toolbar");this.isReadAloudActive?(this.disableDefaultClickToRead(),this.stopReadAloud(),e&&e.classList.add("hidden"),this.setActiveButton(t,!1),this.isReadAloudActive=!1,localStorage.setItem("readAloudActive",!1),console.log("Read Aloud deactivated.")):(e?e.classList.remove("hidden"):this.createReadAloudToolbar(),this.enableDefaultClickToRead(),this.setActiveButton(t,!0),this.isReadAloudActive=!0,localStorage.setItem("readAloudActive",!0),console.log("Read Aloud activated."))},t.prototype.createReadAloudToolbar=function(){const t=n("read-aloud-toolbar","read-aloud-toolbar"),e=n("toolbar-header"),i=s(2,"Read Aloud Settings","toolbar-title"),a=o("close-toolbar","✖");a.addEventListener("click",(()=>{t.remove(),this.disableDefaultClickToRead()})),e.appendChild(i),e.appendChild(a),t.appendChild(e);const l=n("toolbar-controls"),c=o("cursor-read-btn","Cursor Read Aloud");c.innerHTML='<i class="fas fa-mouse-pointer"></i> Cursor Read Aloud',c.addEventListener("click",this.enableCursorReadAloud.bind(this));const r=o("previous-line-btn","Previous Line");r.innerHTML='<i class="fas fa-arrow-left"></i> ',r.addEventListener("click",this.readPreviousLine.bind(this));const d=o("play-read-btn","▶");d.innerHTML='<i class="fas fa-play"></i>',d.addEventListener("click",this.playReadAloud.bind(this));const u=o("stop-read-btn","⏹");u.innerHTML='<i class="fas fa-stop"></i>',u.addEventListener("click",this.stopReadAloud.bind(this));const h=o("next-line-btn","Next Line");h.innerHTML='<i class="fas fa-arrow-right"></i> ',h.addEventListener("click",this.readNextLine.bind(this));const p=document.createElement("div");p.className="sliders-container";const g=document.createElement("div");g.className="slider-wrapper";const m=document.createElement("label");m.setAttribute("for","volume-slider"),m.textContent="Volume:",g.appendChild(m);const b=document.createElement("input");b.type="range",b.id="volume-slider",b.min="0",b.max="1",b.step="0.1",b.value=this.currentVolume||1,b.addEventListener("input",(t=>{this.currentVolume=parseFloat(t.target.value),console.log(`Volume updated to: ${this.currentVolume}`)})),g.appendChild(b);const y=document.createElement("div");y.className="slider-wrapper";const v=document.createElement("label");v.setAttribute("for","speed-slider"),v.textContent="Speed:",y.appendChild(v);const f=document.createElement("input");f.type="range",f.id="speed-slider",f.min="0.5",f.max="2",f.step="0.1",f.value=this.currentSpeed||1,f.addEventListener("input",(t=>{this.currentSpeed=parseFloat(t.target.value),console.log(`Speed updated to: ${this.currentSpeed}`)})),y.appendChild(f),p.appendChild(g),p.appendChild(y),y.appendChild(f),l.appendChild(c),l.appendChild(r),l.appendChild(d),l.appendChild(u),l.appendChild(h),l.appendChild(p),t.appendChild(l),document.body.appendChild(t)},t.prototype.highlightText=function(t,e,o){const n=t.dataset.originalText||t.innerText||"",i=n.slice(0,e),s=n.slice(e,e+o),a=n.slice(e+o);t.innerHTML=`${i}<span style="background-color: yellow;">${s}</span>${a}`},t.prototype.enableDefaultClickToRead=function(){document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, button").forEach((t=>{t.addEventListener("click",this.readElementContent.bind(this))}))},t.prototype.disableDefaultClickToRead=function(){document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, button").forEach((t=>{t.removeEventListener("click",this.readElementContent.bind(this))}))},t.prototype.readElementContent=function(t){const e=t.target,o=e.innerText||e.value||"",n=new SpeechSynthesisUtterance(o);n.volume=this.currentVolume||1,n.rate=this.currentSpeed||1;const i=o.split(" ");let s=0;n.onboundary=t=>{if("word"===t.name){const o=t.charIndex,n=i[s]?.length||0;this.highlightText(e,o,n),s++}},n.onend=()=>{this.clearHighlight(e)},speechSynthesis.speak(n)},t.prototype.clearHighlight=function(t){t.dataset.originalText&&(t.innerHTML=t.dataset.originalText)},t.prototype.playReadAloud=function(){this.isReadAloudActive?document.querySelectorAll("p").length?(this.currentParagraphIndex=0,this.readCurrentLine()):console.log("No paragraphs found to read."):console.log("Read Aloud is not active. Please enable it first.")},t.prototype.enableCursorReadAloud=function(){document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, button").forEach((t=>{let e;t.addEventListener("mouseenter",(()=>{e=setTimeout((()=>{const e=new SpeechSynthesisUtterance(t.innerText||t.value||"");e.volume=this.currentVolume||1,e.rate=this.currentSpeed||1,this.highlightText(t,0,t.innerText.length),speechSynthesis.speak(e)}),1e3)})),t.addEventListener("mouseleave",(()=>{clearTimeout(e),speechSynthesis.cancel()}))}))},t.prototype.readPreviousLine=function(){this.currentParagraphIndex>0?(this.currentParagraphIndex--,this.readCurrentLine()):console.log("Already at the first paragraph.")},t.prototype.readNextLine=function(){const t=document.querySelectorAll("p");void 0===this.currentParagraphIndex&&(this.currentParagraphIndex=0),this.currentParagraphIndex<t.length-1?(this.currentParagraphIndex++,this.readCurrentLine()):console.log("No more paragraphs to read.")},t.prototype.speakText=function(t){const e=t.innerText||"",o=new SpeechSynthesisUtterance(e);o.volume=this.currentVolume||1,o.rate=this.currentSpeed||1,t.dataset.originalText||(t.dataset.originalText=e);const n=e.split(" ");let i=0;o.onboundary=e=>{if("word"===e.name){const o=e.charIndex,s=n[i]?.length||0;this.highlightText(t,o,s),i++}},o.onend=()=>{this.clearHighlight(t)},speechSynthesis.cancel(),speechSynthesis.speak(o)},t.prototype.readCurrentLine=function(){const t=document.querySelectorAll("p");if(void 0===this.currentParagraphIndex||this.currentParagraphIndex>=t.length)return void console.log("No more paragraphs to read.");const e=t[this.currentParagraphIndex];this.speakText(e)},t.prototype.stopReadAloud=function(){speechSynthesis.cancel(),this.currentParagraphIndex=void 0,document.querySelectorAll("[data-original-text]").forEach((t=>{this.clearHighlight(t)})),console.log("Read Aloud stopped, and all highlights cleared.")},document.addEventListener("DOMContentLoaded",(()=>{const t=document.querySelectorAll(".toolbox-button");t.forEach((e=>{e.addEventListener("click",(()=>{t.forEach((t=>t.style.backgroundColor="rgba(255, 255, 255, 0.3)")),e.style.backgroundColor="rgba(52, 88, 185, 1)"}))}))})),t.prototype.initFontSizeAdjustment=function(){const t=document.getElementById("increase-text-btn"),e=document.getElementById("decrease-text-btn");t&&t.addEventListener("click",(()=>{this.adjustFontSize("increase")})),e&&e.addEventListener("click",(()=>{this.adjustFontSize("decrease")}))},t.prototype.adjustFontSize=function(t){const e=document.querySelectorAll("body *:not(.toolbox):not(.toolbox *)");let o=!1,n=!1;e.forEach((e=>{const i=window.getComputedStyle(e),s=parseFloat(i.fontSize);let a=s;"increase"===t&&s<36?(a=Math.min(s+2,36),o=a<36):"decrease"===t&&s>12&&(a=Math.max(s-2,12),n=a>12),e.style.fontSize=`${a}px`})),this.setActiveButton("increase-text-btn",o),this.setActiveButton("decrease-text-btn",n),console.log(`Font size ${t}d. Active buttons: Increase (${o}), Decrease (${n}).`)},t.prototype.initHighlightButtons=function(){const t=document.getElementById("highlight-links-btn");t&&t.addEventListener("click",(()=>{this.highlightContent("links"),this.setActiveButton("highlight-links-btn")}));const e=document.getElementById("highlight-headers-btn");e&&e.addEventListener("click",(()=>{this.highlightContent("headers"),this.setActiveButton("highlight-headers-btn")}));const o=document.getElementById("highlight-images-btn");o&&o.addEventListener("click",(()=>{this.highlightContent("images"),this.setActiveButton("highlight-images-btn")}))},t.prototype.highlightContent=function(t){const e=`highlight-${t}`;let o;if("links"===t)o="a";else if("headers"===t)o="h1, h2, h3, h4, h5, h6";else{if("images"!==t)return void console.warn("Invalid type for highlightContent");o="img"}const n=document.querySelectorAll(o);0!==n.length?(n.forEach((o=>{if("images"===t)if(o.parentNode.classList.contains(e)){const t=o.parentNode;t.replaceWith(...t.childNodes)}else{const t=document.createElement("div");t.className=e,o.parentNode.insertBefore(t,o),t.appendChild(o);const n=o.alt||"No title available",i=document.createElement("span");i.textContent=n,t.appendChild(i)}else o.classList.toggle(e)})),console.log(`${n.length} ${t} elements toggled for highlighting.`)):console.warn(`No ${t} found to highlight.`)},t.prototype.stopAnimations=function(){const t=document.body.classList.toggle("disable-animations");localStorage.setItem("animationsDisabled",t),t?(console.log("Animations and transitions disabled."),this.setActiveButton("stop-animations-btn")):(console.log("Animations and transitions re-enabled."),this.setActiveButton(null))},t.prototype.restoreAnimationState=function(){"true"===localStorage.getItem("animationsDisabled")?(document.body.classList.add("disable-animations"),console.log("Restored: Animations are disabled."),this.setActiveButton("stop-animations-btn")):this.setActiveButton(null)},t.prototype.initStopAnimationsButton=function(){const t=document.getElementById("stop-animations-btn");t&&t.addEventListener("click",this.stopAnimations.bind(this))},t.prototype.initialApp=function(){this.restoreAnimationState(),console.log("Accessibility toolbox initialized.")},t.prototype.initZoomToggleFeature=function(){this.zoomStates=[1,1.25,1.5,1.75],this.zoomIndex=0;const t=document.getElementById("zoom-toggle-btn");t&&t.addEventListener("click",this.toggleZoom.bind(this)),this.restoreZoomState()},t.prototype.toggleZoom=function(){this.zoomIndex=(this.zoomIndex+1)%this.zoomStates.length;const t=this.zoomStates[this.zoomIndex];this.applyZoom(t);const e=1!==t;this.setActiveButton("zoom-toggle-btn",e),console.log(`Zoom level toggled to: ${t}`)},t.prototype.applyZoom=function(t){document.querySelectorAll("body > *:not(#toolbox):not(#openToolboxButton):not(img)").forEach((e=>{e.style.transform=`scale(${t})`,e.style.transformOrigin="0 0",e.style.width=100/t+"%"})),this.saveZoomState(t),console.log(`Zoom level applied: ${t}`)},t.prototype.restoreZoomState=function(){const t=parseFloat(localStorage.getItem("zoomLevel"))||1;this.applyZoom(t),this.zoomIndex=this.zoomStates.indexOf(t),-1===this.zoomIndex&&(this.zoomIndex=0);const e=1!==t;this.setActiveButton("zoom-toggle-btn",e)},t.prototype.saveZoomState=function(t){localStorage.setItem("zoomLevel",t),console.log(`Zoom level saved: ${t}`)},t.prototype.initNightModeFeature=function(){const t=document.getElementById("night-mode-btn");t&&t.addEventListener("click",(()=>{this.toggleNightMode()}));const e="true"===localStorage.getItem("nightMode");document.body.classList.toggle("night-mode",e),this.setActiveButton("night-mode-btn",e)},t.prototype.toggleNightMode=function(){const t=document.body.classList.toggle("night-mode");localStorage.setItem("nightMode",t),this.setActiveButton("night-mode-btn",t),console.log(`Night Mode ${t?"enabled":"disabled"}.`)},t.prototype.initTextSpacingFeature=function(){const t=document.getElementById("text-spacing-btn");t&&t.addEventListener("click",(()=>{this.toggleTextSpacing("text-spacing-btn")}))},t.prototype.toggleTextSpacing=function(t){const e=document.querySelectorAll("body *:not(.toolbox):not(.toolbox *)"),o=["normal","0.1em","0.2em","0.3em"];void 0===this.currentTextSpacingIndex&&(this.currentTextSpacingIndex=0),this.currentTextSpacingIndex=(this.currentTextSpacingIndex+1)%o.length;const n=o[this.currentTextSpacingIndex];e.forEach((t=>{t.style.letterSpacing=n}));const i="normal"!==n;this.setActiveButton(t,i),console.log(`Text spacing set to: ${n}`)},t.prototype.initLineHeightFeature=function(){const t=document.getElementById("line-height-btn");t&&t.addEventListener("click",(()=>{this.toggleLineHeight("line-height-btn")}))},t.prototype.toggleLineHeight=function(t){const e=document.querySelectorAll("body *:not(.toolbox):not(.toolbox *)"),o=["normal","1.5","2","2.5"];void 0===this.currentLineHeightIndex&&(this.currentLineHeightIndex=0),this.currentLineHeightIndex=(this.currentLineHeightIndex+1)%o.length;const n=o[this.currentLineHeightIndex];e.forEach((t=>{t.style.lineHeight=n})),"normal"===n?this.setActiveButton(t,!1):this.setActiveButton(t,!0),console.log(`Line height set to: ${n}`)},t.prototype.initCursorSizeAdjustment=function(){const t=document.getElementById("cursor-size-btn");t&&t.addEventListener("click",(()=>{this.toggleCursorSize("cursor-size-btn")}))},t.prototype.toggleCursorSize=function(t){const e=[{size:"normal",cursor:"auto",label:"Normal",icon:'<i class="fas fa-mouse-pointer"></i>'},{size:"medium",cursor:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="40" width="27.5" viewBox="0 0 320 512"><path fill="%23e0e0e0" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>\') 40 40, auto',label:"Medium",icon:'<i class="fas fa-expand-alt"></i>'},{size:"large",cursor:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="60" width="37.5" viewBox="0 0 320 512"><path fill="%23e0e0e0" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>\') 70 70, auto',label:"Large",icon:'<i class="fas fa-expand"></i>'},{size:"medium",cursor:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="40" width="27.5" viewBox="0 0 320 512"><path fill="%23000000" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>\') 20 20, auto',label:"Medium Black",icon:'<i class="fas fa-circle"></i>'},{size:"large",cursor:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="60" width="37.5" viewBox="0 0 320 512"><path fill="%23000000" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>\') 30 30, auto',label:"Large Black",icon:'<i class="fas fa-circle-notch"></i>'}];void 0===this.currentCursorSizeIndex&&(this.currentCursorSizeIndex=0),this.currentCursorSizeIndex=(this.currentCursorSizeIndex+1)%e.length;const o=e[this.currentCursorSizeIndex];document.documentElement.style.cursor=o.cursor;const n=document.getElementById(t);n&&(n.innerHTML=`${o.icon} Cursor Size: ${o.label}`);const i="normal"!==o.size;this.setActiveButton(t,i),console.log(`Cursor size set to: ${o.size}`)},t.prototype.initKeyboardNavigation=function(){const t=document.getElementById("keyboard-navigation-btn");t&&t.addEventListener("click",(()=>{this.keyboardNavigationActive=!this.keyboardNavigationActive,this.setActiveButton("keyboard-navigation-btn",this.keyboardNavigationActive),this.keyboardNavigationActive?(this.enableKeyboardNavigation(),this.showKeyboardNavigationPopup()):(this.disableKeyboardNavigation(),this.hideKeyboardNavigationPopup())}))},t.prototype.enableKeyboardNavigation=function(){console.log("Keyboard Navigation Enabled"),document.addEventListener("keydown",this.handleKeyboardNavigation.bind(this)),document.body.classList.add("keyboard-navigation-active")},t.prototype.disableKeyboardNavigation=function(){console.log("Keyboard Navigation Disabled"),document.removeEventListener("keydown",this.handleKeyboardNavigation.bind(this)),document.body.classList.remove("keyboard-navigation-active"),this.clearSelectionHighlight()},t.prototype.handleKeyboardNavigation=function(t){const e=Array.from(document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')).filter((t=>!t.disabled&&null!==t.offsetParent));let o=e.indexOf(document.activeElement);const n={ArrowDown:()=>{t.preventDefault(),o=(o+1)%e.length,e[o].focus(),this.highlightSelection(e[o])},ArrowUp:()=>{t.preventDefault(),o=(o-1+e.length)%e.length,e[o].focus(),this.highlightSelection(e[o])},Enter:()=>{document.activeElement&&document.activeElement.click()},Escape:()=>{this.disableKeyboardNavigation(),this.hideKeyboardNavigationPopup(),this.setActiveButton("keyboard-navigation-btn",!1)},F2:()=>this.showKeyboardNavigationPopup(),F3:()=>this.toggleSpeechOutput(),KeyW:()=>document.getElementById("blue-filter-btn")?.click(),KeyI:()=>document.getElementById("remove-images-btn")?.click(),KeyA:()=>document.getElementById("remove-audio-btn")?.click(),KeyR:()=>document.getElementById("read-aloud-btn")?.click(),KeyP:()=>document.getElementById("increase-text-btn")?.click(),KeyM:()=>document.getElementById("decrease-text-btn")?.click(),KeyH:()=>this.navigateToNext("heading"),KeyS:()=>this.navigateToStart(),KeyZ:()=>document.getElementById("zoom-toggle-btn")?.click(),KeyN:()=>document.getElementById("night-mode-btn")?.click(),KeyT:()=>document.getElementById("text-spacing-btn")?.click(),KeyL:()=>this.navigateToNext("list"),KeyC:()=>document.getElementById("cursor-size-btn")?.click(),KeyG:()=>this.navigateToNext("image"),KeyK:()=>this.navigateToNext("link"),KeyD:()=>this.navigateToNext("jump-tag"),KeyF:()=>this.navigateToNext("form-field"),KeyE:()=>this.navigateToNext("input-field"),KeyB:()=>this.navigateToNext("button")};n[t.code]&&n[t.code]()},t.prototype.focusElement=function(t){t&&(t.focus(),t.scrollIntoView({behavior:"smooth",block:"center"}))},t.prototype.scrollPage=function(t){const e={up:()=>window.scrollBy({top:-100,behavior:"smooth"}),down:()=>window.scrollBy({top:100,behavior:"smooth"}),left:()=>window.scrollBy({left:-100,behavior:"smooth"}),right:()=>window.scrollBy({left:100,behavior:"smooth"})};e[t]&&e[t]()},t.prototype.showKeyboardNavigationPopup=function(){if(document.getElementById("keyboard-navigation-popup"))return;const t=document.createElement("div");t.id="keyboard-navigation-popup",t.className="keyboard-popup";const e=document.createElement("div");e.className="popup-header",e.innerHTML='<h3>Instructions for the use of keyboard shortcuts</h3><button class="close-popup-btn">✖</button>',e.querySelector(".close-popup-btn").addEventListener("click",(()=>t.remove())),t.appendChild(e);const o=document.createElement("div");o.className="popup-body",[{key:"Esc",action:"Exit web page navigation"},{key:"F2",action:"Show this guide"},{key:"F3",action:"Toggle speech output"},{key:"Tab",action:"Select next item"},{key:"Shift + Tab",action:"Select previous item"},{key:"S",action:"Reset focus to start"},{key:"H",action:"Next heading"},{key:"G",action:"Next image/graphic"},{key:"K",action:"Next link"},{key:"D",action:"Next jump tag"},{key:"L",action:"Next list"},{key:"F",action:"Next form field"},{key:"E",action:"Next input field"},{key:"W",action:"Blue Filter"},{key:"I",action:"Remove Images"},{key:"A",action:"Remove Audio"},{key:"R",action:"Read Aloud"},{key:"P",action:"Increase Text Font Size"},{key:"M",action:"Decrease Text Font Size"},{key:"Z",action:"Zoom Toggle"},{key:"N",action:"Night Mode"},{key:"T",action:"Text Spacing"},{key:"C",action:"Cursor Size "}].forEach((({key:t,action:e})=>{const n=document.createElement("div");n.className="shortcut-item",n.innerHTML=`<span class="shortcut-key">${t}</span>: ${e}`,o.appendChild(n)})),t.appendChild(o),document.body.appendChild(t)},t.prototype.hideKeyboardNavigationPopup=function(){const t=document.getElementById("keyboard-navigation-popup");t&&t.remove()},t.prototype.highlightSelection=function(t){this.clearSelectionHighlight(),t&&t.classList.add("keyboard-focus")},t.prototype.clearSelectionHighlight=function(){document.querySelectorAll(".keyboard-focus").forEach((t=>t.classList.remove("keyboard-focus")))},t.prototype.navigateToNext=function(t){const e=document.querySelectorAll({heading:"h1, h2, h3, h4, h5, h6",list:"ul, ol","list-entry":"li","form-field":"form","input-field":"input, textarea, select",button:"button",link:"a",image:"img","jump-tag":"[id]"}[t]),o=document.activeElement,n=(Array.from(e).indexOf(o)+1)%e.length;e[n]&&(e[n].focus(),this.highlightSelection(e[n]))},t.prototype.navigateToStart=function(){const t=document.querySelector('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');t&&(t.focus(),this.highlightSelection(t))},t.prototype.setActiveButton=function(t,e=null){const o=document.getElementById(t);o&&((null!==e?e:"true"!==o.dataset.active)?(o.style.backgroundColor="rgba(52, 88, 185, 1)",o.dataset.active="true"):(o.style.backgroundColor="rgba(255, 255, 255, 0.3)",o.dataset.active="false"))},t.prototype.resetButtonStates=function(){document.querySelectorAll(".toolbox-button").forEach((t=>{t.style.backgroundColor="rgba(255, 255, 255, 0.3)",t.dataset.active="false"}))},t.prototype.initAccessibleFontToggle=function(){const t=document.getElementById("accessible-font-btn");t&&t.addEventListener("click",(()=>{this.toggleAccessibleFont("accessible-font-btn")}))},t.prototype.toggleAccessibleFont=function(t){const e=document.body.classList.toggle("accessible-font");this.setActiveButton(t,e),console.log("Accessible font "+(e?"enabled":"disabled"))},t.prototype.initResetFeature=function(){const t=document.getElementById("reset-btn");t&&t.addEventListener("click",(()=>{this.resetToolbox()}))},t.prototype.resetToolbox=function(){document.querySelectorAll(".highlight-links, .highlight-headers, .highlight-images").forEach((t=>{t.classList.remove("highlight-links","highlight-headers","highlight-images")})),document.querySelectorAll("[data-toolbox-modified]").forEach((t=>{t.style.fontSize="",t.style.letterSpacing="",t.style.lineHeight="",t.style.transform="",t.style.transformOrigin="",t.style.width="",t.removeAttribute("data-toolbox-modified")}));const t=document.querySelector(".blue-overlay");t&&t.classList.remove("active"),this.imagesHidden&&(this.removedImages.forEach((({img:t,parent:e,nextSibling:o})=>{o?e.insertBefore(t,o):e.appendChild(t)})),this.removedImages=[],this.imagesHidden=!1),document.querySelectorAll("[data-toolbox-muted]").forEach((t=>{t.muted=!1,t.removeAttribute("data-toolbox-muted")})),document.body.classList.remove("night-mode"),document.documentElement.style.cursor="auto",document.body.classList.remove("accessible-font"),document.body.classList.remove("disable-animations"),this.resetContrast(),localStorage.removeItem("animationsDisabled"),localStorage.removeItem("nightMode"),localStorage.removeItem("zoomLevel"),this.resetButtonStates(),console.log("Toolbox reset to the original state.")},t.prototype.initContrastFeature=function(){const t=document.getElementById("contrast-btn");t&&t.addEventListener("click",(()=>{this.toggleContrastPopup(),this.setActiveButton("contrast-btn")}))},t.prototype.toggleContrastPopup=function(){const t=document.getElementById("contrast-popup");if(t)return void t.remove();const e=document.createElement("div");e.id="contrast-popup",e.className="contrast-popup";const o=document.createElement("div");o.className="contrast-popup-header";const n=document.createElement("h3");n.className="contrast-popup-title",n.textContent="Contrast Settings",o.appendChild(n);const i=document.createElement("button");i.className="contrast-popup-close",i.textContent="✖",i.addEventListener("click",(()=>e.remove())),o.appendChild(i),e.appendChild(o);const s=document.createElement("div");s.className="contrast-popup-body",[{id:"grayscale",text:"Uncolored Display"}].forEach((({id:t,text:e})=>{const o=document.createElement("button");o.id=t,o.className="contrast-mode-button",o.textContent=e,o.addEventListener("click",(e=>this.toggleContrastMode(t,e.target))),s.appendChild(o)}));const a=document.createElement("div");a.className="contrast-custom-colors";const l=["#FFFFFF","#000000","#F0E68C","#ADD8E6","#FFB6C1"],c=document.createElement("label");c.textContent="Background Color:";const r=document.createElement("div");r.className="color-picker-container",l.forEach((t=>{const e=document.createElement("button");e.className="color-button",e.style.backgroundColor=t,e.addEventListener("click",(()=>this.applyCustomColors(t,null))),r.appendChild(e)}));const d=document.createElement("input");d.type="color",d.id="bg-color-picker",d.addEventListener("input",(()=>this.applyCustomColors(d.value,null))),r.appendChild(d),a.appendChild(c),a.appendChild(r);const u=document.createElement("label");u.textContent="Text Color:";const h=document.createElement("div");h.className="color-picker-container",l.forEach((t=>{const e=document.createElement("button");e.className="color-button",e.style.backgroundColor=t,e.addEventListener("click",(()=>this.applyCustomTextColor(t))),h.appendChild(e)}));const p=document.createElement("input");p.type="color",p.id="text-color-picker",p.addEventListener("input",(()=>this.applyCustomTextColor(p.value))),h.appendChild(p),a.appendChild(u),a.appendChild(h),s.appendChild(a);const g=document.createElement("button");g.id="reset-contrast-btn",g.className="contrast-reset-button",g.textContent="Reset Contrast",g.addEventListener("click",(()=>this.resetContrast())),s.appendChild(g),e.appendChild(s),document.body.appendChild(e)},t.prototype.resetContrast=function(){document.body.classList.remove("bright-contrast","reverse-contrast","grayscale"),document.body.style.backgroundColor="",document.body.style.color="",document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, li, a, div, label, button, input, textarea").forEach((t=>{t.style.color=""})),console.log("Contrast settings reset to original.")},t.prototype.applyCustomTextColor=function(t){document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, li, a, div, label, button, input, textarea").forEach((e=>{e.style.color=t})),console.log(`Text color updated to: ${t}`)},t.prototype.applyCustomColors=function(t,e){t&&(document.body.style.backgroundColor=t),e&&(document.body.style.color=e),console.log(`Custom colors applied: Background (${t||"unchanged"}), Text (${e||"unchanged"})`)},t.prototype.toggleContrastMode=function(t,e){const o=document.body.classList,n=o.contains(t);o.remove("bright-contrast","reverse-contrast","grayscale"),n?console.log(`${t} mode deactivated.`):(o.add(t),console.log(`${t} mode activated.`)),this.updateContrastButtonStates(e,n)},t.prototype.updateContrastButtonStates=function(t,e){document.querySelectorAll(".contrast-mode-button").forEach((o=>{o!==t||e?o.classList.remove("active"):o.classList.add("active")}))},document.addEventListener("DOMContentLoaded",(()=>{new t,function(){const t=document.createElement("link");t.rel="stylesheet",t.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",t.type="text/css",document.head.appendChild(t)}()})),{}})()));