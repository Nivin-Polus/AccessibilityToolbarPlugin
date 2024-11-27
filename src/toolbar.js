'use strict';

function MicAccessTool(init) {
    this.init = init || {};
    this.removedImages = [];
    this.imagesHidden = false;
    this.isMuted = false;

    // Initialize the toolbox and other features
    this.initializeAccessibilityToolbox();
    this.initBlueFilter();
    this.initRemoveImages();
    this.initAudioRemoval();
    this.initReadAloud();
    this.initFontSizeAdjustment();
    this.initHighlightButtons();
    this.initStopAnimationsButton();
    this.initZoomToggleFeature();
    this.initNightModeFeature();
    this.initTextSpacingFeature();
    this.initLineHeightFeature();
    this.initCursorSizeAdjustment();
    this.initKeyboardNavigation();
    this.initAccessibleFontToggle();
    this.initResetFeature();
    
}

// Load FontAwesome
function loadFontAwesome() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    link.type = 'text/css';

    // Append the <link> to the <head>
    document.head.appendChild(link);
}

// Generic Element Creator
function createElement(tag, attributes = {}, innerText = '') {
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
function createButton(id, text, iconHtml = '') {
    // Create the button element
    const button = createElement('button', { class: 'toolbox-button', id: id },);

    // Add icon (if iconHtml is provided)
    if (iconHtml) {
        const iconWrapper = document.createElement('span'); 
        iconWrapper.innerHTML = iconHtml; 
        button.appendChild(iconWrapper); 
    }

    // Add the button text
    const textNode = document.createTextNode(text);
    button.appendChild(textNode);

    return button;
}



function createDiv(className, id = '') {
    const attributes = { class: className };
    if (id) attributes.id = id;
    return createElement('div', attributes);
}

function createImage(src, alt, className) {
    return createElement('img', { src: src, alt: alt, class: className });
}

function createHeading(level, text, className = '') {
    return createElement(`h${level}`, { class: className }, text);
}

// Create Toolbox
MicAccessTool.prototype.createToolbox = function () {
    const toolbox = createDiv('toolbox hidden', 'toolbox');
    const imageContainer = createDiv('toolbox-image-container');
    const image = createImage(
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s',
        'Accessibility Logo',
        'toolbox-image'
    );
    imageContainer.appendChild(image);
    toolbox.appendChild(imageContainer);

    const header = createDiv('toolbox-header');
    const title = createHeading(2, 'Accessibility Toolbox', 'toolbox-title');
    header.appendChild(title);
    

    const buttons = [
        { id: 'blue-filter-btn', text: 'Blue Filter', iconClass: '<i class="fas fa-adjust"></i>' },
        { id: 'read-aloud-btn', text: 'Read Aloud', iconClass: '<i class="fas fa-volume-up"></i>' },
        { id: 'remove-images-btn', text: 'Remove Images', iconClass: '<i class="fa-regular fa-image"></i>' },
        { id: 'remove-audio-btn', text: 'Remove Audio', iconClass: '<i class="fas fa-microphone-slash"></i>' },
        { id: 'increase-text-btn', text: 'Increase Text', iconClass: '<i class="fas fa-text-height"></i>' },
        { id: 'decrease-text-btn', text: 'Decrease Text', iconClass: '<i class="fas fa-text-width"></i>' },
        { id: 'highlight-links-btn', text: 'Highlight Links', iconClass: '<i class="fas fa-link"></i>' },
        { id: 'highlight-headers-btn', text: 'Highlight Headers', iconClass: '<i class="fas fa-heading"></i>' },
        { id: 'stop-animations-btn', text: 'Stop Animations', iconClass: '<i class="fas fa-ban"></i>' },
        { id: 'zoom-toggle-btn', text: 'Zoom', iconClass: '<i class="fas fa-search"></i>' },
        { id: 'night-mode-btn', text: 'Night Mode', iconClass: '<i class="fas fa-moon"></i>' },
        { id: 'cursor-size-btn', text: 'Change Cursor Size', iconClass: '<i class="fas fa-mouse-pointer"></i>' },
        // { id: 'text-spacing-btn', text: 'Text Spacing', iconClass: '<i class="fas fa-text-width"></i>' },
        // { id: 'line-height-btn', text: 'Line Height', iconClass: '<i class="fas fa-text-height"></i>' },       
        // { id: 'keyboard-navigation-btn', text: 'Keyboard Navigation', iconClass: '<i class="fas fa-keyboard"></i>' },
        { id: 'accessible-font-btn', text: 'Accessible Font', iconClass: '<i class="fas fa-font"></i>' },
        // { id: 'reset-btn', text: 'Reset', iconClass: '<i class="fas fa-undo"></i>' },

    ];
    
    
    const body = createDiv('toolbox-body');

    buttons.forEach(({ id, text, iconClass }) => {
        const button = createButton(id, text, iconClass);
        body.appendChild(button);
    });
    toolbox.appendChild(header);
    toolbox.appendChild(body);

    document.body.appendChild(toolbox);
    this.resetButtonStates();
};

// Create Side Button
MicAccessTool.prototype.createSideButton = function () {
    const sideButton = createDiv('side-button', 'openToolboxButton');
    const buttonImage = createImage(
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s',
        'Open Toolbox',
        'side-button-image'
    );
    sideButton.appendChild(buttonImage);

    document.body.appendChild(sideButton);
};

// Initialize Toolbox and Side Button
MicAccessTool.prototype.initializeAccessibilityToolbox = function () {
    this.createToolbox();
    this.createSideButton();

    const toolbox = document.getElementById('toolbox');
    const sideButton = document.getElementById('openToolboxButton');

    // Open/close toolbox on side button click
    sideButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        toolbox.classList.toggle('visible');
    });

    document.addEventListener('click', (event) => {
       
        if (
            !toolbox.contains(event.target) && 
            !sideButton.contains(event.target)
        ) {
            toolbox.classList.remove('visible');
        }
    });
};

