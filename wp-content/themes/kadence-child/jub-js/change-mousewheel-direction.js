document.addEventListener("DOMContentLoaded", function () {
    const allowedPages = [64, 721, 2184, 729, 2551, 4531];
    const swipeThreshold = 0;
    const preventDefaultOnTouch = true;

    const bodyClasses = document.body.classList;
    const isAllowedPage = allowedPages.some(id => bodyClasses.contains(`page-id-${id}`));

    const wheelDuration = 600;
    const padDuration = 800;
    const wheelPadThreshold = 80;
    const scrollThreshold = 10;

    const debug = false;

    if (isAllowedPage) {
        const scrollContainer = document.querySelector(".snap-scroll-body");
        const sections = document.querySelectorAll(".snap-scroll-section");

        if (!scrollContainer || sections.length === 0) {
            return;
        }

        let isScrolling = false;
        let touchStartX = null;
        let touchEndX = null;
        let touchStartY = null;
        let touchEndY = null;

        function getSectionOffset(section) {
            let offset = 0;
            let element = section;
            while (element) {
                offset += element.offsetLeft;
                element = element.offsetParent;
            }
            return offset;
        }

        function getCurrentSection(scrollContainer, sections) {
            const scrollPosition = scrollContainer.scrollLeft;

            let closestSection = 0;
            let closestDistance = Math.abs(getSectionOffset(sections[0]) - scrollPosition);

            sections.forEach((section, index) => {
                const offset = section.offsetLeft;
                const distance = Math.abs(offset - scrollPosition);

                if (distance < closestDistance) {
                    closestSection = index;
                    closestDistance = distance;
                }
            });

            return closestSection;
        }

        function scrollToSection(scrollContainer, sections, index, reportedDelta) {
            if (index < 0) index = 0;
            if (index >= sections.length) index = sections.length - 1;

            const targetSection = sections[index];
            const targetPosition = getSectionOffset(targetSection);

            if (debug) 
                console.log(" >>> SCROLLING TO SECTION: " + index);

            scrollContainer.scrollTo({
                left: targetPosition,
                behavior: "smooth"
            });

            var timeoutDuration = reportedDelta > wheelPadThreshold ? wheelDuration : padDuration;

            isScrolling = true;
            if(debug)
                console.log("BLOCKED SCROLLING FOR: " + timeoutDuration + "ms");
            setTimeout(() => {
                isScrolling = false;
                if (debug) 
                    console.log("UNBLOCKED SCROLLING");
            }, timeoutDuration);
        }

        function isTouchInsideScrollText(element) {
            let currentElement = element;
            while (currentElement) {
                if (currentElement.classList && currentElement.classList.contains('scroll-text')) return true;
                if (!currentElement.parentNode) return false;
                currentElement = currentElement.parentNode;
            }
            return false;
        }

        function isTouchInsideBubbles(element) {
            let currentElement = element;
            while (currentElement) {
                if (currentElement.classList && currentElement.classList.contains('splide__slide')) return true;
                if (!currentElement.parentNode) return false;
                currentElement = currentElement.parentNode;
            }
            return false;
        }

        function handleTouchStart(e) {
            if (e.touches.length === 1) {
                if (isTouchInsideBubbles(e.target)) return;
                if (isTouchInsideScrollText(e.target)) return;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchEndX = null;
                touchEndY = null;
                if (preventDefaultOnTouch) {
                }
            }
        }

        function handleTouchMove(e) {
            if (e.touches.length === 1 && touchStartX !== null) {
                if (isTouchInsideBubbles(e.target)) return;
                if (isTouchInsideScrollText(e.target)) return;
                touchEndX = e.touches[0].clientX;
                touchEndY = e.touches[0].clientY;
                if (preventDefaultOnTouch) {
                }
            }
        }

        function handleTouchEnd() {
            if (touchStartX !== null && touchEndX !== null && !isScrolling) {
                if (isTouchInsideBubbles(event.target)) return;
                if (isTouchInsideScrollText(event.target)) return;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
                    let direction = 0;
                    let reportedDelta = 0;
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        direction = deltaX > 0 ? -1 : 1;
                        reportedDelta = Math.abs(deltaX);
                    } else {
                        direction = deltaY > 0 ? -1 : 1;
                        reportedDelta = Math.abs(deltaY);
                    }
                    const currentSectionIndex = getCurrentSection(scrollContainer, sections);
                    const nextSectionIndex = currentSectionIndex + direction;
                    scrollToSection(scrollContainer, sections, nextSectionIndex, reportedDelta);
                }
                touchStartX = null;
                touchEndX = null;
                touchStartY = null;
                touchEndY = null;
            }
        }

        function throttle(func, delay) {
            let timeoutId;
            let lastExec = 0;
            return function(...args) {
                const context = this;
                const now = Date.now();
                if (now - lastExec >= delay) {
                    func.apply(context, args);
                    lastExec = now;
                } else {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        func.apply(context, args);
                        lastExec = Date.now();
                    }, delay);
                }
            };
        }

        function roundTowardZeroToTens(n) {
            return n < 0
                ? Math.ceil(n / 10) * 10
                : Math.floor(n / 10) * 10;
        }          

        const throttledScrollHandler = throttle(function(e) {
            e.preventDefault();

            var delta = Math.max(
                Math.abs(e.originalEvent.deltaX),
                Math.abs(e.originalEvent.deltaY)
            );

            if (
                e.originalEvent.deltaX < 0 &&
                Math.abs(e.originalEvent.deltaX) == Math.abs(delta)
            ) {
                delta = -delta;
            }
            if (
                e.originalEvent.deltaY < 0 &&
                Math.abs(e.originalEvent.deltaY) == Math.abs(delta)
            ) {
                delta = -delta;
            }

            if (isScrolling){
                if (debug) 
                    console.log("BLOCKED EVENT");
                return;
            }

            delta = roundTowardZeroToTens(delta);

            if (debug) 
                console.log("DELTA: " + delta);
            if(Math.abs(delta) >= scrollThreshold) {

                const direction = delta > 0 ? 1 : -1;
                const currentSection = getCurrentSection(scrollContainer, sections);
                let nextSectionIndex = currentSection + direction;

                if (debug) 
                    console.log("current section: " + currentSection + ", next section: " + nextSectionIndex );

                if (nextSectionIndex < 0) nextSectionIndex = 0;
                if (nextSectionIndex >= sections.length) nextSectionIndex = sections.length - 1;
                
                var reportedDelta = Math.abs(delta);

                scrollToSection(scrollContainer, sections, nextSectionIndex, reportedDelta);
            } else {
                if (debug) 
                    console.log("DELTA ERROR");
            }

        }, 400);

        jQuery(".snap-scroll-body").on("wheel", function(e) {
            throttledScrollHandler.call(this, e);
        });

        scrollContainer.addEventListener("touchstart", handleTouchStart);
        scrollContainer.addEventListener("touchmove", handleTouchMove);
        scrollContainer.addEventListener("touchend", handleTouchEnd);
    }
});