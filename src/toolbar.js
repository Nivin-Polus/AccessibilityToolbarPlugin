// 'use strict';
import CONFIG from "../config";
import language  from '../languages.json';


function YourInclusion(init) {
    this.init = init || {};
    this.removedImages = [];
    this.imagesHidden = false;
    this.isMuted = false;
    this.selectedHeaderColor = CONFIG.SETTINGS.BACKGROUND_COLOR;
    
    
    this.initializeAccessibilityToolbox();
    this.initBlueFilter();
    this.initRemoveImages();
    this.addFontSizePopup();
    this.initNightModeFeature();
    this.initTextSpacingFeature();
    this.initLineHeightFeature();
    this.initResetFeature();
    this.initContrastFeature();
    this.addSettingsButtonListener();
    this.initAudioRemoval();
    this.initHighlightButtons();
    this.initStopAnimationsButton();
    this.initZoomToggleFeature();
    this.initAccessibleFontToggle();
    this.initCursorSizeAdjustment();
    this.initSaveFeature(); 
    this.initReadAloud();
    this.initKeyboardNavigation();
    // this.addDevelopmentAlerts();

}

/*** Load Script */
function loadScript() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CONFIG.URLS.ICONS;;
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

    if (text) {
        const textWrapper = this.createTextWrapper(text);
        button.appendChild(textWrapper); 
    }

    return button;
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

    // Check if the icon is an SVG and fetch it
    if (iconUrl.endsWith('.svg')) {
        this.fetchAndAppendSVG(iconUrl, iconWrapper);
    } else if (iconUrl.endsWith('.png') || iconUrl.endsWith('.jpg') || iconUrl.endsWith('.jpeg')) {
        // Handle non-SVG images
        const imgIcon = this.createImageIcon(iconUrl, altText);
        iconWrapper.appendChild(imgIcon);
    }

    return iconWrapper;
};


// Function to fetch and append SVG
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

   
    toolbox.appendChild(header);
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
    settingsButton.addEventListener('click', () => createSettingsPopup());
    headerLeft.appendChild(settingsButton);

    
    const resetButton = this.createButtonWithIcon('reset-btn', 'fas fa-undo');
    resetButton.addEventListener('click', () => initResetFeature());
    headerLeft.appendChild(resetButton);

    return headerLeft;
};

YourInclusion.prototype.createHeaderRightSection = function () {
    const headerRight = this.createDiv('syi-toolbox-header-right');
    headerRight.style.position = 'relative';
    headerRight.style.bottom = '28%';

     
    const infoButton = this.createButtonWithIcon('info-btn', 'fas fa-info-circle');
    headerRight.appendChild(infoButton);

   
    const closeButton = this.createButtonWithIcon('close-btn', 'fas fa-times');
    closeButton.addEventListener('click', () => this.closeToolboxFromButton());
    headerRight.appendChild(closeButton);

    return headerRight;
};
YourInclusion.prototype.closeToolboxFromButton = function () {
    const toolbox = document.querySelector('.syi-toolbox');
    if (toolbox) {
        toolbox.classList.remove('visible'); 
        this.closeAllPopups();

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
        { id: 'blue-filter-btn', textKey: 'BLUE_FILTER', iconClass: './assests/BlueFilter-1.svg' },
        { id: 'contrast-btn', textKey: 'CONTRAST_MODES', iconClass: './assests/contrast.svg' },
        { id: 'remove-images-btn', textKey: 'REMOVE_IMAGES', iconClass: './assests/image-off.svg' },
        { id: 'font-size-btn', textKey: 'FONT_SIZE', iconClass: './assests/fontsize.svg' },
        { id: 'night-mode-btn', textKey: 'NIGHT_MODE', iconClass: './assests/mode-night.svg' },
        { id: 'text-spacing-btn', textKey: 'TEXT_SPACING', iconClass: './assests/ri_text-spacing 2.svg' },
        { id: 'line-height-btn', textKey: 'LINE_HEIGHT', iconClass: './assests/ri_line-height 1.svg' },
        { id: 'remove-audio-btn', textKey: 'REMOVE_AUDIO', iconClass: './assests/mdi_mute 1.svg' },
        { id: 'highlight-links-btn', textKey: 'HIGHLIGHT_LINKS', iconClass: './assests/link 1.svg' },
        { id: 'highlight-headers-btn', textKey: 'HIGHLIGHT_HEADERS', iconClass: './assests/cil_header 1.svg' },
        { id: 'stop-animations-btn', textKey: 'STOP_ANIMATIONS', iconClass: './assests/stop 1.svg' },
        { id: 'zoom-toggle-btn', textKey: 'ZOOM_TOGGLE', iconClass: './assests/zoom 1.svg' },
        { id: 'cursor-size-btn', textKey: 'CURSOR_SIZE', iconClass: './assests/cursor 1.svg' },
        { id: 'accessible-font-btn', textKey: 'ACCESSIBLE_FONT', iconClass: './assests/font 1.svg' },
        { id: 'read-aloud-btn', textKey: 'READ_ALOUD', iconClass: './assests/read-aloud.svg' },
        { id: 'reset-btn1', textKey: 'RESET', iconClass: './assests/reset 1.svg' },
        { id: 'save-settings-btn', textKey: 'SAVE_SETTINGS', iconClass: './assests/save 1.svg' },
    ];

    buttons.forEach(({ id, textKey, iconClass }) => {
        const buttonDiv = this.createDiv(id || textKey.toLowerCase());
        const buttonText = language[selectedLanguage][textKey] || textKey; // Get text from the language JSON
        const button = this.createButton(id, buttonText, iconClass);
        buttonDiv.appendChild(button);
        body.appendChild(buttonDiv);
    });

    return body;
};

  /*** Check the status of each popup flag */
YourInclusion.prototype.arePopupsInactive = function () {
   
    const allInactive = !this.isFontSizePopupActive && !this.isSettingsPopupActive && !this.isContrastPopupActive;

    console.log(`Are all popups inactive? ${allInactive}`);
    return allInactive; 
};


/***  Initialize Toolbox */
YourInclusion.prototype.initializeAccessibilityToolbox = function () {
    this.createToolbox();
    sideButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toolbox.classList.toggle('visible');
    });

    const toolbox = document.getElementById('syi-toolbox');
    const sideButton = document.getElementById('openToolboxButton');

   
    sideButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toolbox.classList.toggle('visible');

    });

    document.addEventListener('click', (event) => {
        const isToolboxActive = toolbox.classList.contains('visible');
    
      
        if (isToolboxActive) {
            if (this.arePopupsInactive()) {
            
                if (!toolbox.contains(event.target) && !sideButton.contains(event.target)) {
                    toolbox.classList.remove('visible');
                    console.log('Toolbox closed as all popups are inactive.');
                }
            } else {
                console.log('Toolbox remains open because a popup is active.');
            }
        }
    });
    
    // Load saved state
    this.loadToolbarState();
};