// Blue Filter
MicAccessTool.prototype.initBlueFilter = function () {
    const blueOverlay = createDiv('blue-overlay');
    document.body.appendChild(blueOverlay);

    const blueFilterButton = document.getElementById('blue-filter-btn');
    if (blueFilterButton) {
        blueFilterButton.addEventListener('click', () => {
            blueOverlay.classList.toggle('active');
            this.setActiveButton('blue-filter-btn');
        });
    }
};
// Remove images
MicAccessTool.prototype.initRemoveImages = function () {
    const removeImageButton = document.getElementById('remove-images-btn');
    if (removeImageButton) {
        removeImageButton.addEventListener('click', () => {
            this.toggleImages(); // Toggle image removal
            this.setActiveButton('remove-images-btn'); // Update button's active state
        });
    }
};

MicAccessTool.prototype.toggleImages = function () {
    if (this.imagesHidden) {
        // Restore removed images
        this.removedImages.forEach(({ img, parent, nextSibling }) => {
            if (nextSibling) {
                parent.insertBefore(img, nextSibling);
            } else {
                parent.appendChild(img);
            }
        });
        this.removedImages = []; // Clear stored images
    } else {
        // Remove images and store their details
        const images = document.querySelectorAll('img:not(.toolbox-image):not(.side-button-image)');
        images.forEach(img => {
            this.removedImages.push({
                img: img,
                parent: img.parentNode,
                nextSibling: img.nextSibling,
            });
            img.parentNode.removeChild(img);
        });
    }

    // Toggle the state of imagesHidden
    this.imagesHidden = !this.imagesHidden;
};

// Audio Removal

MicAccessTool.prototype.initAudioRemoval = function () {
    const audioRemovalButton = document.getElementById('remove-audio-btn');
    if (audioRemovalButton) {
        audioRemovalButton.addEventListener('click', () => {
            this.audioRemoval(); // Toggle audio mute state
            this.setActiveButton('remove-audio-btn'); // Update button's active state
        });
    }
};

MicAccessTool.prototype.audioRemoval = function () {
    const soundElements = document.querySelectorAll('audio, video');
    this.isMuted = !this.isMuted; // Toggle muted state
    soundElements.forEach(element => {
        element.muted = this.isMuted; // Apply the mute state to each element
    });
};

// Read Aloud
// Initialize Read Aloud Feature
MicAccessTool.prototype.initReadAloud = function () {
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
        this.createReadAloudToolbar(); // Restore toolbar if previously active
        this.setActiveButton('read-aloud-btn', true);
    }
};

