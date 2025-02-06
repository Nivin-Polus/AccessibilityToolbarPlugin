// 'use strict';

import CONFIG from "./config";
import language  from './languages.json';


function YourInclusion(init) {
    this.init = init || {};
    this.removedImages = [];
    this.imagesHidden = false;
    this.isMuted = false;
    
    
    this.initRemoveImages();
    this.initNightModeFeature();
    this.initTextSpacingFeature();
    this.initLineHeightFeature();
    this.initResetFeature();
    this.initContrastFeature();
    this.initAudioRemoval();
    this.initHighlightButtons();
    this.initStopAnimationsButton();
    this.initZoomToggleFeature();
    this.initAccessibleFontToggle();
    this.initCursorSizeAdjustment();
    this.initKeyboardNavigation();
    this.initReadAloud();
    this.addStylesForHighlight();
    this.initBlueFilter();
    this.initSaveFeature(); 
    this.addSettingsButtonListener(); 
    this.addFontSizePopup();
   

}

/*** Load Script */
function loadScript() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CONFIG.URLS.ICONS;
    link.type = 'text/css';


    document.head.appendChild(link);
}

/***  Generic Element Creator */

    YourInclusion.prototype.createEle = function (tag, attributes = {}, innerText = '') {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }

    if (innerText) {
        element.innerText = innerText;
    }

    return element;
}

/***  Specific Element Creators */

YourInclusion.prototype.createButton = function (id, text, icon = '') {
    const button = this.createBaseButton(id);
    const iconWrapper = this.createIconWrapper(icon, text || id);

    if (iconWrapper) {
        button.appendChild(iconWrapper); 
    }


    const checkmark = this.createCheckmarkFromLocal(`${CONFIG.URLS.BASE_URL}/assets/check.svg`); 
    button.appendChild(checkmark);

    if (text) {
        const textWrapper = this.createTextWrapper(text);
        button.appendChild(textWrapper); 
    }

    this.addProgressBar(button, id);
    
    return button;
};

YourInclusion.prototype.addProgressBar = function (button, id) {
    const { filledDashes, totalDashes } = this.getDashesForButton(id);

    if (totalDashes > 0) {
        const progressBar = this.createProgressBar(filledDashes, totalDashes);
        button.appendChild(progressBar);
    }
};
YourInclusion.prototype.getDashesForButton = function (id) {
    let filledDashes = 0;
    let totalDashes = 0;

    const stateManager = this.createStateManager('AppState'); 
    const state = stateManager.getState(); 

    switch (id) {
        case 'text-spacing-btn':
            filledDashes = state.textSpacingIncrement || 0;
            totalDashes = 3;
            break;
        case 'line-height-btn':
            filledDashes = state.lineHeightIncrement || 0;
            totalDashes = 3;
            break;
        case 'zoom-toggle-btn':
            filledDashes = state.zoomIncrement || 0;
            totalDashes = 3;
            break;
        case 'cursor-size-btn':
            filledDashes = state.cursorSizeIncrement || 0;
            totalDashes = 4;
            break;
        default:
            filledDashes = 0;
            totalDashes = 0;
            break;
    }

    return { filledDashes, totalDashes };
};
YourInclusion.prototype.createProgressBar = function (filledDashes, totalDashes) {
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('syi-progress-bar-container');
    const progressBar = document.createElement('div');
    progressBar.classList.add('syi-progress-bar', 'dashed');

    for (let i = 0; i < totalDashes; i++) {
        const dash = document.createElement('div');
        dash.classList.add('dash');
        if (i < filledDashes) {
            dash.classList.add('active'); 
        }
        progressBar.appendChild(dash);
    }

    progressBarContainer.appendChild(progressBar);
    return progressBarContainer;
};
YourInclusion.prototype.updateZoomButtonProgressBar = function (id) {
    const zoomButton = document.getElementById(id);
    if (zoomButton) {
        const existingProgressBar = zoomButton.querySelector('.syi-progress-bar-container');
        if (existingProgressBar) {
            existingProgressBar.remove();
        }
        const { filledDashes, totalDashes } = this.getDashesForButton(id);
        const progressBar = this.createProgressBar(Math.min(filledDashes, totalDashes), totalDashes);
        zoomButton.appendChild(progressBar);
    }
};
YourInclusion.prototype.updateTextSpacingProgressBar = function (buttonId, incrementCount) {
    const button = document.getElementById(buttonId);
    if (button) {
        const existingProgressBar = button.querySelector('.syi-progress-bar-container');
        if (existingProgressBar) {
            existingProgressBar.remove();
        }

        const totalDashes = 3; 

        const progressBar = this.createProgressBar(Math.min(incrementCount, totalDashes), totalDashes);
        button.appendChild(progressBar);
    }
};
YourInclusion.prototype.updateLineHeightProgressBar = function (buttonId, incrementCount) {
    const button = document.getElementById(buttonId);
    if (button) {
     
        const existingProgressBar = button.querySelector('.syi-progress-bar-container');
        if (existingProgressBar) {
            existingProgressBar.remove();
        }

        const totalDashes = 3; 

        const progressBar = this.createProgressBar(Math.min(incrementCount, totalDashes), totalDashes);
        button.appendChild(progressBar);
    }
};
YourInclusion.prototype.updateCursorSizeProgressBar = function (buttonId, incrementCount) {
    const button = document.getElementById(buttonId);
    if (button) {
        const existingProgressBar = button.querySelector('.syi-progress-bar-container');
        if (existingProgressBar) {
            existingProgressBar.remove();
        }
        const totalDashes = 4;  

        const progressBar = this.createProgressBar(Math.min(incrementCount, totalDashes), totalDashes);
        button.appendChild(progressBar) 
    }
};


// Function to create a checkmark from a local SVG file
YourInclusion.prototype.createCheckmarkFromLocal = function (svgPath) {
    const wrapper = document.createElement('div');
    wrapper.className = 'syi-checkmark-wrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '5px';
    wrapper.style.right = '5px';
    wrapper.style.width = '20px';
    wrapper.style.height = '20px'; 
    wrapper.style.borderRadius = '50%';
    wrapper.style.backgroundColor = '#EDEDED'; 
    wrapper.style.display = 'none'; 
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    this.fetchAndAppendSVG(svgPath, wrapper);

    return wrapper;
};




YourInclusion.prototype.createBaseButton = function (id) {
    const button = document.createElement('button');
    button.className = 'syi-toolbox-button';
    button.id = id;
    return button;
};

YourInclusion.prototype.createIconWrapper = function (iconUrl, altText) {
    if (!iconUrl) return null;

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';
    if (iconUrl.endsWith('.svg')) {
        this.fetchAndAppendSVG(iconUrl, iconWrapper);
    } else if (iconUrl.endsWith('.png') || iconUrl.endsWith('.jpg') || iconUrl.endsWith('.jpeg')) {
        const imgIcon = this.createImageIcon(iconUrl, altText);
        iconWrapper.appendChild(imgIcon);
    }

    return iconWrapper;
};

YourInclusion.prototype.fetchAndAppendSVG = function (icon, wrapper) {
    fetch(icon)
        .then(response => response.text())
        .then(svgContent => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgContent;

            const svgElement = tempDiv.querySelector('svg');
            if (svgElement) {
                svgElement.classList.add('button-icon'); 
                wrapper.appendChild(svgElement); 
            }
        })
        .catch(error => console.error('Error fetching SVG:', error));
};


YourInclusion.prototype.createImageIcon = function (src, alt) {
    const imgIcon = document.createElement('img');
    imgIcon.src = src;
    imgIcon.alt = alt;
    imgIcon.className = 'button-icon';
    return imgIcon;
};

YourInclusion.prototype.createFontAwesomeIcon = function (icon) {
    const fontAwesomeIcon = document.createElement('span');
    fontAwesomeIcon.innerHTML = icon; 
    fontAwesomeIcon.className = 'font-awesome-icon'; 
    return fontAwesomeIcon;
};


YourInclusion.prototype.createTextWrapper = function (text) {
    const textWrapper = document.createElement('span');
    textWrapper.className = 'text-wrapper';
    textWrapper.textContent = text;
    return textWrapper;
};


YourInclusion.prototype.createButtonWithIcon = function (id, iconClass) {
    const button = document.createElement('button');
    button.className = 'header-btn';
    button.id = id;

    const icon = document.createElement('span');
    icon.className = iconClass; 
    button.appendChild(icon);

    return button;
};


    YourInclusion.prototype.createDiv = function(className, id = ''){
    const attributes = { class: className };
    if (id) attributes.id = id;
    return this.createEle('div', attributes);
}


    YourInclusion.prototype.createImage = function (src, alt, className) {
    return this.createEle('img', { src: src, alt: alt, class: className });
}


    YourInclusion.prototype.createHeading = function (level, text, className = '') {
    return this.createEle(`h${level}`, { class: className }, text);
}


    YourInclusion.prototype.createDiv = function(className, id = ''){
    const attributes = { class: className };
    if (id) attributes.id = id;
    return this.createEle('div', attributes);
}


    YourInclusion.prototype.createImage = function (src, alt, className) {
    return this.createEle('img', { src: src, alt: alt, class: className });
}


    YourInclusion.prototype.createHeading = function (level, text, className = '') {
    return this.createEle(`h${level}`, { class: className }, text);
}


/***  Create Toolbox */
YourInclusion.prototype.createToolbox = function () {
    const toolbox = this.createDiv('syi-toolbox hidden', 'syi-toolbox');

    
    const header = this.createToolboxHeader(); 
    const body = this.createToolboxBody();   
    // const extra = this.createExtralargeButton();  

   
    toolbox.appendChild(header);
    // toolbox.appendChild(extra);
    toolbox.appendChild(body);
    document.body.appendChild(toolbox);
    this.resetButtonStates();
};


// Function to create the toolbox header
YourInclusion.prototype.createToolboxHeader = function () {
    const header = this.createDiv('syi-toolbox-header');
    const headerLeft = this.createHeaderLeftSection();
    const logo = this.createLogo();
    const title = this.createTitle(language[CONFIG.LANGUAGE]['SITE_TITLE']);
    const headerRight = this.createHeaderRightSection();

   
    header.appendChild(headerLeft);
    header.appendChild(logo);
    header.appendChild(title);
    header.appendChild(headerRight);

    return header;
};


YourInclusion.prototype.createHeaderLeftSection = function () {
    const headerLeft = this.createDiv('syi-toolbox-header-left');
    headerLeft.style.position = 'relative';
    headerLeft.style.bottom = '28%';

    
    const settingsButton = this.createButtonWithIcon('settings-btn', 'fas fa-cog');
    settingsButton.style.fontSize = '14px';
    settingsButton.addEventListener('click', () => this.createSettingsPopup());
    headerLeft.appendChild(settingsButton);

    
    const resetButton = this.createButtonWithIcon('reset-btn', 'fas fa-undo');
    resetButton.style.fontSize = '14px';
    resetButton.addEventListener('click', () => initResetFeature());
    headerLeft.appendChild(resetButton);

    return headerLeft;
};

