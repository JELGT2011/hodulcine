import Tab from './tab';

const STATE_PROPERTIES = new Set(['clientId', 'tabs', 'timestamp']);

class State {

  static get properties() {
    return STATE_PROPERTIES;
  }

  constructor(clientId = null, timestamp = 0, tabs = []) {
    this.clientId = clientId;
    this.timestamp = timestamp;
    this.tabs = tabs;
  }

  static fromObject(object) {
    if (!(object
      && object.hasOwnProperty('clientId')
      && object.hasOwnProperty('timestamp')
      && object.hasOwnProperty('tabs'))) return null;
    return new State(object.clientId, object.timestamp, object.tabs.map(Tab.fromObject));
  }

  toObject() {
    return {
      clientId: this.clientId,
      timestamp: this.timestamp,
      tabs: this.tabs.map((tab) => tab.toObject()),
    }
  }

  get urls() {
    return new Set(this.tabs.map((tab) => tab.url))
  }
}

export { State as default };
