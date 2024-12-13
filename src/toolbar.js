
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
    this.initStopAnimationsButton();
    this.initZoomToggleFeature();
    this.initNightModeFeature();
    this.initTextSpacingFeature();
    this.initLineHeightFeature();
    // this.initCursorSizeAdjustment();
    // this.initKeyboardNavigation();
    // this.initAccessibleFontToggle();
    this.initResetFeature();
    this.initContrastFeature();
    this.initSaveFeature();   
    this.addSettingsButtonListener();

}

// Load FontAwesome
function loadScript() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    link.type = 'text/css';


    document.head.appendChild(link);
}

// Generic Element Creator

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

// Specific Element Creators

    YourInclusion.prototype.createButton = function(id, text, icon = ''){
    // Create the button element
    const button = document.createElement('button');
    button.className = 'yi-toolbox-button';
    button.id = id;

    // Create a wrapper div for the icon
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';

    // Check if the icon is a URL or Font Awesome class
    if (icon) {
        if (icon.startsWith('./') || icon.startsWith('/')) {
            // Add inline SVG from local path
            fetch(icon)
                .then(response => response.text())
                .then(svgContent => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = svgContent;

                    const svgElement = tempDiv.querySelector('svg');
                    if (svgElement) {
                        svgElement.classList.add('button-icon'); // Add a class for styling
                        iconWrapper.appendChild(svgElement); // Append inline SVG to the wrapper
                    }
                })
                .catch(error => console.error('Error fetching SVG:', error));
        } else {
            // Add Font Awesome icon
            const fontAwesomeIcon = document.createElement('span');
            fontAwesomeIcon.innerHTML = icon; // Use the provided Font Awesome HTML
            fontAwesomeIcon.className = 'font-awesome-icon'; // Add a class for styling
            iconWrapper.appendChild(fontAwesomeIcon); // Append the Font Awesome icon to the wrapper
        }
    }

    // Add the icon wrapper to the button
    button.appendChild(iconWrapper);

    // Add the button text
    const textWrapper = document.createElement('div');
    textWrapper.className = 'text-wrapper';
    textWrapper.textContent = text;
    button.appendChild(textWrapper);

    return button;
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