/***
 * Create Side Button
 */
YourInclusion.prototype.createSideButton = function () {

    const existingSideButton = document.getElementById('openToolboxButton'); 

    if (existingSideButton) {
        existingSideButton.remove(); 
    }
    const sideButton = this.createSideButtonElement();
    this.makeSideButtonDraggable(sideButton);
    document.body.appendChild(sideButton);
};

YourInclusion.prototype.createSideButtonElement = function () {
    const sideButton = this.createDiv('side-button', 'openToolboxButton');
    const buttonImage = this.createImage(
        CONFIG.URLS.SIDE_BUTTON,
        'Open Toolbox',
        'side-button-image'
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

    // Snap side button to left or right based on the screen center
    x = x + sideButton.offsetWidth / 2 < windowWidth / 2
        ? 10 
        : windowWidth - sideButton.offsetWidth - 20; 

    // Apply the position to the side button
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

    let toolboxLeft = x + sideButton.offsetWidth / 2 - toolbox.offsetWidth / 2;
    let toolboxTop = y - toolbox.offsetHeight - 60;

    // Adjust toolbox position to stay within screen bounds
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    toolboxLeft = Math.max(10, Math.min(toolboxLeft, windowWidth - toolbox.offsetWidth - 10));
    toolboxTop = Math.max(10, Math.min(toolboxTop, windowHeight - toolbox.offsetHeight - 10));

    toolbox.style.left = `${toolboxLeft}px`;
    toolbox.style.top = `${toolboxTop}px`;

    // Adjust side button to stay below the toolbox
    sideButton.style.top = `${toolboxTop + toolbox.offsetHeight + 10}px`;

    
    const isToolboxOnLeft = toolboxLeft < windowWidth / 2;
    this.updatePopupPositions(isToolboxOnLeft);
};

/**
 * Updates the positions of all popups dynamically based on the toolbox location.
 * @param {boolean} isToolboxOnLeft 
 */

    YourInclusion.prototype.updatePopupPositions = function (isToolboxOnLeft) {

    const popupConfigs = [
        { selector: '.syi-font-size-popup', left: isToolboxOnLeft ? '25%' : '74%' },
        { selector: '.syi-settings-popup', left: isToolboxOnLeft ? '28%' : '72%' },
        { selector: '.syi-contrast-popup', left: isToolboxOnLeft ? '30%' : '70%' },
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
              
                blueOverlay.remove();
                this.setActiveButton('blue-filter-btn', false);
            } else {
               
                const newBlueOverlay = this.createDiv('syi-blue-overlay');
                document.body.appendChild(newBlueOverlay);
                newBlueOverlay.classList.add('active');
                this.setActiveButton('blue-filter-btn', true); 
            }
        });
    } else {
        console.error('Blue Filter button is missing.');
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
    
    const images = document.querySelectorAll('img:not(.syi-toolbox-image):not(.side-button-image):not(.syi-toolbox-logo)');

    
    if (this.imagesHidden) {
    
        images.forEach(img => {
            img.classList.remove('hidden-image');
        });
    } else {
      
        images.forEach(img => {
            img.classList.add('hidden-image');
        });
    }

    
    this.imagesHidden = !this.imagesHidden;
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
        console.error('Font Size button or toolbox not found.');
        return;
    }

  
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
                    <button id="decrease-font-btn" class="syi-font-popup-btn">-</button>
                    <span id="font-size-display" class="syi-font-popup-display">0</span>
                    <button id="increase-font-btn" class="syi-font-popup-btn">+</button>
                </div>
                <div class="syi-popup-reset">
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

            let fontSizeChange = 0;
            const originalFontSizes = new Map();
            const allElements = document.body.querySelectorAll(
                '*:not(.syi-toolbox):not(.syi-toolbox *):not(.font-size-popup):not(.syi-font-size-popup *)'
            );
            allElements.forEach((element) => {
                const computedStyle = window.getComputedStyle(element);
                originalFontSizes.set(element, computedStyle.fontSize);
            });

            const applyFontSizeChange = (change) => {
                allElements.forEach((element) => {
                    const originalSize = parseFloat(originalFontSizes.get(element));
                    const newSize = originalSize + change;
                    element.style.fontSize = `${newSize}px`;
                });
            };

            const updateFontSizeDisplay = () => {
                fontSizeDisplay.textContent = fontSizeChange > 0 ? `+${fontSizeChange}` : `${fontSizeChange}`;
            };

            decreaseButton.addEventListener('click', () => {
                if (fontSizeChange > -6) {
                    fontSizeChange -= 1;
                    applyFontSizeChange(fontSizeChange);
                    updateFontSizeDisplay();
                }
            });

            increaseButton.addEventListener('click', () => {
                if (fontSizeChange < 6) {
                    fontSizeChange += 1;
                    applyFontSizeChange(fontSizeChange);
                    updateFontSizeDisplay();
                }
            });

            resetButton.addEventListener('click', () => {
                
                allElements.forEach((element) => {
                    element.style.fontSize = originalFontSizes.get(element);
                });
                fontSizeChange = 0; 
                updateFontSizeDisplay();
            });

            closeButton.addEventListener('click', () => {
                fontSizePopup.style.display = 'none';
            });
        }

        if (fontSizePopup.style.display === 'block') {
            fontSizePopup.style.display = 'none';
            this.isFontSizePopupActive = false;
        } else {
            this.closeAllPopups(); 
            fontSizePopup.style.display = 'block'; 
            this.isFontSizePopupActive = true;
        }
    });
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
    
    const allElements = document.querySelectorAll(':not(button):not(input):not(.syi-toolbox):not(.syi-toolbox *)');

    
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
    console.log(`Night Mode ${isNightModeEnabled ? 'enabled' : 'disabled'}.`);
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
    const elementsToAdjust = document.querySelectorAll('body *:not(.syi-toolbox):not(.syi-toolbox *)');
    const spacingStates = ['normal', '0.1em', '0.2em', '0.3em'];

    if (this.currentTextSpacingIndex === undefined) {
        this.currentTextSpacingIndex = 0;
    }
    this.currentTextSpacingIndex = (this.currentTextSpacingIndex + 1) % spacingStates.length;
    const spacingLevel = spacingStates[this.currentTextSpacingIndex];

    elementsToAdjust.forEach(element => {
        element.style.letterSpacing = spacingLevel;
    });

  
    this.setActiveButton(buttonId, spacingLevel !== 'normal');

    console.log(`Text spacing set to: ${spacingLevel}`);
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
    const elementsToAdjust = document.querySelectorAll('body *:not(.syi-toolbox):not(.syi-toolbox *)');
    const lineHeightStates = ['normal', '1.5', '2', '2.5'];

   
    if (this.currentLineHeightIndex === undefined) {
        this.currentLineHeightIndex = 0;
    }

 
    this.currentLineHeightIndex = (this.currentLineHeightIndex + 1) % lineHeightStates.length;
    const lineHeightLevel = lineHeightStates[this.currentLineHeightIndex];

  
    elementsToAdjust.forEach(element => {
        element.style.lineHeight = lineHeightLevel;
    });

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
        } else {
            button.classList.remove('active-button'); 
            button.dataset.active = 'false'; 
        }
    }
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

    console.log('All buttons have been reset to their default state.');
};