YourInclusion.prototype.createHeaderRightSection = function () {
    const headerRight = this.createDiv('syi-toolbox-header-right');
    headerRight.style.position = 'relative';
    headerRight.style.bottom = '28%';

     
    const infoButton = this.createButtonWithIcon('info-btn', 'fas fa-info-circle');
    infoButton.style.fontSize = '14px'
    infoButton.addEventListener('click', () => this.createInfoPopup());
    headerRight.appendChild(infoButton);
    
   
    const closeButton = this.createButtonWithIcon('close-btn', 'fas fa-times');
    closeButton.style.fontSize = '14px';
    closeButton.addEventListener('click', () => this.closeToolboxFromButton());
    headerRight.appendChild(closeButton);

    return headerRight;
};
YourInclusion.prototype.createInfoPopup = function () {
    this.closeAllPopups();
    if (document.querySelector('.syi-info-popup')) return;
    const popup = this.createDiv('syi-info-popup');
    const header = this.createDiv('syi-info-popup-header');
    header.innerHTML = `
        <span class="info-popup-title">${language[CONFIG.LANGUAGE]['INFO']}</span>
        <button id="close-info-popup" class="close-popup-btn">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    const body = this.createDiv('syi-info-popup-body');
    body.innerHTML = `<p>${language[CONFIG.LANGUAGE]['INFO_TEXT']}</p>`;
    popup.appendChild(header);
    popup.appendChild(body);
    document.body.appendChild(popup);
    const closeButton = header.querySelector('#close-info-popup');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });
};

YourInclusion.prototype.createExtralargeButton = function () {
    const button = document.createElement('div');
    button.classList.add('syi-extralargebutton');

    const icon = document.createElement('i');
    icon.classList.add('fa-2x', 'fa-magnifying-glass-plus', 'fa-solid');
    icon.setAttribute('aria-hidden', 'true');

    button.appendChild(icon);
    button.addEventListener('click', () => {
        event.stopPropagation();
        this.toggleExtralargeToolbox();
    });

    return button; 
};


YourInclusion.prototype.toggleExtralargeToolbox = function () {
    const toolboxBody = document.querySelector('.syi-toolbox-body');
    if (toolboxBody) {
        toolboxBody.classList.toggle('Large-mode');
    }

    const toggleClassForElements = (selector, className) => {
        document.querySelectorAll(selector).forEach(element => {
            element.classList.toggle(className);
        });
    };

    toggleClassForElements('.syi-toolbox-button span', 'Large-mode');
    toggleClassForElements('.syi-toolbox-button', 'Large-mode');
    toggleClassForElements('.syi-toolbox-title', 'Large-mode');
    toggleClassForElements('.syi-font-size-popup', 'Large-mode');
    toggleClassForElements('.syi-font-popup-header', 'Large-mode');
    toggleClassForElements('.syi-font-popup-btn', 'Large-mode');
    toggleClassForElements('.syi-font-popup-display', 'Large-mode');
    toggleClassForElements('.reset-popup-btn', 'Large-mode');
    toggleClassForElements('.syi-contrast-popup-title', 'Large-mode');
    toggleClassForElements('.syi-contrast-custom-colors label', 'Large-mode');
    toggleClassForElements('.syi-contrast-reset-button', 'Large-mode');
    toggleClassForElements('.switch-container p', 'Large-mode');
    toggleClassForElements('.syi-settings-popup h3', 'Large-mode');
    toggleClassForElements('.syi-settings-popup-body label', 'Large-mode');
    toggleClassForElements('.popup-reset', 'Large-mode');
    toggleClassForElements('.corner-svg-icon', 'Large-mode');
    toggleClassForElements('.syi-toolbox-button svg', 'Large-mode');
    toggleClassForElements('.read-aloud-toolbar', 'Large-mode');
    toggleClassForElements('.cursor-label', 'Large-mode');
    toggleClassForElements('.website-label', 'Large-mode');
    toggleClassForElements('.speed-label', 'Large-mode');
    toggleClassForElements('.volume-label', 'Large-mode');
    toggleClassForElements('.keyboard-popup', 'Large-mode');
    toggleClassForElements('.keyboard-popup-body', 'Large-mode');
    toggleClassForElements('.keyboard-popup-header h3', 'Large-mode');

    const isLargeMode = toolboxBody.classList.contains('Large-mode');
    
    // Store the state in AppState
    const stateManager = this.createStateManager('AppState');
    stateManager.updateState({ isExtraLargeToolboxActive: isLargeMode });
};
  


  
YourInclusion.prototype.closeToolboxFromButton = function () {
    const toolbox = document.querySelector('.syi-toolbox');
    const extra = document.querySelector('.syi-extralargebutton');
    if (toolbox) {
        toolbox.classList.remove('visible'); 
        extra.style.visibility = 'hidden';
        this.closeAllPopups();
    }
    const popup = document.getElementById('read-aloud-toolbar');
    if (popup) {
        popup.remove(); 
    }
    
};


// Function to create the toolbox logo
YourInclusion.prototype.createLogo = function () {
    const logo = document.createElement('img');
    logo.src = `${CONFIG.URLS.S3_BUCKET}/icons/image.png`;
    logo.alt = 'Logo';
    logo.className = 'syi-toolbox-logo';
    return logo;
};

// Function to create the toolbox title
YourInclusion.prototype.createTitle = function (text) {
    const title = document.createElement('h2');
    title.className = 'syi-toolbox-title';
    title.textContent = text;
    return title;
};


// Function to create the toolbox body with all buttons

YourInclusion.prototype.createToolboxBody = function (selectedLanguage = CONFIG.LANGUAGE) {
    const body = this.createDiv('syi-toolbox-body');

    const buttons = [
        { id: 'blue-filter-btn', textKey: 'BLUE_FILTER', iconClass: `${CONFIG.URLS.BASE_URL}/assets/BlueFilter-1.svg` },
        { id: 'contrast-btn', textKey: 'CONTRAST_MODES', iconClass: `${CONFIG.URLS.BASE_URL}/assets/contrast.svg` },
        { id: 'remove-images-btn', textKey: 'REMOVE_IMAGES', iconClass: `${CONFIG.URLS.BASE_URL}/assets/image-off.svg` },
        { id: 'font-size-btn', textKey: 'FONT_SIZE', iconClass: `${CONFIG.URLS.BASE_URL}/assets/fontsize.svg` },
        { id: 'night-mode-btn', textKey: 'NIGHT_MODE', iconClass: `${CONFIG.URLS.BASE_URL}/assets/mode-night.svg` },
        { id: 'accessible-font-btn', textKey: 'ACCESSIBLE_FONT', iconClass: `${CONFIG.URLS.BASE_URL}/assets/font-1.svg` },
        { id: 'text-spacing-btn', textKey: 'TEXT_SPACING', iconClass: `${CONFIG.URLS.BASE_URL}/assets/ri_text-spacing-2.svg` },
        { id: 'line-height-btn', textKey: 'LINE_HEIGHT', iconClass: `${CONFIG.URLS.BASE_URL}/assets/ri_line-height-1.svg` },
        { id: 'remove-audio-btn', textKey: 'REMOVE_AUDIO', iconClass: `${CONFIG.URLS.BASE_URL}/assets/mdi_mute-1.svg` },
        { id: 'highlight-links-btn', textKey: 'HIGHLIGHT_LINKS', iconClass: `${CONFIG.URLS.BASE_URL}/assets/link-1.svg` },
        { id: 'highlight-headers-btn', textKey: 'HIGHLIGHT_HEADERS', iconClass: `${CONFIG.URLS.BASE_URL}/assets/cil_header-1.svg` },
        { id: 'zoom-toggle-btn', textKey: 'ZOOM_TOGGLE', iconClass: `${CONFIG.URLS.BASE_URL}/assets/zoom-1.svg` },
        { id: 'stop-animations-btn', textKey: 'STOP_ANIMATIONS', iconClass: `${CONFIG.URLS.BASE_URL}/assets/stop-1.svg` },
        { id: 'cursor-size-btn', textKey: 'CURSOR_SIZE', iconClass: `${CONFIG.URLS.BASE_URL}/assets/cursor-1.svg` },
        { id: 'read-aloud-btn', textKey: 'READ_ALOUD', iconClass: `${CONFIG.URLS.BASE_URL}/assets/read-aloud.svg` },
        { id: 'keyboard-navigation-btn', textKey: 'KEYBOARD-NAVIGATION', iconClass: `${CONFIG.URLS.BASE_URL}/assets/keyboard.svg` },
        { id: 'reset-btn1', textKey: 'RESET', iconClass: `${CONFIG.URLS.BASE_URL}/assets/reset-1.svg` },
        { id: 'save-settings-btn', textKey: 'SAVE_SETTINGS', iconClass: `${CONFIG.URLS.BASE_URL}/assets/save-1.svg` },
        
    ];

    buttons.forEach(({ id, textKey, iconClass }) => {
        const buttonDiv = this.createDiv(id || textKey.toLowerCase());
        const buttonText = language[selectedLanguage][textKey] || textKey; 
        const button = this.createButton(id, buttonText, iconClass);
        buttonDiv.appendChild(button);
        body.appendChild(buttonDiv);
    });

    return body;
};

YourInclusion.prototype.initializeProperties = function () {
    this.isFontSizePopupActive = false;
    this.isSettingsPopupActive = false;
    this.isContrastPopupActive = false;
};


  /*** Check the status of each popup flag */
  YourInclusion.prototype.areAllPopupsInactive = function () {
    const stateManager = this.createStateManager('AppState'); 
    const state = stateManager.getState(); 

    const anyPopupActive = state.isFontSizePopupActive || state.isSettingsPopupActive || state.isContrastPopupActive;
    return !anyPopupActive;
};




/***  Initialize Toolbox */
YourInclusion.prototype.initializeAccessibilityToolbox = function () {
    this.createToolbox();
    this.createSideButton();
    const toolboxdiv = this.createDiv('syi-toolboxdiv');
    const toolboxdiv1 = this.createDiv('syi-toolboxdiv1');
    const toolboxdiv2 = this.createDiv('syi-toolboxdiv2');
    const toolbox = document.getElementById('syi-toolbox');
    const sideButton = document.getElementById('openToolboxButton');
    const extra = this.createExtralargeButton(); 
    let visibilityCounter = 0; 
    sideButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isVisible = toolbox.classList.toggle('visible'); 
        if (isVisible) {
            extra.style.visibility = 'visible';
            extra.style.opacity = '1';
        } else {
            extra.style.visibility = 'hidden';
            extra.style.opacity = '0';
        }
            visibilityCounter++;
            if (visibilityCounter === 1) {
                this.updateToolboxColor();
            
        }
    });
    document.addEventListener('click', (event) => {
        event.stopPropagation();
        const isToolboxActive = toolbox.classList.contains('visible');
        const popupsInactive = this.areAllPopupsInactive();

        if (isToolboxActive && popupsInactive) {
            if (!toolbox.contains(event.target) && !sideButton.contains(event.target)) {
                toolbox.classList.remove('visible');
                extra.classList.remove('visible');
                extra.style.visibility = 'hidden';
            }
        } else if (!popupsInactive) {
        }
    });
    toolboxdiv.appendChild(toolbox);
    toolboxdiv.appendChild(sideButton)
    toolboxdiv1.appendChild(toolboxdiv);
    toolboxdiv2.appendChild(toolboxdiv1);
    toolboxdiv.appendChild(extra);
    document.body.appendChild(toolboxdiv2);
    this.loadToolbarState();
    this.initializeProperties();
    this.createStateManager();
    this.listenForControlOne(sideButton);

};
YourInclusion.prototype.listenForControlOne = function (sideButton) {
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === '1') {
            event.preventDefault(); 
            sideButton.click(); 
        }
    });
};
 YourInclusion.prototype.createStateManager= function(storageKey = 'AppState') {
    const defaultState = {
        isFontSizePopupActive: false,
        isSettingsPopupActive: false,
        isContrastPopupActive: false,
        zoomLevel: 1,
        zoomIncrement: 0, 
        textSpacing:0
    };
    if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify(defaultState));
    }

    return {
        storageKey, 
        saveState(state) {
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        },
        getState() {
            const state = JSON.parse(localStorage.getItem(this.storageKey)) || {};
            return state;
        },
        updateState(updates) {
            const currentState = this.getState();
            const updatedState = { ...currentState, ...updates };
            
            this.saveState(updatedState);
        },

        
        clearState() {
            localStorage.removeItem(this.storageKey);
        }
    };
}




/***
 * Create Side Button
 */
YourInclusion.prototype.createSideButton = function () {
    const existingSideButton = document.getElementById('openToolboxButton'); 
    if (existingSideButton) {
        existingSideButton.remove(); 
    }
    const sideButton = this.createSideButtonElement();
  const checkmark = this.createSideButtonCheckmark(`${CONFIG.URLS.BASE_URL}/assets/tick-white.svg`);
  sideButton.appendChild(checkmark);
    this.makeSideButtonDraggable(sideButton);
    document.body.appendChild(sideButton);
    
};

YourInclusion.prototype.createSideButtonCheckmark = function (svgPath) {
    const wrapper = document.createElement('div');
    wrapper.className = 'syi-side-button-checkmark';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '-4px';
    wrapper.style.right = '-3px'; 
    wrapper.style.width = '24px'; 
    wrapper.style.height = '24px';
    wrapper.style.borderRadius = '50%';
    wrapper.style.backgroundColor = 'rgb(0, 190, 86)';
    wrapper.style.display = 'flex'; 
    wrapper.style.visibility ="hidden"
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.boxShadow = "-1px 4px 7px 0px rgb(0 0 0 / 35%)";
    this.fetchAndAppendSVG(svgPath, wrapper);
    return wrapper;
};

/***
 * Checkmart for Sidebutton
 */

YourInclusion.prototype.updateSideButtonState = function () {
    const sideButton = document.getElementById('openToolboxButton');

    if (!sideButton) {
        return;
    }
    const isActive = Array.from(document.querySelectorAll('.syi-toolbox-button'))
        .some(button => button.dataset.active === 'true');

    const checkmark = sideButton.querySelector('.syi-side-button-checkmark');

    if (isActive) {
      
        if (checkmark) {
            checkmark.style.visibility = 'visible';
        }
        sideButton.style.border = '2px solid #28a745'; 
    } else {
      
        if (checkmark) {
            checkmark.style.visibility = 'hidden'; 
        }
        sideButton.style.border = 'none';
    }
};




YourInclusion.prototype.createSideButtonElement = function () {
    const sideButton = this.createDiv('syi-side-button', 'openToolboxButton');
    const buttonImage = this.createImage(
        CONFIG.URLS.SIDE_BUTTON,
        'Open Toolbox',
        'syi-side-button-image'
    );
    sideButton.appendChild(buttonImage);
    return sideButton;
};

YourInclusion.prototype.makeSideButtonDraggable = function (sideButton) {
    let isDragging = false;
    let offsetX, offsetY;

    sideButton.addEventListener('mousedown', (e) => this.startDragging(e, sideButton));
    document.addEventListener('mousemove', (e) => this.dragSideButton(e, sideButton));
    document.addEventListener('mouseup', () => this.stopDragging());
};

YourInclusion.prototype.startDragging = function (event, sideButton) {
    this.isDragging = true;
    this.offsetX = event.clientX - sideButton.offsetLeft;
    this.offsetY = event.clientY - sideButton.offsetTop;
    document.body.style.cursor = 'move';
};

YourInclusion.prototype.dragSideButton = function (event, sideButton) {
    if (!this.isDragging) return;
    let x = event.clientX - this.offsetX;
    let y = event.clientY - this.offsetY;
    const windowWidth = window.innerWidth;
    x = x + sideButton.offsetWidth / 2 < windowWidth / 2
        ? 10 
        : windowWidth - sideButton.offsetWidth - 20; 
    sideButton.style.left = `${x}px`;
    sideButton.style.top = `${y}px`;

   
    this.updateToolboxPosition(x, y, sideButton);
};

YourInclusion.prototype.stopDragging = function () {
    this.isDragging = false;
    document.body.style.cursor = 'default';
};

YourInclusion.prototype.updateToolboxPosition = function (x, y, sideButton) {
    const toolbox = document.getElementById('syi-toolbox');
    if (!toolbox) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    let toolboxLeft = x + sideButton.offsetWidth / 2 - toolbox.offsetWidth / 2;
    let toolboxTop = y - toolbox.offsetHeight - 60;
    toolboxLeft = Math.max(10, Math.min(toolboxLeft, windowWidth - toolbox.offsetWidth - 10));
    toolboxTop = Math.max(scrollY + 10, Math.min(toolboxTop, scrollY + windowHeight - toolbox.offsetHeight - 10));
    const isToolboxOnLeft = toolboxLeft + toolbox.offsetWidth / 2 < windowWidth / 2;
    if (toolboxLeft + toolbox.offsetWidth / 2 < windowWidth / 2) {
        toolbox.style.left = '10px';
        toolbox.style.right = 'auto';
    } else {
        toolbox.style.right = '10px';
        toolbox.style.left = 'auto';
    }

    toolbox.style.top = `${toolboxTop}px`;
    const sideButtonTop = toolboxTop + toolbox.offsetHeight + 10;
    sideButton.style.top = `${Math.min(sideButtonTop, scrollY + windowHeight - sideButton.offsetHeight - 10)}px`;
    
    const extralargeButton = document.querySelector('.syi-extralargebutton');
    if (extralargeButton) {
        if (isToolboxOnLeft) {
            extralargeButton.classList.add('toolbar-left');
        } else {
            extralargeButton.classList.remove('toolbar-left');
        }
    }

    // Update popup positions
    this.updatePopupPositions(isToolboxOnLeft);
};




/**
 * Updates the positions of all popups dynamically based on the toolbox location.
 * @param {boolean} isToolboxOnLeft 
 */

YourInclusion.prototype.updatePopupPositions = function (isToolboxOnLeft) {

    const popupConfigs = [
        { selector: '.syi-font-size-popup', left: isToolboxOnLeft ? '25%' : '72%' },
        { selector: '.syi-settings-popup', left: isToolboxOnLeft ? '42%' : '72%' },
        { selector: '.syi-contrast-popup', left: isToolboxOnLeft ? '30%' : '69%' },
    ];

    popupConfigs.forEach(({ selector, left }) => {
        const popup = document.querySelector(selector);
        if (popup) {
            popup.style.setProperty('left', left, 'important');
        }
    });
}

/***  Blue Filter */
YourInclusion.prototype.initBlueFilter = function () {
    const blueFilterButton = document.getElementById('blue-filter-btn');

    if (blueFilterButton) {
        blueFilterButton.addEventListener('click', () => {
            const blueOverlay = document.querySelector('.syi-blue-overlay');

            if (blueOverlay) {
                // Remove existing overlay
                blueOverlay.remove();
                this.setActiveButton('blue-filter-btn', false);
            } else {
                // Create a new overlay and append it to the <html> tag
                const newBlueOverlay = this.createDiv('syi-blue-overlay');
                document.documentElement.appendChild(newBlueOverlay);
                newBlueOverlay.classList.add('active');
                this.setActiveButton('blue-filter-btn', true);
            }
        });
    } else {
       
    }
};

/*** Remove images */
YourInclusion.prototype.initRemoveImages = function () {
    const removeImageButton = document.getElementById('remove-images-btn');
    if (removeImageButton) {
        removeImageButton.addEventListener('click', () => {
            this.toggleImages(); 
            this.setActiveButton('remove-images-btn'); 
        });
    }
};

YourInclusion.prototype.toggleImages = function () {
    const images = document.querySelectorAll('img:not(.syi-toolbox-image):not(.syi-side-button-image):not(.syi-toolbox-logo)');
    const isAnyImageHidden = Array.from(images).some(img => img.classList.contains('hidden-image'));
    if (isAnyImageHidden) {
        images.forEach(img => img.classList.remove('hidden-image'));
        this.imagesHidden = false;
    } else {
        images.forEach(img => img.classList.add('hidden-image'));
        this.imagesHidden = true; 
    }
};


/*** Button Click Color change */

document.addEventListener('DOMContentLoaded', () => {
   
    const buttons = document.querySelectorAll('.syi-toolbox-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            buttons.forEach(btn => (btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)"));

            button.style.backgroundColor = "rgba(52, 88, 185, 1)";
        });
    });
});

/*** Font size setting PopuP */
YourInclusion.prototype.addFontSizePopup = function () {
    const fontSizeDiv = document.querySelector('.font-size-btn'); 
    const toolbox = document.querySelector('.syi-toolbox-body');

    if (!fontSizeDiv || !toolbox) {
        
        return;
    }

    this.isFontSizeChanged = false;
    this.isFontSizePopupActive = false;
    const stateManager = this.createStateManager('AppState');
   
    this.fontSizeChange = this.fontSizeChange || 0; 

    fontSizeDiv.addEventListener('click', () => {
        let fontSizePopup = document.querySelector('.syi-font-size-popup');
        if (!fontSizePopup) {
            fontSizePopup = document.createElement('div');
            fontSizePopup.className = 'syi-font-size-popup';

            fontSizePopup.innerHTML = `
                <div class="syi-font-popup-header">
                    <span class="font-popup-title">${language[CONFIG.LANGUAGE]['FONT_SIZE_SETTINGS']}</span>
                    <button id="close-font-popup" class="close-popup-btn">✖</button>
                </div>
                <div class="syi-font-popup-content">
                    <button id="decrease-font-btn" class="syi-font-popup-btn"><i class="fa-solid fa-minus"></i></button>
                    <span id="font-size-display" class="syi-font-popup-display">${this.fontSizeChange}</span>
                    <button id="increase-font-btn" class="syi-font-popup-btn"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div class="syi-popup-reset" style="padding: 10px;">
                    <button id="reset-font-btn" class="reset-popup-btn">${language[CONFIG.LANGUAGE]['RESET']}</button>
                </div>
            `;

            document.body.appendChild(fontSizePopup);

            const toolboxRect = toolbox.getBoundingClientRect();
            fontSizePopup.style.top = `${toolboxRect.top + 20}px`;
            fontSizePopup.style.left = `${toolboxRect.left + 20}px`;

            const decreaseButton = fontSizePopup.querySelector('#decrease-font-btn');
            const increaseButton = fontSizePopup.querySelector('#increase-font-btn');
            const resetButton = fontSizePopup.querySelector('#reset-font-btn');
            const fontSizeDisplay = fontSizePopup.querySelector('#font-size-display');
            const closeButton = fontSizePopup.querySelector('#close-font-popup');

            const allElements = document.body.querySelectorAll(
                '*:not(.syi-toolbox):not(.syi-toolbox *):not(.font-size-popup):not(.syi-font-size-popup *)'
            );

            if (!this.originalFontSizes) {
                this.originalFontSizes = new Map();
                allElements.forEach((element) => {
                    const computedStyle = window.getComputedStyle(element);
                    this.originalFontSizes.set(element, parseFloat(computedStyle.fontSize));
                });
            }

            const applyFontSizeChange = () => {
                allElements.forEach((element) => {
                    const originalSize = this.originalFontSizes.get(element);
            
                    if (originalSize) {
                        const newSize = originalSize + this.fontSizeChange; 
                        const clampedSize = Math.min(Math.max(newSize, originalSize - 6), originalSize + 6);
                        element.style.fontSize = `${clampedSize}px`;
                    }
                });
            };
            
            const updateFontSizeDisplay = () => {
                fontSizeDisplay.textContent = this.fontSizeChange > 0
                    ? `+${this.fontSizeChange}`
                    : `${this.fontSizeChange}`;
                this.isFontSizeChanged = this.fontSizeChange !== 0;
            };
            decreaseButton.addEventListener('click', () => {
                if (this.fontSizeChange > -6) { 
                    this.fontSizeChange -= 1;
                    applyFontSizeChange(); 
                    updateFontSizeDisplay(); 
                }
            });
            increaseButton.addEventListener('click', () => {
                if (this.fontSizeChange < 6) { 
                    this.fontSizeChange += 1;
                    applyFontSizeChange(); 
                    updateFontSizeDisplay(); 
                }
            });
            resetButton.addEventListener('click', () => {
                allElements.forEach((element) => {
                    element.style.fontSize = `${this.originalFontSizes.get(element)}px`;
                });
                this.fontSizeChange = 0; 
                updateFontSizeDisplay(); 
            });
      closeButton.addEventListener('click', () => {
        fontSizePopup.style.display = 'none';
        stateManager.updateState({ isFontSizePopupActive: false });
    });
}
if (fontSizePopup.style.display === 'block') {
    fontSizePopup.style.display = 'none';
    stateManager.updateState({ isFontSizePopupActive: false });
} else {
    this.closeAllPopups(); 
    fontSizePopup.style.display = 'block';
    stateManager.updateState({ isFontSizePopupActive: true }); 
}
const isExtraLargeToolboxActive = stateManager.getState().isExtraLargeToolboxActive;

// If active, apply the Large-mode class to elements
if (isExtraLargeToolboxActive) {
    const toggleClassForElements = (selector, className) => {
        document.querySelectorAll(selector).forEach(element => {
            element.classList.add(className);
        });
    };

    toggleClassForElements('.syi-font-size-popup', 'Large-mode');
    toggleClassForElements('.syi-font-popup-header', 'Large-mode');
    toggleClassForElements('.syi-font-popup-btn', 'Large-mode');
    toggleClassForElements('.syi-font-popup-display', 'Large-mode');
    toggleClassForElements('.reset-popup-btn', 'Large-mode');
}
});
};

/*** Function to check the flag and set the button state  */
YourInclusion.prototype.checkFontSizeChangeFlag = function () {
    this.setActiveButton('font-size-btn', this.isFontSizeChanged);
};

/*** Night Mode Feature */
YourInclusion.prototype.initNightModeFeature = function () {
    const nightModeButton = document.getElementById('night-mode-btn');
    if (nightModeButton) {
        nightModeButton.addEventListener('click', () => {
            this.toggleNightMode();
        });
    }
    const isNightModeEnabled = localStorage.getItem('syi-nightMode') === 'true';
    document.body.classList.toggle('syi-night-mode', isNightModeEnabled);
    this.setActiveButton('night-mode-btn', isNightModeEnabled);
};

YourInclusion.prototype.toggleNightMode = function () {
    
    const allElements = document.querySelectorAll(':not(button):not(input):not(.syi-toolbox):not(.syi-toolbox *):not(.syi-blue-overlay)');

    
    const isNightModeEnabled = document.body.classList.toggle('syi-night-mode');
    localStorage.setItem('syi-nightMode', isNightModeEnabled);

   
    allElements.forEach(element => {
        if (isNightModeEnabled) {
            element.classList.add('syi-night-mode');
        } else {
            element.classList.remove('syi-night-mode');
        }
    });
    this.setActiveButton('night-mode-btn', isNightModeEnabled);
};

/*** Text Spacing Feature */
YourInclusion.prototype.initTextSpacingFeature = function () {
    const textSpacingButton = document.getElementById('text-spacing-btn');
    if (textSpacingButton) {
        textSpacingButton.addEventListener('click', () => {
            this.toggleTextSpacing('text-spacing-btn');
        });
    }
};

YourInclusion.prototype.toggleTextSpacing = function (buttonId) {
    const elementsToAdjust = document.querySelectorAll('body *:not(.syi-toolbox):not(.syi-toolbox *):not(.syi-checkmark-wrapper):not(.syi-checkmark-wrapper *):not(#keyboard-navigation-popup)');
    const spacingStates = ['normal', '0.1em', '0.2em', '0.3em'];

    if (this.currentTextSpacingIndex === undefined) {
        this.currentTextSpacingIndex = 0;
    }
    this.currentTextSpacingIndex = (this.currentTextSpacingIndex + 1) % spacingStates.length;
    const spacingLevel = spacingStates[this.currentTextSpacingIndex];

    elementsToAdjust.forEach(element => {
        element.style.letterSpacing = spacingLevel;
    });

    const stateManager = this.createStateManager('AppState');
    const currentState = stateManager.getState();

    let newTextSpacingIncrement = currentState.textSpacingIncrement || 0;
    if (spacingLevel === 'normal') {
        newTextSpacingIncrement = 0;
    } else {
        newTextSpacingIncrement = Math.min(newTextSpacingIncrement + 1, 3);
    }
    stateManager.updateState({
        textSpacingIncrement: newTextSpacingIncrement
    });
    this.updateTextSpacingProgressBar(buttonId, newTextSpacingIncrement);
  
    this.setActiveButton(buttonId, spacingLevel !== 'normal');
};



/*** Line Height Feature */
YourInclusion.prototype.initLineHeightFeature = function () {
    const lineHeightButton = document.getElementById('line-height-btn');
    if (lineHeightButton) {
        lineHeightButton.addEventListener('click', () => {
            this.toggleLineHeight('line-height-btn');
        });
    }
};


YourInclusion.prototype.toggleLineHeight = function (buttonId) {
    const elementsToAdjust = Array.from(document.querySelectorAll('body *'))
    .filter(element => {
        const isExcluded = element.closest('#syi-toolbox, .syi-popup, .syi-header, .syi-button, .syi-checkmark, #keyboard-navigation-popup ');
        const hasTextContent = Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE);
        return !isExcluded && hasTextContent;
    });
    const lineHeightStates = ['normal', '1.5', '2', '2.5'];

   
    if (this.currentLineHeightIndex === undefined) {
        this.currentLineHeightIndex = 0;
    }

 
    this.currentLineHeightIndex = (this.currentLineHeightIndex + 1) % lineHeightStates.length;
    const lineHeightLevel = lineHeightStates[this.currentLineHeightIndex];

  
    elementsToAdjust.forEach(element => {
        element.style.lineHeight = lineHeightLevel;
    });
      const stateManager = this.createStateManager('AppState');
      const currentState = stateManager.getState();
      let newLineHeightIncrement = currentState.lineHeightIncrement || 0;

      if (lineHeightLevel === 'normal') {
          newLineHeightIncrement = 0;
      } else {
          newLineHeightIncrement += 1;
      }
      stateManager.updateState({
          lineHeightIncrement: newLineHeightIncrement
      });
  
      this.updateLineHeightProgressBar(buttonId, newLineHeightIncrement);

    if (lineHeightLevel === 'normal') {
        this.setActiveButton(buttonId, false); 
    } else {
        this.setActiveButton(buttonId, true); 
    }

};


/*** Button Active */

YourInclusion.prototype.setActiveButton = function (activeButtonId, isActive = null) {
    const button = document.getElementById(activeButtonId);

    if (button) {
        const newState = isActive !== null ? isActive : button.dataset.active !== 'true';
        if (newState) {
            button.classList.add('active-button');
            button.dataset.active = 'true';
            const checkmark = button.querySelector('.syi-checkmark-wrapper');
            if (checkmark) {
                checkmark.style.display = 'block';
            }
        } else {
            button.classList.remove('active-button');
            button.dataset.active = 'false';
            const checkmark = button.querySelector('.syi-checkmark-wrapper');
            if (checkmark) {
                checkmark.style.display = 'none';
            }
        }
    }
    this.updateSideButtonState();
};


/***
 * Reset Active button
 */
YourInclusion.prototype.resetButtonStates = function () {
    
    const buttons = document.querySelectorAll('.syi-toolbox-button');
    buttons.forEach((button) => {
        
        button.classList.remove('active-button'); 
        button.removeAttribute('data-active'); 
    });
};

/*** Reset Function */

YourInclusion.prototype.initResetFeature = function () {
    const resetButtons = document.querySelectorAll('#reset-btn, #reset-btn1');

    resetButtons.forEach((button) => {
        button.addEventListener('click', () => {
            this.resetToolbox();
        });
    });
};

YourInclusion.prototype.resetToolbox = function () {
    this.closeAllPopups();
    this.removeAllHighlights();
    this.restoreDefaultFontStyles();
    this.removeBlueFilter();
    this.restoreImages();
    this.resetAudioSettings();
    this.resetNightMode();
    this.resetCursorSize();
    this.resetAccessibleFont();
    this.reEnableAnimations();
    this.resetContrastSettings();
    this.resetTextSpacing();
    this.resetLineHeight();
    this.resetZoomLevel();
    this.resetKeyboardNavigation();
    this.resetButtonStates();
    this.resetPopupSettings();
    this.clearStorage();
    this.updateSideButtonState();
    this.resetActiveButtons();
    this.resetReadAloud();
    this.validateAndStartPluginReset();
    this.progressBarReset();
    this.clearAllSelectionHighlight();
};



YourInclusion.prototype.removeAllHighlights = function () {
    document.querySelectorAll('.highlight-links, .highlight-headers, .highlight-images').forEach((el) => {
        el.classList.remove('highlight-links', 'highlight-headers', 'highlight-images');
    });
};

YourInclusion.prototype.restoreDefaultFontStyles = function () {
    const fontPopup = document.querySelector('.syi-font-size-popup');
    const resetButton = fontPopup ? fontPopup.querySelector('.reset-popup-btn') : null;

    if (fontPopup && resetButton) {
        fontPopup.style.display = 'block';
        fontPopup.classList.add('visible');
        resetButton.click();
        setTimeout(() => {
            fontPopup.style.display = 'none';
            fontPopup.classList.remove('visible');
        }, 10); 
        this.addFontSizePopup();
    } else {
        console.error('Font popup or reset button not found.');
    }
};


YourInclusion.prototype.removeBlueFilter = function () {
    const blueOverlay = document.querySelector('.syi-blue-overlay');
    if (blueOverlay) blueOverlay.classList.remove('active');
    this.setActiveButton('blue-filter-btn', false);
};

YourInclusion.prototype.restoreImages = function () {
    const removeImageButton = document.getElementById('remove-images-btn');
    if (this.imagesHidden && removeImageButton) {
        removeImageButton.click();
    }
};

YourInclusion.prototype.resetAudioSettings = function () {
    const audioButton = document.getElementById('remove-audio-btn');
    if (audioButton) {
        const soundElements = document.querySelectorAll('audio, video');
        const isAlreadyMuted = Array.from(soundElements).every(el => el.muted);
        const isAudioButtonActive = audioButton.classList.contains('active') || audioButton.dataset.active === 'true';
        if (isAudioButtonActive) {
            audioButton.classList.remove('active'); 
            audioButton.dataset.active = 'false';  
        }
        if (isAlreadyMuted) {
            soundElements.forEach(el => el.muted = false);  
        }

    }
};

YourInclusion.prototype.resetNightMode = function () {
    const nightModeButton = document.getElementById('night-mode-btn');
    if (document.body.classList.contains('syi-night-mode') && nightModeButton) {
        nightModeButton.click();
    }
};

YourInclusion.prototype.resetCursorSize = function () {
    document.documentElement.style.cursor = 'auto';
};

YourInclusion.prototype.resetAccessibleFont = function () {
    document.body.classList.remove('syi-accessible-font');
};

YourInclusion.prototype.reEnableAnimations = function () {
    document.body.classList.remove('disable-animations');
    this.setActiveButton('stop-animations-btn', false);
};

YourInclusion.prototype.resetContrastSettings = function () {
    this.resetContrast();
    this.setActiveButton('contrast-btn', false);
};

YourInclusion.prototype.resetTextSpacing = function () {
    const elements = document.querySelectorAll('body *:not(.syi-toolbox):not(.syi-toolbox *)');
    elements.forEach((element) => {
        element.style.letterSpacing = 'normal';
    });
    this.currentTextSpacingIndex = 0;
    this.setActiveButton('text-spacing-btn', false);
};

YourInclusion.prototype.resetLineHeight = function () {
    const elements = document.querySelectorAll('body *:not(.syi-toolbox):not(.syi-toolbox *)');
    elements.forEach((element) => {
        element.style.lineHeight = 'normal';
    });
    this.currentLineHeightIndex = 0;
    this.setActiveButton('line-height-btn', false);
};

YourInclusion.prototype.resetZoomLevel = function () {
    this.applyZoom(1);
};

YourInclusion.prototype.resetKeyboardNavigation = function () {
    this.setActiveButton('keyboard-navigation-btn', false);
    this.hideKeyboardNavigationPopup();
};

YourInclusion.prototype.resetButtonStates = function () {
    const buttons = document.querySelectorAll('.syi-toolbox-button');
    buttons.forEach((button) => {
        
        button.classList.remove('active-button'); 
        button.removeAttribute('data-active'); 
    });
};

YourInclusion.prototype.resetPopupSettings = function () {
    const defaultSettings = { 
        color: this.selectedHeaderColor, 
        language: CONFIG.LANGUAGE 
    };

    // Reset the popup header color
    if (header) {
        header.style.backgroundColor = defaultSettings.color;
    }

    // Reset the color picker value
    if (colorPicker) {
        const colorPickerInput = colorPicker.querySelector('#color-picker');
        if (colorPickerInput) {
            colorPickerInput.value = defaultSettings.color;
        }
    }

    // Reset the toolbox header color
    const toolboxHeader = document.querySelector('.syi-toolbox-header');
    if (toolboxHeader) {
        toolboxHeader.style.backgroundColor = defaultSettings.color;
    }

    // Reset the icons' colors
    const toolboxIcons = document.querySelectorAll('.syi-toolbox-body svg');
    toolboxIcons.forEach(svg => {
        svg.style.fill = defaultSettings.color;
        svg.style.stroke = defaultSettings.color;

        const innerElements = svg.querySelectorAll('*');
        innerElements.forEach(inner => {
            inner.style.fill = defaultSettings.color;
            inner.style.stroke = defaultSettings.color;
        });
    });

    // Reset the toolbox buttons
    const toolboxButtons = document.querySelectorAll('.syi-toolbox-body .syi-toolbox-btn, .syi-toolbox-button');
    toolboxButtons.forEach(button => {
        button.style.backgroundColor = defaultSettings.color;
        button.style.borderColor = defaultSettings.color;
        button.style.color = defaultSettings.color;
    });

    // Reset the language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = defaultSettings.language;
    }

    // Reset the CSS variable
    document.documentElement.style.setProperty('--bg-color', defaultSettings.color, 'important');
};

YourInclusion.prototype.clearStorage = function () {
    localStorage.clear();
    sessionStorage.clear();
};
YourInclusion.prototype.resetReadAloud = function () {
    this.disableDefaultClickToRead();
    this.disableCursorReadAloud();
    this.stopReadAloud();


    const toolbar = document.getElementById('read-aloud-toolbar');
    if (toolbar) {
        toolbar.remove();
    }

    const readAloudButton = document.getElementById('read-aloud-btn'); 
    if (readAloudButton) {
        this.setActiveButton(readAloudButton.id, false);
    }

    this.isReadAloudActive = false;
    this.isCursorReadAloudActive = false;
    this.currentSpeed = 1; 
    this.currentVolume = 1; 
    localStorage.setItem('readAloudActive', false);
};

YourInclusion.prototype.resetActiveButtons = function () {
    const buttons = document.querySelectorAll('.syi-toolbox-button');
    buttons.forEach(button => {
        button.classList.remove('active-button');
        button.dataset.active = 'false';

        const checkmark = button.querySelector('.syi-checkmark-wrapper');
        if (checkmark) {
            checkmark.style.display = 'none';
        }
    });
    this.updateSideButtonState();
};
YourInclusion.prototype.progressBarReset = function (){
    this.updateZoomButtonProgressBar('zoom-toggle-btn');
    this.updateTextSpacingProgressBar('text-spacing-btn', 0);
    this.updateLineHeightProgressBar('line-height-btn', 0);
    this.updateCursorSizeProgressBar('cursor-size-btn', 0);
};

YourInclusion.prototype.updateSideButtonState = function () {
    const sideButton = document.getElementById('openToolboxButton');

    if (!sideButton) {
        return;
    }

    const isActive = Array.from(document.querySelectorAll('.syi-toolbox-button'))
        .some(button => button.dataset.active === 'true');

    const checkmark = sideButton.querySelector('.syi-side-button-checkmark');

    if (isActive) {
        if (checkmark) {
            checkmark.style.visibility = 'visible';
        }
        sideButton.style.border = '2px solid #28a745'; 
    } else {
        if (checkmark) {
            checkmark.style.visibility = 'hidden';
        }
        sideButton.style.border = 'none';
    }
};





/*** Contrast Mode */

YourInclusion.prototype.initContrastFeature = function () {
    const contrastButton = document.getElementById('contrast-btn');
     const stateManager = this.createStateManager('AppState');
    
    if (contrastButton) {
        contrastButton.addEventListener('click', () => {
            const existingPopup = document.querySelector('.syi-contrast-popup');

            if (existingPopup) {
                existingPopup.remove(); 
                this.resetContrast();
                stateManager.updateState({ isContrastPopupActive: false });     
            } else {
                this.createContrastPopup(); 
            }
        });
    }
};


YourInclusion.prototype.createContrastPopup = function () {
    this.closeAllPopups(); 
    const stateManager = this.createStateManager('AppState');

    const existingPopup = document.getElementById('syi-contrast-popup');
    if (existingPopup) {
        existingPopup.remove();
        this.isContrastPopupActive = false;
        stateManager.updateState({ isContrastPopupActive: false });
        return;
    }

    const popup = document.createElement('div');
    popup.id = 'syi-contrast-popup';
    popup.className = 'syi-contrast-popup'; 

    const header = this.createContrastPopupHeader(language[CONFIG.LANGUAGE]['CONTRAST'], () => {
        popup.remove(); 
        this.isContrastPopupActive = false;
    });
    popup.appendChild(header);

    const body = document.createElement('div');
    body.className = 'syi-contrast-popup-body';

    this.addPresetModes(body);
    this.addCustomColorControls(body);

    const resetButton = document.createElement('button');
    resetButton.className = 'syi-contrast-reset-button';
    resetButton.textContent = language[CONFIG.LANGUAGE]['RESET_CONTRAST'];
    resetButton.addEventListener('click', () => this.resetContrast());
    body.appendChild(resetButton);

    popup.appendChild(body);

     const closeButton = document.createElement('button');
    closeButton.className = 'syi-contrast-close-button';
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>'; 
    closeButton.addEventListener('click', () => { 
        event.stopPropagation(); 
        popup.remove();
        stateManager.updateState({ isContrastPopupActive: false });       
    });
     body.appendChild(closeButton);
 
     popup.appendChild(body);

    const toolbox = document.querySelector('.syi-toolbox');
    if (!toolbox) {
        console.error('Toolbox element not found!');
        return;
    }

    const toolboxRect = toolbox.getBoundingClientRect();
    const popupWidth = 400; 
    
    popup.style.top = `${toolboxRect.top + window.scrollY}px`;
    if (toolboxRect.left < window.innerWidth / 2) {
        popup.style.left = `${toolboxRect.right + 10}px`; //
    } else {
        popup.style.left = `${toolboxRect.left - popupWidth - 10}px`; 
    }

    document.body.appendChild(popup);

    stateManager.updateState({ isContrastPopupActive: true });
    const isExtraLargeToolboxActive = stateManager.getState().isExtraLargeToolboxActive;

    if (isExtraLargeToolboxActive) {
        const toggleClassForElements = (selector, className) => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.add(className);
            });
        };

        toggleClassForElements('.syi-contrast-popup-title', 'Large-mode');
        toggleClassForElements('.syi-contrast-custom-colors label', 'Large-mode');
        toggleClassForElements('.syi-contrast-reset-button', 'Large-mode');
        toggleClassForElements('.switch-container p', 'Large-mode');
    }
};


YourInclusion.prototype.createContrastPopupHeader = function (titleText, closeCallback) {
    const header = document.createElement('div');
    header.className = 'syi-contrast-popup-header'; 


    const title = document.createElement('h3');
    title.className = 'syi-contrast-popup-title'; 
    title.textContent = titleText;
    header.appendChild(title);

    return header;
};

YourInclusion.prototype.addPresetModes = function (container) {
    const switchContainer = document.createElement('div');
    switchContainer.className = 'switch-container';
    const label = document.createElement('p');
    label.textContent = label.textContent = language[CONFIG.LANGUAGE]['UNCOLORED_DISPLAY'];
    label.style.color = "#333333";
    label.style.fontWeight = 'bold';
    switchContainer.appendChild(label);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'mz-switch-rounded';
    checkbox.id = 'mz-switch-rounded';
    const switchLabel = document.createElement('label');
    switchLabel.setAttribute('for', 'mz-switch-rounded');

    switchContainer.appendChild(checkbox);
    switchContainer.appendChild(switchLabel);
    checkbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        this.toggleContrastMode(isChecked ? 'grayscale' : 'default', e.target);
    });

    container.appendChild(switchContainer);
};

YourInclusion.prototype.contrastModeActive = false;

YourInclusion.prototype.addCustomColorControls = function (container) {
    const customColorsSection = document.createElement('div');
    customColorsSection.className = 'syi-contrast-custom-colors';

    const predefinedColors = ['#F0F0F0', '#000000', '#F0E68C', '#ADD8E6', '#FFB6C1'];

    const bgLabel = document.createElement('label');
    bgLabel.textContent = language[CONFIG.LANGUAGE]['BACKGROUND'];

    const bgColorContainer = document.createElement('div');
    bgColorContainer.className = 'syi-color-picker-container';

    predefinedColors.forEach((color) => {
        const colorButton = document.createElement('button');
        colorButton.className = 'color-button';
        colorButton.style.backgroundColor = color;

        colorButton.addEventListener('click', () => {
            this.applyBackgroundColor(color);
            this.updateContrastFlag(true);
        });

        bgColorContainer.appendChild(colorButton);
    });

    const bgColorPicker = document.createElement('input');
    bgColorPicker.type = 'color';
    bgColorPicker.id = 'bg-color-picker';
    bgColorPicker.style.padding = "0";
    bgColorPicker.style.width = "revert";

    bgColorPicker.addEventListener('input', () => {
        const selectedColor = bgColorPicker.value;
        this.applyBackgroundColor(selectedColor);
        this.updateContrastFlag(true);
    });

    bgColorContainer.appendChild(bgColorPicker);
    customColorsSection.appendChild(bgLabel);
    customColorsSection.appendChild(bgColorContainer);

    const textLabel = document.createElement('label');
    textLabel.textContent = language[CONFIG.LANGUAGE]['TEXT_COLOR'];

    const textColorContainer = document.createElement('div');
    textColorContainer.className = 'syi-color-picker-container';

    predefinedColors.forEach((color) => {
        const colorButton = document.createElement('button');
        colorButton.className = 'color-button';
        colorButton.style.backgroundColor = color;
        colorButton.addEventListener('click', () => {
            this.applyCustomTextColor(color);
            this.updateContrastFlag(true);
        });
        textColorContainer.appendChild(colorButton);
    });

    const textColorPicker = document.createElement('input');
    textColorPicker.type = 'color';
    textColorPicker.id = 'text-color-picker';
    textColorPicker.style.padding = "0";
    textColorPicker.style.width = "revert";

    textColorPicker.addEventListener('input', () => {
        this.applyCustomTextColor(textColorPicker.value);
        this.updateContrastFlag(true);
    });

    textColorContainer.appendChild(textColorPicker);

    customColorsSection.appendChild(textLabel);
    customColorsSection.appendChild(textColorContainer);

    container.appendChild(customColorsSection);
};

YourInclusion.prototype.applyBackgroundColor = function (color) { 
    const elements = document.querySelectorAll(
        'body *:not(button):not(input):not(.syi-toolbox, .syi-toolbox *):not(.syi-contrast-popup, .syi-contrast-popup *):not(.syi-blue-overlay):not(.syi-extralargebutton):not(img):not(svg):not(video):not(.fa-2x):not(.fa-magnifying-glass-plus):not(.fa-solid)'
    );

    elements.forEach((element) => {
        element.style.background = color;
        element.style.backgroundColor = color;
    });
    this.customBackgroundColor = color;
    

};

YourInclusion.prototype.applyCustomTextColor = function (color) {
    if (color) {
        const excludeToolbarAndPopup = (element) => {
            return (
                !element.closest('.syi-toolbox') && 
                !element.closest('.syi-contrast-popup') 
            );
        };

       
        const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, span, li, a,label, input, textarea'
        );

        textElements.forEach((element) => {
            if (excludeToolbarAndPopup(element)) {
                element.style.color = color; 
            }
        });

        this.customTextColor = color; 
    }
};

YourInclusion.prototype.resetContrast = function () {
    document.body.classList.remove('bright-contrast', 'reverse-contrast', 'grayscale');
    document.body.style.background = '';
    document.body.style.backgroundColor = '';
    document.body.style.color = '';

    const allElements = document.querySelectorAll(
        '*:not(.syi-toolbox):not(.syi-toolbox *):not(.syi-contrast-popup):not(.syi-contrast-popup *)'
    );
    allElements.forEach((element) => {
        element.style.background = '';
        element.style.backgroundColor = '';
        element.style.color = '';
    });

    this.updateContrastFlag(false);
    const checkbox = document.getElementById('mz-switch-rounded');
    if (checkbox) {
        checkbox.checked = false;
    }
};

YourInclusion.prototype.toggleContrastMode = function (mode, button) {
    const isActive = document.body.classList.contains(mode);
    document.body.classList.remove('bright-contrast', 'reverse-contrast', 'grayscale');

    if (!isActive) {
        document.body.classList.add(mode);
        this.updateContrastFlag(true);
    } else {
        this.updateContrastFlag(false); 
    }
    this.updateContrastButtonStates(button, !isActive);
};


YourInclusion.prototype.updateContrastButtonStates = function (clickedButton, isActive) {
    const buttons = document.querySelectorAll('.syi-contrast-mode-button');
    buttons.forEach((button) => {
        if (button === clickedButton && !isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
};

YourInclusion.prototype.updateContrastFlag = function (state) {
    this.contrastModeActive = state;
    this.checkContrastFlagAndSetButton();
};

YourInclusion.prototype.checkContrastFlagAndSetButton = function () {
    this.setActiveButton('contrast-btn', this.contrastModeActive);
};


YourInclusion.prototype.setContrastMode = function (savedState) {
    if (!savedState) return;

    const { contrastMode, bgColor, textColor } = savedState;

    if (contrastMode) {
        document.body.classList.add(contrastMode);
    }

    if (bgColor) {
        document.body.style.backgroundColor = bgColor;
    }

    if (textColor) {
        const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, span, li, a,label, button, input, textarea'
        );
        textElements.forEach((element) => {
            element.style.color = textColor;
        });
    }
};


// Save Function

// Save Toolbar State
YourInclusion.prototype.initSaveFeature = function () {
    const saveButton = document.getElementById('save-settings-btn');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            this.saveToolbarState();
        });
    } else {
       
    }
};
YourInclusion.prototype.saveToolbarState = function () { 
    const stateManager = this.createStateManager('AppState');
    const isExtraLargeToolboxActive = stateManager.getState().isExtraLargeToolboxActive || false;
    const state = {
        blueFilterActive: document.querySelector('.syi-blue-overlay')?.classList.contains('active') || false,
        imagesHidden: this.imagesHidden || false,
        isMuted: this.isMuted || false,
        currentFontSize: this.getCurrentFontSize(),
        originalFontSize: this.originalFontSize || this.getCurrentFontSize(),
        fontSizeChange: this.fontSizeChange || 0,
        nightModeActive: document.body.classList.contains('syi-night-mode') || false,
        zoomLevel: parseFloat(localStorage.getItem('zoomLevel')) || 1,
        textSpacingIndex: this.currentTextSpacingIndex || 0,
        lineHeightIndex: this.currentLineHeightIndex || 0,
        cursorSizeIndex: this.currentCursorSizeIndex || 0,
        accessibleFont: document.body.classList.contains('accessible-font') || false,
        animationsDisabled: document.body.classList.contains('disable-animations') || false,
        contrastMode: this.getContrastMode(),
        customBackgroundColor: this.customBackgroundColor || null, 
        customTextColor: this.customTextColor || null,
        activeButtons: this.getActiveButtons(),
        highlightedLinks: document.querySelector('.highlight-links') !== null,
        highlightedHeaders: document.querySelector('.highlight-headers') !== null,
        selectedHeaderColor: localStorage.getItem('popupHeaderColor') || null,
        popupLanguage: CONFIG.LANGUAGE || 'en-US',
        popupColor: document.getElementById('syi-color-picker')?.value || this.selectedHeaderColor,
        isExtraLargeToolboxActive: isExtraLargeToolboxActive
    };

    localStorage.setItem('toolbarState', JSON.stringify(state));
};

// Load Toolbar State
YourInclusion.prototype.loadToolbarState = function () {
    const savedState = JSON.parse(localStorage.getItem('toolbarState')) || null;

    if (!savedState) {
        
        return;
    }

 
    

    // Restore Blue Filter
    const blueFilterButton = document.getElementById('blue-filter-btn');

    if (blueFilterButton) {
        // Initialize Blue Filter
        this.initBlueFilter();
    
        // Check saved state and toggle accordingly
        if (savedState.blueFilterActive) {
            blueFilterButton.click(); 
        }
    } else {
        console.error('Blue Filter button is missing.');
    }

     // Restore Extra Large Toolbox Mode
     if (savedState.isExtraLargeToolboxActive) {
        this.toggleExtralargeToolbox(); 
        const extraLargeCheckbox = document.getElementById('extra-large-toolbox-checkbox');
        if (extraLargeCheckbox) {
            extraLargeCheckbox.checked = true;
        }
    }
    // Restore Image Visibility
    if (savedState.imagesHidden) {
        this.toggleImages(); 
        this.setActiveButton('remove-images-btn', true);
    }

    // Restore Audio Mute State
    const audioButton = document.getElementById('remove-audio-btn');
if (audioButton) {
    const soundElements = document.querySelectorAll('audio, video');
    const isAlreadyMuted = Array.from(soundElements).every(el => el.muted);

    // Check if the audio button is already active
    const isAudioButtonActive = audioButton.classList.contains('active') || audioButton.dataset.active === 'true';

    if (!isAudioButtonActive && isAlreadyMuted) {
    } else if (!isAudioButtonActive) {
        audioButton.click(); 
    }
}
  
     // Restore Highlight Links
     if (savedState.highlightedLinks) {
        this.highlightContent('links');
        this.setActiveButton('highlight-links-btn', true);
    }

    // Restore Highlight Headers
    if (savedState.highlightedHeaders) {
        this.highlightContent('headers');
        this.setActiveButton('highlight-headers-btn', true);
    }

    // Restore Night Mode
    if (savedState.nightModeActive) {
        setTimeout(() => {
            const nightModeButton = document.getElementById('night-mode-btn');
            if (nightModeButton) {
               
                nightModeButton.click();
            } else {
                
            }
        }, 2000); 
    }

    // Restore Zoom Level
    if (savedState.zoomLevel) {
        this.applyZoom(savedState.zoomLevel);
        this.setActiveButton('zoom-toggle-btn', savedState.zoomLevel !== 1);
    }

    // Restore Text Spacing
    if (typeof savedState.textSpacingIndex !== 'undefined') {
        this.currentTextSpacingIndex = savedState.textSpacingIndex - 1; 
        this.toggleTextSpacing('text-spacing-btn');
    }

    // Restore Line Height
    if (typeof savedState.lineHeightIndex !== 'undefined') {
        this.currentLineHeightIndex = savedState.lineHeightIndex - 1; 
        this.toggleLineHeight('line-height-btn');
    }

    // Restore Cursor Size
    if (typeof savedState.cursorSizeIndex !== 'undefined') {
        this.currentCursorSizeIndex = savedState.cursorSizeIndex - 1; 
        this.toggleCursorSize('cursor-size-btn');
    }
    


    // Blue Filter Logic
   
    if (blueFilterButton) {
       
        this.initBlueFilter();

        // Apply saved state
        if (savedState.blueFilterActive) {
           
            let blueOverlay = document.querySelector('.blue-overlay');
            if (!blueOverlay) {
                blueOverlay = this.createDiv('blue-overlay');
                document.body.appendChild(blueOverlay);
                blueOverlay.classList.add('active');
            }
            this.setActiveButton('blue-filter-btn', true);
        }
    } else {
        console.error('Blue Filter button is missing.');
    }
    

    // Restore Font Size Logic

    this.fontSizeChange = savedState.fontSizeChange || 0;

    if (this.fontSizeChange !== 0) {
        this.simulateFontSizeAdjustment(this.fontSizeChange);
    }

    // Restore Animations
    if (savedState.animationsDisabled) {
        document.body.classList.add('disable-animations');
        this.setActiveButton('stop-animations-btn', true);
    }

      // Restore Highlighted Links and Headers
      if (savedState.highlightedButtons) {
        savedState.highlightedButtons.forEach((buttonId) => {
            const type = buttonId.includes('links') ? 'links' : 'headers';
            this.highlightContent(type);
            this.setActiveButton(buttonId, true);
        });
    }

   // Restore Contrast Mode
   if (savedState.contrastMode) {
    document.body.classList.add(savedState.contrastMode);
}

   // Restore background color
   if (savedState.customBackgroundColor) {
    this.applyBackgroundColor(savedState.customBackgroundColor);
}

    // Restore accessible font state
    if (savedState.accessibleFont) {
        document.body.classList.add('accessible-font');
        this.setActiveButton('accessible-font-btn', true);
    }



  // Restore Custom Text Color
  if (savedState.customTextColor) {
    const textElements = document.querySelectorAll(
        'p, h1, h2, h3, h4, h5, h6, span, li, a, label, button, input, textarea:not(.syi-toolbox):not(.syi-toolbox *)'
    );

    textElements.forEach((element) => {
        if (!element.closest('.syi-toolbox')) { 
            element.style.color = savedState.customTextColor; 
        }
    });
}


    // Activate Saved Buttons
    if (Array.isArray(savedState.activeButtons)) {
        savedState.activeButtons.forEach((buttonId) => this.setActiveButton(buttonId, true));
    }

    //Settings Popup save 
    if (savedState.popupLanguage) {
        CONFIG.LANGUAGE = savedState.popupLanguage;
        this.updateToolbarLanguage();
    }

 // Restore Popup Color
 if (savedState.popupColor) {
    const colorPicker = document.getElementById('syi-color-picker');
    if (colorPicker) {
        colorPicker.value = savedState.popupColor;
    }

    const popupHeader = document.querySelector('.syi-settings-popup-header');
    if (popupHeader) {
        popupHeader.style.backgroundColor = savedState.popupColor;
    }

    // Update the global CSS variable --bg-color
    document.documentElement.style.setProperty('--bg-color', savedState.popupColor, 'important');

    // Ensure Toolbox Icons are Styled
    const applyIconStyles = () => {
        const toolboxIcons = document.querySelectorAll('.syi-toolbox-body svg');
        if (toolboxIcons.length > 0) {
            toolboxIcons.forEach(svg => {
                svg.style.fill = savedState.popupColor;
                svg.style.stroke = savedState.popupColor;
                svg.setAttribute('fill', savedState.popupColor);
                svg.setAttribute('stroke', savedState.popupColor);

                const innerElements = svg.querySelectorAll('*');
                innerElements.forEach(inner => {
                    inner.style.fill = savedState.popupColor;
                    inner.style.stroke = savedState.popupColor;
                    inner.setAttribute('fill', savedState.popupColor);
                    inner.setAttribute('stroke', savedState.popupColor);
                });
            });
        } 
    };
    
    // Check if icons exist; apply styles or wait for them to load
    if (document.querySelectorAll('.syi-toolbox-body svg').length === 0) {
        setTimeout(applyIconStyles, 500); 
    } else {
        applyIconStyles();
    }

    this.updateToolboxColor(popupHeader, savedState.popupColor);
}
};



// Helper Functions
YourInclusion.prototype.simulateFontSizeAdjustment = function (change) {
    const waitForElement = (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const poll = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element with selector "${selector}" not found within timeout.`));
                } else {
                    setTimeout(poll, 100);
                }
            };

            poll();
        });
    };

    const performAdjustment = async () => {
        try {
            const toolbox = await waitForElement('.syi-toolbox');
            const fontSizeButton = await waitForElement('.font-size-btn');
            fontSizeButton.click();
            const fontSizePopup = await waitForElement('.syi-font-size-popup');
            if (fontSizePopup.style.display !== 'block') {
                throw new Error('Font size popup is not visible.');
            };
            const steps = Math.abs(change);
            const isIncrease = change > 0;

            if (steps === 0) {
                return;
            }

            const buttonSelector = isIncrease ? '#increase-font-btn' : '#decrease-font-btn';
            const adjustmentButton = fontSizePopup.querySelector(buttonSelector);

            if (!adjustmentButton) {
                throw new Error(`Button "${buttonSelector}" not found in the popup.`);
            }

            for (let i = 0; i < steps; i++) {
                adjustmentButton.click();
                
            }
            fontSizePopup.style.display = 'none';
            this.isFontSizePopupActive = false;
            
        } catch (error) {
            console.error('Error in simulateFontSizeAdjustment:', error);
        }
    };

    performAdjustment();
};


