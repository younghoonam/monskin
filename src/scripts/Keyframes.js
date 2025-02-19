import * as Utils from "./Utils.js";

const scrollContainer = document.querySelector(".snap-container");

class Keyframes {
  constructor(elements) {
    this.elements = elements;
    this.numOfSection = elements.length - 1;
    this.currentSection = 0;
    this.progress = new Array(this.numOfSection);
    this.wholeProgress = 0;

    this.update();
    scrollContainer.addEventListener("scroll", () => {
      this.update();
    });
  }

  update() {
    this.wholeProgress = Utils.getScrollProgress();
    const currentKeyframe = Utils.getScrollSection(this.elements);
    this.currentSection = currentKeyframe;

    for (let index = 0; index < this.elements.length - 1; index++) {
      const element = this.elements[index];
      const nextElement = this.elements[index + 1];
      const progress = Utils.getScrollProgress(element, nextElement);
      this.progress[index] = progress;
    }

    // console.log(this.currentSection, this.progress, this.wholeProgress);
  }
}

export { Keyframes };