// Create Toolbox
YourInclusion.prototype.createToolbox = function () {
    const toolbox = this.createDiv('yi-toolbox hidden', 'yi-toolbox');
    const imageContainer = this.createDiv('yi-toolbox-image-container');
   
    toolbox.appendChild(imageContainer);
   // Header Section
   const header = this.createDiv('yi-toolbox-header');

   // Left Buttons
const headerLeft = this.createDiv('yi-toolbox-header-left');

const settingsButton = document.createElement('button');
settingsButton.id = 'settings-btn';
settingsButton.className = 'header-btn';
settingsButton.innerHTML = '<i class="fas fa-cog"></i>'; 
headerLeft.style.position = "relative";
headerLeft.style.bottom = "28%";
headerLeft.appendChild(settingsButton);

const resetButton = document.createElement('button');
resetButton.id = 'reset-btn';
resetButton.className = 'header-btn';
resetButton.innerHTML = '<i class="fas fa-undo"></i>'; // Add icon
headerLeft.appendChild(resetButton);

// Center Logo and Title
const logo = document.createElement('img');
logo.src = 'https://your-inclusion.s3.ap-south-1.amazonaws.com/Your_Inclusion/icons/image.png';
logo.alt = 'Logo';
logo.className = 'yi-toolbox-logo';

const title = document.createElement('h2');
title.className = 'yi-toolbox-title';
title.textContent = 'Site Point Eye Assistant';

// Right Buttons
const headerRight = this.createDiv('yi-toolbox-header-right');

const infoButton = document.createElement('button');
infoButton.id = 'info-btn';
infoButton.className = 'header-btn';
infoButton.innerHTML = '<i class="fas fa-info-circle"></i>'; // Add icon
headerRight.style.position = "relative";
headerRight.style.bottom = "28%";
headerRight.appendChild(infoButton);

const closeButton = document.createElement('button');
closeButton.id = 'close-btn';
closeButton.className = 'header-btn';
closeButton.innerHTML = '<i class="fas fa-times"></i>'; // Add icon
headerRight.appendChild(closeButton);
settingsButton.addEventListener('click', () => {
    createSettingsPopup();
});

// Append all parts to the header
header.appendChild(headerLeft);
header.appendChild(logo);
header.appendChild(title);
header.appendChild(headerRight);

// Dedicated close function for the close button
YourInclusion.prototype.closeToolboxFromButton = function () {
    const toolbox = document.querySelector('.yi-toolbox');
    if (toolbox) { // Corrected the variable reference
        toolbox.classList.remove('visible');
    }
};

// Link the function to the close button
closeButton.addEventListener('click', () => {
    this.closeToolboxFromButton();
});

// Reset Button - Reuse Existing Reset Functionality
resetButton.addEventListener('click', function () {
    initResetFeature(); 
});

    const buttons = [
        { id: 'blue-filter-btn', text: 'Blue Filter', iconClass: './assests/BlueFilter-1.svg'  },
        { id: 'contrast-btn', text: 'Contrast Modes', iconClass: './assests/contrast.svg' },
        { id: 'remove-images-btn', text: 'Remove Images', iconClass: './assests/image-off.svg' },
        { id: 'font-size-btn', text: 'Font Size', iconClass: './assests/fontsize.svg' },
        { id: 'night-mode-btn', text: 'Night Mode', iconClass: './assests/mode-night.svg' },
        { id: 'text-spacing-btn', text: 'Text Spacing', iconClass: '<i class="fas fa-text-width"></i>' },
        { id: 'line-height-btn', text: 'Line Height', iconClass: '<i class="fas fa-text-height"></i>' },   
        { id: 'remove-audio-btn', text: 'Remove Audio', iconClass: '<i class="fas fa-microphone-slash"></i>' },
        { id: 'highlight-links-btn', text: 'Highlight Links', iconClass: '<i class="fas fa-link"></i>' },
        { id: 'highlight-headers-btn', text: 'Highlight Headers', iconClass: '<i class="fas fa-heading"></i>' },
        { id: 'stop-animations-btn', text: 'Stop Animations', iconClass: '<i class="fas fa-ban"></i>' },
        { id: 'zoom-toggle-btn', text: 'Zoom', iconClass: '<i class="fas fa-search"></i>' },
        { id: 'cursor-size-btn', text: 'Change Cursor Size', iconClass: '<i class="fas fa-mouse-pointer"></i>' },
        { id: 'accessible-font-btn', text: 'Accessible Font', iconClass: '<i class="fas fa-font"></i>' },
        { id: 'read-aloud-btn', text: 'Read Aloud', iconClass: './assests/read-aloud.svg' },
        // { id: 'keyboard-navigation-btn', text: 'Keyboard Navigation', iconClass: '<i class="fas fa-keyboard"></i>' },
        { id: 'reset-btn1', text: 'Reset', iconClass: '<i class="fas fa-undo"></i>' },
        { id: 'save-settings-btn', text: 'Save', iconClass: '<i class="fas fa-save"></i>' },
    ];
    
    const body = this.createDiv('yi-toolbox-body');

buttons.forEach(({ id, text, iconClass }) => {
    // Create a div and set its class name to the button's name (id or text)
    const buttonDiv = document.createElement('div');
    buttonDiv.className = id || text.replace(/\s+/g, '-').toLowerCase(); 

    // Create the button and append it to the div
    const button = this.createButton(id, text, iconClass);
    buttonDiv.appendChild(button);

    // Append the button div to the body
    body.appendChild(buttonDiv);
});

toolbox.appendChild(header);
toolbox.appendChild(body);

document.body.appendChild(toolbox);
this.resetButtonStates();

};

