(function() {
    /**
     * This script uses the IntersectionObserver API to add a 'is-visible' class
     * to elements with the 'show-info' class when they enter the viewport.
     */

    // 1. Select all elements we want to animate
    const targets = document.querySelectorAll('.show-info');

    // 2. Set up the options for the observer
    // rootMargin: adds a margin around the root (viewport). 
    // Negative values shrink the root area, meaning the element
    // has to be further inside the viewport before it's considered "intersecting".
    // '-50px' means the animation will trigger when the element is 50px inside the viewport.
    const options = {
        root: null, // null means it observes intersections relative to the viewport
        rootMargin: '0px 0px -50px 0px',
        threshold: 0 // Trigger as soon as any part of the element is visible
    };

    // 3. The callback function that runs when an observed element's visibility changes
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            // Check if the element is intersecting (i.e., is in the viewport)
            if (entry.isIntersecting) {
                // Add the 'is-visible' class to trigger the CSS animation
                entry.target.classList.add('is-visible');

                // Once the animation is triggered, we don't need to watch this element anymore.
                // This is good for performance.
                observer.unobserve(entry.target);
            }
        });
    };

    // 4. Create the Intersection Observer
    const observer = new IntersectionObserver(callback, options);

    // 5. Tell the observer to watch each of our target elements
    targets.forEach(target => {
        observer.observe(target);
    });

})();