// Helper function to apply font size change
YourInclusion.prototype.applyFontSizeChange = function (change) {
    const allElements = document.body.querySelectorAll(
        '*:not(.syi-toolbox):not(.syi-toolbox *):not(.font-size-popup):not(.syi-font-size-popup *)'
    );

    if (!this.originalFontSizes) {
        console.error('Original font sizes not initialized.');
        return;
    }

    allElements.forEach((element) => {
        const originalSize = this.originalFontSizes.get(element);
        if (originalSize) {
            const newSize = originalSize + change;
            const clampedSize = Math.min(Math.max(newSize, originalSize - 6), originalSize + 6);
            element.style.fontSize = `${clampedSize}px`;
        }
    });
};



YourInclusion.prototype.getCurrentFontSize = function () {
    const allElements = document.querySelectorAll('body *:not(.syi-toolbox):not(.syi-toolbox *)');
    let totalFontSize = 0;
    let count = 0;

    allElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);

        if (fontSize) {
            totalFontSize += fontSize;
            count++;
        }
    });

    const averageFontSize = count > 0 ? totalFontSize / count : 16;

    return averageFontSize;
};


YourInclusion.prototype.getContrastMode = function () {
    if (document.body.classList.contains('grayscale')) return 'grayscale';
    return null;
};

