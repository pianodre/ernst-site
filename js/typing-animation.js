// Typing Animation for Homepage
class TypingAnimation {
    constructor() {
        this.line1Text = "Hi, I'm Dylan.";
        this.line2Text = "A Computer Science Major";
        this.subText = "Cybersecurity emphasis";
        this.line1Element = document.getElementById('typing-text-line1');
        this.line2Element = document.getElementById('typing-text-line2');
        this.subElement = document.getElementById('sub-typing-text');
        this.line1Cursor = document.querySelector('.cursor-line1');
        this.line2Cursor = document.querySelector('.cursor-line2');
        this.subCursor = document.querySelector('.sub-cursor');
        
        this.line1Index = 0;
        this.line2Index = 0;
        this.subIndex = 0;
        this.typingSpeed = 80; // milliseconds per character
        this.subTypingSpeed = 60;
        this.pauseBetweenLines = 300; // pause between line 1 and line 2
        this.pauseBeforeSubtext = 500; // pause before starting subtext
    }

    init() {
        // Hide line2 cursor and sub-cursor initially
        this.line2Cursor.classList.add('hidden');
        this.subCursor.classList.add('hidden');
        
        // Start typing the first line
        this.typeLine1();
    }

    typeLine1() {
        if (this.line1Index < this.line1Text.length) {
            this.line1Element.textContent += this.line1Text.charAt(this.line1Index);
            this.line1Index++;
            setTimeout(() => this.typeLine1(), this.typingSpeed);
        } else {
            // Line 1 is complete, hide line1 cursor and start line 2 after pause
            setTimeout(() => {
                this.line1Cursor.classList.add('hidden');
                this.line2Cursor.classList.remove('hidden');
                this.typeLine2();
            }, this.pauseBetweenLines);
        }
    }

    typeLine2() {
        if (this.line2Index < this.line2Text.length) {
            this.line2Element.textContent += this.line2Text.charAt(this.line2Index);
            this.line2Index++;
            setTimeout(() => this.typeLine2(), this.typingSpeed);
        } else {
            // Line 2 is complete, hide line2 cursor and start subtext after pause
            setTimeout(() => {
                this.line2Cursor.classList.add('hidden');
                this.subCursor.classList.remove('hidden');
                this.typeSubText();
            }, this.pauseBeforeSubtext);
        }
    }

    typeSubText() {
        if (this.subIndex < this.subText.length) {
            this.subElement.textContent += this.subText.charAt(this.subIndex);
            this.subIndex++;
            setTimeout(() => this.typeSubText(), this.subTypingSpeed);
        } else {
            // Subtext is complete, keep cursor blinking
            // Optionally hide cursor after some time
            setTimeout(() => {
                this.subCursor.classList.add('hidden');
            }, 3000); // Hide cursor after 3 seconds
        }
    }
}

// Initialize the typing animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const typingAnimation = new TypingAnimation();
    typingAnimation.init();
});
