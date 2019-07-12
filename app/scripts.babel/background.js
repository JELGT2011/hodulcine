'use strict';

// this import should come first because it modifies the chromium api
import 'chrome-extension-async';
import uuid4 from 'uuid/v4';

function prettyPrint(obj) {
  return JSON.stringify(obj, null, '\t');
}

const STATE_PROPERTIES = new Set(['clientId', 'tabs', 'timestamp']);
const TAB_SYNC_PROPERTIES = new Set(['index', 'url', 'active', 'pinned']);

chrome.runtime.onInstalled.addListener(handleRuntimeOnInstalled);
chrome.runtime.onStartup.addListener(handleRuntimeOnStartup);

chrome.storage.onChanged.addListener(handleStorageOnChanged);

chrome.tabs.onCreated.addListener(handleTabEvent);
chrome.tabs.onUpdated.addListener(handleTabEvent);
chrome.tabs.onMoved.addListener(handleTabEvent);
chrome.tabs.onRemoved.addListener(handleTabEvent);
chrome.tabs.onReplaced.addListener(handleTabEvent);

// TODO: include information about windows, create proxy maps between window ids and match based on similarity
// chrome.tabs.onAttached
// chrome.tabs.onDetached
// chrome.tabs.onHighlighted

let clientId = null;

function handleRuntimeOnInstalled(details) {
  console.log(`Installed new version. previousVersion = ${details.previousVersion}`);
  clientId = clientId || uuid4();
}

function handleRuntimeOnStartup() {
  clientId = clientId || uuid4();
  // noinspection JSIgnoredPromiseFromCall
  mergeStatesByTimestamp();
}

function handleStorageOnChanged(changes, areaName) {
  if (areaName !== 'sync') return;
  // noinspection JSIgnoredPromiseFromCall
  mergeStatesByClientId();
}

function handleTabEvent(tab) {
  // noinspection JSIgnoredPromiseFromCall
  setRemoteStateFromLocal();
}

async function setRemoteStateFromLocal() {
  let localState = await getLocalState();
  await setRemoteState(localState);
}

async function mergeStatesByClientId() {
  let remoteState = await getRemoteState();
  if (remoteState && remoteState.clientId && remoteState.clientId !== clientId) {
    console.log(
      `remote state was updated by another client,
      force updating local state:
      localClientId = ${clientId}, remoteClientId = ${remoteState.clientId}`
    );
    await setLocalState(remoteState);
  }
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

async function mergeStatesByTimestamp() {
  let localState = await getLocalState();
  let remoteState = await getRemoteState();

  if (!(remoteState instanceof State)) {
    console.log(`remoteState does not exist, overwriting: localState = ${prettyPrint(localState)}`);
    await setRemoteState(localState);
    return;
  }

  if (remoteState.urls === localState.urls) {
    console.log(`remote and local urls are the same, no-op: remoteUrls = ${remoteState.urls}, localUrls = ${localState.urls}`);
    return;
  }

  if (remoteState.timestamp < localState.timestamp) {
    console.log(`overwriting remote state to merge: localState = ${prettyPrint(localState)}, remoteState = ${prettyPrint(remoteState)}`);
    await setRemoteState(localState);
  } else {
    console.log(`overwriting local state to merge: localState = ${prettyPrint(localState)}, remoteState = ${prettyPrint(remoteState)}`);
    await setLocalState(remoteState);
  }
}

async function getLocalState() {
  // TODO: fill in queryInfo
  let tabs = await chrome.tabs.query({});
  let localState = new State(
    clientId,
    Date.now(),
    tabs.map(Tab.fromObject),
  );

  console.log(`created local state: localState = ${prettyPrint(localState)}`);
  await chrome.storage.local.set(localState.toObject());
  return localState;
}

async function getRemoteState() {
  return State.fromObject(await chrome.storage.sync.get(State.properties));
}

async function setLocalState(remoteState) {
  let localState = await getLocalState();

  console.log(`setting local state from remote: remoteState = ${prettyPrint(remoteState)}`);
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
  console.log(`setting remote state from local: localState = ${prettyPrint(localState)}`);
  await chrome.storage.sync.set(localState.toObject());
}