/*** Reset Function */

YourInclusion.prototype.initResetFeature = function () {
    
    const resetButtons = document.querySelectorAll('#reset-btn, #reset-btn1');

  
    resetButtons.forEach((button) => {
        button.addEventListener('click', () => {
            this.resetToolbox(); 
        });
    });
}


YourInclusion.prototype.resetToolbox = function () {
    this.closeAllPopups();

    /*** Remove highlights added by the toolbox */
    document.querySelectorAll('.highlight-links, .highlight-headers, .highlight-images').forEach((el) => {
        el.classList.remove('highlight-links', 'highlight-headers', 'highlight-images');
    });

    /*** Restore only toolbox-specific font size, spacing, and transforms, excluding popups and toolbox */
    document.querySelectorAll('[data-toolbox-modified]').forEach((el) => {
        if (!el.closest('.syi-font-size-popup') && !el.closest('.syi-toolbox')) {
            el.style.fontSize = '';
            el.style.letterSpacing = 'normal'; 
            el.style.lineHeight = 'normal';    
            el.style.transform = '';
            el.style.transformOrigin = '';
            el.style.width = '';
            el.removeAttribute('data-toolbox-modified');
        }
    });

    /*** Remove blue filter if applied by the toolbox */
    const blueOverlay = document.querySelector('.syi-blue-overlay');
    if (blueOverlay) blueOverlay.classList.remove('active');
    this.setActiveButton('blue-filter-btn', false);

    /*** Restore images hidden by the toolbox */
    const removeImageButton = document.getElementById('remove-images-btn');
    if (this.imagesHidden && removeImageButton) {
        removeImageButton.click();
        console.log('Remove Images button triggered via reset.');
    }

    /*** Unmute audio/video elements muted by the toolbox */
    const audioButton = document.getElementById('remove-audio-btn');
    if (audioButton) {
        const soundElements = document.querySelectorAll('audio, video');
        const isAlreadyMuted = Array.from(soundElements).every(el => el.muted);

        if (isAlreadyMuted) {
            console.log('Audio is already muted. Simulating click to unmute...');
            audioButton.click(); // Simulate button click
        }
    }


    /*** Disable night mode introduced by the toolbox */
    const nightModeButton = document.getElementById('night-mode-btn');
    if (document.body.classList.contains('syi-night-mode') && nightModeButton) {
        nightModeButton.click(); 
    }

    /*** Reset cursor size to default */
    document.documentElement.style.cursor = 'auto';

    /*** Reset accessible font settings */
    document.body.classList.remove('accessible-font');

    /*** Re-enable animations if disabled by the toolbox */
    document.body.classList.remove('disable-animations');
    this.setActiveButton('stop-animations-btn', false);

    /*** Trigger resetContrast function to handle contrast settings */
    this.resetContrast();
    this.setActiveButton('contrast-btn', false);

    /*** Reset Text Spacing */
    const elementsToAdjustTextSpacing = document.querySelectorAll(
        'body *:not(.syi-toolbox):not(.syi-toolbox *)'
    );
    elementsToAdjustTextSpacing.forEach((element) => {
        element.style.letterSpacing = 'normal'; 
    });
    this.currentTextSpacingIndex = 0; 
    console.log('Text spacing reset to normal.');
    this.setActiveButton('text-spacing-btn', false);
    this.setActiveButton('line-height-btn', false);

    /*** Reset Line Height */
    const elementsToAdjustLineHeight = document.querySelectorAll(
        'body *:not(.syi-toolbox):not(.syi-toolbox *)'
    );
    elementsToAdjustLineHeight.forEach((element) => {
        element.style.lineHeight = 'normal'; 
    });
    this.currentLineHeightIndex = 0; 
    console.log('Line height reset to normal.');

    /*** Clear toolbox-specific local storage settings */
    localStorage.removeItem('animationsDisabled');
    localStorage.removeItem('nightMode');
    localStorage.removeItem('zoomLevel');
    localStorage.removeItem('toolbarState');

    /*** Reset zoom level */
    this.applyZoom(1);

    /*** Reset button states controlled by the toolbox */
    this.resetButtonStates();
    this.resetPopupSettings();
    console.log('All buttons reset.');

    console.log('Toolbox reset to the original state.');
};





/*** Contrast Mode */

YourInclusion.prototype.initContrastFeature = function () {
    const contrastButton = document.getElementById('contrast-btn');
    if (contrastButton) {
        contrastButton.addEventListener('click', () => {
            this.createContrastPopup();
            this.setActiveButton('contrast-btn');
        });
    }
};

