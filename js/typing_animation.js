class RollingTextAnimation {
    constructor(element, titles, options = {}) {
        this.element = element;
        this.titles = titles;
        this.options = {
            typeSpeed: options.typeSpeed || 100,
            deleteSpeed: options.deleteSpeed || 50,
            displayTime: options.displayTime || 2000,
            startDelay: options.startDelay || 500,
            staticPrefix: options.staticPrefix || '> ',
            onComplete: options.onComplete || null
        };
        
        this.currentTitleIndex = 0;
        this.currentText = '';
        this.currentCharIndex = 0;
        this.isTyping = true;
        this.isRunning = false;
        this.staticElement = null;
        this.rollingElement = null;
        this.cursorElement = null;
        
        this.init();
    }
    
    init() {
        // Create container structure
        this.element.innerHTML = '';
        
        // Create container
        const container = document.createElement('span');
        container.classList.add('rolling-container');
        
        // Create static prefix element
        this.staticElement = document.createElement('span');
        this.staticElement.classList.add('rolling-static');
        this.staticElement.textContent = this.options.staticPrefix;
        
        // Create rolling text element
        this.rollingElement = document.createElement('span');
        this.rollingElement.classList.add('rolling-text');
        this.rollingElement.textContent = '';
        
        // Create cursor element
        this.cursorElement = document.createElement('span');
        this.cursorElement.classList.add('rolling-cursor');
        
        container.appendChild(this.staticElement);
        container.appendChild(this.rollingElement);
        container.appendChild(this.cursorElement);
        this.element.appendChild(container);
        
        // Start animation after delay
        setTimeout(() => {
            this.startAnimation();
        }, this.options.startDelay);
    }
    
    startAnimation() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.typeCurrentTitle();
    }
    
    typeCurrentTitle() {
        const currentTitle = this.titles[this.currentTitleIndex];
        
        if (this.isTyping) {
            // Typing phase
            if (this.currentCharIndex < currentTitle.length) {
                this.currentText += currentTitle[this.currentCharIndex];
                this.rollingElement.textContent = this.currentText;
                this.currentCharIndex++;
                
                setTimeout(() => {
                    this.typeCurrentTitle();
                }, this.options.typeSpeed);
            } else {
                // Finished typing, wait then start deleting
                setTimeout(() => {
                    this.isTyping = false;
                    this.typeCurrentTitle();
                }, this.options.displayTime);
            }
        } else {
            // Deleting phase
            if (this.currentText.length > 0) {
                this.currentText = this.currentText.slice(0, -1);
                this.rollingElement.textContent = this.currentText;
                
                setTimeout(() => {
                    this.typeCurrentTitle();
                }, this.options.deleteSpeed);
            } else {
                // Finished deleting, move to next title
                this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titles.length;
                this.currentCharIndex = 0;
                this.isTyping = true;
                
                // Small pause before next title
                setTimeout(() => {
                    this.typeCurrentTitle();
                }, 300);
            }
        }
    }
    
    // Method to stop the animation
    stop() {
        this.isRunning = false;
    }
    
    // Method to restart the animation
    restart() {
        this.currentTitleIndex = 0;
        this.currentText = '';
        this.currentCharIndex = 0;
        this.isTyping = true;
        this.isRunning = false;
        
        this.init();
    }
}

// Initialize rolling text animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Find the hero subtitle element
    const heroSubtitle = document.querySelector('.hero-box p');
    
    if (heroSubtitle) {
        // Define the job titles to rotate through
        const jobTitles = [
            'C++ Developer',
            'Cybersecurity Enthusiast', 
            'Information Security Student',
            'Modern C++ Specialist'
        ];
        
        // Create rolling text animation
        const rollingAnimation = new RollingTextAnimation(heroSubtitle, jobTitles, {
            typeSpeed: 120,        // Speed of typing (ms per character)
            deleteSpeed: 60,       // Speed of deleting (ms per character)
            displayTime: 2500,     // Time to display complete text (ms)
            startDelay: 1000,      // Delay before starting (ms)
            staticPrefix: '> ',    // Static text before rolling text
            onComplete: function() {
                console.log('Rolling animation cycle completed!');
            }
        });
        
        // Optional: Restart animation when hero section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    // Only restart if not already running
                    if (!rollingAnimation.isRunning) {
                        setTimeout(() => {
                            rollingAnimation.restart();
                        }, 500);
                    }
                }
            });
        }, {
            threshold: 0.5
        });
        
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }
});