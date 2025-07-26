document.addEventListener('DOMContentLoaded', () => {
    // Select the elements needed for the animation
    const contactSection = document.getElementById('contact');
    const headingEl = document.getElementById('contact-heading');

    // Early exit if elements are not found
    if (!contactSection || !headingEl) {
        console.error("Required elements for contact animation not found.");
        return;
    }

    // --- Configuration for the typing animation ---
    const textToType1 = "Interested?";
    const textToType2 = "Get In Touch";
    const typingSpeed = 50; // Time in ms between each character
    const deletingSpeed = 60; // Time in ms between each character deletion
    const pauseDuration = 3000; // Pause in ms after "Interested?" is typed

    /**
     * Simulates a typing effect for a given string.
     * @param {string} text - The text to type out.
     * @param {HTMLElement} element - The HTML element to type into.
     * @param {number} [index=0] - The starting index for typing.
     * @param {function} [callback] - A function to call after typing is complete.
     */
    const typeText = (text, element, index = 0, callback) => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeText(text, element, index + 1, callback), typingSpeed);
        } else if (callback) {
            // Wait for the pause duration before executing the callback
            setTimeout(callback, pauseDuration);
        }
    };

    /**
     * Simulates deleting text from an element.
     * @param {HTMLElement} element - The element to delete text from.
     * @param {function} [callback] - A function to call after deleting is complete.
     */
    const deleteText = (element, callback) => {
        const currentText = element.textContent;
        if (currentText.length > 0) {
            element.textContent = currentText.slice(0, -1);
            setTimeout(() => deleteText(element, callback), deletingSpeed);
        } else if (callback) {
            callback();
        }
    };

    // --- The main animation sequence ---
    const startAnimationSequence = () => {
        // 1. Start by typing "Interested?"
        typeText(textToType1, headingEl, 0, () => {
            // 2. After typing and pausing, delete the text
            deleteText(headingEl, () => {
                // 3. After deleting, type the final text "Get In Touch"
                typeText(textToType2, headingEl);
            });
        });
    };

    // --- Intersection Observer to trigger the animation on view ---
    const observer = new IntersectionObserver((entries, observerInstance) => {
        const entry = entries[0];
        // If the element is not intersecting (visible), do nothing.
        if (!entry.isIntersecting) return;

        // If it is visible, start the animation.
        startAnimationSequence();

        // Animation should only run once, so we stop observing the element.
        observerInstance.unobserve(contactSection);
    }, {
        root: null, // Observes intersections relative to the viewport
        threshold: 0.4 // Triggers when 40% of the element is visible
    });

    // Start observing the contact section.
    observer.observe(contactSection);
});