YourInclusion.prototype.arePopupsInactive = function () {
    const popups = ['.font-size-popup', '.settings-popup', '.contrast-popup'];
    return popups.every((selector) => {
        const popup = document.querySelector(selector);
        return !popup || !popup.classList.contains('visible'); // Popup is either not present or not visible
    });
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

    document.addEventListener('click', (event) => {
        const isToolboxActive = toolbox.classList.contains('visible');

        // Only close the toolbox if it is active and all popups are inactive
        if (isToolboxActive && this.arePopupsInactive() && !toolbox.contains(event.target) && !sideButton.contains(event.target)) {
            toolbox.classList.remove('visible');
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

        // Snap side button to left or right based on the screen center
        if (x + sideButton.offsetWidth / 2 < windowWidth / 2) {
            x = 10; // Align to the left edge
        } else {
            x = windowWidth - sideButton.offsetWidth - 20; // Align to the right edge
        }

        // Apply the position to the side button
        sideButton.style.left = `${x}px`;
        sideButton.style.top = `${y}px`;

        const toolbox = document.getElementById('yi-toolbox');

        // Toolbox should follow the side button
        let toolboxLeft = x + sideButton.offsetWidth / 2 - toolbox.offsetWidth / 2;
        let toolboxTop = y - toolbox.offsetHeight - 60;

        // Ensure toolbox stays within the screen bounds horizontally
        if (toolboxLeft + toolbox.offsetWidth > windowWidth) {
            toolboxLeft = windowWidth - toolbox.offsetWidth - 10;
        }
        if (toolboxLeft < 10) {
            toolboxLeft = 10;
        }

        // Get window height to ensure it stays within screen vertically
        const windowHeight = window.innerHeight;

        // Ensure toolbox stays within vertical bounds
        if (toolboxTop < 10) {
            toolboxTop = 10;
        }

        if (toolboxTop + toolbox.offsetHeight > windowHeight) {
            toolboxTop = windowHeight - toolbox.offsetHeight - 10;
        }

        // Apply the final position to the toolbox
        toolbox.style.left = `${toolboxLeft}px`;
        toolbox.style.top = `${toolboxTop}px`;

        // Check if toolbox is on the left side of the screen
        const isToolboxOnLeft = toolboxLeft < windowWidth / 2;
        

         // Update popup positions
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


// Blue Filter
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


// Remove images
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
    // Select all images except the toolbar-related side image
    const images = document.querySelectorAll('img:not(.yi-toolbox-image):not(.side-button-image)');

    // Toggle visibility based on the state
    if (this.imagesHidden) {
        // Remove the hidden-image class to make images visible again
        images.forEach(img => {
            img.classList.remove('hidden-image');
        });
    } else {
        // Add the hidden-image class to hide the images
        images.forEach(img => {
            img.classList.add('hidden-image');
        });
    }

    // Toggle the state of imagesHidden
    this.imagesHidden = !this.imagesHidden;
};




// Audio Removal

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
   
    const buttons = document.querySelectorAll('.yi-toolbox-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            buttons.forEach(btn => (btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)"));

            button.style.backgroundColor = "rgba(52, 88, 185, 1)";
        });
    });
});

// Font size setting PopuP
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
            const allElements = document.body.querySelectorAll('*:not(.yi-toolbox):not(.yi-toolbox *)');
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









// HightLight Functions
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



// Stop Animation

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

// Zoom
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
    const elementsToZoom = document.querySelectorAll('body > *:not(#yi-toolbox):not(#openToolboxButton):not(img)');

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

    // Find the corresponding zoom index
    this.zoomIndex = this.zoomStates.indexOf(savedZoomLevel);
    if (this.zoomIndex === -1) this.zoomIndex = 0; 

    // Set the button state based on the saved zoom level
    const isActive = savedZoomLevel !== 1; 
    this.setActiveButton('zoom-toggle-btn', isActive);
};


// Save Zoom State on Change
YourInclusion.prototype.saveZoomState = function (zoomLevel) {
    localStorage.setItem('zoomLevel', zoomLevel);
    console.log(`Zoom level saved: ${zoomLevel}`);
};


// Night Mode Feature
YourInclusion.prototype.initNightModeFeature = function () {
    const nightModeButton = document.getElementById('night-mode-btn');
    if (nightModeButton) {
        nightModeButton.addEventListener('click', () => {
            this.toggleNightMode();
        });
    }

    // Check stored night mode state and apply it
    const isNightModeEnabled = localStorage.getItem('nightMode') === 'true';
    document.body.classList.toggle('night-mode', isNightModeEnabled);
    this.setActiveButton('night-mode-btn', isNightModeEnabled);
};