MicAccessTool.prototype.toggleReadAloud = function (buttonId) {
    const toolbar = document.getElementById('read-aloud-toolbar');
    const isActive = this.isReadAloudActive || false; // Check current active state

    if (isActive) {
        // Deactivate Read Aloud
        this.disableDefaultClickToRead();
        this.stopReadAloud();
        if (toolbar) toolbar.classList.add('hidden'); // Hide toolbar
        this.setActiveButton(buttonId, false); // Deactivate button
        this.isReadAloudActive = false; // Update state
        localStorage.setItem('readAloudActive', false);
        console.log('Read Aloud deactivated.');
    } else {
        // Activate Read Aloud
        if (!toolbar) {
            this.createReadAloudToolbar(); // Create toolbar if it doesn't exist
        } else {
            toolbar.classList.remove('hidden'); // Show toolbar
        }
        this.enableDefaultClickToRead();
        this.setActiveButton(buttonId, true); // Activate button
        this.isReadAloudActive = true; // Update state
        localStorage.setItem('readAloudActive', true);
        console.log('Read Aloud activated.');
    }
};


// Create the Read Aloud Toolbar
MicAccessTool.prototype.createReadAloudToolbar = function () {
    const toolbar = createDiv('read-aloud-toolbar', 'read-aloud-toolbar');

    // Toolbar Header
    const header = createDiv('toolbar-header');
    const title = createHeading(2, 'Read Aloud Settings', 'toolbar-title');
    const closeButton = createButton('close-toolbar', '✖');
    closeButton.addEventListener('click', () => {
        toolbar.remove();
        this.disableDefaultClickToRead();
    });
    header.appendChild(title);
    header.appendChild(closeButton);
    toolbar.appendChild(header);

    // Toolbar Controls
    const controls = createDiv('toolbar-controls');

    // Cursor Read Aloud Button
    const cursorButton = createButton('cursor-read-btn', 'Cursor Read Aloud');
    cursorButton.innerHTML = `<i class="fas fa-mouse-pointer"></i> Cursor Read Aloud`;
    cursorButton.addEventListener('click', this.enableCursorReadAloud.bind(this));

    // Previous Line Button
     const previousButton = createButton('previous-line-btn', 'Previous Line');
     previousButton.innerHTML = `<i class="fas fa-arrow-left"></i> `;
     previousButton.addEventListener('click', this.readPreviousLine.bind(this));

    // Play Button
    const playButton = createButton('play-read-btn', '▶');
    playButton.innerHTML = `<i class="fas fa-play"></i>`;
    playButton.addEventListener('click', this.playReadAloud.bind(this));

    // Stop Button
    const stopButton = createButton('stop-read-btn', '⏹');
    stopButton.innerHTML = `<i class="fas fa-stop"></i>`;
    stopButton.addEventListener('click', this.stopReadAloud.bind(this));
 
     // Next Line Button
     const nextButton = createButton('next-line-btn', 'Next Line');
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
MicAccessTool.prototype.highlightText = function (element, start, length) {
    const text = element.dataset.originalText || element.innerText || '';
    const before = text.slice(0, start);
    const highlight = text.slice(start, start + length);
    const after = text.slice(start + length);

    element.innerHTML = `${before}<span style="background-color: yellow;">${highlight}</span>${after}`;
};





// Enable Default Click-to-Read
MicAccessTool.prototype.enableDefaultClickToRead = function () {
    const elements = document.querySelectorAll('h1, h2, h3, p, a, button');
    elements.forEach(element => {
        element.addEventListener('click', this.readElementContent.bind(this));
    });
};

// Disable Default Click-to-Read
MicAccessTool.prototype.disableDefaultClickToRead = function () {
    const elements = document.querySelectorAll('h1, h2, h3, p, a, button');
    elements.forEach(element => {
        element.removeEventListener('click', this.readElementContent.bind(this));
    });
};

// Read Element Content with Highlighting
MicAccessTool.prototype.readElementContent = function (event) {
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
        this.clearHighlight(element); // Clear highlight after reading ends
    };

    speechSynthesis.speak(msg);
};

