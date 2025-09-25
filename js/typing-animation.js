// Enhanced Typing Animation for Homepage
class TypingAnimation {
    constructor() {
        this.nameText = "Dylan Ernst";
        this.titleText = "Software Engineer";
        this.descriptionText = "Computer Science Major at Chapman University";
        
        this.nameElement = document.getElementById('typing-text-name');
        this.titleElement = document.getElementById('typing-text-title');
        this.descriptionElement = document.getElementById('typing-text-description');
        
        this.nameCursor = document.querySelector('.cursor-name');
        this.titleCursor = document.querySelector('.cursor-title');
        this.descriptionCursor = document.querySelector('.cursor-description');
  
        this.nameIndex = 0;
        this.titleIndex = 0;
        this.descriptionIndex = 0;
        
        this.typingSpeed = 80; // milliseconds per character
        this.fastTypingSpeed = 60; // for description
        this.pauseBetweenSections = 50; // shorter pause between name and title
        this.pauseBeforeDescription = 200; // shorter pause before description
    }

    init() {
        // Hide title and description cursors initially
        this.titleCursor.classList.add('hidden');
        this.descriptionCursor.classList.add('hidden');
        

        
        // Start with a small delay for dramatic effect
        setTimeout(() => {
            this.typeName();
        }, 500);
    }

    typeName() {
        if (this.nameIndex < this.nameText.length) {
            this.nameElement.textContent += this.nameText.charAt(this.nameIndex);
            this.nameIndex++;
            setTimeout(() => this.typeName(), this.typingSpeed);
        } else {
            // Name is complete, hide name cursor and start title after pause
            setTimeout(() => {
                this.nameCursor.classList.add('hidden');
                this.titleCursor.classList.remove('hidden');
                this.typeTitle();
            }, this.pauseBetweenSections);
        }
    }

    typeTitle() {
        if (this.titleIndex < this.titleText.length) {
            this.titleElement.textContent += this.titleText.charAt(this.titleIndex);
            this.titleIndex++;
            setTimeout(() => this.typeTitle(), this.typingSpeed);
        } else {
            // Title is complete, hide title cursor and start description after pause
            setTimeout(() => {
                this.titleCursor.classList.add('hidden');
                this.descriptionCursor.classList.remove('hidden');
                this.typeDescription();
            }, this.pauseBeforeDescription);
        }
    }

    typeDescription() {
        if (this.descriptionIndex < this.descriptionText.length) {
            this.descriptionElement.textContent += this.descriptionText.charAt(this.descriptionIndex);
            this.descriptionIndex++;
            setTimeout(() => this.typeDescription(), this.fastTypingSpeed);
        } else {
            // Description is complete, hide cursor and show hero elements
            setTimeout(() => {
                this.descriptionCursor.classList.add('hidden');
                this.showHeroElements();
            }, 500);
        }
    }

    showHeroElements() {
        // Show CTA buttons with animation
        const ctaButtons = document.querySelector('.hero-cta');
        if (ctaButtons) {
            ctaButtons.classList.add('visible');
        }
        
        // Show floating icons with staggered animation
        const floatingIcons = document.querySelectorAll('.floating-icon');
        floatingIcons.forEach((icon, index) => {
            setTimeout(() => {
                icon.classList.add('visible');
            }, index * 200);
        });
        
        // Show scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            setTimeout(() => {
                scrollIndicator.classList.add('visible');
            }, 800);
        }
    }
}

// Initialize the typing animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const typingAnimation = new TypingAnimation();
    typingAnimation.init();
});