YourInclusion.prototype.toggleNightMode = function () {
    // Select all elements on the page except buttons, inputs, and the toolbar (including its children)
    const allElements = document.querySelectorAll(':not(button):not(input):not(.yi-toolbox):not(.yi-toolbox *)');

    // Toggle night mode state
    const isNightModeEnabled = document.body.classList.toggle('night-mode');
    localStorage.setItem('nightMode', isNightModeEnabled);

    // Add or remove the `night-mode` class for each element individually, excluding the toolbar
    allElements.forEach(element => {
        if (isNightModeEnabled) {
            element.classList.add('night-mode');
        } else {
            element.classList.remove('night-mode');
        }
    });

    // Update button state explicitly based on the current mode
    this.setActiveButton('night-mode-btn', isNightModeEnabled);

    console.log(`Night Mode ${isNightModeEnabled ? 'enabled' : 'disabled'}.`);
};






// Text Spacing Feature
YourInclusion.prototype.initTextSpacingFeature = function () {
    const textSpacingButton = document.getElementById('text-spacing-btn');
    if (textSpacingButton) {
        textSpacingButton.addEventListener('click', () => {
            this.toggleTextSpacing('text-spacing-btn');
        });
    }
};

// Toggle Text Spacing with Active State Management
YourInclusion.prototype.toggleTextSpacing = function (buttonId) {
    const elementsToAdjust = document.querySelectorAll('body *:not(.yi-toolbox):not(.yi-toolbox *)');
    const spacingStates = ['normal', '0.1em', '0.2em', '0.3em'];

    // Initialize the spacing index if not already set
    if (this.currentTextSpacingIndex === undefined) {
        this.currentTextSpacingIndex = 0;
    }

    // Cycle through the spacing states
    this.currentTextSpacingIndex = (this.currentTextSpacingIndex + 1) % spacingStates.length;
    const spacingLevel = spacingStates[this.currentTextSpacingIndex];

    // Apply the spacing level to all eligible elements
    elementsToAdjust.forEach(element => {
        element.style.letterSpacing = spacingLevel;
    });

    
    const isActive = spacingLevel !== 'normal';
    this.setActiveButton(buttonId, isActive); 

    console.log(`Text spacing set to: ${spacingLevel}`);
};


// Line Height Feature
YourInclusion.prototype.initLineHeightFeature = function () {
    const lineHeightButton = document.getElementById('line-height-btn');
    if (lineHeightButton) {
        lineHeightButton.addEventListener('click', () => {
            this.toggleLineHeight('line-height-btn');
        });
    }
};

// Toggle Line Height with Active State Management
YourInclusion.prototype.toggleLineHeight = function (buttonId) {
    const elementsToAdjust = document.querySelectorAll('body *:not(.yi-toolbox):not(.yi-toolbox *)');
    const lineHeightStates = ['normal', '1.5', '2', '2.5'];

    // Initialize the line height index if not already set
    if (this.currentLineHeightIndex === undefined) {
        this.currentLineHeightIndex = 0;
    }

    // Cycle through the line height states
    this.currentLineHeightIndex = (this.currentLineHeightIndex + 1) % lineHeightStates.length;
    const lineHeightLevel = lineHeightStates[this.currentLineHeightIndex];

    // Apply the line height level to all eligible elements
    elementsToAdjust.forEach(element => {
        element.style.lineHeight = lineHeightLevel;
    });

    // Manage button active state explicitly
    if (lineHeightLevel === 'normal') {
        this.setActiveButton(buttonId, false); 
    } else {
        this.setActiveButton(buttonId, true); 
    }

    console.log(`Line height set to: ${lineHeightLevel}`);
};


// Cursor Size

// Initialize Cursor Size Adjustment
YourInclusion.prototype.initCursorSizeAdjustment = function () {
    const cursorSizeButton = document.getElementById('cursor-size-btn');
    if (cursorSizeButton) {
        cursorSizeButton.addEventListener('click', () => {
            this.toggleCursorSize('cursor-size-btn');
        });
    }
};

