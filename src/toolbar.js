'use strict';

function YourInclusion(init) {
    this.init = init || {};
    this.removedImages = [];
    this.imagesHidden = false;
    this.isMuted = false;
    this.selectedHeaderColor = '#393636';

    // Initialize the toolbox and other features
    this.initializeAccessibilityToolbox();
    this.initBlueFilter();
    this.initRemoveImages();
    this.addFontSizePopup();
    // this.initAudioRemoval();
    // this.initReadAloud();
    // this.initHighlightButtons();
    // this.initStopAnimationsButton();
    // this.initZoomToggleFeature();
    this.initNightModeFeature();
    this.initTextSpacingFeature();
    this.initLineHeightFeature();
    // this.initCursorSizeAdjustment();
    // this.initKeyboardNavigation();
    // this.initAccessibleFontToggle();
    this.initResetFeature();
    this.initContrastFeature();
    // this.initSaveFeature();   
    this.addSettingsButtonListener();
    this.addDevelopmentAlerts();

}

/*** Load Script */
function loadScript() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
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
        button.appendChild(iconWrapper); // Add icon wrapper if it exists
    }

    if (text) {
        const textWrapper = this.createTextWrapper(text);
        button.appendChild(textWrapper); // Add text wrapper
    }

    return button;
};

// Function to create a base button
YourInclusion.prototype.createBaseButton = function (id) {
    const button = document.createElement('button');
    button.className = 'yi-toolbox-button';
    button.id = id;
    return button;
};

// Function to create an icon wrapper
YourInclusion.prototype.createIconWrapper = function (icon, altText) {
    if (!icon) return null;

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';

    if (icon.startsWith('./') || icon.startsWith('/')) {
        // Inline SVG
        this.fetchAndAppendSVG(icon, iconWrapper);
    } else if (icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg')) {
        // Image files
        const imgIcon = this.createImageIcon(icon, altText);
        iconWrapper.appendChild(imgIcon);
    } else {
        // Font Awesome or other icons
        const fontAwesomeIcon = this.createFontAwesomeIcon(icon);
        iconWrapper.appendChild(fontAwesomeIcon);
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
                svgElement.classList.add('button-icon'); // Add a class for styling
                wrapper.appendChild(svgElement); // Append inline SVG to the wrapper
            }
        })
        .catch(error => console.error('Error fetching SVG:', error));
};

// Function to create an image icon
YourInclusion.prototype.createImageIcon = function (src, alt) {
    const imgIcon = document.createElement('img');
    imgIcon.src = src;
    imgIcon.alt = alt;
    imgIcon.className = 'button-icon';
    return imgIcon;
};

// Function to create a Font Awesome icon
YourInclusion.prototype.createFontAwesomeIcon = function (icon) {
    const fontAwesomeIcon = document.createElement('span');
    fontAwesomeIcon.innerHTML = icon; // Use the provided Font Awesome HTML
    fontAwesomeIcon.className = 'font-awesome-icon'; // Add a class for styling
    return fontAwesomeIcon;
};

// Function to create a text wrapper
YourInclusion.prototype.createTextWrapper = function (text) {
    const textWrapper = document.createElement('span');
    textWrapper.className = 'text-wrapper';
    textWrapper.textContent = text;
    return textWrapper;
};

// Function to create a button with only an icon (e.g., header buttons)
YourInclusion.prototype.createButtonWithIcon = function (id, iconClass) {
    const button = document.createElement('button');
    button.className = 'header-btn';
    button.id = id;

    const icon = document.createElement('span');
    icon.className = iconClass; // Use Font Awesome class for the icon
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
    const toolbox = this.createDiv('yi-toolbox hidden', 'yi-toolbox');

    // Create toolbox sections
    const header = this.createToolboxHeader(); // Header Section
    const body = this.createToolboxBody();     // Body Section

    // Append all parts to the toolbox
    toolbox.appendChild(header);
    toolbox.appendChild(body);

    // Add the toolbox to the document
    document.body.appendChild(toolbox);

    // Reset button states after creating the toolbox
    this.resetButtonStates();
};


// Function to create the toolbox header
YourInclusion.prototype.createToolboxHeader = function () {
    const header = this.createDiv('yi-toolbox-header');

    // Left Buttons (Settings and Reset)
    const headerLeft = this.createHeaderLeftSection();

    // Center Logo and Title
    const logo = this.createLogo();
    const title = this.createTitle('Site Point Eye Assistant');

    // Right Buttons (Info and Close)
    const headerRight = this.createHeaderRightSection();

    // Append all parts to the header
    header.appendChild(headerLeft);
    header.appendChild(logo);
    header.appendChild(title);
    header.appendChild(headerRight);

    return header;
};

