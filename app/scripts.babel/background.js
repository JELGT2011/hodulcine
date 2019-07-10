'use strict';

import 'chrome-extension-async';

const STATE_PROPERTIES = new Set(['tabs', 'timestamp']);
const TAB_SYNC_PROPERTIES = new Set(['index', 'url', 'active', 'pinned']);

chrome.runtime.onInstalled.addListener(handleRuntimeOnInstalled);
chrome.runtime.onStartup.addListener(handleMerge);

chrome.storage.onChanged.addListener(handleStorageOnChanged);

chrome.tabs.onCreated.addListener(handleMerge);

// TODO: look up docs for these functions
// chrome.tabs.onUpdated.addListener(handleMerge);
// chrome.tabs.onMoved.addListener(handleMerge);
// chrome.tabs.onActivated.addListener(handleMerge);
// chrome.tabs.onRemoved.addListener(handleMerge);
// chrome.tabs.onReplaced.addListener(handleMerge);

// TODO: include information about windows, create proxy maps between window ids and match based on similarity
// chrome.tabs.onAttached
// chrome.tabs.onDetached
// chrome.tabs.onHighlighted


function handleRuntimeOnInstalled(details) {
  console.log(`Installed new version. previousVersion = ${details.previousVersion}`);
}

// TODO: handle shouldn't execute if this client just updated the remote
function handleStorageOnChanged(changes, areaName) {
  if (areaName !== 'sync') return;
  // noinspection JSIgnoredPromiseFromCall
  setLocalStateFromRemote();
}

function handleMerge() {
  // noinspection JSIgnoredPromiseFromCall
  mergeStates();
}

async function setLocalStateFromRemote() {
  let remoteState = await getRemoteState();
  await setLocalState(remoteState);
}

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

class State {

  static get properties() {
    return STATE_PROPERTIES;
  }

  constructor(timestamp = 0, tabs = []) {
    this.timestamp = timestamp;
    this.tabs = tabs;
  }

  static fromObject(object) {
    if (!(object
      && object.hasOwnProperty('timestamp')
      && object.hasOwnProperty('tabs'))) return null;
    return new State(object.timestamp, object.tabs.map(Tab.fromObject));
  }

  toObject() {
    return {
      timestamp: this.timestamp,
      tabs: this.tabs.map((tab) => tab.toObject()),
    }
  }

  get urls() {
    return new Set(this.tabs.map((tab) => tab.url))
  }
}

async function mergeStates() {
  let localState = await getOrCreateLocalState();
  let remoteState = await getRemoteState();

  if (!(remoteState instanceof State)) {
    console.log(`remoteState does not exist, overwriting: localState = ${JSON.stringify(localState)}`);
    await setRemoteState(localState);
    return;
  }

  if (remoteState.urls === localState.urls) {
    console.log(`remote and local urls are the same, no-op: remoteUrls = ${remoteState.urls}, localUrls = ${localState.urls}`);
    return;
  }

  if (remoteState.timestamp < localState.timestamp) {
    console.log(`overwriting remote state to merge: localState = ${JSON.stringify(localState)}, remoteState = ${JSON.stringify(remoteState)}`);
    await setRemoteState(localState);
  } else {
    console.log(`overwriting local state to merge: localState = ${JSON.stringify(localState)}, remoteState = ${JSON.stringify(remoteState)}`);
    await setLocalState(remoteState);
  }
}

async function createLocalState() {
  // TODO: fill in queryInfo
  let tabs = await chrome.tabs.query({});
  let localState = new State(
    Date.now(),
    tabs.map(Tab.fromObject),
  );

  console.log(`created local state: localState = ${JSON.stringify(localState)}`);
  await chrome.storage.local.set(localState.toObject());
  return localState;
}

async function getOrCreateLocalState() {
  let localState = State.fromObject(await chrome.storage.local.get(State.properties));
  console.log(`fetched local state: localState = ${JSON.stringify(localState)}`);

  if (localState instanceof State) return localState;
  return await createLocalState();
}

async function getRemoteState() {
  return State.fromObject(await chrome.storage.sync.get(State.properties));
}

async function setLocalState(remoteState) {
  let localState = await getOrCreateLocalState();

  console.log(`setting local state from remote: remoteState = ${JSON.stringify(remoteState)}`);
  await chrome.storage.local.set(remoteState.toObject());

  let remoteUrls = new Set(remoteState.tabs.map((tab) => tab.url));
  let localUrls = new Set(localState.tabs.map((tab) => tab.url));

  for (let tab of localState.tabs) {
    if (!remoteUrls.has(tab.url)) {
      console.log(`removing local tab: tabUrl = ${tab.url}`);
      await chrome.tabs.remove(tab.id);
    }
  }

  for (let tab of remoteState.tabs) {
    if (!localUrls.has(tab.url)) {
      console.log(`creating local tab: tabUrl = ${tab.url}`);
      await chrome.tabs.create({
        index: tab.index,
        url: tab.url,
        active: tab.active,
        pinned: tab.pinned,
      });
    }
  }
}

async function setRemoteState(localState) {
  console.log(`setting remote state from local: localState = ${JSON.stringify(localState)}`);
  await chrome.storage.sync.set(localState.toObject());
}