YourInclusion.prototype.createContrastPopup = function () {
    this.closeAllPopups(); 

    const existingPopup = document.getElementById('syi-contrast-popup');
    if (existingPopup) {
        existingPopup.remove();
        this.isContrastPopupActive = false;
        return;
    }

    const popup = document.createElement('div');
    popup.id = 'syi-contrast-popup';
    popup.className = 'syi-contrast-popup'; 

    const header = this.createPopupHeader(language[CONFIG.LANGUAGE]['CONTRAST'], () => {
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
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => { 
        popup.remove();       
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

    this.isContrastPopupActive = true; 
};


YourInclusion.prototype.createPopupHeader = function (titleText, closeCallback) {
    const header = document.createElement('div');
    header.className = 'syi-contrast-popup-header'; 


    const title = document.createElement('h3');
    title.className = 'syi-contrast-popup-title'; 
    title.textContent = titleText;
    header.appendChild(title);

    return header;
};

YourInclusion.prototype.addPresetModes = function (container) {
    const modes = [{ id: 'grayscale', text: language[CONFIG.LANGUAGE]['UNCOLORED_DISPLAY'] }];

    modes.forEach(({ id, text }) => {
        const modeButton = document.createElement('button');
        modeButton.id = id;
        modeButton.className = 'syi-contrast-mode-button';
        modeButton.textContent = text;
        modeButton.addEventListener('click', (e) => this.toggleContrastMode(id, e.target));
        container.appendChild(modeButton);
    });
};
YourInclusion.prototype.addCustomColorControls = function (container) {
    const customColorsSection = document.createElement('div');
    customColorsSection.className = 'syi-contrast-custom-colors';

    const predefinedColors = ['#FFFFFF', '#000000', '#F0E68C', '#ADD8E6', '#FFB6C1'];

    const bgLabel = document.createElement('label');
    bgLabel.textContent = language[CONFIG.LANGUAGE]['BACKGROUND'];

    const bgColorContainer = document.createElement('div');
    bgColorContainer.className = 'color-picker-container';

    predefinedColors.forEach((color) => {
        const colorButton = document.createElement('button');
        colorButton.className = 'color-button';
        colorButton.style.backgroundColor = color;

        colorButton.addEventListener('click', () => {
            this.applyBackgroundColor(color);
        });

        bgColorContainer.appendChild(colorButton);
    });

    const bgColorPicker = document.createElement('input');
    bgColorPicker.type = 'color';
    bgColorPicker.id = 'bg-color-picker';

    bgColorPicker.addEventListener('input', () => {
        const selectedColor = bgColorPicker.value;
        this.applyBackgroundColor(selectedColor);
    });

    bgColorContainer.appendChild(bgColorPicker);
    customColorsSection.appendChild(bgLabel);
    customColorsSection.appendChild(bgColorContainer);

    const textLabel = document.createElement('label');
    textLabel.textContent = language[CONFIG.LANGUAGE]['TEXT_COLOR'];

    const textColorContainer = document.createElement('div');
    textColorContainer.className = 'color-picker-container';

    predefinedColors.forEach((color) => {
        const colorButton = document.createElement('button');
        colorButton.className = 'color-button';
        colorButton.style.backgroundColor = color;
        colorButton.addEventListener('click', () => this.applyCustomTextColor(color));
        textColorContainer.appendChild(colorButton);
    });

    const textColorPicker = document.createElement('input');
    textColorPicker.type = 'color';
    textColorPicker.id = 'text-color-picker';

    textColorPicker.addEventListener('input', () => this.applyCustomTextColor(textColorPicker.value));
    textColorContainer.appendChild(textColorPicker);

    customColorsSection.appendChild(textLabel);
    customColorsSection.appendChild(textColorContainer);

    container.appendChild(customColorsSection);
};
YourInclusion.prototype.applyBackgroundColor = function (color) {
    const elements = document.querySelectorAll(
        '*:not(button):not(input):not(.syi-toolbox):not(.syi-toolbox *):not(.syi-contrast-popup):not(.syi-contrast-popup *)'
    );

    elements.forEach((element) => {
        element.style.background = color;
        element.style.backgroundColor = color;
    });

    console.log(`Background applied to all elements: ${color}`);
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
            'p, h1, h2, h3, h4, h5, h6, span, li, a, div, label, input, textarea'
        );

        textElements.forEach((element) => {
            if (excludeToolbarAndPopup(element)) {
                element.style.color = color; 
            } else {
                console.log('Excluded element:', element); 
            }
        });

        this.customTextColor = color; 
    }
};


// Reset Contrast
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
        
        element.classList.remove('bright-contrast', 'reverse-contrast', 'grayscale');
    });

    console.log('Contrast settings reset to original.');
};


// Toggle Contrast Modes
YourInclusion.prototype.toggleContrastMode = function (mode, button) {
    const bodyClassList = document.body.classList;

  
    const isActive = bodyClassList.contains(mode);

    
    bodyClassList.remove('bright-contrast', 'reverse-contrast', 'grayscale');

    
    if (!isActive) {
        bodyClassList.add(mode);
        console.log(`${mode} mode activated.`);
    } else {
        console.log(`${mode} mode deactivated.`);
    }

    this.updateContrastButtonStates(button, isActive);
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

YourInclusion.prototype.setContrastMode = function (savedState) {
    if (!savedState) return;

    const { contrastMode, bgColor, textColor } = savedState;

    if (contrastMode) {
        document.body.classList.add(contrastMode);
        console.log(`Restored contrast mode: ${contrastMode}`);
    }

    if (bgColor) {
        document.body.style.backgroundColor = bgColor;
        console.log(`Restored background color: ${bgColor}`);
    }

    if (textColor) {
        const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, span, li, a, div, label, button, input, textarea'
        );
        textElements.forEach((element) => {
            element.style.color = textColor;
        });
        console.log(`Restored text color: ${textColor}`);
    }
};


// Save Function

// Save Toolbar State
YourInclusion.prototype.initSaveFeature = function () {
    const saveButton = document.getElementById('save-settings-btn');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            this.saveToolbarState();
            console.log('Settings saved.');
        });
    } else {
        console.error('Save button not found.');
    }
};
YourInclusion.prototype.saveToolbarState = function () {
    const state = {
        blueFilterActive: document.querySelector('.blue-overlay')?.classList.contains('active') || false,
        imagesHidden: this.imagesHidden || false,
        isMuted: this.isMuted || false,
        currentFontSize: this.getCurrentFontSize(),
        nightModeActive: document.body.classList.contains('night-mode') || false,
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
        popupLanguage: CONFIG.LANGUAGE || 'en',
        popupColor: document.getElementById('color-picker')?.value || '#007bff'
    };

    localStorage.setItem('toolbarState', JSON.stringify(state));
    console.log('Toolbar state saved:', state);
};





// Load Toolbar State
YourInclusion.prototype.loadToolbarState = function () {
    const savedState = JSON.parse(localStorage.getItem('toolbarState')) || null;

    if (!savedState) {
        console.log('No saved state found. Using default settings.');
        return;
    }

    console.log('Restoring toolbar state:', savedState);
    

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
    // Restore Image Visibility
    if (savedState.imagesHidden) {
        this.toggleImages(); 
        this.setActiveButton('remove-images-btn', true);
    }

    // Restore Audio Mute State
    if (savedState.isMuted) {
        this.audioRemoval(); 
        this.setActiveButton('remove-audio-btn', true);
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
        document.body.classList.add('night-mode');
        this.setActiveButton('night-mode-btn', true);
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
    
       // Restore Font Size
    //    if (savedState.currentFontSize) {
    //     const currentFontSize = parseFloat(savedState.currentFontSize);
    //     const calculatedFontSize = this.getCurrentFontSize();
    //     const adjustment = currentFontSize - calculatedFontSize;

    //     if (adjustment > 0) {
    //         for (let i = 0; i < adjustment; i++) this.adjustFontSize('increase');
    //     } else if (adjustment < 0) {
    //         for (let i = 0; i < -adjustment; i++) this.adjustFontSize('decrease');
    //     }
    // }


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
    console.log(`Restored contrast mode: ${savedState.contrastMode}`);
}

// Restore Custom Background Color
if (savedState.customBackgroundColor) {
    document.body.style.backgroundColor = savedState.customBackgroundColor;
    console.log(`Restored custom background color: ${savedState.customBackgroundColor}`);
}

    // Restore accessible font state
    if (savedState.accessibleFont) {
        document.body.classList.add('accessible-font');
        this.setActiveButton('accessible-font-btn', true);
        console.log('Restored: Accessible font enabled.');
    }



  // Restore Custom Text Color
  if (savedState.customTextColor) {
    const textElements = document.querySelectorAll(
        'p, h1, h2, h3, h4, h5, h6, span, li, a, div, label, button, input, textarea'
    );

    textElements.forEach((element) => {
        element.style.color = savedState.customTextColor; 
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
    const colorPicker = document.getElementById('color-picker');
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
            console.log('SVG icon colors updated.');
        } else {
            console.log('No SVG icons found to style.');
        }
    };

    // Check if icons exist; apply styles or wait for them to load
    if (document.querySelectorAll('.syi-toolbox-body svg').length === 0) {
        console.log('SVG icons not found yet. Retrying...');
        setTimeout(applyIconStyles, 500); // Retry after delay
    } else {
        applyIconStyles();
    }

    this.updateToolboxColor(popupHeader, savedState.popupColor);
}
};