YourInclusion.prototype.getActiveButtons = function () {
    const buttons = Array.from(document.querySelectorAll('.syi-toolbox-button[data-active="true"]'));
    return buttons.map(button => button.id);
};


YourInclusion.prototype.getHighlightedButtons = function () {
    const highlighted = [];
    if (document.querySelectorAll('.highlight-links.active').length > 0) {
        highlighted.push('highlight-links-btn');
    }
    if (document.querySelectorAll('.highlight-headers.active').length > 0) {
        highlighted.push('highlight-headers-btn');
    }
    return highlighted;
};

YourInclusion.prototype.resetSettings = function () {
    localStorage.removeItem('toolbarState');
    this.resetToolbox();
};



// Setting button functions

YourInclusion.prototype.addSettingsButtonListener = function () {
    const settingsButton = document.getElementById('settings-btn'); 
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            this.createSettingsPopup();
        });
    } else {
        
    }
};

YourInclusion.prototype.createSettingsPopup = function () {
    this.closeAllPopups();
    const stateManager = this.createStateManager('AppState');
    if (document.querySelector('.syi-settings-popup')) return;

    const popup = this.createPopupContainer();
    const header = this.createPopupHeader(language[CONFIG.LANGUAGE]['SETTINGS'], popup);
    const colorPicker = this.createColorPicker(header);;
    const body = this.createPopupBody(header, colorPicker);
    popup.appendChild(header);
    popup.appendChild(body)

    document.body.appendChild(popup);

    stateManager.updateState({ isSettingsPopupActive: true });

    const isToolboxOnLeft = this.determineToolboxPosition(popup);
    this.updatePopupPositions(isToolboxOnLeft);
    const isExtraLargeToolboxActive = stateManager.getState().isExtraLargeToolboxActive;

    if (isExtraLargeToolboxActive) {
        const toggleClassForElements = (selector, className) => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.add(className);
            });
        };

        toggleClassForElements('.syi-settings-popup h3', 'Large-mode');
        toggleClassForElements('.syi-settings-popup-body label', 'Large-mode');
        toggleClassForElements('.popup-reset', 'Large-mode');
    }
};
YourInclusion.prototype.createPopupContainer = function () {
    const popup = this.createDiv('syi-settings-popup');
    popup.style.position = 'absolute';
    popup.style.top = '19%';
    return popup;
};

