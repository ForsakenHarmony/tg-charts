/**
 * @typedef
 * @name VNode
 * @property {string} tagName
 * @property {Object} attributes
 * @property {(VNode | string)[]} children
 */

/**
 *
 * @param {string} tagName
 * @param {Object?} attributes
 * @param {(VNode | string)[]} children
 *
 * @return {VNode}
 */
export function h(tagName, attributes = {}, children = []) {
  return {
    tagName,
    attributes,
    children
  };
}

/**
 *
 * @param {ChildNode} element
 * @param {Object} attributes
 */
function diffAttrs(element, attributes) {
  const newAttrs = Object.keys(attributes);
  const attrs = element.attributes;
  for (let i = attrs.length - 1; i >= 0; i--) {
    let name = attrs[i].name;
    let value = attrs[i].value;
    // if we already have the attribute, let's reuse it
    if (attributes[name] !== undefined) {
      newAttrs.splice(newAttrs.indexOf(name), 1);
      if ("" + attributes[name] !== value) {
        attrs[i].value = attributes[name];
      }
    } else {
      // delete any not given
      element.removeAttribute(name);
    }
  }
  newAttrs.map(a => {
    // event handlers
    if (a[0] === "o" && a[1] === "n") {
      const name = a.toLowerCase().substr(2);
      if (!element._listen || !element._listen[name])
        element.addEventListener(name, eventProxy, false);
      (element._listen || (element._listen = {}))[name] = attributes[a];
      // } else if (element[a] !== 'undefined') {
      //   element[a] = attributes[a];
    } else {
      element.setAttribute(a, attributes[a]);
    }
  });
}

function eventProxy(e) {
  return this._listen[e.type](e);
}

const EMPTY_ARR = [];

/**
 *
 * @param {ChildNode} parent
 * @param {(VNode | string)[]} nodes
 * @param {boolean?} isSvg
 * @return {SVGAElement}
 */
export function diff(parent, nodes, isSvg = false) {
  const children = parent.childNodes;

  let n,
    i = 0,
    len = nodes.length,
    childI = 0,
    isNew = false,
    el;
  for (; i < len; i++) {
    n = nodes[i];
    // skip null nodes
    if (!n) continue;
    // convert to string if it's not a normal node
    n = n.tagName ? n : typeof n === "string" ? n : "" + n;
    // svgs need namespace elements
    isSvg = n.tagName === "svg" || isSvg;
    // try to find the right element, delete any that are not in the node tree
    el = children[childI++];
    while (el != null && (el.tagName || "#text").toLowerCase() !== n.tagName) {
      parent.removeChild(el);
      el = children[childI++];
    }
    // create and append an element if we didn't find one
    isNew = !el;
    el =
      el ||
      (typeof n === "string"
        ? document.createTextNode(n)
        : isSvg
        ? document.createElementNS("http://www.w3.org/2000/svg", n.tagName)
        : document.createElement(n.tagName));
    if (typeof n === "string") {
      // text node
      el.data !== n && (el.data = n);
    } else {
      // normal element
      diffAttrs(el, n.attributes);
      diff(el, n.children, isSvg);
    }
    if (isNew) parent.appendChild(el);
  }

  for (; childI < children.length; childI++) {
    parent.removeChild(children[childI]);
  }
}