// Toggle Cursor Size with Active State Management
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

    // Initialize cursor size index if not set
    if (this.currentCursorSizeIndex === undefined) this.currentCursorSizeIndex = 0;

    // Cycle through the cursor sizes
    this.currentCursorSizeIndex = (this.currentCursorSizeIndex + 1) % cursorSizes.length;
    const selectedCursor = cursorSizes[this.currentCursorSizeIndex];

    // Apply the selected cursor size
    document.documentElement.style.cursor = selectedCursor.cursor;

    // Update button text and icon
    const button = document.getElementById(buttonId);
    if (button) {
        button.innerHTML = `${selectedCursor.icon} Cursor Size: ${selectedCursor.label}`;
    }

    // Manage active state explicitly
    const isActive = selectedCursor.size !== 'normal';
    this.setActiveButton(buttonId, isActive); 

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

// Button Active

YourInclusion.prototype.setActiveButton = function (activeButtonId, isActive = null) {
    const button = document.getElementById(activeButtonId);

    if (button) {
        // Determine the new state
        const newState = isActive !== null ? isActive : button.dataset.active !== 'true';

        if (newState) {
            // Activate the button
            button.classList.add('active-button'); // Add active class
            button.dataset.active = 'true'; 
        } else {
            // Deactivate the button
            button.classList.remove('active-button'); // Remove active class
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


// Accessible Function

YourInclusion.prototype.initAccessibleFontToggle = function () {
    const fontToggleButton = document.getElementById('accessible-font-btn');
    if (fontToggleButton) {
        fontToggleButton.addEventListener('click', () => {
            this.toggleAccessibleFont('accessible-font-btn');
            console.log('Accessible font toggle button clicked.'); // Debugging
        });
    } else {
        console.error('Font toggle button not found.');
    }
};

YourInclusion.prototype.toggleAccessibleFont = function (buttonId) {
    // Toggle the class on the body element
    const isFontApplied = document.body.classList.toggle('accessible-font');

    // Set the active state for the button
    this.setActiveButton(buttonId, isFontApplied);

    // Save the state
    this.saveToolbarState();

    // Log the status for debugging
    console.log(`Accessible font ${isFontApplied ? 'enabled' : 'disabled'}`);
};


// Reset Function

YourInclusion.prototype.initResetFeature = function () {
    
    const resetButtons = document.querySelectorAll('#reset-btn, #reset-btn1');

  
    resetButtons.forEach((button) => {
        button.addEventListener('click', () => {
            this.resetToolbox(); 
        });
    });
}


YourInclusion.prototype.resetToolbox = function () {
    // Remove highlights added by the toolbox
    document.querySelectorAll('.highlight-links, .highlight-headers, .highlight-images').forEach(el => {
        el.classList.remove('highlight-links', 'highlight-headers', 'highlight-images');
    });

    // Restore only toolbox-specific font size, spacing, and transforms, excluding popups and toolbox
    document.querySelectorAll('[data-toolbox-modified]').forEach(el => {
        if (!el.closest('.font-size-popup') && !el.closest('.yi-toolbox')) { // Exclude popups and toolbox
            el.style.fontSize = ''; 
            el.style.letterSpacing = '';
            el.style.lineHeight = ''; 
            el.style.transform = ''; 
            el.style.transformOrigin = ''; 
            el.style.width = ''; 
            el.removeAttribute('data-toolbox-modified'); // Remove the marker attribute
        }
    });

    // Remove blue filter if applied by the toolbox
    const blueOverlay = document.querySelector('.blue-overlay');
    if (blueOverlay) blueOverlay.classList.remove('active');

    // Restore images hidden by the toolbox
    if (this.imagesHidden) {
        this.removedImages.forEach(({ img, parent, nextSibling }) => {
            if (nextSibling) {
                parent.insertBefore(img, nextSibling);
            } else {
                parent.appendChild(img);
            }
        });
        this.removedImages = [];
        this.imagesHidden = false;
    }

    // Unmute audio/video elements muted by the toolbox
    const soundElements = document.querySelectorAll('[data-toolbox-muted]');
    soundElements.forEach(el => {
        el.muted = false; 
        el.removeAttribute('data-toolbox-muted');
    });

    // Disable night mode introduced by the toolbox
    document.body.classList.remove('night-mode');

    // Reset cursor size to default
    document.documentElement.style.cursor = 'auto';

    // Reset accessible font settings
    document.body.classList.remove('accessible-font');

    // Re-enable animations if disabled by the toolbox
    document.body.classList.remove('disable-animations');

    // Trigger resetContrast function to handle contrast settings
    this.resetContrast();

    // Click the reset button in the settings popup if it exists
const settingsResetButton = document.querySelector('.settings-popup .reset-popup-btn, .settings-popup .popup-reset');
if (settingsResetButton) {
    settingsResetButton.click();
    console.log('Settings popup reset triggered.');
}

// Click the reset button in the font size popup if it exists
const fontSizeResetButton = document.querySelector('.font-size-popup .reset-popup-btn, .font-size-popup .popup-reset');
if (fontSizeResetButton) {
    fontSizeResetButton.click();
    console.log('Font size popup reset triggered.');
}


   // Clear toolbox-specific local storage settings
   localStorage.removeItem('animationsDisabled');
   localStorage.removeItem('nightMode');
   localStorage.removeItem('zoomLevel');
   localStorage.removeItem('toolbarState');

   // Reset zoom level
   this.applyZoom(1);

   // Reset text spacing, excluding toolbox and popups
   const elementsToAdjust = document.querySelectorAll('body *:not(.yi-toolbox):not(.yi-toolbox *):not(.font-size-popup):not(.font-size-popup *)');
   elementsToAdjust.forEach(element => {
       element.style.letterSpacing = 'normal';
       element.style.lineHeight = 'normal';
       element.style.fontSize = '';
   });

   // Reset font size
   this.currentFontSize = null;

    // Reset button states controlled by the toolbox
    this.resetButtonStates();

    console.log('Toolbox reset to the original state.');
}



// Contrast Mode

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
    this.closeAllPopups();
    const existingPopup = document.getElementById('contrast-popup');
    if (existingPopup) {
        existingPopup.remove();
        return;
    }

    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'contrast-popup';
    popup.className = 'contrast-popup';

    // Position the popup dynamically
    popup.style.position = 'absolute';
    popup.style.top = '19%'; // Fixed top position

    const toolbox = document.querySelector('.yi-toolbox');
    const toolboxRect = toolbox.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const isToolboxOnLeft = toolboxRect.left < windowWidth / 2;

    // Set the left position based on toolbox location
    popup.style.left = isToolboxOnLeft ? '30%' : '70%';

    // Popup Header
    const header = this.createPopupHeader('Contrast Settings', () => popup.remove());
    popup.appendChild(header);

    // Popup Body
    const body = document.createElement('div');
    body.className = 'contrast-popup-body';

    // Add preset modes
    this.addPresetModes(body);

    // Add custom color controls
    this.addCustomColorControls(body);

    this.isContrastPopupActive = true;

    // Toggle visibility dynamically
    popup.addEventListener('click', () => {
        if (popup.style.display === 'block') {
            popup.style.display = 'none';
            this.isContrastPopupActive = false; // Update flag
        } else {
            popup.style.display = 'block';
            this.isContrastPopupActive = true; // Update flag
        }
    });

    

    // Add Reset Button
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-contrast-btn';
    resetButton.className = 'contrast-reset-button';
    resetButton.textContent = 'Reset Contrast';
    resetButton.addEventListener('click', () => this.resetContrast());
    body.appendChild(resetButton);

    popup.appendChild(body);
    document.body.appendChild(popup);
};
YourInclusion.prototype.createPopupHeader = function (titleText, closeCallback) {
    const header = document.createElement('div');
    header.className = 'contrast-popup-header';

    const title = document.createElement('h3');
    title.className = 'contrast-popup-title';
    title.textContent = titleText;
    header.appendChild(title);

    const closeButton = document.createElement('button');
    closeButton.className = 'contrast-popup-close';
    closeButton.textContent = '✖';
    closeButton.addEventListener('click', closeCallback);
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



// Apply Custom Text Color
YourInclusion.prototype.applyCustomTextColor = function (color) {
    if (color) {
        // Select text elements but exclude toolbox and popup
        const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, span, li, a, div, label, button, input, textarea' +
            ':not(.yi-toolbox):not(.contrast-popup):not(.yi-toolbox *):not(.contrast-popup *)'
        );

        textElements.forEach((element) => {
            element.style.color = color; 
        });
    
        this.customTextColor = color;
    }
};



// Apply Custom Colors
YourInclusion.prototype.applyCustomColors = function (bgColor, textColor) {
    if (bgColor) {
        document.body.style.backgroundColor = bgColor;
        this.customBackgroundColor = bgColor; // Store the custom background color
    }
    if (textColor) {
        const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, span, li, a, div, label, button, input, textarea'
        );
        textElements.forEach((element) => {
            element.style.color = textColor;
        });
        this.customTextColor = textColor; 
    }
    console.log(`Custom colors applied: Background (${bgColor || 'unchanged'}), Text (${textColor || 'unchanged'})`);
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
    // Check if the popup already exists
    if (document.querySelector('.settings-popup')) return;

    // Create the popup container
    const popup = document.createElement('div');
    popup.className = 'settings-popup';

    // Set popup default position
    popup.style.position = 'absolute';
    popup.style.top = '19%';

    // Dynamically determine if the toolbox is on the left
    const toolbox = document.querySelector('.yi-toolbox');
    const toolboxRect = toolbox.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const isToolboxOnLeft = toolboxRect.left < windowWidth / 2;

    // Set the initial left position based on toolbox location
    popup.style.left = isToolboxOnLeft ? '28%' : '72%';

        // Create the popup header
    const header = document.createElement('div');
    header.className = 'settings-popup-header';
  

    const headerTitle = document.createElement('h3');
    headerTitle.textContent = 'Settings';
    headerTitle.className = 'settings-popup-title'; // Add class for styling if needed
    header.appendChild(headerTitle);

    // Append the header element to the popup
    const popup2 = document.querySelector('.settings-popup');
    if (popup2) {
        popup.appendChild(header);
    }

    // Add the header to the popup
    popup.appendChild(header);

    // Create language selector
    const languageSelector = document.createElement('div');
    languageSelector.className = 'popup-section';
    const languageLabel = document.createElement('label');
    languageLabel.textContent = 'Select Language: ';
    languageLabel.for = 'language-select';
    const languageDropdown = document.createElement('select');
    languageDropdown.id = 'language-select';
    languageDropdown.innerHTML = `
        <option value="en">English</option>
        <option value="de">German</option>
    `;
    languageSelector.appendChild(languageLabel);
    languageSelector.appendChild(languageDropdown);

    // Create color picker
    const colorPicker = document.createElement('div');
    colorPicker.className = 'popup-section';
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Pick a Color: ';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'color-picker';
    colorInput.value = '#007bff'; // Default color
    colorPicker.appendChild(colorLabel);
    colorPicker.appendChild(colorInput);

    // Default settings
    const defaultSettings = {
        color: '#393636',
        language: 'en',
    };

   // Handle color changes
   colorInput.addEventListener('input', (event) => {
    const selectedColor = event.target.value;

    // Change popup header background color
    header.style.backgroundColor = selectedColor;

    // Change toolbox header background color
    const toolboxHeaders = document.querySelectorAll('.yi-toolbox-header, .settings-popup-header');

    // Iterate over the NodeList and apply the background color with !important
    toolboxHeaders.forEach(header => {
        header.style.setProperty('background-color', selectedColor, 'important');
    });
    
    // Change SVG and inner elements' fill and stroke color
    const toolboxIcons = document.querySelectorAll('.yi-toolbox-body svg');
    toolboxIcons.forEach(svg => {
        svg.style.fill = selectedColor;
        svg.style.stroke = selectedColor;

        // Update inner elements (e.g., paths)
        const innerElements = svg.querySelectorAll('*');
        innerElements.forEach(inner => {
            inner.style.fill = selectedColor;
            inner.style.stroke = selectedColor;
        });
    });

    // Change background color of toolbox buttons
    const toolboxButtons = document.querySelectorAll(
        '.yi-toolbox-body .yi-toolbox-btn, .yi-toolbox-button, .font-popup-btn, ' +
        ' #font-popup-reset'
    );
    toolboxButtons.forEach(button => {
        button.style.backgroundColor = selectedColor;
        button.style.borderColor = selectedColor;
        button.style.color = selectedColor;
    });
    const root = document.documentElement;
    root.style.setProperty('--bg-color', selectedColor, 'important');

    // Dynamically update the CSS for .font-popup-btn and .reset-popup-btn
const styleSheet = document.styleSheets[0]; // Use the first stylesheet or dynamically create one

const updateCSSRule = (selector, property, value) => {
    let ruleFound = false;

    // Check if the rule exists and update it
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText === selector) {
            rule.style.setProperty(property, value, 'important');
            ruleFound = true;
            break;
        }
    }

    // If the rule doesn't exist, add it dynamically
    if (!ruleFound) {
        styleSheet.insertRule(
            `${selector} { ${property}: ${value} !important; }`,
            styleSheet.cssRules.length
        );
    }
};

// Update background color for .font-popup-btn and .reset-popup-btn
updateCSSRule('.font-popup-btn', 'background-color', selectedColor);
updateCSSRule('.reset-popup-btn', 'background-color', selectedColor);

    

    // Ensure elements using the variable have the important class
    const elementsToUpdate = document.querySelectorAll('.uses-bg-color');
    elementsToUpdate.forEach(element => {
        element.style.setProperty('background-color', `var(--bg-color)`, 'important');
    });
   
});

    // Add a Reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.className = 'popup-reset';
    resetButton.style.color = "white";
    resetButton.addEventListener('click', () => {
        // Reset to default settings
        header.style.backgroundColor = defaultSettings.color;
        headerTitle.style.color = 'white';
        colorInput.value = defaultSettings.color;

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
             // Reset buttons in toolbox and popups to default color
            const buttonsToReset = document.querySelectorAll(
                '.yi-toolbox-body .yi-toolbox-btn, .yi-toolbox-button, .font-popup-btn, .reset-popup-btn'
            );

            buttonsToReset.forEach(button => {
                button.style.setProperty('background-color', defaultSettings.color, 'important');
                button.style.setProperty('border-color', defaultSettings.color, 'important');
                button.style.setProperty('color', 'white', 'important'); // Set text color to white
            });
        });

        

        const toolboxButtons = document.querySelectorAll('.yi-toolbox-body .yi-toolbox-btn, .yi-toolbox-button');
        toolboxButtons.forEach(button => {
            button.style.backgroundColor = defaultSettings.color;
            button.style.borderColor = defaultSettings.color;
            button.style.color = defaultSettings.color;
        });

        languageDropdown.value = defaultSettings.language; // Reset language
        document.documentElement.style.setProperty('--bg-color', defaultSettings.color, 'important');
    });

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.className = 'popup-close';
    closeButton.addEventListener('click', () => {
        popup.remove(); // Remove the popup when close is clicked
    });

    // Append sections to the popup
    popup.appendChild(languageSelector);
    popup.appendChild(colorPicker);
    popup.appendChild(resetButton); // Add Reset button to the popup
    popup.appendChild(closeButton);

    // Add the popup to the document body
    document.body.appendChild(popup);

    // Dynamically update position based on toolbox location
    this.updatePopupPositions(isToolboxOnLeft);
    if (settingsPopup) {
        if (settingsPopup.style.display === 'block') {
            settingsPopup.style.display = 'none';
            this.isSettingsPopupActive = false; // Update flag
        } else {
            settingsPopup.style.display = 'block';
            this.isSettingsPopupActive = true; // Update flag
        }
        return;
    }
    this.isSettingsPopupActive = true;

    // Toggle visibility dynamically (click handler for the popup itself)
    settingsPopup.addEventListener('click', () => {
        if (settingsPopup.style.display === 'block') {
            settingsPopup.style.display = 'none';
            this.isSettingsPopupActive = false; // Update flag
        } else {
            settingsPopup.style.display = 'block';
            this.isSettingsPopupActive = true; // Update flag
        }
    });
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







// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    new YourInclusion();
    loadScript();
});