YourInclusion.prototype.createPopupHeader = function (titleText, popup) {
    const header = this.createDiv('syi-settings-popup-header');
    const headerTitle = this.createHeading(3, titleText, 'syi-settings-popup-title');
    const closeButton = this.createSettingsPopupCloseButton(popup);
    header.appendChild(headerTitle);
    header.appendChild(closeButton);
    return header;
};
YourInclusion.prototype.updateToolbarLanguage = function () {
    // Update header title
    const headerTitle = document.querySelector('.syi-toolbox-title');
    if (headerTitle) {
        headerTitle.innerText = language[CONFIG.LANGUAGE]['SITE_TITLE'];
    }

    // Update buttons dynamically
    const buttonsConfig = [
        { id: 'blue-filter-btn', textKey: 'BLUE_FILTER' },
        { id: 'contrast-btn', textKey: 'CONTRAST_MODES' },
        { id: 'remove-images-btn', textKey: 'REMOVE_IMAGES' },
        { id: 'font-size-btn', textKey: 'FONT_SIZE' },
        { id: 'night-mode-btn', textKey: 'NIGHT_MODE' },
        { id: 'text-spacing-btn', textKey: 'TEXT_SPACING' },
        { id: 'line-height-btn', textKey: 'LINE_HEIGHT' },
        { id: 'remove-audio-btn', textKey: 'REMOVE_AUDIO' },
        { id: 'highlight-links-btn', textKey: 'HIGHLIGHT_LINKS' },
        { id: 'highlight-headers-btn', textKey: 'HIGHLIGHT_HEADERS' },
        { id: 'stop-animations-btn', textKey: 'STOP_ANIMATIONS' },
        { id: 'zoom-toggle-btn', textKey: 'ZOOM_TOGGLE' },
        { id: 'cursor-size-btn', textKey: 'CURSOR_SIZE' },
        { id: 'accessible-font-btn', textKey: 'ACCESSIBLE_FONT' },
        { id: 'read-aloud-btn', textKey: 'READ_ALOUD' },
        { id: 'keyboard-navigation-btn', textKey: 'KEYBOARD-NAVIGATION'},
        { id: 'reset-btn1', textKey: 'RESET' },
        { id: 'save-settings-btn', textKey: 'SAVE_SETTINGS' },
    ];

    buttonsConfig.forEach(({ id, textKey }) => {
        const button = document.getElementById(id);
        if (button) {
            const textWrapper = button.querySelector('.text-wrapper');
            if (textWrapper) {
                textWrapper.innerText = language[CONFIG.LANGUAGE][textKey] || textKey;
            }
        }
    });
    const superSizedTitle = document.querySelector('.syi-extralarge-title');
    if (superSizedTitle) {
        superSizedTitle.innerText = language[CONFIG.LANGUAGE]['SUPER_SIZED_WIDGET'] || 'Super Sized Widget';
    }
    const settingsPopup = document.querySelector('.syi-settings-popup');
    if (!settingsPopup) return;

    const popupTitle = settingsPopup.querySelector('.syi-settings-popup-title');
    if (popupTitle) {
        popupTitle.innerText = language[CONFIG.LANGUAGE]['SETTINGS'];
    }

    const languageLabel = settingsPopup.querySelector('label[for="language-select"]');
    if (languageLabel) {
        languageLabel.innerText = language[CONFIG.LANGUAGE]['SELECT_LANGUAGES'];
    }

    const colorPickerLabel = settingsPopup.querySelector('.syi-color-picker-label');
    if (colorPickerLabel) {
        colorPickerLabel.innerText = language[CONFIG.LANGUAGE]['PICK_COLOR'];
    }

    const resetButton = settingsPopup.querySelector('.popup-reset');
    if (resetButton) {
        resetButton.innerText = language[CONFIG.LANGUAGE]['RESET'];
    }

    const fontSizePopup = document.querySelector('.syi-font-size-popup');
    if (fontSizePopup) {
        fontSizePopup.remove();
    }

    const readAloudToolbar = document.getElementById('read-aloud-toolbar');
    if (readAloudToolbar) {
        readAloudToolbar.remove();
        this.createReadAloudToolbar(); 
    }
    const keyboardnavpopup = document.querySelector('#keyboard-navigation-popup');
    if (keyboardnavpopup) {
        keyboardnavpopup.remove();
        this.showKeyboardNavigationPopup();
    }
};

YourInclusion.prototype.createLanguageSelector = function () {
    const languageSelector = this.createDiv('popup-section');

    const languageLabel = this.createEle('label', { for: 'language-select' }, language[CONFIG.LANGUAGE]['SELECT_LANGUAGES']);
    const languageDropdown = this.createEle('select', { id: 'language-select' });

    languageDropdown.innerHTML = `
        <option value="en-US" ${CONFIG.LANGUAGE === 'en-US' ? 'selected' : ''}>English</option>
        <option value="de-DE" ${CONFIG.LANGUAGE === 'de-DE' ? 'selected' : ''}>German</option>
    `;

    languageDropdown.addEventListener('change', (event) => {
        CONFIG.LANGUAGE = event.target.value;
        this.updateToolbarLanguage();
    });

    languageSelector.appendChild(languageLabel);
    languageSelector.appendChild(languageDropdown);
    return languageSelector;
};

// Function to create the color picker
YourInclusion.prototype.createColorPicker = function (header) {
    const colorPicker = this.createDiv('popup-section');

    const colorLabel = this.createEle('label', { class: 'syi-color-picker-label' }, language[CONFIG.LANGUAGE]['PICK_COLOR']);

    const colorPickerContainer = this.createDiv('syi-color-picker-container');

    const savedColor = this.getSavedColor() || "#393636";
    const colorInput = this.createEle('input', { type: 'color', id: 'syi-color-picker', value: savedColor });
    const colorCodeInput = this.createEle('input', { 
        type: 'text', 
        id: 'color-code', 
        value: savedColor, 
        readonly: true, 
        class: 'syi-color-code-input' 
    });
    colorInput.addEventListener('input', (event) => {
        const selectedColor = event.target.value;
        this.updateToolboxColor(header, selectedColor); 
        colorCodeInput.value = selectedColor; 
        this.saveColor(selectedColor); 
        var Color = selectedColor;

    });
    colorPickerContainer.appendChild(colorInput);
    colorPickerContainer.appendChild(colorCodeInput);
    colorPicker.appendChild(colorLabel);
    colorPicker.appendChild(colorPickerContainer);

    return colorPicker;
};
YourInclusion.prototype.createPopupBody = function (header, colorPicker) {
    const body = this.createDiv('syi-settings-popup-body'); 

    
    const languageSelector = this.createLanguageSelector();
    const ColorPicker = this.createColorPicker();
    const resetbutton = this.createPopupResetButton(header, colorPicker);
    body.appendChild(languageSelector);
    body.appendChild(ColorPicker);
    body.appendChild(resetbutton);

    return body;
};


YourInclusion.prototype.getSavedColor = function () {
    return localStorage.getItem('selectedColor'); 
};

// Method to save the selected color
YourInclusion.prototype.saveColor = function (color) {
    localStorage.setItem('selectedColor', color); 
};



// Function to create the reset button
YourInclusion.prototype.createPopupResetButton = function (header, colorPicker) {
    const resetButton = this.createEle('button', { class: 'popup-reset' },  language[CONFIG.LANGUAGE]['RESET']);
    resetButton.style.color = 'white';

    resetButton.addEventListener('click', () => {
        this.resetPopupSettings(header, colorPicker);
    });

    return resetButton;
};

// Function to reset the popup settings
YourInclusion.prototype.resetPopupSettings = function (header, colorPicker) {

    const defaultSettings = (() => {
        const storedConfig = localStorage.getItem('config');
        if (storedConfig) {
            const config = JSON.parse(storedConfig);
            return { 
                color: config.colorCode || this.selectedHeaderColor, 
                language: config.languageIsoCode || CONFIG.LANGUAGE 
            };
        } else {
            console.warn("No config found in local storage. Using default settings.");
            return { 
                color: this.selectedHeaderColor, 
                language: CONFIG.LANGUAGE 
            };
        }
    })();

    // Reset the popup header color
    if (header) {
        header.style.backgroundColor = defaultSettings.color;
    }

    // Reset the color picker value
    if (colorPicker) {
        const colorPickerInput = colorPicker.querySelector('#syi-color-picker');
        if (colorPickerInput) {
            colorPickerInput.value = defaultSettings.color;
        }
    }

    // Reset the toolbox header color
    const toolboxHeader = document.querySelector('.syi-toolbox-header');
    if (toolboxHeader) {
        toolboxHeader.style.backgroundColor = defaultSettings.color;
    }

    // Reset the icons' colors
    const toolboxIcons = document.querySelectorAll('.syi-toolbox-body svg');
    toolboxIcons.forEach(svg => {
        svg.style.fill = defaultSettings.color;
        svg.style.stroke = defaultSettings.color;

        const innerElements = svg.querySelectorAll('*');
        innerElements.forEach(inner => {
            inner.style.fill = defaultSettings.color;
            inner.style.stroke = defaultSettings.color;
        });
    });

    // Reset the toolbox buttons
    const toolboxButtons = document.querySelectorAll('.syi-toolbox-body .syi-toolbox-btn, .syi-toolbox-button');
    toolboxButtons.forEach(button => {
        button.style.backgroundColor = defaultSettings.color;
        button.style.borderColor = defaultSettings.color;
        button.style.color = defaultSettings.color;
    });

    // Reset the language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = defaultSettings.language;
    }
    const savedState = JSON.parse(localStorage.getItem('toolbarState')) || {};
    savedState.popupColor = defaultSettings.color;
    localStorage.setItem('toolbarState', JSON.stringify(savedState));

    // Reset the CSS variable
    document.documentElement.style.setProperty('--bg-color', defaultSettings.color, 'important');
};

YourInclusion.prototype.createSettingsPopupCloseButton = function (popup) {
    const stateManager = this.createStateManager('AppState');
    const closeButton = this.createEle('button', { class: 'popup-close' });
    const icon = this.createEle('i', { class: 'fas fa-times' }); 
    closeButton.appendChild(icon);
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        popup.remove();
        stateManager.updateState({ isSettingsPopupActive: false });
    });
    return closeButton;
};


// Function to update toolbox and popup colors dynamically
YourInclusion.prototype.updateToolboxColor = function (header, color) {
    const selectedColor = color || this.selectedHeaderColor || '#393636';

    if (header) {
        header.style.backgroundColor = selectedColor;
    }

    const toolboxHeaders = document.querySelectorAll('.syi-toolbox-header, .syi-settings-popup-header');
    toolboxHeaders.forEach(header => {
        header.style.setProperty('background-color', selectedColor, 'important');
    });

    const toolboxIcons = document.querySelectorAll('.syi-toolbox-body svg');
    toolboxIcons.forEach(svg => {
        svg.style.removeProperty('fill');
        svg.style.removeProperty('stroke');
        svg.style.fill = selectedColor;
        svg.style.stroke = selectedColor;

        const innerElements = svg.querySelectorAll('*');
        innerElements.forEach(inner => {
            inner.style.removeProperty('fill');
            inner.style.removeProperty('stroke');
            inner.style.fill = selectedColor;
            inner.style.stroke = selectedColor;
        });
    });

    const toolboxButtons = document.querySelectorAll('.syi-toolbox-body .syi-toolbox-btn, .syi-toolbox-button');
    toolboxButtons.forEach(button => {
        button.style.backgroundColor = selectedColor;
        button.style.borderColor = selectedColor;
    });

    const root = document.documentElement; 
    root.style.setProperty('--bg-color', selectedColor, 'important');

    this.selectedHeaderColor = selectedColor; 
};

// Function to determine toolbox position
YourInclusion.prototype.determineToolboxPosition = function (popup) {
    const toolbox = document.querySelector('.syi-toolbox');
    const toolboxRect = toolbox.getBoundingClientRect();
    const isToolboxOnLeft = toolboxRect.left < window.innerWidth / 2;

    popup.style.left = isToolboxOnLeft ? '28%' : '71%';
    return isToolboxOnLeft;
};



// Popup Close
YourInclusion.prototype.closeAllPopups = function (excludeSelector) {
    const popupSelectors = ['.syi-settings-popup', '.syi-contrast-popup', '.syi-font-size-popup']; 
    const stateManager = this.createStateManager('AppState');
    popupSelectors.forEach((selector) => {
        if (selector !== excludeSelector) {
            const popup = document.querySelector(selector);
            if (popup) {
                if (!popup.matches('.syi-toolbox-body') && !popup.closest('.syi-toolbox-body')) {
                    if (selector === '.syi-font-size-popup') {
                        const closeButton = popup.querySelector('#close-font-popup');
                        if (closeButton) {
                            closeButton.addEventListener('click', (event) => {
                                event.stopPropagation(); 
                                popup.style.display = 'none';
                            });
                            closeButton.click(); 
                                stateManager.updateState({
                                    isFontSizePopupActive: false,
                                    isSettingsPopupActive: false,
                                    isContrastPopupActive: false,
                                });
                        }
                    } else {
                        popup.remove(); 
                    }
                }
            }
        }
    });
};

/***
 * Remove Audio
 */

YourInclusion.prototype.initAudioRemoval = function () {
    const audioRemovalButton = document.getElementById('remove-audio-btn');
    if (audioRemovalButton) {
        audioRemovalButton.addEventListener('click', () => {
            this.audioRemoval(); 
            this.setActiveButton('remove-audio-btn', this.isMuted); 
            this.saveToolbarState();
        });

        // Restore state on initialization
        const savedState = JSON.parse(localStorage.getItem('toolbarState')) || {};
        if (savedState.isMuted) {
            this.isMuted = savedState.isMuted;
            this.audioRemoval(true); 
            this.setActiveButton('remove-audio-btn', this.isMuted); 
        }
    }
};;


// Toggle Audio Mute/Unmute
YourInclusion.prototype.audioRemoval = function (applyOnly = false) {
    const soundElements = document.querySelectorAll('audio, video');
    if (!applyOnly) {
        this.isMuted = !this.isMuted; 
    }
    soundElements.forEach(element => {
        element.muted = this.isMuted; 
    });
    
};

/***
 * HightLight Functions
 */
YourInclusion.prototype.initHighlightButtons = function () {
    const highlightLinksButton = document.getElementById('highlight-links-btn');
    if (highlightLinksButton) {
        highlightLinksButton.addEventListener('click', () => {
            this.highlightContent('links');
            this.setActiveButton('highlight-links-btn');
        });
    }

    const highlightHeadersButton = document.getElementById('highlight-headers-btn');
    if (highlightHeadersButton) {
        highlightHeadersButton.addEventListener('click', () => {
            this.highlightContent('headers');
            this.setActiveButton('highlight-headers-btn');
        });
    }

    const highlightImagesButton = document.getElementById('highlight-images-btn');
    if (highlightImagesButton) {
        highlightImagesButton.addEventListener('click', () => {
            this.highlightContent('images');
            this.setActiveButton('highlight-images-btn');
        });
    }
};

YourInclusion.prototype.highlightContent = function (type) {
    const highlightClass = `highlight-${type}`;

    let selector;
    if (type === 'links') {
        selector = 'a';
    } else if (type === 'headers') {
        selector = 'h1, h2, h3, h4, h5, h6';
    } else if (type === 'images') {
        selector = 'img';
    } else {
        console.warn('Invalid type for highlightContent');
        return;
    }

    // Select all elements of the given type
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
        console.warn(`No ${type} found to highlight.`);
        return;
    }

    elements.forEach(element => {
        if (type === 'images') {
            const wrapperExists = element.parentNode.classList.contains(highlightClass);
            if (!wrapperExists) {
                const wrapper = document.createElement('div');
                wrapper.className = highlightClass;
                element.parentNode.insertBefore(wrapper, element);
                wrapper.appendChild(element);

                const altText = element.alt || 'No title available';
                const titleSpan = document.createElement('span');
                titleSpan.textContent = altText;
                wrapper.appendChild(titleSpan);
            } else {
                const wrapper = element.parentNode;
                wrapper.replaceWith(...wrapper.childNodes);
            }
        } else {
            element.classList.toggle(highlightClass);
        }
    });

  
};
YourInclusion.prototype.getHighlightedButtons = function () {
    const highlighted = [];
    const highlightButtons = document.querySelectorAll('.highlight-links, .highlight-headers, .highlight-images');
    highlightButtons.forEach((button) => {
        if (button.classList.contains('active')) {
            highlighted.push(button.id);
        }
    });
    return highlighted;
};