// Function to create the left section of the header
YourInclusion.prototype.createHeaderLeftSection = function () {
    const headerLeft = this.createDiv('yi-toolbox-header-left');
    headerLeft.style.position = 'relative';
    headerLeft.style.bottom = '28%';

    // Settings Button with Font Awesome Icon
    const settingsButton = this.createButtonWithIcon('settings-btn', 'fas fa-cog');
    settingsButton.addEventListener('click', () => createSettingsPopup());
    headerLeft.appendChild(settingsButton);

    // Reset Button with Font Awesome Icon
    const resetButton = this.createButtonWithIcon('reset-btn', 'fas fa-undo');
    resetButton.addEventListener('click', () => initResetFeature());
    headerLeft.appendChild(resetButton);

    return headerLeft;
};

YourInclusion.prototype.createHeaderRightSection = function () {
    const headerRight = this.createDiv('yi-toolbox-header-right');
    headerRight.style.position = 'relative';
    headerRight.style.bottom = '28%';

    // Info Button 
    const infoButton = this.createButtonWithIcon('info-btn', 'fas fa-info-circle');
    headerRight.appendChild(infoButton);

    // Close Button 
    const closeButton = this.createButtonWithIcon('close-btn', 'fas fa-times');
    closeButton.addEventListener('click', () => this.closeToolboxFromButton());
    headerRight.appendChild(closeButton);

    return headerRight;
};
YourInclusion.prototype.closeToolboxFromButton = function () {
    const toolbox = document.querySelector('.yi-toolbox');
    if (toolbox) {
        toolbox.classList.remove('visible'); // Hide toolbox by removing the 'visible' class
        console.log('Toolbox has been closed.');
    }
};


// Function to create the toolbox logo
YourInclusion.prototype.createLogo = function () {
    const logo = document.createElement('img');
    logo.src = 'https://your-inclusion.s3.ap-south-1.amazonaws.com/Your_Inclusion/icons/image.png';
    logo.alt = 'Logo';
    logo.className = 'yi-toolbox-logo';
    return logo;
};

// Function to create the toolbox title
YourInclusion.prototype.createTitle = function (text) {
    const title = document.createElement('h2');
    title.className = 'yi-toolbox-title';
    title.textContent = text;
    return title;
};

// Function to create the toolbox body with all buttons
YourInclusion.prototype.createToolboxBody = function () {
    const body = this.createDiv('yi-toolbox-body');

    const buttons = [
        { id: 'blue-filter-btn', text: 'Blue Filter', iconClass: './assests/BlueFilter-1.svg' },
        { id: 'contrast-btn', text: 'Contrast Modes', iconClass: './assests/contrast.svg' },
        { id: 'remove-images-btn', text: 'Remove Images', iconClass: './assests/image-off.svg' },
        { id: 'font-size-btn', text: 'Font Size', iconClass: './assests/fontsize.svg' },
        { id: 'night-mode-btn', text: 'Night Mode', iconClass: './assests/mode-night.svg' },
        { id: 'text-spacing-btn', text: 'Text Spacing', iconClass: './assests/ri_text-spacing 2.svg' },
        { id: 'line-height-btn', text: 'Line Height', iconClass: './assests/ri_line-height 1.svg' },
        { id: 'remove-audio-btn', text: 'Remove Audio', iconClass: './assests/mdi_mute 1.svg' },
        { id: 'highlight-links-btn', text: 'Highlight Links', iconClass: './assests/link 1.svg' },
        { id: 'highlight-headers-btn', text: 'Highlight Headers', iconClass: './assests/cil_header 1.svg' },
        { id: 'stop-animations-btn', text: 'Stop Animations', iconClass: './assests/stop 1.svg' },
        { id: 'zoom-toggle-btn', text: 'Zoom', iconClass: './assests/zoom 1.svg' },
        { id: 'cursor-size-btn', text: 'Change Cursor Size', iconClass: './assests/cursor 1.svg' },
        { id: 'accessible-font-btn', text: 'Accessible Font', iconClass: './assests/font 1.svg' },
        { id: 'read-aloud-btn', text: 'Read Aloud', iconClass: './assests/read-aloud.svg' },
        { id: 'reset-btn1', text: 'Reset', iconClass: './assests/reset 1.svg' },
        { id: 'save-settings-btn', text: 'Save', iconClass: './assests/save 1.svg' },
    ];

    buttons.forEach(({ id, text, iconClass }) => {
        const buttonDiv = this.createDiv(id || text.replace(/\s+/g, '-').toLowerCase());
        const button = this.createButton(id, text, iconClass);
        buttonDiv.appendChild(button);
        body.appendChild(buttonDiv);
    });

    return body;
};

  /*** Check the status of each popup flag */
YourInclusion.prototype.arePopupsInactive = function () {
   
    const allInactive = !this.isFontSizePopupActive && !this.isSettingsPopupActive && !this.isContrastPopupActive;

    console.log(`Are all popups inactive? ${allInactive}`);
    return allInactive; // Return true only if all flags are false
};


