/**
 * data.js — Image collection and feature extraction
 */

const DataStore = (() => {
  // classes: [{ name, images: [HTMLImageElement] }]
  const classes = [];

  function addClass(name = '') {
    classes.push({ name, images: [] });
    return classes.length - 1;
  }

  function removeClass(index) {
    classes.splice(index, 1);
  }

  function setClassName(index, name) {
    if (classes[index]) classes[index].name = name;
  }

  function addImages(classIndex, imageElements) {
    if (classes[classIndex]) {
      classes[classIndex].images.push(...imageElements);
    }
  }

  function getClasses() {
    return classes;
  }

  function getClass(index) {
    return classes[index];
  }

  function clear() {
    classes.length = 0;
  }

  /**
   * Returns true if every class has at least `minImages` images and
   * there are at least 2 classes.
   */
  function isReady(minImages = 1) {
    return classes.length >= 2 && classes.every(c => c.images.length >= minImages);
  }

  return { addClass, removeClass, setClassName, addImages, getClasses, getClass, clear, isReady };
})();