/***
 * Stop Animation
 */

// Stop Animation Functionality
YourInclusion.prototype.stopAnimations = function () {
    const isDisabled = document.body.classList.toggle('disable-animations'); 
    localStorage.setItem('animationsDisabled', isDisabled);
    if (isDisabled) {
        this.setActiveButton('stop-animations-btn', true);  
    } else {
        this.setActiveButton('stop-animations-btn', false); 
    }
};;

// Restore Animation State on Load
YourInclusion.prototype.stopAnimations = function () {
    const isDisabled = document.body.classList.toggle('disable-animations'); 

    // Persist the state in localStorage
    localStorage.setItem('animationsDisabled', isDisabled);

    // Toggle the active button state using setActiveButton
    if (isDisabled) {
        this.setActiveButton('stop-animations-btn', true);  // Activate button
    } else {;
        this.setActiveButton('stop-animations-btn', false); 
    }
};

// Add Stop Animations Button Listener
YourInclusion.prototype.initStopAnimationsButton = function () {
    const stopAnimationsButton = document.getElementById('stop-animations-btn');
    if (stopAnimationsButton) {
        stopAnimationsButton.addEventListener('click', this.stopAnimations.bind(this));
    }
};

// Initialize the app and restore state
YourInclusion.prototype.initialApp = function () {
    this.restoreAnimationState();
};

/***
 * Zoom
 */
YourInclusion.prototype.initZoomToggleFeature = function () {
    this.zoomStates = [1, 1.1, 1.2, 1.3]; 
    this.zoomIndex = 0; 

    const zoomToggleButton = document.getElementById('zoom-toggle-btn');
    if (zoomToggleButton) {
        zoomToggleButton.addEventListener('click', this.toggleZoom.bind(this));
    }

    this.restoreZoomState();
};

// Toggle Zoom Function
YourInclusion.prototype.toggleZoom = function () {
    this.zoomIndex = (this.zoomIndex + 1) % this.zoomStates.length; 
    const zoomLevel = this.zoomStates[this.zoomIndex];
    this.applyZoom(zoomLevel);
    const stateManager = this.createStateManager('AppState');
    const currentState = stateManager.getState();
    let newZoomIncrement = currentState.zoomIncrement;
    if (zoomLevel === 1) {
        newZoomIncrement = 0; 
    } else {
        newZoomIncrement += 1; 
    }

    stateManager.updateState({
        zoomLevel: zoomLevel,
        zoomIncrement: newZoomIncrement
    });

    this.updateZoomButtonProgressBar('zoom-toggle-btn', this.zoomIndex);
    const isActive = zoomLevel !== 1; 

    this.setActiveButton('zoom-toggle-btn', isActive);
};

YourInclusion.prototype.applyZoom = function (zoomLevel) {
    const body = document.body;
    body.style.zoom = zoomLevel;
    const excludedElements = document.querySelectorAll('#syi-toolbox, #openToolboxButton, #read-aloud-toolbar');
    excludedElements.forEach(element => {
        
        element.style.zoom = 'none';
    });

};

// Restore Zoom State
YourInclusion.prototype.restoreZoomState = function () {
    const savedZoomLevel = parseFloat(localStorage.getItem('zoomLevel')) || 1; 
    this.applyZoom(savedZoomLevel);
    this.zoomIndex = this.zoomStates.indexOf(savedZoomLevel);
    if (this.zoomIndex === -1) this.zoomIndex = 0; 
    const isActive = savedZoomLevel !== 1; 
    this.setActiveButton('zoom-toggle-btn', isActive);
};

// Save Zoom State
YourInclusion.prototype.saveZoomState = function (zoomLevel) {
    localStorage.setItem('zoomLevel', zoomLevel);
};




/***
 * Accessible Function
 */

YourInclusion.prototype.initAccessibleFontToggle = function () {
    const fontToggleButton = document.getElementById('accessible-font-btn');
    if (fontToggleButton) {
        fontToggleButton.addEventListener('click', () => {
            this.toggleAccessibleFont('accessible-font-btn');
            
        });
    } 
};

YourInclusion.prototype.toggleAccessibleFont = function (buttonId) {
    
    const isFontApplied = document.body.classList.toggle('syi-accessible-font');
    this.setActiveButton(buttonId, isFontApplied);
   
};


/***
 * Cursor Size
 */
YourInclusion.prototype.initCursorSizeAdjustment = function () {
    const cursorSizeButton = document.getElementById('cursor-size-btn');
    if (cursorSizeButton) {
        cursorSizeButton.addEventListener('click', () => {
            this.toggleCursorSize('cursor-size-btn');
        });
    }
};

YourInclusion.prototype.toggleCursorSize = function (buttonId) {
    const cursorSizes = [
        {
            size: 'normal',
            cursor: 'auto', 
            label: 'Normal',
            icon: '<i class="fas fa-mouse-pointer"></i>',
        },
        {
            size: 'medium',
            cursor: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="40" width="27.5" viewBox="0 0 320 512"><path fill="%23e0e0e0" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>') 40 40, auto`,
            label: 'Medium',
            icon: '<i class="fas fa-expand-alt"></i>',
        },
        {
            size: 'large',
            cursor: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="60" width="37.5" viewBox="0 0 320 512"><path fill="%23e0e0e0" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>') 70 70, auto`,
            label: 'Large',
            icon: '<i class="fas fa-expand"></i>',
        },
        {
            size: 'medium',
            cursor: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="40" width="27.5" viewBox="0 0 320 512"><path fill="%23000000" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>') 20 20, auto`,
            label: 'Medium Black',
            icon: '<i class="fas fa-circle"></i>',
        },
        {
            size: 'large',
            cursor: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="60" width="37.5" viewBox="0 0 320 512"><path fill="%23000000" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>') 30 30, auto`,
            label: 'Large Black',
            icon: '<i class="fas fa-circle-notch"></i>',
        },
        
    ];
    
    if (this.currentCursorSizeIndex === undefined) this.currentCursorSizeIndex = 0;
    this.currentCursorSizeIndex = (this.currentCursorSizeIndex + 1) % cursorSizes.length;
    const selectedCursor = cursorSizes[this.currentCursorSizeIndex];

    // Retrieve color from config stored in local storage
    const storedConfig = JSON.parse(localStorage.getItem('config'));
    const cursorColor = storedConfig?.BACKGROUND_COLOR || '#393636'; 

    // Apply the custom cursor globally
    document.documentElement.style.cursor = selectedCursor.cursor;

    // Dynamically exclude the toolbox
    const toolbox = document.querySelector('.syi-toolbox');
    if (toolbox) {
        toolbox.style.cursor = 'auto';

        const rect = toolbox.getBoundingClientRect();
        const style = document.documentElement.style;

        style.setProperty('--toolbox-top', `${rect.top}px`);
        style.setProperty('--toolbox-left', `${rect.left}px`);
        style.setProperty('--toolbox-width', `${rect.width}px`);
        style.setProperty('--toolbox-height', `${rect.height}px`);
    }
    const cursorExcludeStyle = document.getElementById('cursor-exclude-style');
    if (!cursorExcludeStyle) {
        const style = document.createElement('style');
        style.id = 'cursor-exclude-style';
        style.innerHTML = `
            .syi-toolbox {
                cursor: auto !important;
            }
            body {
                cursor: var(--cursor) !important;
            }
        `;
        document.head.appendChild(style);
        
    }

    const stateManager = this.createStateManager('AppState');
    const currentState = stateManager.getState();

    let newCursorSizeIncrement = currentState.cursorSizeIncrement || 0;

    // Reset the counter when 'normal' cursor size is selected
    if (selectedCursor.size === 'normal') {
        newCursorSizeIncrement = 0;
    } else {
        newCursorSizeIncrement += 1;
    }

    // Update the state with the new increment
    stateManager.updateState({
        cursorSizeIncrement: newCursorSizeIncrement
    });
    


    const button = document.getElementById(buttonId);
    if (button) {
        const parser = new DOMParser();
        const iconElement = parser.parseFromString(selectedCursor.icon, 'image/svg+xml').documentElement;

        // Apply color to the SVG
        if (iconElement) {
            iconElement.setAttribute('fill', cursorColor);
            iconElement.setAttribute('stroke', cursorColor);

            const innerElements = iconElement.querySelectorAll('*');
            innerElements.forEach(inner => {
                inner.setAttribute('fill', cursorColor);
                inner.setAttribute('stroke', cursorColor);
            });

            const svgHTML = new XMLSerializer().serializeToString(iconElement);

            button.innerHTML = `${svgHTML} ${selectedCursor.label}`;
        }
    }
    this.updateCursorSizeProgressBar(buttonId, newCursorSizeIncrement);
};
// Read Aloud
// Initialize Read Aloud Feature
YourInclusion.prototype.initReadAloud = function () {
    const readAloudBtn = document.getElementById('read-aloud-btn');
    if (readAloudBtn) {
        readAloudBtn.addEventListener('click', () => {
            this.toggleReadAloud('read-aloud-btn');
        });
    }
    this.currentSpeed = parseFloat(localStorage.getItem('readAloudSpeed')) || 1;
    this.currentVolume = parseFloat(localStorage.getItem('readAloudVolume')) || 1;
     this.readElementsCache = new WeakSet();
    const isReadAloudActive = localStorage.getItem('readAloudActive') === 'true';
    if (isReadAloudActive) {
        this.enableDefaultClickToRead();
        this.createReadAloudToolbar(); 
        this.setActiveButton('read-aloud-btn', true);
    }
};

YourInclusion.prototype.toggleReadAloud = function (buttonId) {
    const toolbar = document.getElementById('read-aloud-toolbar');
    const isActive = this.isReadAloudActive || false;

    if (isActive) {
  
        this.disableDefaultClickToRead(); 
        this.disableCursorReadAloud(); 
        this.stopReadAloud(); 

        const popup = document.getElementById('read-aloud-toolbar');
        if (popup) {
            popup.remove(); 
        }

        this.setActiveButton(buttonId, false); 
        this.isReadAloudActive = false; 
        this.isCursorReadAloudActive = false;
        localStorage.setItem('readAloudActive', false); 

    } else {
        
        if (!toolbar) {
            this.createReadAloudToolbar(); 
        } else {
            toolbar.classList.remove('hidden'); 
        }

        this.enableDefaultClickToRead();
        this.disableCursorReadAloud();
        this.setActiveButton(buttonId, true); 

        this.isReadAloudActive = true; 
        this.isCursorReadAloudActive = false; 
        localStorage.setItem('readAloudActive', true); 

    }
};

// Create the Read Aloud Toolbar
YourInclusion.prototype.createReadAloudToolbar = function () {
    const toolbox = document.getElementById('syi-toolbox');
    const stateManager = this.createStateManager('AppState');
    if (!toolbox || !toolbox.classList.contains('visible')) {
        const existingToolbar = document.getElementById('read-aloud-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
        }
        return; 
    }

    // Check if the toolbar already exists
    const existingToolbar = document.getElementById('read-aloud-toolbar');
    if (existingToolbar) {
        return;
    }

    // Create toolbar wrapper
    const toolbar = document.createElement('div');
    toolbar.id = 'read-aloud-toolbar';
    toolbar.className = 'read-aloud-toolbar';

    // Toolbar Header
    const header = document.createElement('div');
    header.className = 'toolbar-header';

    const title = document.createElement('h5');
    title.className = 'toolbar-title';
    title.textContent = language[CONFIG.LANGUAGE]['READ-ALOUD'];

    const closeButton = document.createElement('button');
    closeButton.id = 'close-toolbar';
    closeButton.textContent = '✖';
    closeButton.addEventListener('click', () => {
        this.closeReadAloud();
        this.setActiveButton('read-aloud-btn', false);
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    toolbar.appendChild(header);

    // Toolbar Controls
    const controls = document.createElement('div');
    controls.className = 'toolbar-controls';

    // Cursor Read Aloud Section
    const cursorSection = document.createElement('div');
    cursorSection.className = 'cursor-section';

    const cursorLabel = document.createElement('span');
    cursorLabel.className = 'cursor-label';
    cursorLabel.textContent = language[CONFIG.LANGUAGE]['CURSOR-READ-ALOUD'];

    const cursorToggleWrapper = document.createElement('div');
    cursorToggleWrapper.className = 'cursor-toggle-wrapper';

    const cursorInput = document.createElement('input');
    cursorInput.type = 'checkbox';
    cursorInput.id = 'cursor-read-aloud';
    cursorInput.className = 'hidden-toggle';
    cursorInput.style.visibility = "hidden";
    cursorInput.style.position = "absolute";

    const cursorSwitch = document.createElement('label');
    cursorSwitch.htmlFor = 'cursor-read-aloud';
    cursorSwitch.className = 'switch';
    cursorInput.addEventListener('change', (event) => {
    const isChecked = event.target.checked; 
    if (isChecked) {
        this.enableCursorReadAloud(); 
        this.isCursorReadAloudActive = true; 
    } else {
        this.disableCursorReadAloud();
        this.isCursorReadAloudActive = false;
    }
});
    

    cursorToggleWrapper.appendChild(cursorInput);
    cursorToggleWrapper.appendChild(cursorSwitch);
    cursorSection.appendChild(cursorLabel);
    cursorSection.appendChild(cursorToggleWrapper);
    

    // Website Read Aloud Section
    const websiteSection = document.createElement('div');
    websiteSection.className = 'website-section';

    const websiteLabel = document.createElement('span');
    websiteLabel.className = 'website-label';
    websiteLabel.textContent = language[CONFIG.LANGUAGE]['WEBSITE-READ-ALOUD'];

    const playbackControls = document.createElement('div');
    playbackControls.className = 'playback-controls';

    const previousButton = document.createElement('button');
    previousButton.id = 'previous-line-btn';
    previousButton.textContent = '⏮';
    previousButton.addEventListener('click', this.readPreviousLine.bind(this));

    const playButton = document.createElement('button');
    playButton.id = 'play-read-btn';
    playButton.textContent = '▶';
    playButton.addEventListener('click', () => {
        if (this.isReadAloudActive) {
            this.stopAllReadAloud();
            playButton.textContent = '▶';  
        } else {
            this.playReadAloud();
            playButton.textContent = '⏸️';  
            playButton.style.setProperty('color', 'black', 'important');
        }
    });

    const stopButton = document.createElement('button');
    stopButton.id = 'stop-read-btn';
    stopButton.textContent = '⏹';
    stopButton.addEventListener('click', this.stopAllReadAloud.bind(this));

    const nextButton = document.createElement('button');
    nextButton.id = 'next-line-btn';
    nextButton.textContent = '⏭';
    nextButton.addEventListener('click', this.readNextLine.bind(this));

    playbackControls.appendChild(previousButton);
    playbackControls.appendChild(playButton);
    playbackControls.appendChild(stopButton);
    playbackControls.appendChild(nextButton);

    websiteSection.appendChild(websiteLabel);
    websiteSection.appendChild(playbackControls);

    // Speed Section
    const speedSection = document.createElement('div');
    speedSection.className = 'speed-section';

    const speedLabel = document.createElement('span');
    speedLabel.className = 'speed-label';
    speedLabel.textContent = language[CONFIG.LANGUAGE]['SPEED'];

    const speedWrapper = document.createElement('div');
    speedWrapper.className = 'speed-wrapper';

    const minusButton = document.createElement('button');
    minusButton.className = 'speed-minus';

    const minusIcon = document.createElement('i');
    minusIcon.className = 'fas fa-minus'; 
    minusButton.appendChild(minusIcon);

    minusButton.addEventListener('click', () => {
        this.currentSpeed = Math.max(this.currentSpeed - 0.1, 0.5);
        speedDisplay.textContent = this.currentSpeed.toFixed(1);
    });

    const speedDisplay = document.createElement('span');
    speedDisplay.className = 'speed-display';
    speedDisplay.textContent = (this.currentSpeed || 1).toFixed(1);

    const plusButton = document.createElement('button');
    plusButton.className = 'speed-plus';

    const plusIcon = document.createElement('i');
    plusIcon.className = 'fas fa-plus'; 
    plusButton.appendChild(plusIcon);
    
    plusButton.addEventListener('click', () => {
        this.currentSpeed = Math.min(this.currentSpeed + 0.1, 2);
        speedDisplay.textContent = this.currentSpeed.toFixed(1);
    });

    speedWrapper.appendChild(minusButton);
    speedWrapper.appendChild(speedDisplay);
    speedWrapper.appendChild(plusButton);
    speedSection.appendChild(speedLabel);
    speedSection.appendChild(speedWrapper);

    // Volume Section
    const volumeSection = document.createElement('div');
    volumeSection.className = 'volume-section';

    const volumeLabel = document.createElement('span');
    volumeLabel.className = 'volume-label';
    volumeLabel.textContent = language[CONFIG.LANGUAGE]['VOLUME'];

    const volumeWrapper = document.createElement('div');
    volumeWrapper.className = 'volume-wrapper';

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.1';
    volumeSlider.value = this.currentVolume || 1;
    volumeSlider.className = 'volume-slider';

    const volumeDisplay = document.createElement('span');
    volumeDisplay.className = 'volume-display';
    volumeDisplay.textContent = `${Math.round((this.currentVolume || 1) * 100)}%`;

    volumeSlider.addEventListener('input', (e) => {
        this.currentVolume = parseFloat(e.target.value);
        volumeDisplay.textContent = `${Math.round(this.currentVolume * 100)}%`;

        const sliderPercentage = this.currentVolume * 100;
        volumeSlider.style.background = `linear-gradient(to right, #0078d7 ${sliderPercentage}%, #ddd ${sliderPercentage}%)`;
    });

    volumeWrapper.appendChild(volumeSlider);
    volumeWrapper.appendChild(volumeDisplay);
    volumeSection.appendChild(volumeLabel);
    volumeSection.appendChild(volumeWrapper);

    const divider = () => {
        const div = document.createElement('div');
        div.className = 'vertical-divider';
        return div;
    };

    controls.appendChild(cursorSection);
    controls.appendChild(divider());
    controls.appendChild(websiteSection);
    controls.appendChild(divider());
    controls.appendChild(speedSection);
    controls.appendChild(divider());
    controls.appendChild(volumeSection);
    toolbar.appendChild(controls);
    document.body.appendChild(toolbar);
    const isExtraLargeToolboxActive = stateManager.getState().isExtraLargeToolboxActive;

    if (isExtraLargeToolboxActive) {
        const toggleClassForElements = (selector, className) => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.add(className);
            });
        };
        toggleClassForElements('.read-aloud-toolbar', 'Large-mode');
    toggleClassForElements('.cursor-label', 'Large-mode');
    toggleClassForElements('.website-label', 'Large-mode');
    toggleClassForElements('.speed-label', 'Large-mode');
    toggleClassForElements('.volume-label', 'Large-mode');
}

};
YourInclusion.prototype.closeReadAloud = function () {
    // Simulate clicking the Read Aloud button if it exists
    const readAloudButton = document.getElementById('read-aloud-btn');
    if (readAloudButton) {
        readAloudButton.click();
    }

    // Remove any highlights on the page
    const highlightedElements = document.querySelectorAll('.highlighted');
    highlightedElements.forEach(element => {
        element.classList.remove('highlighted');
    });

    const toolbar = document.getElementById('read-aloud-toolbar');
    if (toolbar) {
        toolbar.remove()
    }
    this.stopReadAloud();

};


