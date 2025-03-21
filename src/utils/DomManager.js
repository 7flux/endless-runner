// can be obsolete

export class DomManager {
  static mounted; // DOM elements {}

  constructor(elements) {}

  cleanup() {}

  mount(parent, element) {
    parent.appendChild(element);
    DomManager.mounted[parent.className] = {
      name: element.className, // simple lookup?
      element: element,
    }
  }
}