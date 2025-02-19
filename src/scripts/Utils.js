const scrollContainer = document.querySelector(".snap-container");

function getScrollProgress(element1 = null, element2 = null) {
  // const scrollTop = window.scrollY;
  const scrollTop = scrollContainer.scrollTop;
  const viewportHeight = window.innerHeight;

  if (element1 && element2) {
    // Scroll progress between two elements
    const element1Top = element1.offsetTop;
    const element2Top = element2.offsetTop;
    const scrollRange = element2Top - element1Top;

    // Clamp and calculate scroll progress
    const currentScroll = Math.min(
      Math.max(scrollTop - element1Top, 0),
      scrollRange
    );
    return scrollRange > 0 ? currentScroll / scrollRange : 1;
  } else if (element1) {
    // Scroll progress from the top of the page to one element
    const elementTop = element1.offsetTop;
    const scrollRange = elementTop;

    // Clamp and calculate scroll progress
    const currentScroll = Math.min(Math.max(scrollTop, 0), scrollRange);
    return scrollRange > 0 ? currentScroll / scrollRange : 1;
  } else {
    // Scroll progress for the entire page
    const documentHeight =
      document.documentElement.scrollHeight - viewportHeight;
    return documentHeight > 0 ? scrollTop / documentHeight : 1;
  }
}

function getScrollSection(elements) {
  // const scrollTop = window.scrollY;
  const scrollTop = scrollContainer.scrollTop;
  const totalSections = elements.length - 1;

  for (let i = 0; i < totalSections; i++) {
    const sectionTop = elements[i].offsetTop;
    const nextSectionTop =
      i < totalSections - 1 ? elements[i + 1].offsetTop : Infinity;

    if (scrollTop >= sectionTop && scrollTop < nextSectionTop) {
      return i;
    }
  }

  // If scrolled past the last section, return the last section index
  return 0;
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export { getRandomNumber, getScrollProgress, getScrollSection };