// Helper Functions
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
    console.log(`Calculated average font size: ${averageFontSize}px`);
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


YourInclusion.prototype.initializeAccessibilityToolbox = function () {
    this.createToolbox();
    this.createSideButton();

    const toolbox = document.getElementById('syi-toolbox');
    const sideButton = document.getElementById('openToolboxButton');
    sideButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toolbox.classList.toggle('visible');
    });
    this.loadToolbarState();
};

YourInclusion.prototype.resetSettings = function () {
    localStorage.removeItem('toolbarState');
    this.resetToolbox();
    console.log('Toolbar state reset.');
};

// Setting button functions

YourInclusion.prototype.addSettingsButtonListener = function () {
    const settingsButton = document.getElementById('settings-btn'); 
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            this.createSettingsPopup();
        });
    } else {
        console.error('Settings button not found');
    }
};

YourInclusion.prototype.createSettingsPopup = function () {
    this.closeAllPopups();

    if (document.querySelector('.syi-settings-popup')) return;

    const popup = this.createPopupContainer();
    const header = this.createPopupHeader(language[CONFIG.LANGUAGE]['SETTINGS']);
    const languageSelector = this.createLanguageSelector();
    const colorPicker = this.createColorPicker(header);
    const resetButton = this.createPopupResetButton(header, colorPicker);
    const closeButton = this.createPopupCloseButton(popup);

    // Append sections to the popup
    popup.appendChild(header);
    popup.appendChild(languageSelector);
    popup.appendChild(colorPicker);
    popup.appendChild(resetButton);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);

    const isToolboxOnLeft = this.determineToolboxPosition(popup);
    this.updatePopupPositions(isToolboxOnLeft);
};
YourInclusion.prototype.createPopupContainer = function () {
    const popup = this.createDiv('syi-settings-popup');
    popup.style.position = 'absolute';
    popup.style.top = '19%';
    return popup;
};

YourInclusion.prototype.createPopupHeader = function (titleText) {
    const header = this.createDiv('syi-settings-popup-header');
    const headerTitle = this.createHeading(3, titleText, 'syi-settings-popup-title');
    header.appendChild(headerTitle);
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

    const colorPickerLabel = settingsPopup.querySelector('.color-picker-label');
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
    
};

YourInclusion.prototype.createLanguageSelector = function () {
    const languageSelector = this.createDiv('popup-section');

    const languageLabel = this.createEle('label', { for: 'language-select' }, language[CONFIG.LANGUAGE]['SELECT_LANGUAGES']);
    const languageDropdown = this.createEle('select', { id: 'language-select' });

    languageDropdown.innerHTML = `
        <option value="en" ${CONFIG.LANGUAGE === 'en' ? 'selected' : ''}>English</option>
        <option value="de" ${CONFIG.LANGUAGE === 'de' ? 'selected' : ''}>German</option>
    `;

    languageDropdown.addEventListener('change', (event) => {
        CONFIG.LANGUAGE = event.target.value; 
        this.updateToolbarLanguage(); 
        this.saveToolbarState();
    });

    languageSelector.appendChild(languageLabel);
    languageSelector.appendChild(languageDropdown);
    return languageSelector;
};

// Function to create the color picker
YourInclusion.prototype.createColorPicker = function (header) {
    const colorPicker = this.createDiv('popup-section');

    const colorLabel = this.createEle('label', { class: 'color-picker-label' }, language[CONFIG.LANGUAGE]['PICK_COLOR']);
    const colorInput = this.createEle('input', { type: 'color', id: 'color-picker', value: '#007bff' });

    colorInput.addEventListener('input', (event) => {
        this.updateToolboxColor(header, event.target.value);
        this.saveToolbarState();
    });

    colorPicker.appendChild(colorLabel);
    colorPicker.appendChild(colorInput);
    return colorPicker;
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

YourInclusion.prototype.createPopupCloseButton = function (popup) {
    const closeButton = this.createEle('button', { class: 'popup-close' }, 'X');
    closeButton.addEventListener('click', () => popup.remove());
    return closeButton;
};

// Function to update toolbox and popup colors dynamically
YourInclusion.prototype.updateToolboxColor = function (header, color) {
    if (header) { // Added null check for `header`
        header.style.backgroundColor = color; // Update header color if it exists
    }

    const toolboxHeaders = document.querySelectorAll('.syi-toolbox-header, .syi-settings-popup-header');
    if (toolboxHeaders.length > 0) { // Check if elements exist
        toolboxHeaders.forEach(header => {
            header.style.setProperty('background-color', color, 'important');
        });
    }

    const toolboxIcons = document.querySelectorAll('.syi-toolbox-body svg');
    if (toolboxIcons.length > 0) { // Check if elements exist
        toolboxIcons.forEach(svg => {
            svg.style.fill = color;
            svg.style.stroke = color;

            const innerElements = svg.querySelectorAll('*');
            innerElements.forEach(inner => {
                inner.style.fill = color;
                inner.style.stroke = color;
            });
        });
    }

    const toolboxButtons = document.querySelectorAll('.syi-toolbox-body .syi-toolbox-btn, .syi-toolbox-button');
    if (toolboxButtons.length > 0) { // Check if elements exist
        toolboxButtons.forEach(button => {
            button.style.backgroundColor = color;
            button.style.borderColor = color;
        });
    }

    document.documentElement.style.setProperty('--bg-color', color, 'important');
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
            this.setActiveButton('remove-audio-btn'); 
        });
    }
};

YourInclusion.prototype.audioRemoval = function () {
    const soundElements = document.querySelectorAll('audio, video');
    this.isMuted = !this.isMuted; 
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

    console.log(`${elements.length} ${type} elements toggled for highlighting.`);
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

    // Persist the state in localStorage
    localStorage.setItem('animationsDisabled', isDisabled);

    if (isDisabled) {
        console.log('Animations and transitions disabled.');
        this.setActiveButton('stop-animations-btn'); 
    } else {
        console.log('Animations and transitions re-enabled.');
        this.setActiveButton(null); 
    }
};

