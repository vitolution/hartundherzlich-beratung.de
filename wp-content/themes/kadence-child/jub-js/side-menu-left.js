document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.wp-block-kadence-navigation-link a[href^="#"], .wp-block-kadence-advancedbtn a[href^="#"], a[href^="#"], a[href^="https://www.hartundherzlich-beratung.de/leistungen/#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start"
        });

        const mobileMenu = document.querySelector(".mobile-menu");
        if (mobileMenu && mobileMenu.classList.contains("open")) {
          mobileMenu.classList.remove("open");
        }
      }
    });
  });

  function addClassIfIntersecting(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".anchor").forEach(item => {
          item.classList.add("inactive");
          item.classList.remove("current-menu-item");
        });

        switch(entry.target.id) {
          case 'leistungen':
            document.querySelector('.leistungen').classList.remove("inactive");
            document.querySelector('.leistungen')?.classList.add("current-menu-item");
            break;
          case 'wir':
            document.querySelector('.wir').classList.remove("inactive");
            document.querySelector('.wir')?.classList.add("current-menu-item");
            break;
          case 'kunden':
            document.querySelector('.kunden').classList.remove("inactive");
            document.querySelector('.kunden')?.classList.add("current-menu-item");
            break;
          case 'jobs':
            document.querySelector('.jobs').classList.remove("inactive");
            document.querySelector('.jobs')?.classList.add("current-menu-item");
            break;
          case 'news':
            document.querySelector('.news').classList.remove("inactive");
            document.querySelector('.news')?.classList.add("current-menu-item");
            break;
          case 'kontakt':
            if(document.querySelector('.kontakt')) {
              document.querySelector('.kontakt').classList.remove("inactive");
              document.querySelector('.kontakt')?.classList.add("current-menu-item");
            }
            break;
          case 'start':
		document.querySelectorAll(".anchor").forEach(item => {
			item.classList.add("inactive");
		});
		break;
        }
      }
    });
  }
document.querySelectorAll('.current-menu-item').forEach(item => {
  item.classList.remove('current-menu-item');
});

  const observer = new IntersectionObserver(addClassIfIntersecting, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  });

  const sections = ["start", "leistungen", "wir", "kunden", "jobs", "news", "kontakt"];
  sections.forEach(section => {
    const target = document.getElementById(section);
    if (target) {
      observer.observe(target);
    }
  });
});