/***  Initialize Toolbox */
YourInclusion.prototype.initializeAccessibilityToolbox = function () {
    this.createToolbox();
    this.createSideButton();

    const toolbox = document.getElementById('yi-toolbox');
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


YourInclusion.prototype.createSideButton = function () {
    const sideButton = this.createDiv('side-button', 'openToolboxButton');
    const buttonImage = this.createImage(
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s',
        'Open Toolbox',
        'side-button-image'
    );
    sideButton.appendChild(buttonImage);


 // Make the side button draggable
let isDragging = false;
let offsetX, offsetY;

sideButton.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - sideButton.offsetLeft;
    offsetY = e.clientY - sideButton.offsetTop;
    document.body.style.cursor = 'move';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        const windowWidth = window.innerWidth;

       
        if (x + sideButton.offsetWidth / 2 < windowWidth / 2) {
            x = 10; 
        } else {
            x = windowWidth - sideButton.offsetWidth - 20; 
        }

      
        sideButton.style.left = `${x}px`;
        sideButton.style.top = `${y}px`;

        const toolbox = document.getElementById('yi-toolbox');

       
        let toolboxLeft = x + sideButton.offsetWidth / 2 - toolbox.offsetWidth / 2;
        let toolboxTop = y - toolbox.offsetHeight - 60;

      
        if (toolboxLeft + toolbox.offsetWidth > windowWidth) {
            toolboxLeft = windowWidth - toolbox.offsetWidth - 10;
        }
        if (toolboxLeft < 10) {
            toolboxLeft = 10;
        }

        
        const windowHeight = window.innerHeight;

     
        if (toolboxTop < 10) {
            toolboxTop = 10;
        }

        if (toolboxTop + toolbox.offsetHeight > windowHeight) {
            toolboxTop = windowHeight - toolbox.offsetHeight - 10;
        }

        
        toolbox.style.left = `${toolboxLeft}px`;
        toolbox.style.top = `${toolboxTop}px`;

    
        const isToolboxOnLeft = toolboxLeft < windowWidth / 2;
        

   
         this.updatePopupPositions(isToolboxOnLeft);
        }
    });
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
    }
});


    document.body.appendChild(sideButton);
};

/**
 * Updates the positions of all popups dynamically based on the toolbox location.
 * @param {boolean} isToolboxOnLeft 
 */

    YourInclusion.prototype.updatePopupPositions = function (isToolboxOnLeft) {

    const popupConfigs = [
        { selector: '.font-size-popup', left: isToolboxOnLeft ? '25%' : '74%' },
        { selector: '.settings-popup', left: isToolboxOnLeft ? '28%' : '72%' },
        { selector: '.contrast-popup', left: isToolboxOnLeft ? '30%' : '70%' },
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
            const blueOverlay = document.querySelector('.blue-overlay');

            if (blueOverlay) {
              
                blueOverlay.remove();
                this.setActiveButton('blue-filter-btn', false);
            } else {
               
                const newBlueOverlay = this.createDiv('blue-overlay');
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
    
    const images = document.querySelectorAll('img:not(.yi-toolbox-image):not(.side-button-image):not(.yi-toolbox-logo)');

    
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
   
    const buttons = document.querySelectorAll('.yi-toolbox-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            buttons.forEach(btn => (btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)"));

            button.style.backgroundColor = "rgba(52, 88, 185, 1)";
        });
    });
});