MicAccessTool.prototype.clearHighlight = function (element) {
    if (element.dataset.originalText) {
        element.innerHTML = element.dataset.originalText;
    }
};



// Play Entire Page Read Aloud with Highlighting
MicAccessTool.prototype.playReadAloud = function () {
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
MicAccessTool.prototype.enableCursorReadAloud = function () {
    const elements = document.querySelectorAll('h1, h2, h3, p, a, button');
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

MicAccessTool.prototype.readPreviousLine = function () {
    if (this.currentParagraphIndex > 0) {
        this.currentParagraphIndex--;
        this.readCurrentLine();
    } else {
        console.log('Already at the first paragraph.');
    }
};



MicAccessTool.prototype.readNextLine = function () {
    const paragraphs = document.querySelectorAll('p');

    if (this.currentParagraphIndex === undefined) this.currentParagraphIndex = 0;

    if (this.currentParagraphIndex < paragraphs.length - 1) {
        this.currentParagraphIndex++;
        this.readCurrentLine();
    } else {
        console.log('No more paragraphs to read.');
    }
};



MicAccessTool.prototype.speakText = function (element) {
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
        this.clearHighlight(element); // Clear highlights after speech
    };

    // Cancel ongoing speech and start speaking
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
};



MicAccessTool.prototype.readCurrentLine = function () {
    const paragraphs = document.querySelectorAll('p');

    if (this.currentParagraphIndex === undefined || this.currentParagraphIndex >= paragraphs.length) {
        console.log('No more paragraphs to read.');
        return;
    }

    const currentParagraph = paragraphs[this.currentParagraphIndex];
    this.speakText(currentParagraph);
};



// Stop Read Aloud
MicAccessTool.prototype.stopReadAloud = function () {
    speechSynthesis.cancel(); // Stop all ongoing speech
    this.currentParagraphIndex = undefined; // Reset paragraph index

    // Clear highlights for all paragraphs
    document.querySelectorAll('[data-original-text]').forEach((element) => {
        this.clearHighlight(element);
    });

    console.log('Read Aloud stopped, and all highlights cleared.');
};






//Button Click Color change

document.addEventListener('DOMContentLoaded', () => {
   
    const buttons = document.querySelectorAll('.toolbox-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            buttons.forEach(btn => (btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)"));

            button.style.backgroundColor = "rgba(52, 88, 185, 1)";
        });
    });
});

// Font Size

// Initialize font size adjustment limits
MicAccessTool.prototype.initFontSizeAdjustment = function () {
    const increaseTextButton = document.getElementById('increase-text-btn');
    const decreaseTextButton = document.getElementById('decrease-text-btn');

    // Add event listeners to buttons
    if (increaseTextButton) {
        increaseTextButton.addEventListener('click', () => {
            this.adjustFontSize('increase'); // Adjust font size
        });
    }
    if (decreaseTextButton) {
        decreaseTextButton.addEventListener('click', () => {
            this.adjustFontSize('decrease'); // Adjust font size
        });
    }
};


// Adjust font size with limits
MicAccessTool.prototype.adjustFontSize = function (action) {
    const minFontSize = 12; // Minimum font size limit
    const maxFontSize = 36; // Maximum font size limit
    const allElements = document.querySelectorAll('body *:not(.toolbox):not(.toolbox *)');

    let canIncrease = false;
    let canDecrease = false;

    allElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const currentFontSize = parseFloat(computedStyle.fontSize);

        let newFontSize = currentFontSize;

        if (action === 'increase' && currentFontSize < maxFontSize) {
            newFontSize = Math.min(currentFontSize + 2, maxFontSize); // Increase by 2px
            canIncrease = newFontSize < maxFontSize; // Check if further increase is possible
        } else if (action === 'decrease' && currentFontSize > minFontSize) {
            newFontSize = Math.max(currentFontSize - 2, minFontSize); // Decrease by 2px
            canDecrease = newFontSize > minFontSize; // Check if further decrease is possible
        }

        // Apply the new font size
        element.style.fontSize = `${newFontSize}px`;
    });

    // Update button states based on limits
    this.setActiveButton('increase-text-btn', canIncrease);
    this.setActiveButton('decrease-text-btn', canDecrease);

    console.log(`Font size ${action}d. Active buttons: Increase (${canIncrease}), Decrease (${canDecrease}).`);
};



