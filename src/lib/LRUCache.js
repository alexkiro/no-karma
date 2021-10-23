export default class LRUCache {
  constructor(maxSize) {
    this.maxSize = parseInt(maxSize);
    this.store = {};
    this.ids = [];
  }
  add(id, item) {
    if (this.store[item]) {
      this.ids.splice(this.ids.indexOf(id), 1);
      this.ids.push(id);
    }

    if (this.ids.length === this.maxSize) {
      delete this.store[this.ids.shift()];
    }

    this.ids.push(id);
    this.store[id] = item;
  }

  get(key) {
    return this.store[key];
  }
}