YourInclusion.prototype.createSliderControl = function (labelText, id, min, max, step, value, onInput) {
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';
    const label = document.createElement('label');
    label.htmlFor = id;
    label.className = 'slider-label';
    label.textContent = labelText;
    const input = document.createElement('input');
    input.type = 'range';
    input.id = id;
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;
    input.addEventListener('input', onInput);
    wrapper.appendChild(label);
    wrapper.appendChild(input);

    return wrapper;
};
// Helper Function to Highlight Text
YourInclusion.prototype.highlightText = function (element, start, length) {
    const text = element.dataset.originalText || element.innerText || '';
    const before = text.slice(0, start);
    const highlight = text.slice(start, start + length);
    const after = text.slice(start + length);

    if (!element.dataset.originalText) {
        element.dataset.originalText = text; 
    }

    element.innerHTML = `${before}<span style="background-color: yellow;">${highlight}</span>${after}`;
};
YourInclusion.prototype.highlightWord = function (element, start, length) {
    const text = element.dataset.originalText;
    const before = text.slice(0, start);
    const highlight = text.slice(start, start + length);
    const after = text.slice(start + length);
    element.innerHTML = `${before}<span class="highlighted-word">${highlight}</span>${after}`;
    const highlightSpan = element.querySelector('.highlighted-word');
    if (highlightSpan) {
        highlightSpan.style.backgroundColor = 'yellow'; 
    }
};

YourInclusion.prototype.clearHighlight = function (element) {
    if (element.dataset.originalText) {
        element.innerHTML = element.dataset.originalText; 
        delete element.dataset.originalText;
    }
};
// Enable Default Click-to-Read
YourInclusion.prototype.enableDefaultClickToRead = function () {
    this.readElementContentBound = this.readElementContent.bind(this);
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    elements.forEach((element) => {
        element.addEventListener('click', this.readElementContentBound);
    });
   
};

// Disable Default Click-to-Read
YourInclusion.prototype.disableDefaultClickToRead = function () {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    elements.forEach((element) => {
        element.removeEventListener('click', this.readElementContentBound);
    });
    
};

// Read Element Content with Highlighting
YourInclusion.prototype.readElementContent = function (event) {
    const element = event.target;
    if (element.closest('#read-aloud-toolbar') || element.tagName === 'BUTTON') {
        return;
    }
    if (this.readElementsCache.has(element)) {
        return;
    }
    this.readElementsCache.add(element);

    const text = element.innerText || element.value || '';
    const msg = new SpeechSynthesisUtterance(text);
    msg.volume = this.currentVolume || 1;
    msg.rate = this.currentSpeed || 1;

    const words = text.split(' ');
    let wordIndex = 0;

    msg.onboundary = (boundaryEvent) => {
        if (boundaryEvent.name === 'word') {
            const wordStart = boundaryEvent.charIndex;
            const wordLength = words[wordIndex]?.length || 0;
            this.highlightText(element, wordStart, wordLength);
            wordIndex++;
        }
    };

    msg.onend = () => {
        this.clearHighlight(element);
    };

    speechSynthesis.speak(msg);
};

// Play Entire Page Read Aloud with Highlighting
YourInclusion.prototype.playReadAloud = function () {
    if (!this.isReadAloudActive) {
        this.isReadAloudActive = true;
    

    }
    speechSynthesis.speak;
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, img');
    this.contentToRead = Array.from(elements).filter(el => el.innerText.trim());

    if (!this.contentToRead.length) {
        return;
    }
    this.currentContentIndex = parseInt(localStorage.getItem('currentContentIndex'), 10) || 0;
    this.currentWordIndex = 0;  
    this.readCurrentContent();
};
YourInclusion.prototype.pauseReadAloud = function () {
    speechSynthesis.pause();  // Pause the speech
    this.isReadAloudActive = false;
};

