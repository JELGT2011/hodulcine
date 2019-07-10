'use strict';

import 'chrome-extension-async';

const STATE_PROPERTIES = new Set(['tabs', 'timestamp']);
const TAB_SYNC_PROPERTIES = new Set(['index', 'url', 'active', 'pinned']);

chrome.runtime.onInstalled.addListener(handleRuntimeOnInstalled);
chrome.runtime.onStartup.addListener(handleMerge);

chrome.storage.onChanged.addListener(handleStorageOnChanged);

chrome.tabs.onCreated.addListener(handleMerge);
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
  // noinspection JSIgnoredPromiseFromCall
  mergeStates();
}

function handleStorageOnChanged(changes, areaName) {
  if (areaName !== 'sync') return;
  // noinspection JSIgnoredPromiseFromCall
  mergeStates();
}

function handleMerge() {
  // noinspection JSIgnoredPromiseFromCall
  mergeStates();
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
    console.log(`converting object to Tab: object = ${JSON.stringify(object)}`);
    if (!(object &&
      object.hasOwnProperty('index') &&
      object.hasOwnProperty('url') &&
      object.hasOwnProperty('active') &&
      object.hasOwnProperty('pinned'))) return null;
    return new Tab(object.index, object.url, object.active, object.pinned);
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
    console.log(`converting object to State: object = ${JSON.stringify(object)}`);
    if (!(object
      && object.hasOwnProperty('timestamp')
      && object.hasOwnProperty('tabs'))) return new State();
    return new State(object.timestamp, object.tabs.map(Tab.fromObject));
  }
}

async function mergeStates() {
  let localState = await getOrCreateLocalState();
  let remoteState = await getRemoteState();

  if (!(remoteState instanceof State) || remoteState.timestamp < localState.timestamp) {
    console.log(`overwriting remote state to merge: localState = ${JSON.stringify(localState)}, remoteState = ${JSON.stringify(remoteState)}`);
    await setRemoteStateFromLocal(localState);
  } else {
    console.log(`overwriting local state to merge: localState = ${JSON.stringify(localState)}, remoteState = ${JSON.stringify(remoteState)}`);
    await setLocalStateFromRemote(remoteState);
  }
}

async function createLocalState() {
  let tabs = await chrome.tabs.query({});
  let localState = new State(
    Date.now(),
    tabs.map(Tab.fromObject),
  );

  console.log(`created local state: localState = ${JSON.stringify(localState)}`);
  await chrome.storage.local.set(localState);
  return localState;
}

async function getOrCreateLocalState() {
  let localState = State.fromObject(await chrome.storage.local.get(State.properties));
  if (localState instanceof State) return localState;

  return await createLocalState();
}

async function getRemoteState() {
  return State.fromObject(await chrome.storage.sync.get(State.properties));
}

async function setLocalStateFromRemote(remoteState) {
  let localState = await getOrCreateLocalState();

  console.log(`setting local state from remote: remoteState = ${JSON.stringify(remoteState)}`);
  await chrome.storage.local.set(remoteState);

  let remoteUrls = new Set(remoteState.tabs.map((tab) => tab.url));
  let localUrls = new Set(localState.tabs.map((tab) => tab.url));

  // remove tabs not present in remote
  for (let tab of localState.tabs) {
    if (!remoteUrls.has(tab.url)) {
      console.log(`removing local tab: tabUrl = ${tab.url}`);
      await chrome.tabs.remove(tab.id);
    }
  }

  // add tabs not present in local
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

async function setRemoteStateFromLocal(localState) {
  console.log(`setting remote state from local: localState = ${JSON.stringify(localState)}`);
  await chrome.storage.sync.set(localState);
}