// Restore Animation State on Load
YourInclusion.prototype.restoreAnimationState = function () {
    const isDisabled = localStorage.getItem('animationsDisabled') === 'true';
    if (isDisabled) {
        document.body.classList.add('disable-animations');
        console.log('Restored: Animations are disabled.');
        this.setActiveButton('stop-animations-btn'); 
    } else {
        this.setActiveButton(null);
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
    console.log('Accessibility toolbox initialized.');
};

/***
 * Zoom
 */
YourInclusion.prototype.initZoomToggleFeature = function () {
    this.zoomStates = [1, 1.25, 1.5, 1.75]; 
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

    // Apply the selected zoom level
    this.applyZoom(zoomLevel);

    // Set the active button state explicitly
    const isActive = zoomLevel !== 1; 
    this.setActiveButton('zoom-toggle-btn', isActive);

    console.log(`Zoom level toggled to: ${zoomLevel}`);
};


// Apply Zoom Function
YourInclusion.prototype.applyZoom = function (zoomLevel) {
    const elementsToZoom = document.querySelectorAll('body > *:not(#syi-toolbox):not(#openToolboxButton):not(img)');

    elementsToZoom.forEach(element => {
        element.style.transform = `scale(${zoomLevel})`;
        element.style.transformOrigin = '0 0'; 
        element.style.width = `${100 / zoomLevel}%`; 
    });

    // Save the zoom level to localStorage
    this.saveZoomState(zoomLevel);

    console.log(`Zoom level applied: ${zoomLevel}`);
};


YourInclusion.prototype.restoreZoomState = function () {
    const savedZoomLevel = parseFloat(localStorage.getItem('zoomLevel')) || 1; 
    this.applyZoom(savedZoomLevel);
    this.zoomIndex = this.zoomStates.indexOf(savedZoomLevel);
    if (this.zoomIndex === -1) this.zoomIndex = 0; 
    const isActive = savedZoomLevel !== 1; 
    this.setActiveButton('zoom-toggle-btn', isActive);
};


// Save Zoom State on Change
YourInclusion.prototype.saveZoomState = function (zoomLevel) {
    localStorage.setItem('zoomLevel', zoomLevel);
    console.log(`Zoom level saved: ${zoomLevel}`);
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
    } else {
        console.error('Font toggle button not found.');
    }
};

YourInclusion.prototype.toggleAccessibleFont = function (buttonId) {
    
    const isFontApplied = document.body.classList.toggle('syi-accessible-font');
    this.setActiveButton(buttonId, isFontApplied);
    this.saveToolbarState();
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
    ]

    if (this.currentCursorSizeIndex === undefined) this.currentCursorSizeIndex = 0;
    this.currentCursorSizeIndex = (this.currentCursorSizeIndex + 1) % cursorSizes.length;
    const selectedCursor = cursorSizes[this.currentCursorSizeIndex];

    // Apply the custom cursor globally
    document.documentElement.style.cursor = selectedCursor.cursor;

    // Dynamically exclude the toolbox
    const toolbox = document.querySelector('.syi-toolbox');
    if (toolbox) {
        toolbox.style.cursor = 'auto';

        // Update toolbox position with custom exclusion logic
        const rect = toolbox.getBoundingClientRect();
        const style = document.documentElement.style;

        style.setProperty('--toolbox-top', `${rect.top}px`);
        style.setProperty('--toolbox-left', `${rect.left}px`);
        style.setProperty('--toolbox-width', `${rect.width}px`);
        style.setProperty('--toolbox-height', `${rect.height}px`);
    }

    // Add CSS dynamically to exclude the toolbox area
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

    // Update button text/icon
    const button = document.getElementById(buttonId);
    if (button) {
        // Retrieve the icon from the button creation logic
        const iconClass = './assests/cursor 1.svg'; // Dynamically reference the iconClass value
        const existingIcon = button.querySelector('img')?.outerHTML || `<img src="${iconClass}" alt="Cursor Icon" style="height: 20px; margin-right: 8px;">`;
    
        // Update button label while preserving the icon
        button.innerHTML = `${existingIcon} ${selectedCursor.label}`;
    }

    console.log(`Cursor size set to: ${selectedCursor.size}`);
};

// Keyboard Navigation

// Keyboard Navigation Initialization
YourInclusion.prototype.initKeyboardNavigation = function () {
    const keyboardNavButton = document.getElementById('keyboard-navigation-btn');
    if (keyboardNavButton) {
        keyboardNavButton.addEventListener('click', () => {
            this.keyboardNavigationActive = !this.keyboardNavigationActive;
            this.setActiveButton('keyboard-navigation-btn', this.keyboardNavigationActive);

            if (this.keyboardNavigationActive) {
                this.enableKeyboardNavigation();
                this.showKeyboardNavigationPopup();
            } else {
                this.disableKeyboardNavigation();
                this.hideKeyboardNavigationPopup();
            }
        });
    }
};


// Enable Keyboard Navigation
YourInclusion.prototype.enableKeyboardNavigation = function () {
    console.log('Keyboard Navigation Enabled');
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    document.body.classList.add('keyboard-navigation-active');
};

// Disable Keyboard Navigation
YourInclusion.prototype.disableKeyboardNavigation = function () {
    console.log('Keyboard Navigation Disabled');
    document.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    document.body.classList.remove('keyboard-navigation-active');
    this.clearSelectionHighlight();
};

// Handle Keyboard Navigation
YourInclusion.prototype.handleKeyboardNavigation = function (event) {
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
        KeyW: () => document.getElementById('blue-filter-btn')?.click(),
        KeyI: () => document.getElementById('remove-images-btn')?.click(),
        KeyA: () => document.getElementById('remove-audio-btn')?.click(),
        KeyR: () => document.getElementById('read-aloud-btn')?.click(),
        KeyP: () => document.getElementById('increase-text-btn')?.click(),
        KeyM: () => document.getElementById('decrease-text-btn')?.click(),
        KeyH: () => this.navigateToNext('heading'),
        KeyS: () => this.navigateToStart(),
        KeyZ: () => document.getElementById('zoom-toggle-btn')?.click(),
        KeyN: () => document.getElementById('night-mode-btn')?.click(),
        KeyT: () => document.getElementById('text-spacing-btn')?.click(),
        KeyL: () => this.navigateToNext('list'),
        KeyC: () => document.getElementById('cursor-size-btn')?.click(),
        KeyG: () => this.navigateToNext('image'),
        KeyK: () => this.navigateToNext('link'),
        KeyD: () => this.navigateToNext('jump-tag'),
        KeyF: () => this.navigateToNext('form-field'),
        KeyE: () => this.navigateToNext('input-field'),
        KeyB: () => this.navigateToNext('button'),
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
    const scrollAmount = 70; // Amount to scroll per action
    const scrollMap = {
        up: () => window.scrollBy({ top: -scrollAmount, behavior: 'smooth' }),
        down: () => window.scrollBy({ top: scrollAmount, behavior: 'smooth' }),
        left: () => window.scrollBy({ left: -scrollAmount, behavior: 'smooth' }),
        right: () => window.scrollBy({ left: scrollAmount, behavior: 'smooth' }),
    };

    if (scrollMap[direction]) {
        scrollMap[direction]();
    }
};

