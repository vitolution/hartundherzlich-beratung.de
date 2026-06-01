document.addEventListener('DOMContentLoaded', function() {
    // Scrollbaren Container auswählen
    const scrollContainer = document.querySelector('.snap-scroll-body');
    if (!scrollContainer) {
        console.error('Scrollbarer Container nicht gefunden.');
        return;
    }

    // Alle Slides mit der Klasse snap-scroll-section auswählen
    const slides = document.querySelectorAll('.snap-scroll-section');
    console.log('Slides:', slides);

    // Intersection Observer erstellen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slideId = entry.target.id;
                console.log('Sichtbarer Slide:', slideId);

                // URL ohne Anker zurücksetzen
                window.history.replaceState({}, '', window.location.pathname);

                // Nur Anker setzen, wenn slideId nicht "start" ist
                if (slideId && slideId !== 'start') {
                    window.history.replaceState({}, '', `#${slideId}`);
                }
            }
        });
    }, {
        root: scrollContainer,
        threshold: 0.5,
        rootMargin: '0px'
    });

    // Alle Slides beobachten
    slides.forEach(slide => {
        observer.observe(slide);
    });
});