// HightLight Functions
MicAccessTool.prototype.initHighlightButtons = function () {
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

MicAccessTool.prototype.highlightContent = function (type) {
    const highlightClass = `highlight-${type}`;

    // Determine the selector based on the type
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
            // Handle image-specific highlighting (adding titles)
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
            // Toggle the highlight class for links and headers
            element.classList.toggle(highlightClass);
        }
    });

    console.log(`${elements.length} ${type} elements toggled for highlighting.`);
};


// Stop Animation

// Stop Animation Functionality
MicAccessTool.prototype.stopAnimations = function () {
    const isDisabled = document.body.classList.toggle('disable-animations'); 

    // Persist the state in localStorage
    localStorage.setItem('animationsDisabled', isDisabled);

    if (isDisabled) {
        console.log('Animations and transitions disabled.');
        this.setActiveButton('stop-animations-btn'); // Set button to active
    } else {
        console.log('Animations and transitions re-enabled.');
        this.setActiveButton(null); // Deactivate button
    }
};

// Restore Animation State on Load
MicAccessTool.prototype.restoreAnimationState = function () {
    const isDisabled = localStorage.getItem('animationsDisabled') === 'true';
    if (isDisabled) {
        document.body.classList.add('disable-animations');
        console.log('Restored: Animations are disabled.');
        this.setActiveButton('stop-animations-btn'); // Ensure button is active on load
    } else {
        this.setActiveButton(null); // Reset button state if animations are enabled
    }
};

// Add Stop Animations Button Listener
MicAccessTool.prototype.initStopAnimationsButton = function () {
    const stopAnimationsButton = document.getElementById('stop-animations-btn');
    if (stopAnimationsButton) {
        stopAnimationsButton.addEventListener('click', this.stopAnimations.bind(this));
    }
};

// Initialize the app and restore state
MicAccessTool.prototype.initialApp = function () {
    this.restoreAnimationState(); // Restore animation state
    console.log('Accessibility toolbox initialized.');
};

// Zoom Toggle Functionality
MicAccessTool.prototype.initZoomToggleFeature = function () {
    this.zoomStates = [1, 1.25, 1.5, 1.75]; // Define zoom levels
    this.zoomIndex = 0; // Default to the first zoom level

    // Add event listener for the Zoom Toggle button
    const zoomToggleButton = document.getElementById('zoom-toggle-btn');
    if (zoomToggleButton) {
        zoomToggleButton.addEventListener('click', this.toggleZoom.bind(this));
    }

    // Restore saved zoom state on initialization
    this.restoreZoomState();
};


// Toggle Zoom Function
MicAccessTool.prototype.toggleZoom = function () {
    this.zoomIndex = (this.zoomIndex + 1) % this.zoomStates.length; // Cycle through zoom states
    const zoomLevel = this.zoomStates[this.zoomIndex];

    // Apply the selected zoom level
    this.applyZoom(zoomLevel);

    // Set the active button state explicitly
    const isActive = zoomLevel !== 1; // Active for zoom levels other than default (1)
    this.setActiveButton('zoom-toggle-btn', isActive);

    console.log(`Zoom level toggled to: ${zoomLevel}`);
};


// Apply Zoom Function
MicAccessTool.prototype.applyZoom = function (zoomLevel) {
    const elementsToZoom = document.querySelectorAll('body > *:not(#toolbox):not(#openToolboxButton):not(img)');

    elementsToZoom.forEach(element => {
        element.style.transform = `scale(${zoomLevel})`;
        element.style.transformOrigin = '0 0'; // Keep scaling from the top-left corner
        element.style.width = `${100 / zoomLevel}%`; // Adjust width to maintain layout
    });

    // Save the zoom level to localStorage
    this.saveZoomState(zoomLevel);

    console.log(`Zoom level applied: ${zoomLevel}`);
};


MicAccessTool.prototype.restoreZoomState = function () {
    const savedZoomLevel = parseFloat(localStorage.getItem('zoomLevel')) || 1; // Default to 1 (no zoom)
    this.applyZoom(savedZoomLevel);

    // Find the corresponding zoom index
    this.zoomIndex = this.zoomStates.indexOf(savedZoomLevel);
    if (this.zoomIndex === -1) this.zoomIndex = 0; // Reset if saved level is invalid

    // Set the button state based on the saved zoom level
    const isActive = savedZoomLevel !== 1; // Active for levels other than default (1)
    this.setActiveButton('zoom-toggle-btn', isActive);
};