// Show Keyboard Shortcuts Popup
YourInclusion.prototype.showKeyboardNavigationPopup = function () {
    const existingPopup = document.getElementById('keyboard-navigation-popup');
    if (existingPopup) return;

    const popup = document.createElement('div');
    popup.id = 'keyboard-navigation-popup';
    popup.className = 'keyboard-popup';

    const header = document.createElement('div');
    header.className = 'popup-header';
    header.innerHTML = '<h3>Instructions for the use of keyboard shortcuts</h3><button class="close-popup-btn">✖</button>';
    header.querySelector('.close-popup-btn').addEventListener('click', () => popup.remove());
    popup.appendChild(header);

    const shortcuts = [
        { key: 'Esc', action: 'Exit web page navigation' },
        { key: 'F2', action: 'Show this guide' },
        { key: 'F3', action: 'Toggle speech output' },
        { key: 'Tab', action: 'Select next item' },
        { key: 'Shift + Tab', action: 'Select previous item' },
        { key: 'S', action: 'Reset focus to start' },
        { key: 'H', action: 'Next heading' },
        { key: 'G', action: 'Next image/graphic' },
        { key: 'K', action: 'Next link' },
        { key: 'D', action: 'Next jump tag' },
        { key: 'L', action: 'Next list' },
        { key: 'F', action: 'Next form field' },
        { key: 'E', action: 'Next input field' },
        { key: 'W', action: 'Blue Filter' },
        { key: 'I', action: 'Remove Images' },
        { key: 'A', action: 'Remove Audio' },
        { key: 'R', action: 'Read Aloud' },
        { key: 'P', action: 'Increase Text Font Size' },
        { key: 'M', action: 'Decrease Text Font Size' },
        { key: 'Z', action: 'Zoom Toggle' },
        { key: 'N', action: 'Night Mode' },
        { key: 'T', action: 'Text Spacing' },
        { key: 'C', action: 'Cursor Size ' },

    ];

    const body = document.createElement('div');
    body.className = 'popup-body';

    shortcuts.forEach(({ key, action }) => {
        const item = document.createElement('div');
        item.className = 'shortcut-item';
        item.innerHTML = `<span class="shortcut-key">${key}</span>: ${action}`;
        body.appendChild(item);
    });

    popup.appendChild(body);
    document.body.appendChild(popup);
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
    this.clearSelectionHighlight();
    if (element) {
        element.classList.add('keyboard-focus');
    }
};
YourInclusion.prototype.clearSelectionHighlight = function () {
    document.querySelectorAll('.keyboard-focus').forEach((el) => el.classList.remove('keyboard-focus'));
};


// Navigate to Specific Elements
YourInclusion.prototype.navigateToNext = function (type) {
    const selectors = {
        heading: 'h1, h2, h3, h4, h5, h6',
        list: 'ul, ol',
        'list-entry': 'li',
        'form-field': 'form',
        'input-field': 'input, textarea, select',
        button: 'button',
        link: 'a',
        image: 'img',
        'jump-tag': '[id]',
    };
    const elements = document.querySelectorAll(selectors[type]);
    const current = document.activeElement;
    const currentIndex = Array.from(elements).indexOf(current);
    const nextIndex = (currentIndex + 1) % elements.length;

    if (elements[nextIndex]) {
        elements[nextIndex].focus();
        this.highlightSelection(elements[nextIndex]);
    }
};

// Navigate to Start
YourInclusion.prototype.navigateToStart = function () {
    const firstFocusable = document.querySelector('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
        this.highlightSelection(firstFocusable);
    }
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

    // Check if Read Aloud was previously active (e.g., stored state)
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
        // Deactivate Read Aloud
        this.disableDefaultClickToRead();
        this.stopReadAloud();
        if (toolbar) toolbar.classList.add('hidden'); 
        this.setActiveButton(buttonId, false); 
        this.isReadAloudActive = false; 
        localStorage.setItem('readAloudActive', false);
        console.log('Read Aloud deactivated.');
    } else {
        // Activate Read Aloud
        if (!toolbar) {
            this.createReadAloudToolbar();
        } else {
            toolbar.classList.remove('hidden'); 
        }
        this.enableDefaultClickToRead();
        this.setActiveButton(buttonId, true); 
        this.isReadAloudActive = true; 
        localStorage.setItem('readAloudActive', true);
        console.log('Read Aloud activated.');
    }
};


