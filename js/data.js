/**
 * data.js — In-memory image store
 */
const DataStore = (() => {
  let classes = [];   // [{ id, name, images[] }]
  let nextId  = 0;

  function addClass(name = '') {
    const id = nextId++;
    classes.push({ id, name, images: [] });
    return classes.length - 1;
  }

  function removeClass(index) {
    classes.splice(index, 1);
  }

  function setClassName(index, name) {
    if (classes[index]) classes[index].name = name;
  }

  function addImages(index, imgs) {
    if (classes[index]) classes[index].images.push(...imgs);
  }

  function clearImages(index) {
    if (classes[index]) classes[index].images = [];
  }

  function getClasses()      { return classes; }
  function getClass(i)       { return classes[i]; }
  function getClassCount()   { return classes.length; }
  function getTotalImages()  { return classes.reduce((s, c) => s + c.images.length, 0); }

  function isReady(min = 1) {
    return classes.length >= 2 && classes.every(c => c.images.length >= min);
  }

  function clear() {
    classes = [];
    nextId  = 0;
  }

  return {
    addClass, removeClass, setClassName,
    addImages, clearImages,
    getClasses, getClass, getClassCount, getTotalImages,
    isReady, clear
  };
})();
