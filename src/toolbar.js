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
function createButton(id, text) {
    return createElement('button', { class: 'toolbox-button', id: id }, text);
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

    const body = createDiv('toolbox-body');
    const buttons = [
        { id: 'blue-filter-btn', text: 'Blue Filter' },
        { id: 'read-aloud-btn', text: 'Read Aloud' },
        { id: 'remove-images-btn', text: 'Remove Images' },
        { id: 'remove-audio-btn', text: 'Remove Audio' },
    ];

    buttons.forEach(({ id, text }) => {
        const button = createButton(id, text);
        body.appendChild(button);
    });

    toolbox.appendChild(imageContainer);
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

function setupButtonClickBehavior(buttonSelector, action) {
    // Select all buttons matching the provided selector
    const buttons = document.querySelectorAll(buttonSelector);

    buttons.forEach(button => {
        const originalColor = window.getComputedStyle(button).backgroundColor;

        button.addEventListener('click', () => {
            // Toggle the button's color
            if (button.style.backgroundColor === 'rgb(52, 88, 185)') {
                button.style.backgroundColor = originalColor; // Revert to original
            } else {
                button.style.backgroundColor = 'rgb(52, 88, 185)'; // Change to new color
            }

            // Call the provided action function
            if (typeof action === 'function') {
                action(button); // Pass the button element to the action
            }
        });
    });
}
// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    new MicAccessTool();
});