YourInclusion.prototype.readCurrentContent = function () {
    if (this.currentContentIndex >= this.contentToRead.length) {
        return;
    }

    const currentElement = this.contentToRead[this.currentContentIndex];
    const words = currentElement.innerText.trim().split(/\s+/); 

    if (this.currentWordIndex >= words.length) {
        this.currentWordIndex = 0;
        this.currentContentIndex++;
        localStorage.setItem('currentContentIndex', this.currentContentIndex);
        this.readCurrentContent(); 
        return;
    }

    const currentWord = words[this.currentWordIndex];
    const startIndex = currentElement.innerText.indexOf(currentWord);
    const endIndex = startIndex + currentWord.length;
    const highlightedWord = currentElement.innerText.substring(0, startIndex) + 
        `<span class="highlighted">${currentWord}</span>` + 
        currentElement.innerText.substring(endIndex);

    currentElement.innerHTML = highlightedWord;
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.volume = this.currentVolume || 1;
    utterance.rate = this.currentSpeed || 1.5; 
    utterance.onend = () => {
        currentElement.innerHTML = currentElement.innerText; 
        this.currentWordIndex++;
        this.readCurrentContent(); 
    };
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
};
// You can style the highlighted element with CSS
YourInclusion.prototype.addStylesForHighlight = function() {
    const style = document.createElement('style');
    style.innerHTML = `
        .highlighted {
            background-color: yellow; /* Add any style you prefer */
            transition: background-color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
};
// Cursor Read-Aloud Toggle
YourInclusion.prototype.toggleCursorReadAloud = function (toggleState) {
    if (toggleState) {
        this.disableDefaultClickToRead(); 
        this.enableCursorReadAloud();
        this.isCursorReadAloudActive = true;
    } else {
        this.disableCursorReadAloud(); 
        this.enableDefaultClickToRead(); 
        this.isCursorReadAloudActive = false;
    }
};

// Enable Cursor Read Aloud
YourInclusion.prototype.enableCursorReadAloud = function () {
    if (this.isCursorReadAloudActive) {
        return;
    }
    if (!this.readElementsCache) {
        this.readElementsCache = new Set();
    }

    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    this.cursorReadElements = elements;

    elements.forEach((element) => {
        const readHandler = (event) => this.readElementContent(event);

        element.addEventListener('mouseenter', readHandler);
        element.cursorReadAloudHandlers = { readHandler };
    });

    this.isCursorReadAloudActive = true;
};
// Disable Cursor Read Aloud
YourInclusion.prototype.disableCursorReadAloud = function () {
    if (!this.isCursorReadAloudActive) {
        return;
    }

    if (this.cursorReadElements) {
        this.cursorReadElements.forEach((element) => {
            const { readHandler } = element.cursorReadAloudHandlers || {};
            if (readHandler) {
                element.removeEventListener('mouseenter', readHandler);
                delete element.cursorReadAloudHandlers;
            }
        });
    }

    this.isCursorReadAloudActive = false;
};
YourInclusion.prototype.readPreviousLine = function () {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');

    if (!elements.length) {
        return;
    }

    if (this.currentParagraphIndex === undefined || this.currentParagraphIndex <= 0) {
        return;
    }
    this.currentParagraphIndex--;

    const currentElement = elements[this.currentParagraphIndex];
    const text = currentElement.innerText.trim();

    if (!text) {
        this.readPreviousLine(); 
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.currentVolume || 1;
    utterance.rate = this.currentSpeed || 1;
    currentElement.style.backgroundColor = 'yellow'; 
    utterance.onend = () => {
        currentElement.style.backgroundColor = ''; 
    };
    utterance.onerror = (e) => {
        currentElement.style.backgroundColor = ''; 
    };
    speechSynthesis.cancel(); 
    speechSynthesis.speak(utterance);
};
YourInclusion.prototype.readNextLine = function () {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span'); 

    if (!elements.length) {
        return;
    }
    if (this.currentParagraphIndex === undefined || this.currentParagraphIndex >= elements.length) {
        this.currentParagraphIndex = 0; 
    }

    const currentElement = elements[this.currentParagraphIndex];
    const text = currentElement.innerText.trim();

    if (!text) {
        this.currentParagraphIndex++;
        if (this.currentParagraphIndex < elements.length) {
            this.readNextLine();
        } 
        return;
    }

   
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.currentVolume || 1;
    utterance.rate = this.currentSpeed || 1;
    currentElement.style.backgroundColor = 'yellow'; 
    utterance.onend = () => {
        currentElement.style.backgroundColor = '';       
    };
    utterance.onerror = (e) => {
        currentElement.style.backgroundColor = ''; 
    };
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    this.currentParagraphIndex++;
};
YourInclusion.prototype.readCurrentLine = function () {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span'); 

    if (!elements.length) {
        return;
    }

    if (
        this.currentParagraphIndex === undefined ||
        this.currentParagraphIndex >= elements.length
    ) {
        return;
    }

    const currentElement = elements[this.currentParagraphIndex];
    this.speakText(currentElement);
};

YourInclusion.prototype.speakText = function (element) {
    const text = element.innerText || '';
    const msg = new SpeechSynthesisUtterance(text);
    msg.volume = this.currentVolume || 1;
    msg.rate = this.currentSpeed || 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
};

// Stop Read Aloud
YourInclusion.prototype.stopReadAloud = function () {
    speechSynthesis.cancel();
    this.stopAllReadAloud();
    this.disableDefaultClickToRead();
    this.currentParagraphIndex = this.currentWordIndex;
    document.querySelectorAll('[data-original-text]').forEach((element) => {
        this.clearHighlight(element);
    });
    const popup = document.getElementById('read-aloud-toolbar');
    if (popup) {
        popup.remove();
    }
};

YourInclusion.prototype.stopAllReadAloud = function () {
    
    speechSynthesis.cancel();
    this.disableDefaultClickToRead();
    this.currentParagraphIndex = this.currentWordIndex;
    document.querySelectorAll('[data-original-text]').forEach((element) => {
        this.clearHighlight(element);
    });
    this.isReadAloudActive = false;
    localStorage.setItem('readAloudActive', false);
    this.currentWordIndex = 0;
};


//Button Click Color change

document.addEventListener('DOMContentLoaded', () => {
   
    const buttons = document.querySelectorAll('.syi-toolbox-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            buttons.forEach(btn => (btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)"));

            button.style.backgroundColor = "rgba(52, 88, 185, 1)";
        });
    });
});


// Keyboard Navigation

// Keyboard Navigation Initialization
YourInclusion.prototype.initKeyboardNavigation = function () {
    const keyboardNavButton = document.getElementById('keyboard-navigation-btn');
    
    if (keyboardNavButton) {
        // Toggle on button click
        keyboardNavButton.addEventListener('click', () => {
            this.keyboardNavigationActive = !this.keyboardNavigationActive;
            this.setActiveButton('keyboard-navigation-btn', this.keyboardNavigationActive);

            if (this.keyboardNavigationActive) {
                this.enableKeyboardNavigation();
                this.showKeyboardNavigationPopup();
            } else {
                this.disableKeyboardNavigation();
                this.hideKeyboardNavigationPopup();
                this.clearAllSelectionHighlight();
            }
        });
    }

    // Listen for Alt to toggle keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.altKey) {
            event.preventDefault();
            this.keyboardNavigationActive = !this.keyboardNavigationActive;
            this.setActiveButton('keyboard-navigation-btn', this.keyboardNavigationActive);

            if (this.keyboardNavigationActive) {
                this.enableKeyboardNavigation();
                this.showKeyboardNavigationPopup();
            } else {
                this.disableKeyboardNavigation();
                this.hideKeyboardNavigationPopup();
                this.clearAllSelectionHighlight();
            }
        }
    });
};



// Enable Keyboard Navigation
YourInclusion.prototype.enableKeyboardNavigation = function () {
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    document.body.classList.add('keyboard-navigation-active');
};

// Disable Keyboard Navigation
YourInclusion.prototype.disableKeyboardNavigation = function () {
    document.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    document.body.classList.remove('keyboard-navigation-active');
    this.clearSelectionHighlight();
};

// Handle Keyboard Navigation
YourInclusion.prototype.handleKeyboardNavigation = function (event) {
    if (!this.keyboardNavigationActive) {
        return; 
    }
    const focusableSelectors = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(document.querySelectorAll(focusableSelectors)).filter(
        (el) => !el.disabled && el.offsetParent !== null
    );

    let currentIndex = focusableElements.indexOf(document.activeElement);

    const keyFunctionMap = {
        ArrowDown: () => {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[currentIndex].focus();
            this.highlightSelection(focusableElements[currentIndex]);
        },
        ArrowUp: () => {
            event.preventDefault();
            currentIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            focusableElements[currentIndex].focus();
            this.highlightSelection(focusableElements[currentIndex]);
        },
        ArrowLeft: () => {
            event.preventDefault();
           
        },
        ArrowRight: () => {
            event.preventDefault();
            
        },
        Enter: () => {
            if (document.activeElement) {
                document.activeElement.click();
            }
        },
        Escape: () => {
            this.disableKeyboardNavigation();
            this.hideKeyboardNavigationPopup();
            this.setActiveButton('keyboard-navigation-btn', false);
        },
        F2: () => this.showKeyboardNavigationPopup(),
        F3: () => this.toggleSpeechOutput(),
    
        KeyB: () => {
            if (event.shiftKey) {
                document.getElementById('blue-filter-btn')?.click();
            } else {
                this.navigateToNextButton();
            }
        },
    
        KeyK: () => {
            if (event.shiftKey) {;
                document.getElementById('accessible-font-btn')?.click();
            } else {
                this.navigateToNextLink();
            }
        },
    
        KeyI: () => {
            if (event.shiftKey) {
                document.getElementById('remove-images-btn')?.click();
            } else {
                remove-audio-btn
            }
        },
        KeyA: () => {
            if (event.shiftKey) {
                document.getElementById('stop-animations-btn')?.click();
            } else {
                this.scrollPage('left');
            }
        },
    
        KeyR: () => {
            if (event.shiftKey) {
                document.getElementById('reset-btn1')?.click();
            } else {
                document.getElementById('read-aloud-btn')?.click();
            }
        },
    
        KeyP: () => {
            if (event.shiftKey) {
                document.getElementById('highlight-links-btn')?.click();
            } else {
                this.increaseFontSize();
            }
        },
    
        KeyM: () => {
            if (event.shiftKey) {
                document.getElementById('highlight-headers-btn')?.click();
            } else {
                this.decreaseFontSize();
            }
        },
    
        KeyC: () => {
            if (event.shiftKey) {
                document.getElementById('contrast-btn')?.click();
            } else {
                document.getElementById('cursor-size-btn')?.click();
            }
        },
    
        KeyU: () => this.navigateToStart(),
    
        KeyZ: () => {
            if (event.shiftKey) {
                document.getElementById('zoom-toggle-btn')?.click();
            } else {
                document.getElementById('remove-audio-btn')?.click();
            }
        },
    
        KeyN: () => {
            if (event.shiftKey) {
                document.getElementById('night-mode-btn')?.click();
            } else {
            }
        },
    
        KeyT: () => {
            if (event.shiftKey) {
                document.getElementById('text-spacing-btn')?.click();
            } else {
            }
        },
    
        KeyL: () => {
            if (event.shiftKey) {
                document.getElementById('line-height-btn')?.click();
            } else {
                this.navigateToNextList();
            }
        },
    
        KeyS: () => {
            if (event.shiftKey) {
                document.getElementById('save-settings-btn')?.click();
            } else {
                this.scrollPage('down');
            }
        },
        
        KeyF: () => {
            if (event.shiftKey) {
                this.navigateToNextFormField();
            } else {
            }
        },

        KeyE: () => {
            if (event.shiftKey) {
            } else {
                this.navigateToNextInputField();
            }
        },

        KeyD: () => {
            if (event.shiftKey) {
                this.navigateToNextJumpTag();
            } else {
                this.scrollPage('right');
            }
        },
        KeyW: (event) => {
            if (event.shiftKey) {
               
            } else {
                event.preventDefault(); 
                this.scrollPage('up');  
            }
        },

   
        KeyG: () => this.navigateToNextImage(), 
        KeyH: () => this.navigateToNextHeading(),
        KeyJ: () => this.navigateToNextListEntry(),
        KeyO: () => this.navigateToNextCombobox(),
        KeyQ: () => this.navigateToNextEmbedded(),
       
        Digit1: () => this.navigateHeading1(),
        Digit2: () => this.navigateHeading2(),
        Digit3: () => this.navigateHeading3(),
        Digit4: () => this.navigateHeading4(),
        Digit5: () => this.navigateHeading5(),
        Digit6: () => this.navigateHeading6(),

    };

    if (keyFunctionMap[event.code]) {
        keyFunctionMap[event.code]();
    }
};





// Focus on an Element
YourInclusion.prototype.focusElement = function (element) {
    if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// Scroll the Page
YourInclusion.prototype.scrollPage = function (direction) {
    const scrollAmount = 800; 
    const scrollOptions = {
        behavior: 'smooth',
        left: 0,
        top: 0,
    };
    const findScrollableContainer = () => {
        const scrollableSelectors = [
            'html',                     
            'body',                     
            '.scroll-container',        
            'router-outlet',           
            '.mat-sidenav-content',     
            '[class*="content"]',       
        ];
        for (const selector of scrollableSelectors) {
            const element = document.querySelector(selector);
            if (element && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)) {
                return element; 
            }
        }
        return document.documentElement || document.body;
    };
    const scrollContainer = findScrollableContainer();

    if (!scrollContainer) {
        return;
    }
    switch (direction) {
        case 'up':
            scrollOptions.top = -scrollAmount;
            break;
        case 'down':
            scrollOptions.top = scrollAmount;
            break;
        case 'left':
            scrollOptions.left = -scrollAmount;
            break;
        case 'right':
            scrollOptions.left = scrollAmount;
            break;
        default:
            console.error('Invalid scroll direction:', direction);
            return;
    }
    try {
        scrollContainer.scrollBy(scrollOptions);
    } catch (error) {
        console.warn('scrollBy not supported on the detected container. Falling back to window scrolling.');
        window.scrollBy(scrollOptions);
    }
};

    

// Function to clear all highlights
YourInclusion.prototype.clearAllSelectionHighlight = function () {
    const highlightedElements = document.querySelectorAll('.highlighted'); 
    highlightedElements.forEach(element => {
        element.classList.remove('highlighted'); 
        element.style.outline = ''; 
        element.style.backgroundColor = ''; 
    });
}

// Show Keyboard Shortcuts Popup
YourInclusion.prototype.showKeyboardNavigationPopup = function () {
    const existingPopup = document.getElementById('keyboard-navigation-popup');
    const stateManager = this.createStateManager('AppState');

   
    if (existingPopup) return;

    const popup = document.createElement('div');
    popup.id = 'keyboard-navigation-popup';
    popup.className = 'keyboard-popup';

    const header = document.createElement('div');
    header.className = 'keyboard-popup-header';
    header.innerHTML = `<h3>${language[CONFIG.LANGUAGE]['INSTRUCTIONS FOR THE USE OF KEYBOARD SHORTCUTS']}</h3><button class="close-popup-btn">✖</button>`;
    header.querySelector('.close-popup-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        popup.remove(); 
    });
    popup.appendChild(header);

    const shortcuts = [
        { key: 'Esc', action: language[CONFIG.LANGUAGE]['EXIT_WEB_PAGE_NAVIGATION']},
        { key: 'F2', action: language[CONFIG.LANGUAGE]['SHOW_THIS_GUIDE']},
        { key: 'F3', action: language[CONFIG.LANGUAGE]['TOGGLE_SPEECH_OUTPUT']},
        { key: 'Tab', action: language[CONFIG.LANGUAGE]['SELECT_NEXT_ITEM']},
        { key: 'Shift + Tab', action: language[CONFIG.LANGUAGE]['SELECT_PREVIOUS_ITEM']},
        { key: 'U', action: language[CONFIG.LANGUAGE]['RESET_FOCUS_TO_START'] },
        { key: 'H', action: language[CONFIG.LANGUAGE]['NEXT_HEADING'] },
        { key: 'G', action: language[CONFIG.LANGUAGE]['NEXT_IMAGE_GRAPHIC'] },
        { key: 'K', action: language[CONFIG.LANGUAGE]['NEXT_LINK'] },
        { key: 'L', action: language[CONFIG.LANGUAGE]['NEXT_LIST'] },
        { key: 'E', action: language[CONFIG.LANGUAGE]['NEXT_INPUT_FIELD'] },
        { key: 'J', action: language[CONFIG.LANGUAGE]['NEXT_LIST_ENTRY'] },
        { key: 'O', action: language[CONFIG.LANGUAGE]['NEXT_COMBOBOX'] },
        { key: 'Q', action: language[CONFIG.LANGUAGE]['NEXT_EMBEDDED_OBJECT'] },
        { key: 'P', action: language[CONFIG.LANGUAGE]['INCREASE_FONT_SIZE'] },
        { key: 'M', action: language[CONFIG.LANGUAGE]['DECREASE_FONT_SIZE'] },
        { key: 'C', action: language[CONFIG.LANGUAGE]['CURSOR_SIZE'] },
        { key: 'Z', action: language[CONFIG.LANGUAGE]['REMOVE_AUDIO'] },
        { key: '1', action: language[CONFIG.LANGUAGE]['HEADING_1'] },
        { key: '2', action: language[CONFIG.LANGUAGE]['HEADING_2'] },
        { key: '3', action: language[CONFIG.LANGUAGE]['HEADING_3'] },
        { key: '4', action: language[CONFIG.LANGUAGE]['HEADING_4'] },
        { key: '5', action: language[CONFIG.LANGUAGE]['HEADING_5'] },
        { key: '6', action: language[CONFIG.LANGUAGE]['HEADING_6'] },
        { key: 'ALT', action: language[CONFIG.LANGUAGE]['START_KEYBOARD_NAVIGATION'] },
        { key: 'Shift + D', action: language[CONFIG.LANGUAGE]['NEXT_JUMP_TAG'] },
        { key: 'Shift + F', action: language[CONFIG.LANGUAGE]['NEXT_FORM_FIELD'] },
        { key: 'Shift + B', action: language[CONFIG.LANGUAGE]['BLUE_FILTER'] },
        { key: 'Shift + I', action: language[CONFIG.LANGUAGE]['REMOVE_IMAGES'] },
        { key: 'Shift + R', action: language[CONFIG.LANGUAGE]['READ_ALOUD'] },
        { key: 'Shift + P', action: language[CONFIG.LANGUAGE]['HIGHLIGHT_LINKS'] },
        { key: 'Shift + M', action: language[CONFIG.LANGUAGE]['HIGHLIGHT_HEADERS'] },
        { key: 'Shift + Z', action: language[CONFIG.LANGUAGE]['ZOOM_TOGGLE'] },
        { key: 'Shift + N', action: language[CONFIG.LANGUAGE]['NIGHT_MODE'] },
        { key: 'Shift + T', action: language[CONFIG.LANGUAGE]['TEXT_SPACING'] },
        { key: 'Shift + L', action: language[CONFIG.LANGUAGE]['LINE_HEIGHT'] },
        { key: 'Shift + A', action: language[CONFIG.LANGUAGE]['STOP_ANIMATIONS'] },
        { key: 'Shift + K', action: language[CONFIG.LANGUAGE]['ACCESSIBLE_FONT'] },
        { key: 'Shift + C', action: language[CONFIG.LANGUAGE]['CONTRAST'] },
        { key: 'Shift + S', action: language[CONFIG.LANGUAGE]['SAVE_SETTINGS'] },
        { key: 'Shift + R', action: language[CONFIG.LANGUAGE]['RESET'] }
            
    ];

    const body = document.createElement('div');
    body.className = 'keyboard-popup-body';

    shortcuts.forEach(({ key, action }) => {
        const item = document.createElement('div');
        item.className = 'shortcut-item';
        item.innerHTML = `<span class="shortcut-key">${key}</span>: ${action}`;
        body.appendChild(item);
    });

    popup.appendChild(body);
    document.body.appendChild(popup);
    const isExtraLargeToolboxActive = stateManager.getState().isExtraLargeToolboxActive;

    if (isExtraLargeToolboxActive) {
        const toggleClassForElements = (selector, className) => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.add(className);
            });
        };
    toggleClassForElements('.keyboard-popup', 'Large-mode');
    toggleClassForElements('.keyboard-popup-body', 'Large-mode');
    toggleClassForElements('.keyboard-popup-header h3', 'Large-mode'); 
}
};

// Hide Keyboard Shortcuts Popup
YourInclusion.prototype.hideKeyboardNavigationPopup = function () {
    const popup = document.getElementById('keyboard-navigation-popup');
    if (popup) {
        popup.remove();
    }
};
// Highlight Selection
YourInclusion.prototype.highlightSelection = function (element) {
    if (this.currentHighlight) {
        this.currentHighlight.classList.remove('keyboard-focus');
    }
    if (element) {
        element.classList.add('keyboard-focus');
        this.currentHighlight = element;
    }
};

// Clear Selection Highlight
YourInclusion.prototype.clearSelectionHighlight = function () {
    if (this.currentHighlight) {
        this.currentHighlight.classList.remove('keyboard-focus');
        this.currentHighlight = null;
    }
};

// Navigate to Next Element Helper
YourInclusion.prototype.navigateToNextElement = function (type) {
    const allElements = Array.from(document.querySelectorAll('*:not(.syi-toolbox):not(.syi-toolbox *):not(.font-size-popup):not(.syi-font-size-popup *):not(#keyboard-navigation-popup *)'));
    const current = document.activeElement;
    let currentIndex = allElements.indexOf(current);

    let nextIndex = -1;
    const types = Array.isArray(type) ? type : [type];
    const matchesType = (element) => types.includes(element.tagName.toLowerCase());

    // Check for Shift key press
    const isShiftPressed = event.shiftKey;

    // Find the next matching element
    for (let i = currentIndex + 1; i < allElements.length; i++) {
        if (matchesType(allElements[i])) {
            nextIndex = i;
            break;
        }
    }

    if (nextIndex === -1) {
        for (let i = 0; i <= currentIndex; i++) {
            if (matchesType(allElements[i])) {
                nextIndex = i;
                break;
            }
        }
    }

    if (nextIndex !== -1) {
        const targetElement = allElements[nextIndex];
        const previouslyHighlighted = document.querySelector('.highlighted');
        if (previouslyHighlighted) {
            previouslyHighlighted.classList.remove('highlighted');
        }
        if (['input', 'textarea', 'select'].includes(targetElement.tagName.toLowerCase()) && isShiftPressed) {
            targetElement.blur(); 

            
            setTimeout(() => {
                targetElement.focus(); 
                targetElement.classList.add('highlighted');
            }, 1000); 
        } else {
        
            if (!targetElement.hasAttribute('tabindex')) {
                targetElement.setAttribute('tabindex', '-1');
            }

            targetElement.focus();
            targetElement.classList.add('highlighted'); 
        }
    }
};

YourInclusion.prototype.navigateHeading1 = function () {
    this.navigateToNextElement('h1');
};
YourInclusion.prototype.navigateHeading2 = function () {
    this.navigateToNextElement('h2');
};
YourInclusion.prototype.navigateHeading2 = function () {
    this.navigateToNextElement('h3');
};
YourInclusion.prototype.navigateHeading4 = function () {
    this.navigateToNextElement('h4');
};
YourInclusion.prototype.navigateHeading5 = function () {
    this.navigateToNextElement('h5');
};
YourInclusion.prototype.navigateHeading6 = function () {
    this.navigateToNextElement('h6');
};

YourInclusion.prototype.navigateToNextHeading = function () {
    this.navigateToNextElement(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
};

YourInclusion.prototype.navigateToNextJumpTag = function () {
    this.navigateToNextElement('[id]');
};

YourInclusion.prototype.navigateToNextFormField = function () {
    this.navigateToNextElement('form'); 
};

YourInclusion.prototype.navigateToNextListEntry = function () {
    this.navigateToNextElement(['ul', 'li', 'ol', 'li']);
};

YourInclusion.prototype.navigateToNextCombobox = function () {
    this.navigateToNextElement('select');
};

YourInclusion.prototype.navigateToNextEmbedded = function () {
    this.navigateToNextElement(['embed', 'object', 'iframe']);
};

YourInclusion.prototype.navigateToNextButton = function () {
    this.navigateToNextElement('button');
};

YourInclusion.prototype.navigateToNextLink = function () {
    this.navigateToNextElement('a');
};

YourInclusion.prototype.navigateToNextImage = function () {
    this.navigateToNextElement('img');
};
YourInclusion.prototype.navigateToNextList = function () {
    this.navigateToNextElement(['ul', 'ol']);
};
YourInclusion.prototype.navigateToNextInputField = function () {
    this.navigateToNextElement(['input', 'textarea', 'select']);
};


// Navigate to Start
YourInclusion.prototype.navigateToStart = function () {
    const firstFocusable = document.querySelector('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
        this.highlightSelection(firstFocusable);
    }
};

YourInclusion.prototype.increaseFontSize = function () {
    const fontSizeButton = document.getElementById('font-size-btn');
    if (fontSizeButton) {
        fontSizeButton.click(); 
        setTimeout(() => {
            const increaseButton = document.getElementById('increase-font-btn');
            if (increaseButton) {
                increaseButton.click(); 
            }
        }, 100); 
    }
};

YourInclusion.prototype.decreaseFontSize = function () {
    const fontSizeButton = document.getElementById('font-size-btn');
    if (fontSizeButton) {
        fontSizeButton.click(); 
        setTimeout(() => {
            const decreaseButton = document.getElementById('decrease-font-btn');
            if (decreaseButton) {
                decreaseButton.click(); 
            }
        }, 100);
    }
};

YourInclusion.prototype.checkToolbarState = function () {
    const toolbarState = JSON.parse(localStorage.getItem('toolbarState'));
    
    if (!toolbarState) {
      localStorage.removeItem('syi-nightMode');
      localStorage.removeItem('readAloudActive');
      const appState = JSON.parse(localStorage.getItem('appState')) || {}; 
      appState.zoomIncrement = 0;
      appState.lineHeightIncrement = 0;
      appState.cursorSizeIncrement = 0;

      const stateManager = this.createStateManager('AppState');
      const currentState = stateManager.getState() || {};
      currentState.isExtraLargeToolboxActive = "False";
      delete currentState.isExtraLargeToolboxActive; 
      
      localStorage.setItem('Appstate', JSON.stringify(currentState));
      
      

      localStorage.setItem('appState', JSON.stringify(appState));
      return;
    }

    const { activeButtons } = toolbarState;
  
    const isNightModeActive = activeButtons.includes("night-mode-btn");
    const isReadAloudActive = activeButtons.includes('read-aloud-btn');
    if (!isNightModeActive) {
      localStorage.removeItem('syi-nightMode');
    }
    if (!isReadAloudActive) {
      localStorage.removeItem('readAloudActive');
    }
    
};

  
  

// Initialize on Page Load and Validation
YourInclusion.prototype.fetchAndValidateLicense = async function () {
    const url = CONFIG.URLS.API_Endpoint;
    // const payload = {
    //     websiteUrl: "http://google.com",
    // };
    const payload = {
        websiteUrl: window.location.origin, 
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
           
            throw new Error(`HTTP error! Status: ${response.status}`);
            
        }

        const data = await response.json();
        this.apiJson = data;
        return this.apiJson;
    } catch (error) {
        console.error("Error fetching license:", error);
        throw error;
    }
};

YourInclusion.prototype.startPlugin = async function () {
    this.initializeAccessibilityToolbox();
    loadScript();
    this.checkToolbarState();
    const readAloudToolbar = document.getElementById('read-aloud-toolbar');
    const instance = new YourInclusion();
};

YourInclusion.prototype.validateAndStartPlugin = async function () {   
  
    let isLicenseValid = false;

    try {
        let apiJson;
        const storedLicense = sessionStorage.getItem('pluginLicense');
        if (storedLicense) {
            apiJson = JSON.parse(storedLicense);
            if (new Date(apiJson.expireDate) <= new Date()) {
                sessionStorage.removeItem('pluginLicense');
                apiJson = await this.fetchAndValidateLicense(); 
            }
        } else {
            apiJson = await this.fetchAndValidateLicense();
        }
        if (apiJson.isValid && new Date(apiJson.expireDate) > new Date()) {
            sessionStorage.setItem('pluginLicense', JSON.stringify(apiJson));
        }
        const storedConfig = localStorage.getItem('config');
        if (!storedConfig) {
            const config = {
                languageIsoCode: apiJson.pluginDetails.languageIsoCode,
                colorCode: apiJson.pluginDetails.colorCode,
            };
            localStorage.setItem('config', JSON.stringify(config));
        } 
        if (apiJson.isValid && new Date(apiJson.expireDate) > new Date()) {
            isLicenseValid = true;
        } 
if (isLicenseValid) {
    this.startPlugin();
    const savedState = JSON.parse(localStorage.getItem('toolbarState')) || {};
    this.selectedHeaderColor = savedState.popupColor || localStorage.getItem('popupHeaderColor') || apiJson.pluginDetails.colorCode || '#393636';
    this.resetSelectedColor = this.selectedHeaderColor;
    this.defaultLanguage = savedState.popupLanguage || localStorage.getItem('popupLanguage') || apiJson.pluginDetails.languageIsoCode || 'en-US';
    document.documentElement.style.setProperty('--bg-color', this.selectedHeaderColor);

    let config = localStorage.getItem('config');
    if (config) {
        config = JSON.parse(config);
    } else {
        config = {
            BACKGROUND_COLOR: this.selectedHeaderColor,
            LANGUAGE: this.defaultLanguage
        };
    }
    CONFIG.LANGUAGE = this.defaultLanguage;
    config.BACKGROUND_COLOR = this.selectedHeaderColor;
    config.LANGUAGE = this.defaultLanguage;
    this.updateToolbarLanguage();
    localStorage.setItem('config', JSON.stringify(config));


}
        
        
    } catch (error) {
        console.error("Error during license validation:", error);
    }

    return isLicenseValid;
};
YourInclusion.prototype.validateAndStartPluginReset = async function () {
    try {
        const apiJson = await this.fetchAndValidateLicense();
        if (!apiJson || !apiJson.pluginDetails || apiJson.pluginDetails.invalidLicense) {
            const toolbox = document.querySelector('.syi-toolbox');
            if (toolbox) {
                toolbox.remove();
            }
            const sideButtons = document.querySelectorAll('.syi-side-button'); 
            sideButtons.forEach(button => button.remove());
        }
        sessionStorage.setItem('pluginLicense', JSON.stringify(apiJson));
        const config = {
            languageIsoCode: apiJson.pluginDetails.languageIsoCode || 'en-US',
            colorCode: apiJson.pluginDetails.colorCode || '#393636',
        };
        localStorage.setItem('config', JSON.stringify(config));
        this.selectedHeaderColor = config.colorCode;
        this.defaultLanguage = config.languageIsoCode;
        document.documentElement.style.setProperty('--bg-color', this.selectedHeaderColor);
    
        this.updateToolbarLanguage();
    } catch (error) {
        console.error("Error during license validation and configuration:", error);
    }
};



YourInclusion.prototype.updateLanguageInConfig = function (apiLanguage) {
    let config = localStorage.getItem('config');
    
    if (config) {
        config = JSON.parse(config);
        config.LANGUAGE = apiLanguage;
        localStorage.setItem('config', JSON.stringify(config));
    } else {
        console.warn("Config file not found in local storage.");
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const plugin = new YourInclusion();
    const isLicenseValid = await plugin.validateAndStartPlugin();
    

    if (!isLicenseValid) {
        console.log("Plugin will not function due to invalid license.");
        
    }
    
});

export default YourInclusion;