// Save Zoom State on Change
MicAccessTool.prototype.saveZoomState = function (zoomLevel) {
    localStorage.setItem('zoomLevel', zoomLevel);
    console.log(`Zoom level saved: ${zoomLevel}`);
};


// Night Mode Feature
MicAccessTool.prototype.initNightModeFeature = function () {
    const nightModeButton = document.getElementById('night-mode-btn');
    if (nightModeButton) {
        nightModeButton.addEventListener('click', () => {
            this.toggleNightMode();
        });
    }

    // Check stored night mode state and apply it
    const isNightModeEnabled = localStorage.getItem('nightMode') === 'true';
    document.body.classList.toggle('night-mode', isNightModeEnabled);
    this.setActiveButton('night-mode-btn', isNightModeEnabled); // Set the button state explicitly
};

MicAccessTool.prototype.toggleNightMode = function () {
    const isNightModeEnabled = document.body.classList.toggle('night-mode'); 
    localStorage.setItem('nightMode', isNightModeEnabled);

    // Update button state explicitly based on the current mode
    this.setActiveButton('night-mode-btn', isNightModeEnabled);

    console.log(`Night Mode ${isNightModeEnabled ? 'enabled' : 'disabled'}.`);
};



// Text Spacing Feature
MicAccessTool.prototype.initTextSpacingFeature = function () {
    const textSpacingButton = document.getElementById('text-spacing-btn');
    if (textSpacingButton) {
        textSpacingButton.addEventListener('click', () => {
            this.toggleTextSpacing('text-spacing-btn');
        });
    }
};

// Toggle Text Spacing with Active State Management
MicAccessTool.prototype.toggleTextSpacing = function (buttonId) {
    const elementsToAdjust = document.querySelectorAll('body *:not(.toolbox):not(.toolbox *)');
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

    // Explicitly set the button's active state based on whether the spacing is `normal`
    const isActive = spacingLevel !== 'normal';
    this.setActiveButton(buttonId, isActive); // Explicitly set active or inactive

    console.log(`Text spacing set to: ${spacingLevel}`);
};


// Line Height Feature
MicAccessTool.prototype.initLineHeightFeature = function () {
    const lineHeightButton = document.getElementById('line-height-btn');
    if (lineHeightButton) {
        lineHeightButton.addEventListener('click', () => {
            this.toggleLineHeight('line-height-btn');
        });
    }
};

// Toggle Line Height with Active State Management
MicAccessTool.prototype.toggleLineHeight = function (buttonId) {
    const elementsToAdjust = document.querySelectorAll('body *:not(.toolbox):not(.toolbox *)');
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
        this.setActiveButton(buttonId, false); // Deactivate button when line height returns to normal
    } else {
        this.setActiveButton(buttonId, true); // Activate button for other line height states
    }

    console.log(`Line height set to: ${lineHeightLevel}`);
};


// Cursor Size

// Initialize Cursor Size Adjustment
MicAccessTool.prototype.initCursorSizeAdjustment = function () {
    const cursorSizeButton = document.getElementById('cursor-size-btn');
    if (cursorSizeButton) {
        cursorSizeButton.addEventListener('click', () => {
            this.toggleCursorSize('cursor-size-btn');
        });
    }
};

// Toggle Cursor Size with Active State Management
MicAccessTool.prototype.toggleCursorSize = function (buttonId) {
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
    this.setActiveButton(buttonId, isActive); // Set active state based on whether size is "normal"

    console.log(`Cursor size set to: ${selectedCursor.size}`);
};


// Keyboard Navigation

