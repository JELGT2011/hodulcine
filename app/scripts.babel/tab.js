
const TAB_SYNC_PROPERTIES = new Set(['index', 'url', 'active', 'pinned']);

class Tab {

  static get properties() {
    return TAB_SYNC_PROPERTIES;
  }

  constructor(index, url, active, pinned) {
    this.index = index;
    this.url = url;
    this.active = active;
    this.pinned = pinned;
  }

  static fromObject(object) {
    if (!(object &&
      object.hasOwnProperty('index') &&
      object.hasOwnProperty('url') &&
      object.hasOwnProperty('active') &&
      object.hasOwnProperty('pinned'))) return null;
    return new Tab(object.index, object.url, object.active, object.pinned);
  }

  toObject() {
    return {
      index: this.index,
      url: this.url,
      active: this.active,
      pinned: this.pinned,
    }
  }
}

export { Tab as default };
