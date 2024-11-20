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
        const iconWrapper = document.createElement('span'); // Wrapper for the icon
        iconWrapper.innerHTML = iconHtml; // Parse the HTML string into a DOM element
        button.appendChild(iconWrapper); // Append the icon to the button
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
    ];
    
    
    const body = createDiv('toolbox-body');

    buttons.forEach(({ id, text, iconClass }) => {
        const button = createButton(id, text, iconClass);
        body.appendChild(button);
    });
    toolbox.appendChild(header);
    toolbox.appendChild(body);

    document.body.appendChild(toolbox);
};

// Create Side Button
MicAccessTool.prototype.createSideButton = function () {
    const sideButton = createDiv('side-button', 'openToolboxButton');
    const buttonImage = createImage(
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmaznO2w-h9n4bz-pEGtsiqy0J1JGh-wlMCw&s',
        'Open Toolbox',
        ''
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

    sideButton.addEventListener('click', () => {
        toolbox.classList.toggle('visible');
    });
};

// Feature Initializers
MicAccessTool.prototype.initBlueFilter = function () {
    const blueOverlay = createDiv('blue-overlay');
    document.body.appendChild(blueOverlay);

    const blueFilterButton = document.getElementById('blue-filter-btn');
    if (blueFilterButton) {
        blueFilterButton.addEventListener('click', () => {
            blueOverlay.classList.toggle('active');
        });
    }
};

MicAccessTool.prototype.initRemoveImages = function () {
    const removeImageButton = document.getElementById('remove-images-btn');
    if (removeImageButton) {
        removeImageButton.addEventListener('click', this.toggleImages.bind(this));
    }
};

MicAccessTool.prototype.toggleImages = function () {
    if (this.imagesHidden) {
        this.removedImages.forEach(({ img, parent, nextSibling }) => {
            if (nextSibling) {
                parent.insertBefore(img, nextSibling);
            } else {
                parent.appendChild(img);
            }
        });
        this.removedImages = [];
    } else {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            this.removedImages.push({
                img: img,
                parent: img.parentNode,
                nextSibling: img.nextSibling,
            });
            img.parentNode.removeChild(img);
        });
    }

    this.imagesHidden = !this.imagesHidden;
};

MicAccessTool.prototype.initAudioRemoval = function () {
    const audioRemovalButton = document.getElementById('remove-audio-btn');
    if (audioRemovalButton) {
        audioRemovalButton.addEventListener('click', this.audioRemoval.bind(this));
    }
};

MicAccessTool.prototype.audioRemoval = function () {
    const soundElements = document.querySelectorAll('audio, video');
    this.isMuted = !this.isMuted;
    soundElements.forEach(element => {
        element.muted = this.isMuted;
    });
};

MicAccessTool.prototype.initReadAloud = function () {
    const readAloudBtn = document.getElementById('read-aloud-btn');
    if (readAloudBtn) {
        readAloudBtn.addEventListener('click', this.readAloud.bind(this));
    }
};

MicAccessTool.prototype.readAloud = function () {
    const msg = new SpeechSynthesisUtterance();
    const tags = document.querySelectorAll('h1, h2, h3, p, a, button');

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            msg.text = tag.innerText || tag.value || '';
            if (msg.text) {
                tags.forEach(t => (t.style.backgroundColor = ''));
                tag.style.backgroundColor = 'yellow';
                speechSynthesis.speak(msg);
                msg.onend = () => {
                    tag.style.backgroundColor = '';
                };
            }
        });
    });
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


// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    new MicAccessTool();
    loadFontAwesome()
});