// Keyboard Navigation Initialization
MicAccessTool.prototype.initKeyboardNavigation = function () {
    const keyboardNavButton = document.getElementById('keyboard-navigation-btn');
    if (keyboardNavButton) {
        keyboardNavButton.addEventListener('click', () => {
            this.keyboardNavigationActive = !this.keyboardNavigationActive; // Toggle state
            this.setActiveButton('keyboard-navigation-btn'); // Highlight button

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
MicAccessTool.prototype.enableKeyboardNavigation = function () {
    console.log('Keyboard Navigation Enabled');

    // Add keydown event listener for navigation and functionality
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
};

// Disable Keyboard Navigation
MicAccessTool.prototype.disableKeyboardNavigation = function () {
    console.log('Keyboard Navigation Disabled');

    // Remove keydown event listener
    document.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
};

// Handle Keyboard Navigation and Functionality
MicAccessTool.prototype.handleKeyboardNavigation = function (event) {
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
        },
        ArrowUp: () => {
            event.preventDefault();
            currentIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            focusableElements[currentIndex].focus();
        },
        Enter: () => {
            if (document.activeElement) {
                document.activeElement.click();
            }
        },
        Escape: () => {
            this.disableKeyboardNavigation();
            this.hideKeyboardNavigationPopup();
            this.setActiveButton(null);
        },
        KeyB: () => document.getElementById('blue-filter-btn').click(),
        KeyI: () => document.getElementById('remove-images-btn').click(),
        KeyA: () => document.getElementById('remove-audio-btn').click(),
        KeyR: () => document.getElementById('read-aloud-btn').click(),
        KeyP: () => document.getElementById('increase-text-btn').click(),
        KeyM: () => document.getElementById('decrease-text-btn').click(),
        KeyH: () => document.getElementById('highlight-links-btn').click(),
        KeyS: () => document.getElementById('stop-animations-btn').click(),
        KeyZ: () => document.getElementById('zoom-toggle-btn').click(),
        KeyN: () => document.getElementById('night-mode-btn').click(),
        KeyT: () => document.getElementById('text-spacing-btn').click(),
        KeyL: () => document.getElementById('line-height-btn').click(),
        KeyC: () => document.getElementById('cursor-size-btn').click(),
    };

    if (keyFunctionMap[event.code]) {
        keyFunctionMap[event.code](); // Trigger the function mapped to the key
    }
};

// Show Popup for Keyboard Shortcuts
MicAccessTool.prototype.showKeyboardNavigationPopup = function () {
    const existingPopup = document.getElementById('keyboard-navigation-popup');
    if (existingPopup) return; // Prevent duplicate popups

    const popup = createDiv('keyboard-popup', 'keyboard-navigation-popup'); 
    const header = createDiv('popup-header');
    const title = createHeading(3, 'Keyboard Shortcuts', 'popup-title');
    const closeButton = createElement('button', { class: 'close-popup-btn' }, '✖');
    closeButton.addEventListener('click', this.hideKeyboardNavigationPopup.bind(this));
    header.appendChild(title);
    header.appendChild(closeButton);

    const keyFunctionMap = [
        { key: 'ArrowDown', text: 'Navigate to next element' },
        { key: 'ArrowUp', text: 'Navigate to previous element' },
        { key: 'Enter', text: 'Activate selected element' },
        { key: 'B', text: 'Blue Filter' },
        { key: 'I', text: 'Remove Images' },
        { key: 'A', text: 'Remove Audio' },
        { key: 'R', text: 'Read Aloud' },
        { key: 'P', text: 'Increase Text Size' },
        { key: 'M', text: 'Decrease Text Size' },
        { key: 'H', text: 'Highlight Links' },
        { key: 'S', text: 'Stop Animations' },
        { key: 'Z', text: 'Zoom' },
        { key: 'N', text: 'Night Mode' },
        { key: 'T', text: 'Adjust Text Spacing' },
        { key: 'L', text: 'Adjust Line Height' },
        { key: 'C', text: 'Change Cursor Size' },
    ];

    const body = createDiv('popup-body');
    const list = createElement('ul', { class: 'shortcut-list' });

    keyFunctionMap.forEach(({ key, text }) => {
        const listItem = createElement('li', { class: 'shortcut-item' });
        listItem.innerHTML = `<strong>${key}</strong>: ${text}`;
        list.appendChild(listItem);
    });

    body.appendChild(list);
    popup.appendChild(header);
    popup.appendChild(body);

    document.body.appendChild(popup);
};

// Hide Popup
MicAccessTool.prototype.hideKeyboardNavigationPopup = function () {
    const popup = document.getElementById('keyboard-navigation-popup');
    if (popup) {
        popup.remove();
    }
};



// Button Active

MicAccessTool.prototype.setActiveButton = function (activeButtonId, isActive = null) {
    const button = document.getElementById(activeButtonId);

    if (button) {
        // Determine the new state based on the `isActive` parameter or toggle the current state
        const newState = isActive !== null ? isActive : button.dataset.active !== 'true';

        if (newState) {
            // Activate the button
            button.style.backgroundColor = 'rgba(52, 88, 185, 1)'; // Active state
            button.dataset.active = 'true'; // Mark as active
        } else {
            // Deactivate the button
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Default state
            button.dataset.active = 'false'; // Mark as inactive
        }
    }
};



MicAccessTool.prototype.resetButtonStates = function () {
    const buttons = document.querySelectorAll('.toolbox-button');
    buttons.forEach((button) => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Default state
        button.dataset.active = 'false'; // Ensure all buttons are inactive
    });
};


// Accessible Function

MicAccessTool.prototype.initAccessibleFontToggle = function () {
    const fontToggleButton = document.getElementById('accessible-font-btn');
    if (fontToggleButton) {
        fontToggleButton.addEventListener('click', () => {
            this.toggleAccessibleFont();
            this.setActiveButton('accessible-font-btn'); // Highlight button
        });
    }
};

MicAccessTool.prototype.toggleAccessibleFont = function () {
    const isFontApplied = document.body.classList.toggle('accessible-font');
    console.log(`Accessible font ${isFontApplied ? 'enabled' : 'disabled'}`);
};

// Reset Function

MicAccessTool.prototype.initResetFeature = function () {
    const resetButton = document.getElementById('reset-btn');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            this.resetToolbox(); // Call the reset function
        });
    }
};