/*** Font size setting PopuP */
YourInclusion.prototype.addFontSizePopup = function () {
    const fontSizeDiv = document.querySelector('.font-size-btn'); // Font Size button
    const toolbox = document.querySelector('.yi-toolbox-body'); // Toolbox container

    if (!fontSizeDiv || !toolbox) {
        console.error('Font Size button or toolbox not found.');
        return;
    }

    // Add event listener for the Font Size button (execute only when button is clicked)
    fontSizeDiv.addEventListener('click', () => {
        // Check if the popup already exists
        let fontSizePopup = document.querySelector('.font-size-popup');
        if (!fontSizePopup) {
            // Create the popup container
            fontSizePopup = document.createElement('div');
            fontSizePopup.className = 'font-size-popup';

            // Add the popup content
            fontSizePopup.innerHTML = `
                <div class="font-popup-header">
                    <span class="font-popup-title">Font Size Settings</span>
                    <button id="close-font-popup" class="close-popup-btn">✖</button>
                </div>
                <div class="font-popup-content">
                    <button id="decrease-font-btn" class="font-popup-btn">-</button>
                    <span id="font-size-display" class="font-popup-display">0</span>
                    <button id="increase-font-btn" class="font-popup-btn">+</button>
                </div>
                <div class="font-popup-reset">
                    <button id="reset-font-btn" class="reset-popup-btn">Reset</button>
                </div>
            `;

            // Append the popup to the body
            document.body.appendChild(fontSizePopup);

            // Position the popup close to the toolbox
            const toolboxRect = toolbox.getBoundingClientRect();
            fontSizePopup.style.top = `${toolboxRect.top + 20}px`;
            fontSizePopup.style.left = `${toolboxRect.left + 20}px`;

            // Initialize font size logic
            const decreaseButton = fontSizePopup.querySelector('#decrease-font-btn');
            const increaseButton = fontSizePopup.querySelector('#increase-font-btn');
            const resetButton = fontSizePopup.querySelector('#reset-font-btn');
            const fontSizeDisplay = fontSizePopup.querySelector('#font-size-display');
            const closeButton = fontSizePopup.querySelector('#close-font-popup');

            // Track font size adjustment relative to original
            let fontSizeChange = 0;

            // Save original font sizes
            const originalFontSizes = new Map();
            const allElements = document.body.querySelectorAll(
                '*:not(.yi-toolbox):not(.yi-toolbox *):not(.font-size-popup):not(.font-size-popup *)'
            );
            allElements.forEach((element) => {
                const computedStyle = window.getComputedStyle(element);
                originalFontSizes.set(element, computedStyle.fontSize);
            });

            // Function to update font size for all elements
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
                if (fontSizeChange > -6) { // Limit decrease to -6
                    fontSizeChange -= 1;
                    applyFontSizeChange(fontSizeChange);
                    updateFontSizeDisplay();
                }
            });

            increaseButton.addEventListener('click', () => {
                if (fontSizeChange < 6) { // Limit increase to +6
                    fontSizeChange += 1;
                    applyFontSizeChange(fontSizeChange);
                    updateFontSizeDisplay();
                }
            });

            resetButton.addEventListener('click', () => {
                // Reset all elements to their original font size
                allElements.forEach((element) => {
                    element.style.fontSize = originalFontSizes.get(element);
                });
                fontSizeChange = 0; // Reset the change
                updateFontSizeDisplay(); // Reset display to 0
            });

            closeButton.addEventListener('click', () => {
                fontSizePopup.style.display = 'none';
            });
        }

        // Toggle popup visibility
        if (fontSizePopup.style.display === 'block') {
            fontSizePopup.style.display = 'none';
            this.isFontSizePopupActive = false;
        } else {
            this.closeAllPopups(); // Close other popups
            fontSizePopup.style.display = 'block'; // Show font size popup
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

   
    const isNightModeEnabled = localStorage.getItem('nightMode') === 'true';
    document.body.classList.toggle('night-mode', isNightModeEnabled);
    this.setActiveButton('night-mode-btn', isNightModeEnabled);
};

YourInclusion.prototype.toggleNightMode = function () {
    
    const allElements = document.querySelectorAll(':not(button):not(input):not(.yi-toolbox):not(.yi-toolbox *)');

    
    const isNightModeEnabled = document.body.classList.toggle('night-mode');
    localStorage.setItem('nightMode', isNightModeEnabled);

   
    allElements.forEach(element => {
        if (isNightModeEnabled) {
            element.classList.add('night-mode');
        } else {
            element.classList.remove('night-mode');
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
    const elementsToAdjust = document.querySelectorAll('body *:not(.yi-toolbox):not(.yi-toolbox *)');
    const spacingStates = ['normal', '0.1em', '0.2em', '0.3em'];

   
    if (this.currentTextSpacingIndex === undefined) {
        this.currentTextSpacingIndex = 0;
    }

    
    this.currentTextSpacingIndex = (this.currentTextSpacingIndex + 1) % spacingStates.length;
    const spacingLevel = spacingStates[this.currentTextSpacingIndex];

    
    elementsToAdjust.forEach(element => {
        element.style.letterSpacing = spacingLevel;
    });

    
    const isActive = spacingLevel !== 'normal';
    this.setActiveButton(buttonId, isActive); 

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
    const elementsToAdjust = document.querySelectorAll('body *:not(.yi-toolbox):not(.yi-toolbox *)');
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

    console.log(`Line height set to: ${lineHeightLevel}`);
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



YourInclusion.prototype.resetButtonStates = function () {
    const buttons = document.querySelectorAll('.yi-toolbox-button');
    buttons.forEach((button) => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; 
        button.dataset.active = 'false'; 
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
}


YourInclusion.prototype.resetToolbox = function () {
    this.closeAllPopups();
    /*** Remove highlights added by the toolbox */
    document.querySelectorAll('.highlight-links, .highlight-headers, .highlight-images').forEach(el => {
        el.classList.remove('highlight-links', 'highlight-headers', 'highlight-images');
    });

    /*** Restore only toolbox-specific font size, spacing, and transforms, excluding popups and toolbox */
    document.querySelectorAll('[data-toolbox-modified]').forEach(el => {
        if (!el.closest('.font-size-popup') && !el.closest('.yi-toolbox')) { 
            el.style.fontSize = ''; 
            el.style.letterSpacing = '';
            el.style.lineHeight = ''; 
            el.style.transform = ''; 
            el.style.transformOrigin = ''; 
            el.style.width = ''; 
            el.removeAttribute('data-toolbox-modified');
        }
    });

    /*** Remove blue filter if applied by the toolbox */
    const blueOverlay = document.querySelector('.blue-overlay');
    if (blueOverlay) blueOverlay.classList.remove('active');

    /*** Restore images hidden by the toolbox */
    const removeImageButton = document.getElementById('remove-images-btn');
    if (this.imagesHidden && removeImageButton) {
        removeImageButton.click();
        console.log('Remove Images button triggered via reset.');
    }


    /*** Unmute audio/video elements muted by the toolbox */
    const soundElements = document.querySelectorAll('[data-toolbox-muted]');
    soundElements.forEach(el => {
        el.muted = false; 
        el.removeAttribute('data-toolbox-muted');
    });

    /*** Disable night mode introduced by the toolbox */
    const nightModeButton = document.getElementById('night-mode-btn');
    if (document.body.classList.contains('night-mode') && nightModeButton) {
        nightModeButton.click(); // Trigger the Night Mode button
    }

    /*** Reset cursor size to default */
    document.documentElement.style.cursor = 'auto';

    /***  Reset accessible font settings */
    document.body.classList.remove('accessible-font');

    /*** Re-enable animations if disabled by the toolbox */
    document.body.classList.remove('disable-animations');

    /*** Trigger resetContrast function to handle contrast settings */
    this.resetContrast();

    /*** Click the reset button in the settings popup if it exists */
const settingsResetButton = document.querySelector('.settings-popup .reset-popup-btn, .settings-popup .popup-reset');
if (settingsResetButton) {
    settingsResetButton.click();
    console.log('Settings popup reset triggered.');
}

/*** Click the reset button in the font size popup if it exists */
const fontSizeResetButton = document.querySelector('.font-size-popup .reset-popup-btn, .font-size-popup .popup-reset');
if (fontSizeResetButton) {
    fontSizeResetButton.click();
    console.log('Font size popup reset triggered.');
}


   /*** Clear toolbox-specific local storage settings */
   localStorage.removeItem('animationsDisabled');
   localStorage.removeItem('nightMode');
   localStorage.removeItem('zoomLevel');
   localStorage.removeItem('toolbarState');

   /*** Reset zoom level */
   this.applyZoom(1);

   /*** Reset text spacing, excluding toolbox and popups */
   const elementsToAdjust = document.querySelectorAll('body *:not(.yi-toolbox):not(.yi-toolbox *):not(.font-size-popup):not(.font-size-popup *)');
   elementsToAdjust.forEach(element => {
       element.style.letterSpacing = 'normal';
       element.style.lineHeight = 'normal';
       element.style.fontSize = '';
   });

//    /*** Reset font size *
   this.currentFontSize = null;

    /***Reset Language and Default color   */
   languageDropdown.value = defaultSettings.language; 
    document.documentElement.style.setProperty('--bg-color', defaultSettings.color, 'important');
    

    /*** Reset button states controlled by the toolbox */
    this.resetButtonStates();

    console.log('Toolbox reset to the original state.');
}


/*** Contrast Mode */


// Initialize Contrast Feature
YourInclusion.prototype.initContrastFeature = function () {
    const contrastButton = document.getElementById('contrast-btn');
    if (contrastButton) {
        contrastButton.addEventListener('click', () => {
            this.createContrastPopup();
            this.setActiveButton('contrast-btn');
        });
    }
};

// Toggle Contrast Popup
YourInclusion.prototype.createContrastPopup = function () {
    this.closeAllPopups(); // Close any other active popups

    // Check if the popup already exists
    const existingPopup = document.getElementById('contrast-popup');
    if (existingPopup) {
        existingPopup.remove();
        this.isContrastPopupActive = false;
        return;
    }

    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'contrast-popup';
    popup.className = 'contrast-popup'; // Ensure this class is styled in your CSS

    // Attach the header using the createPopupHeader function
    const header = this.createPopupHeader('Contrast Settings', () => {
        popup.remove(); // Remove the popup when closed
        this.isContrastPopupActive = false;
    });
    popup.appendChild(header);

    // Create the body content
    const body = document.createElement('div');
    body.className = 'contrast-popup-body';

    // Add buttons, controls, or other elements to the body
    this.addPresetModes(body);
    this.addCustomColorControls(body);

    // Add a reset button to the body
    const resetButton = document.createElement('button');
    resetButton.className = 'contrast-reset-button';
    resetButton.textContent = 'Reset Contrast';
    resetButton.addEventListener('click', () => this.resetContrast());
    body.appendChild(resetButton);

    popup.appendChild(body);

    // Position the popup dynamically relative to the toolbox
    const toolbox = document.querySelector('.yi-toolbox');
    if (!toolbox) {
        console.error('Toolbox element not found!');
        return;
    }

    const toolboxRect = toolbox.getBoundingClientRect();
    const popupWidth = 400; 
     

    // Position the popup to the right or left of the toolbox
    
    popup.style.top = `${toolboxRect.top + window.scrollY}px`;
    if (toolboxRect.left < window.innerWidth / 2) {
        // Place popup to the right of the toolbox
        popup.style.left = `${toolboxRect.right + 10}px`; //
    } else {
        // Place popup to the left of the toolbox
        popup.style.left = `${toolboxRect.left - popupWidth - 10}px`; 
    }


    // Add the popup to the document body
    document.body.appendChild(popup);

    this.isContrastPopupActive = true; // Update the active state
};


YourInclusion.prototype.createPopupHeader = function (titleText, closeCallback) {
    // Create the header container
    const header = document.createElement('div');
    header.className = 'contrast-popup-header'; // Ensure this class is styled in your CSS

    // Create the title element
    const title = document.createElement('h3');
    title.className = 'contrast-popup-title'; // Ensure this class is styled in your CSS
    title.textContent = titleText;
    header.appendChild(title);



    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.className = 'contrast-popup-close'; // Ensure this class is styled in your CSS
    closeButton.textContent = '✖'; // Close icon
    closeButton.setAttribute('aria-label', 'Close'); // Accessibility: screen reader-friendly
    closeButton.addEventListener('click', () => {
        if (typeof closeCallback === 'function') {
            closeCallback(); // Call the callback to handle the close action
        }
    });
    header.appendChild(closeButton);

    return header;
};

YourInclusion.prototype.addPresetModes = function (container) {
    const modes = [{ id: 'grayscale', text: 'Uncolored Display' }];

    modes.forEach(({ id, text }) => {
        const modeButton = document.createElement('button');
        modeButton.id = id;
        modeButton.className = 'contrast-mode-button';
        modeButton.textContent = text;
        modeButton.addEventListener('click', (e) => this.toggleContrastMode(id, e.target));
        container.appendChild(modeButton);
    });
};
YourInclusion.prototype.addCustomColorControls = function (container) {
    const customColorsSection = document.createElement('div');
    customColorsSection.className = 'contrast-custom-colors';

    const predefinedColors = ['#FFFFFF', '#000000', '#F0E68C', '#ADD8E6', '#FFB6C1'];

    // Background Section
    const bgLabel = document.createElement('label');
    bgLabel.textContent = 'Background:';

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

    // Text Color Section
    const textLabel = document.createElement('label');
    textLabel.textContent = 'Text Color:';

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
    // Select all elements except buttons, inputs, toolbox, and popups
    const elements = document.querySelectorAll(
        '*:not(button):not(input):not(.yi-toolbox):not(.yi-toolbox *):not(.contrast-popup):not(.contrast-popup *)'
    );

    elements.forEach((element) => {
        // Apply the background color
        element.style.background = color;
        element.style.backgroundColor = color;
    });

    console.log(`Background applied to all elements: ${color}`);
};

YourInclusion.prototype.applyCustomTextColor = function (color) {
    if (color) {
        // Dynamically exclude elements inside toolbox and popup
        const excludeToolbarAndPopup = (element) => {
            return (
                !element.closest('.yi-toolbox') && // Exclude if the element or its ancestors are inside toolbox
                !element.closest('.contrast-popup') // Exclude if the element or its ancestors are inside contrast-popup
            );
        };

        // Select all relevant text elements
        const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, span, li, a, div, label, input, textarea'
        );

        textElements.forEach((element) => {
            if (excludeToolbarAndPopup(element)) {
                element.style.color = color; // Apply color to allowed elements only
            } else {
                console.log('Excluded element:', element); // Debug excluded elements
            }
        });

        this.customTextColor = color; // Store the applied color
    }
};


// Reset Contrast
YourInclusion.prototype.resetContrast = function () {
    // Remove all contrast classes from the body
    document.body.classList.remove('bright-contrast', 'reverse-contrast', 'grayscale');

    // Reset body styles
    document.body.style.background = '';
    document.body.style.backgroundColor = '';
    document.body.style.color = ''; // Reset body text color

    // Reset all elements' background and text color styles
    const allElements = document.querySelectorAll(
        '*:not(.yi-toolbox):not(.yi-toolbox *):not(.contrast-popup):not(.contrast-popup *)'
    );
    allElements.forEach((element) => {
        // Reset background properties
        element.style.background = '';
        element.style.backgroundColor = '';
        
        // Reset text color, but ensure to remove any color-related classes
        element.style.color = '';  // Remove inline style
        
        // Optionally, reset class-based colors (if classes like "bright-contrast" are applied)
        element.classList.remove('bright-contrast', 'reverse-contrast', 'grayscale');
    });

    console.log('Contrast settings reset to original.');
};


// Toggle Contrast Modes
YourInclusion.prototype.toggleContrastMode = function (mode, button) {
    const bodyClassList = document.body.classList;

    // Check if the mode is currently active
    const isActive = bodyClassList.contains(mode);

    // Remove all other contrast modes
    bodyClassList.remove('bright-contrast', 'reverse-contrast', 'grayscale');

    // If the clicked mode was not active, activate it
    if (!isActive) {
        bodyClassList.add(mode);
        console.log(`${mode} mode activated.`);
    } else {
        console.log(`${mode} mode deactivated.`);
    }

    // Update the button states
    this.updateContrastButtonStates(button, isActive);
};

// Update Contrast Button States
YourInclusion.prototype.updateContrastButtonStates = function (clickedButton, isActive) {
    const buttons = document.querySelectorAll('.contrast-mode-button');
    buttons.forEach((button) => {
        if (button === clickedButton && !isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
};

// Set the Contrast Mode
YourInclusion.prototype.setContrastMode = function (savedState) {
    if (!savedState) return;

    const { contrastMode, bgColor, textColor } = savedState;

    // Apply preset contrast mode
    if (contrastMode) {
        document.body.classList.add(contrastMode);
        console.log(`Restored contrast mode: ${contrastMode}`);
    }

    // Apply custom background color
    if (bgColor) {
        document.body.style.backgroundColor = bgColor;
        console.log(`Restored background color: ${bgColor}`);
    }

    // Apply custom text color
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
        selectedHeaderColor: localStorage.getItem('popupHeaderColor') || null 
    };

    // Save state to localStorage
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
       if (savedState.currentFontSize) {
        const currentFontSize = parseFloat(savedState.currentFontSize);
        const calculatedFontSize = this.getCurrentFontSize();
        const adjustment = currentFontSize - calculatedFontSize;

        if (adjustment > 0) {
            for (let i = 0; i < adjustment; i++) this.adjustFontSize('increase');
        } else if (adjustment < 0) {
            for (let i = 0; i < -adjustment; i++) this.adjustFontSize('decrease');
        }
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

    console.log('Toolbar state restored successfully.');
};



// Helper Functions
YourInclusion.prototype.getCurrentFontSize = function () {
    const allElements = document.querySelectorAll('body *:not(.yi-toolbox):not(.yi-toolbox *)');
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

    // Return the average font size or default to 16px
    const averageFontSize = count > 0 ? totalFontSize / count : 16;
    console.log(`Calculated average font size: ${averageFontSize}px`);
    return averageFontSize;
};


YourInclusion.prototype.getContrastMode = function () {
    if (document.body.classList.contains('grayscale')) return 'grayscale';
    return null;
};

YourInclusion.prototype.getActiveButtons = function () {
    const buttons = Array.from(document.querySelectorAll('.yi-toolbox-button[data-active="true"]'));
    return buttons.map(button => button.id);
};

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

    const toolbox = document.getElementById('yi-toolbox');
    const sideButton = document.getElementById('openToolboxButton');

    // Open/close toolbox on side button click
    sideButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toolbox.classList.toggle('visible');
    });

    // document.addEventListener('click', (event) => {
    //     // Check if any popup is currently active
    //     const isPopupActive = document.querySelector(
    //         '.font-size-popup[style*="display: block"], ' +
    //         '.settings-popup[style*="display: block"], ' +
    //         '.contrast-popup[style*="display: block"], ' +
    //         '.read-aloud-popup[style*="display: block"], ' +
    //         '.font-size-popup.visible, ' +
    //         '.settings-popup.visible, ' +
    //         '.contrast-popup.visible, ' +
    //         '.read-aloud-popup.visible'
    //     );
    
    //     // Only close the toolbox if no popup is active
    //     if (!isPopupActive && !toolbox.contains(event.target) && !sideButton.contains(event.target)) {
    //         toolbox.classList.remove('visible');
    //     }
    // });
    
    

    // Load saved state
    this.loadToolbarState();
};

YourInclusion.prototype.resetSettings = function () {
    localStorage.removeItem('toolbarState');
    this.resetToolbox();
    console.log('Toolbar state reset.');
};

// Color Change Helper



// Setting button functions

// Add the event listener for the settings button
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

    if (document.querySelector('.settings-popup')) return;

    const popup = this.createPopupContainer();
    const header = this.createPopupHeader('Settings');
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

// Function to create the popup container
YourInclusion.prototype.createPopupContainer = function () {
    const popup = this.createDiv('settings-popup');
    popup.style.position = 'absolute';
    popup.style.top = '19%';
    return popup;
};

// Function to create the popup header
YourInclusion.prototype.createPopupHeader = function (titleText) {
    const header = this.createDiv('settings-popup-header');
    const headerTitle = this.createHeading(3, titleText, 'settings-popup-title');
    header.appendChild(headerTitle);
    return header;
};

// Function to create the language selector
YourInclusion.prototype.createLanguageSelector = function () {
    const languageSelector = this.createDiv('popup-section');

    const languageLabel = this.createEle('label', { for: 'language-select' }, 'Select Language: ');
    const languageDropdown = this.createEle('select', { id: 'language-select' });
    languageDropdown.innerHTML = `
        <option value="en">English</option>
        <option value="de">German</option>
    `;

    languageSelector.appendChild(languageLabel);
    languageSelector.appendChild(languageDropdown);
    return languageSelector;
};

// Function to create the color picker
YourInclusion.prototype.createColorPicker = function (header) {
    const colorPicker = this.createDiv('popup-section');

    const colorLabel = this.createEle('label', {}, 'Pick a Color: ');
    const colorInput = this.createEle('input', { type: 'color', id: 'color-picker', value: '#007bff' });

    colorInput.addEventListener('input', (event) => {
        this.updateToolboxColor(header, event.target.value);
    });

    colorPicker.appendChild(colorLabel);
    colorPicker.appendChild(colorInput);
    return colorPicker;
};

// Function to create the reset button
YourInclusion.prototype.createPopupResetButton = function (header, colorPicker) {
    const resetButton = this.createEle('button', { class: 'popup-reset' }, 'Reset');
    resetButton.style.color = 'white';

    resetButton.addEventListener('click', () => {
        this.resetPopupSettings(header, colorPicker);
    });

    return resetButton;
};

// Function to reset the popup settings
YourInclusion.prototype.resetPopupSettings = function (header, colorPicker) {
    const defaultSettings = { color: '#393636', language: 'en' };

    header.style.backgroundColor = defaultSettings.color;
    colorPicker.querySelector('#color-picker').value = defaultSettings.color;

    const toolboxHeader = document.querySelector('.yi-toolbox-header');
    if (toolboxHeader) toolboxHeader.style.backgroundColor = defaultSettings.color;

    const toolboxIcons = document.querySelectorAll('.yi-toolbox-body svg');
    toolboxIcons.forEach(svg => {
        svg.style.fill = defaultSettings.color;
        svg.style.stroke = defaultSettings.color;

        const innerElements = svg.querySelectorAll('*');
        innerElements.forEach(inner => {
            inner.style.fill = defaultSettings.color;
            inner.style.stroke = defaultSettings.color;
        });
    });

    const toolboxButtons = document.querySelectorAll('.yi-toolbox-body .yi-toolbox-btn, .yi-toolbox-button');
    toolboxButtons.forEach(button => {
        button.style.backgroundColor = defaultSettings.color;
        button.style.borderColor = defaultSettings.color;
        button.style.color = defaultSettings.color;
    });

    document.getElementById('language-select').value = defaultSettings.language;
    document.documentElement.style.setProperty('--bg-color', defaultSettings.color, 'important');
};

// Function to create the close button
YourInclusion.prototype.createPopupCloseButton = function (popup) {
    const closeButton = this.createEle('button', { class: 'popup-close' }, 'X');
    closeButton.addEventListener('click', () => popup.remove());
    return closeButton;
};

// Function to update toolbox and popup colors dynamically
YourInclusion.prototype.updateToolboxColor = function (header, color) {
    header.style.backgroundColor = color;

    const toolboxHeaders = document.querySelectorAll('.yi-toolbox-header, .settings-popup-header');
    toolboxHeaders.forEach(header => {
        header.style.setProperty('background-color', color, 'important');
    });

    const toolboxIcons = document.querySelectorAll('.yi-toolbox-body svg');
    toolboxIcons.forEach(svg => {
        svg.style.fill = color;
        svg.style.stroke = color;

        const innerElements = svg.querySelectorAll('*');
        innerElements.forEach(inner => {
            inner.style.fill = color;
            inner.style.stroke = color;
        });
    });

    const toolboxButtons = document.querySelectorAll('.yi-toolbox-body .yi-toolbox-btn, .yi-toolbox-button');
    toolboxButtons.forEach(button => {
        button.style.backgroundColor = color;
        button.style.borderColor = color;
    });

    document.documentElement.style.setProperty('--bg-color', color, 'important');
};

// Function to determine toolbox position
YourInclusion.prototype.determineToolboxPosition = function (popup) {
    const toolbox = document.querySelector('.yi-toolbox');
    const toolboxRect = toolbox.getBoundingClientRect();
    const isToolboxOnLeft = toolboxRect.left < window.innerWidth / 2;

    popup.style.left = isToolboxOnLeft ? '28%' : '71%';
    return isToolboxOnLeft;
};



// Popup Close
YourInclusion.prototype.closeAllPopups = function (excludeSelector) {
    const popupSelectors = ['.settings-popup', '.contrast-popup', '.font-size-popup']; 
    popupSelectors.forEach((selector) => {
        if (selector !== excludeSelector) {
            const popup = document.querySelector(selector);
            if (popup) {
                // Prevent affecting the toolbox explicitly
                if (!popup.matches('.yi-toolbox-body') && !popup.closest('.yi-toolbox-body')) {
                    if (selector === '.font-size-popup') {
                        // Special handling for font-size popup
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

// Alert for buttons

YourInclusion.prototype.addDevelopmentAlerts = function () {
    const buttonIds = [
        'remove-audio-btn',
        'highlight-links-btn',
        'highlight-headers-btn',
        'stop-animations-btn',
        'zoom-toggle-btn',
        'cursor-size-btn',
        'accessible-font-btn',
        'read-aloud-btn',
        'save-settings-btn'
    ];

    buttonIds.forEach((id) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
                alert("Function under development.");
            });
        } else {
            console.warn(`Button with ID '${id}' not found.`);
        }
    });
};





// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    new YourInclusion();
    loadScript();
});

