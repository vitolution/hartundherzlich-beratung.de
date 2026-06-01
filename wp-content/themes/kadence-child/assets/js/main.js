document.addEventListener('DOMContentLoaded', function() {

  
    // Alle Slides mit der Klasse snap-scroll-section auswählen
    const slides = document.querySelectorAll('.snap-scroll-section');

    // Intersection Observer erstellen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // ID des aktuellen Slides abrufen
                const slideId = entry.target.id;
                if (slideId) {
                    // URL ohne Anker setzen
                    window.history.replaceState({}, '', window.location.pathname);
                    // Neuen Anker zur URL hinzufügen
                    window.history.replaceState({}, '', `#${slideId}`);
                }
            }
        });
    }, {
        threshold: 0.5, // 50% des Slides müssen sichtbar sein, um als "aktiv" zu gelten
        rootMargin: '-50% 0px -50% 0px' // Optional: Anpassung der Erkennungszone
    });

    // Alle Slides beobachten
    slides.forEach(slide => {
        observer.observe(slide);
    });
});