MicAccessTool.prototype.resetToolbox = function () {
    // Remove highlights
    document.querySelectorAll('.highlight-links, .highlight-headers, .highlight-images').forEach(el => {
        el.classList.remove('highlight-links', 'highlight-headers', 'highlight-images');
    });

    // Restore original font size and spacing for elements modified by the toolbox
    document.querySelectorAll('body *:not(.toolbox):not(.toolbox *)').forEach(el => {
        if (el.style.fontSize) el.style.fontSize = ''; // Reset only toolbox-applied font size
        if (el.style.letterSpacing) el.style.letterSpacing = ''; // Reset only toolbox-applied spacing
        if (el.style.lineHeight) el.style.lineHeight = ''; // Reset only toolbox-applied line height
        if (el.style.transform) el.style.transform = ''; // Reset only toolbox-applied zoom
        if (el.style.transformOrigin) el.style.transformOrigin = ''; // Reset toolbox-applied transform origin
        if (el.style.width && el.style.transform) el.style.width = ''; // Reset width only if it was adjusted by zoom
    });

    // Remove blue filter
    const blueOverlay = document.querySelector('.blue-overlay');
    if (blueOverlay) blueOverlay.classList.remove('active');

    // Restore images
    if (this.imagesHidden) {
        // Only restore images removed by the toolbox, preserving website styles
        this.removedImages.forEach(({ img, parent, nextSibling }) => {
            if (nextSibling) {
                parent.insertBefore(img, nextSibling);
            } else {
                parent.appendChild(img);
            }
        });
        this.removedImages = []; // Clear stored removed images
        this.imagesHidden = false;
    }

    // Restore audio
    const soundElements = document.querySelectorAll('audio, video');
    soundElements.forEach(el => {
        if (el.muted) el.muted = false; // Unmute only if muted by the toolbox
    });

    // Disable night mode
    document.body.classList.remove('night-mode');

    // Reset cursor size
    document.documentElement.style.cursor = 'auto';

    // Reset accessible font
    document.body.classList.remove('accessible-font');

    // Re-enable animations
    document.body.classList.remove('disable-animations');

    // Clear only toolbox-specific local storage settings
    localStorage.removeItem('animationsDisabled');
    localStorage.removeItem('nightMode');
    localStorage.removeItem('zoomLevel');

    // Reset button states
    this.resetButtonStates();

    console.log('Toolbox reset to the original state.');
};





// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    new MicAccessTool();
    loadFontAwesome()
});