// Create the Read Aloud Toolbar
YourInclusion.prototype.createReadAloudToolbar = function () {
    const toolbar = this.createDiv('read-aloud-toolbar', 'read-aloud-toolbar');

    // Toolbar Header
    const header = this.createDiv('toolbar-header');
    const title = this.createHeading(2, 'Read Aloud Settings', 'toolbar-title');
    const closeButton = this.createButton('close-toolbar', '✖');
    closeButton.addEventListener('click', () => {
        toolbar.remove();
        this.disableDefaultClickToRead();
    });
    header.appendChild(title);
    header.appendChild(closeButton);
    toolbar.appendChild(header);

    // Toolbar Controls
    const controls = this.createDiv('toolbar-controls');

    // Cursor Read Aloud Button
    const cursorButton = this.createButton('cursor-read-btn', 'Cursor Read Aloud');
    cursorButton.innerHTML = `<i class="fas fa-mouse-pointer"></i> Cursor Read Aloud`;
    cursorButton.addEventListener('click', this.enableCursorReadAloud.bind(this));

    // Previous Line Button
     const previousButton = this.createButton('previous-line-btn', 'Previous Line');
     previousButton.innerHTML = `<i class="fas fa-arrow-left"></i> `;
     previousButton.addEventListener('click', this.readPreviousLine.bind(this));

    // Play Button
    const playButton = this.createButton('play-read-btn', '▶');
    playButton.innerHTML = `<i class="fas fa-play"></i>`;
    playButton.addEventListener('click', this.playReadAloud.bind(this));

    // Stop Button
    const stopButton = this.createButton('stop-read-btn', '⏹');
    stopButton.innerHTML = `<i class="fas fa-stop"></i>`;
    stopButton.addEventListener('click', this.stopReadAloud.bind(this));
 
// Next Line Button
const nextButton = this.createButton('next-line-btn', 'Next Line');
nextButton.innerHTML = `<i class="fas fa-arrow-right"></i> `;
nextButton.addEventListener('click', this.readNextLine.bind(this));

// Create Volume and Speed Container
const slidersContainer = document.createElement('div');
slidersContainer.className = 'sliders-container';

// Create Volume Slider
const volumeWrapper = document.createElement('div');
volumeWrapper.className = 'slider-wrapper';

const volumeLabel = document.createElement('label');
volumeLabel.setAttribute('for', 'volume-slider');
volumeLabel.textContent = 'Volume:';
volumeWrapper.appendChild(volumeLabel);

const volumeSlider = document.createElement('input');
volumeSlider.type = 'range';
volumeSlider.id = 'volume-slider';
volumeSlider.min = '0';
volumeSlider.max = '1';
volumeSlider.step = '0.1';
volumeSlider.value = this.currentVolume || 1;

volumeSlider.addEventListener('input', (e) => {
this.currentVolume = parseFloat(e.target.value);
console.log(`Volume updated to: ${this.currentVolume}`);
});
volumeWrapper.appendChild(volumeSlider);

// Create Speed Slider
const speedWrapper = document.createElement('div');
speedWrapper.className = 'slider-wrapper';

const speedLabel = document.createElement('label');
speedLabel.setAttribute('for', 'speed-slider');
speedLabel.textContent = 'Speed:';
speedWrapper.appendChild(speedLabel);

const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.id = 'speed-slider';
speedSlider.min = '0.5';
speedSlider.max = '2';
speedSlider.step = '0.1';
speedSlider.value = this.currentSpeed || 1;

speedSlider.addEventListener('input', (e) => {
this.currentSpeed = parseFloat(e.target.value);
console.log(`Speed updated to: ${this.currentSpeed}`);
});
speedWrapper.appendChild(speedSlider);

// Add sliders to sliders container
slidersContainer.appendChild(volumeWrapper);
slidersContainer.appendChild(speedWrapper);

speedWrapper.appendChild(speedSlider);
    // Append Buttons and Controls
    controls.appendChild(cursorButton);
    controls.appendChild(previousButton);
    controls.appendChild(playButton);
    controls.appendChild(stopButton);
    controls.appendChild(nextButton);
    controls.appendChild(slidersContainer);
    toolbar.appendChild(controls);

    // Add Toolbar to Document Body
    document.body.appendChild(toolbar);
};

// Helper Function to Highlight Text
YourInclusion.prototype.highlightText = function (element, start, length) {
    const text = element.dataset.originalText || element.innerText || '';
    const before = text.slice(0, start);
    const highlight = text.slice(start, start + length);
    const after = text.slice(start + length);

    element.innerHTML = `${before}<span style="background-color: yellow;">${highlight}</span>${after}`;
};


// Enable Default Click-to-Read
YourInclusion.prototype.enableDefaultClickToRead = function () {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    elements.forEach(element => {
        element.addEventListener('click', this.readElementContent.bind(this));
    });
};

// Disable Default Click-to-Read
YourInclusion.prototype.disableDefaultClickToRead = function () {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    elements.forEach(element => {
        element.removeEventListener('click', this.readElementContent.bind(this));
    });
};

// Read Element Content with Highlighting
YourInclusion.prototype.readElementContent = function (event) {
    const element = event.target;
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

YourInclusion.prototype.clearHighlight = function (element) {
    if (element.dataset.originalText) {
        element.innerHTML = element.dataset.originalText;
    }
};



// Play Entire Page Read Aloud with Highlighting
YourInclusion.prototype.playReadAloud = function () {
    if (!this.isReadAloudActive) {
        console.log('Read Aloud is not active. Please enable it first.');
        return;
    }

    const paragraphs = document.querySelectorAll('p');

    if (!paragraphs.length) {
        console.log('No paragraphs found to read.');
        return;
    }

    // Initialize paragraph index and start reading
    this.currentParagraphIndex = 0;
    this.readCurrentLine();
};




// Enable Cursor Read Aloud
YourInclusion.prototype.enableCursorReadAloud = function () {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    elements.forEach(element => {
        let timeoutId;
        element.addEventListener('mouseenter', () => {
            timeoutId = setTimeout(() => {
                const msg = new SpeechSynthesisUtterance(element.innerText || element.value || '');
                msg.volume = this.currentVolume || 1;
                msg.rate = this.currentSpeed || 1;
                this.highlightText(element, 0, element.innerText.length); 
                speechSynthesis.speak(msg);
            }, 1000);
        });
        element.addEventListener('mouseleave', () => {
            clearTimeout(timeoutId);
            speechSynthesis.cancel();
        });
    });
};

YourInclusion.prototype.readPreviousLine = function () {
    if (this.currentParagraphIndex > 0) {
        this.currentParagraphIndex--;
        this.readCurrentLine();
    } else {
        console.log('Already at the first paragraph.');
    }
};



YourInclusion.prototype.readNextLine = function () {
    const paragraphs = document.querySelectorAll('p');

    if (this.currentParagraphIndex === undefined) this.currentParagraphIndex = 0;

    if (this.currentParagraphIndex < paragraphs.length - 1) {
        this.currentParagraphIndex++;
        this.readCurrentLine();
    } else {
        console.log('No more paragraphs to read.');
    }
};



YourInclusion.prototype.speakText = function (element) {
    const text = element.innerText || '';
    const msg = new SpeechSynthesisUtterance(text);
    msg.volume = this.currentVolume || 1;
    msg.rate = this.currentSpeed || 1;

    // Save original text for restoration
    if (!element.dataset.originalText) {
        element.dataset.originalText = text;
    }

    // Highlight words as they are spoken
    const words = text.split(' ');
    let wordIndex = 0;

    msg.onboundary = (event) => {
        if (event.name === 'word') {
            const wordStart = event.charIndex;
            const wordLength = words[wordIndex]?.length || 0;
            this.highlightText(element, wordStart, wordLength);
            wordIndex++;
        }
    };

    msg.onend = () => {
        this.clearHighlight(element); 
    };


    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
};



YourInclusion.prototype.readCurrentLine = function () {
    const paragraphs = document.querySelectorAll('h1,h2,h3,h4,h5,h6,p');

    if (this.currentParagraphIndex === undefined || this.currentParagraphIndex >= paragraphs.length) {
        console.log('No more paragraphs to read.');
        return;
    }

    const currentParagraph = paragraphs[this.currentParagraphIndex];
    this.speakText(currentParagraph);
};



// Stop Read Aloud
YourInclusion.prototype.stopReadAloud = function () {
    speechSynthesis.cancel(); 
    this.currentParagraphIndex = undefined; 

    // Clear highlights for all paragraphs
    document.querySelectorAll('[data-original-text]').forEach((element) => {
        this.clearHighlight(element);
    });

    console.log('Read Aloud stopped, and all highlights cleared.');
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



// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    new YourInclusion();
    loadScript();
});

export default YourInclusion;