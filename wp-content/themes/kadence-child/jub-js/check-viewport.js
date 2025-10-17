const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
};

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    } else {
      entry.target.classList.remove('animate');
    }
  });
}

const observer = new IntersectionObserver(handleIntersection, observerOptions);

const items = document.querySelectorAll('.snap-scroll-section');
items.forEach(item => observer.observe(item));
