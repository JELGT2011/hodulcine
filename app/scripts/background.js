(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

require("chrome-extension-async");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STATE_PROPERTIES = new Set(['tabs', 'timestamp']);
var TAB_SYNC_PROPERTIES = new Set(['index', 'url', 'active', 'pinned']);
chrome.runtime.onInstalled.addListener(handleRuntimeOnInstalled);
chrome.runtime.onStartup.addListener(handleMerge);
chrome.storage.onChanged.addListener(handleStorageOnChanged);
chrome.tabs.onCreated.addListener(handleMerge); // chrome.tabs.onUpdated.addListener(handleMerge);
// chrome.tabs.onMoved.addListener(handleMerge);
// chrome.tabs.onActivated.addListener(handleMerge);
// chrome.tabs.onRemoved.addListener(handleMerge);
// chrome.tabs.onReplaced.addListener(handleMerge);
// TODO: include information about windows, create proxy maps between window ids and match based on similarity
// chrome.tabs.onAttached
// chrome.tabs.onDetached
// chrome.tabs.onHighlighted

function handleRuntimeOnInstalled(details) {
  console.log("Installed new version. previousVersion = ".concat(details.previousVersion)); // noinspection JSIgnoredPromiseFromCall

  mergeStates();
}

function handleStorageOnChanged(changes, areaName) {
  if (areaName !== 'sync') return; // noinspection JSIgnoredPromiseFromCall

  mergeStates();
}

function handleMerge() {
  // noinspection JSIgnoredPromiseFromCall
  mergeStates();
}

var Tab =
/*#__PURE__*/
function () {
  _createClass(Tab, null, [{
    key: "properties",
    get: function get() {
      return TAB_SYNC_PROPERTIES;
    }
  }]);

  function Tab(index, url, active, pinned) {
    _classCallCheck(this, Tab);

    this.index = index;
    this.url = url;
    this.active = active;
    this.pinned = pinned;
  }

  _createClass(Tab, null, [{
    key: "fromObject",
    value: function fromObject(object) {
      console.log("converting object to Tab: object = ".concat(JSON.stringify(object)));
      if (!(object && object.hasOwnProperty('index') && object.hasOwnProperty('url') && object.hasOwnProperty('active') && object.hasOwnProperty('pinned'))) return null;
      return new Tab(object.index, object.url, object.active, object.pinned);
    }
  }]);

  return Tab;
}();

var State =
/*#__PURE__*/
function () {
  _createClass(State, null, [{
    key: "properties",
    get: function get() {
      return STATE_PROPERTIES;
    }
  }]);

  function State() {
    var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var tabs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, State);

    this.timestamp = timestamp;
    this.tabs = tabs;
  }

  _createClass(State, null, [{
    key: "fromObject",
    value: function fromObject(object) {
      console.log("converting object to State: object = ".concat(JSON.stringify(object)));
      if (!(object && object.hasOwnProperty('timestamp') && object.hasOwnProperty('tabs'))) return new State();
      return new State(object.timestamp, object.tabs.map(Tab.fromObject));
    }
  }]);

  return State;
}();

function mergeStates() {
  return _mergeStates.apply(this, arguments);
}

function _mergeStates() {
  _mergeStates = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var localState, remoteState;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getOrCreateLocalState();

          case 2:
            localState = _context.sent;
            _context.next = 5;
            return getRemoteState();

          case 5:
            remoteState = _context.sent;

            if (!(!(remoteState instanceof State) || remoteState.timestamp < localState.timestamp)) {
              _context.next = 12;
              break;
            }

            console.log("overwriting remote state to merge: localState = ".concat(JSON.stringify(localState), ", remoteState = ").concat(JSON.stringify(remoteState)));
            _context.next = 10;
            return setRemoteStateFromLocal(localState);

          case 10:
            _context.next = 15;
            break;

          case 12:
            console.log("overwriting local state to merge: localState = ".concat(JSON.stringify(localState), ", remoteState = ").concat(JSON.stringify(remoteState)));
            _context.next = 15;
            return setLocalStateFromRemote(remoteState);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _mergeStates.apply(this, arguments);
}

function createLocalState() {
  return _createLocalState.apply(this, arguments);
}

function _createLocalState() {
  _createLocalState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var tabs, localState;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return chrome.tabs.query({});

          case 2:
            tabs = _context2.sent;
            localState = new State(Date.now(), tabs.map(Tab.fromObject));
            console.log("created local state: localState = ".concat(JSON.stringify(localState)));
            _context2.next = 7;
            return chrome.storage.local.set(localState);

          case 7:
            return _context2.abrupt("return", localState);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _createLocalState.apply(this, arguments);
}

function getOrCreateLocalState() {
  return _getOrCreateLocalState.apply(this, arguments);
}

function _getOrCreateLocalState() {
  _getOrCreateLocalState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var localState;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = State;
            _context3.next = 3;
            return chrome.storage.local.get(State.properties);

          case 3:
            _context3.t1 = _context3.sent;
            localState = _context3.t0.fromObject.call(_context3.t0, _context3.t1);

            if (!(localState instanceof State)) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", localState);

          case 7:
            _context3.next = 9;
            return createLocalState();

          case 9:
            return _context3.abrupt("return", _context3.sent);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getOrCreateLocalState.apply(this, arguments);
}

function getRemoteState() {
  return _getRemoteState.apply(this, arguments);
}

function _getRemoteState() {
  _getRemoteState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = State;
            _context4.next = 3;
            return chrome.storage.sync.get(State.properties);

          case 3:
            _context4.t1 = _context4.sent;
            return _context4.abrupt("return", _context4.t0.fromObject.call(_context4.t0, _context4.t1));

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getRemoteState.apply(this, arguments);
}

function setLocalStateFromRemote(_x) {
  return _setLocalStateFromRemote.apply(this, arguments);
}

function _setLocalStateFromRemote() {
  _setLocalStateFromRemote = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(remoteState) {
    var localState, remoteUrls, localUrls, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tab, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _tab;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getOrCreateLocalState();

          case 2:
            localState = _context5.sent;
            console.log("setting local state from remote: remoteState = ".concat(JSON.stringify(remoteState)));
            _context5.next = 6;
            return chrome.storage.local.set(remoteState);

          case 6:
            remoteUrls = new Set(remoteState.tabs.map(function (tab) {
              return tab.url;
            }));
            localUrls = new Set(localState.tabs.map(function (tab) {
              return tab.url;
            })); // remove tabs not present in remote

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 11;
            _iterator = localState.tabs[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context5.next = 22;
              break;
            }

            tab = _step.value;

            if (remoteUrls.has(tab.url)) {
              _context5.next = 19;
              break;
            }

            console.log("removing local tab: tabUrl = ".concat(tab.url));
            _context5.next = 19;
            return chrome.tabs.remove(tab.id);

          case 19:
            _iteratorNormalCompletion = true;
            _context5.next = 13;
            break;

          case 22:
            _context5.next = 28;
            break;

          case 24:
            _context5.prev = 24;
            _context5.t0 = _context5["catch"](11);
            _didIteratorError = true;
            _iteratorError = _context5.t0;

          case 28:
            _context5.prev = 28;
            _context5.prev = 29;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 31:
            _context5.prev = 31;

            if (!_didIteratorError) {
              _context5.next = 34;
              break;
            }

            throw _iteratorError;

          case 34:
            return _context5.finish(31);

          case 35:
            return _context5.finish(28);

          case 36:
            // add tabs not present in local
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context5.prev = 39;
            _iterator2 = remoteState.tabs[Symbol.iterator]();

          case 41:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context5.next = 50;
              break;
            }

            _tab = _step2.value;

            if (localUrls.has(_tab.url)) {
              _context5.next = 47;
              break;
            }

            console.log("creating local tab: tabUrl = ".concat(_tab.url));
            _context5.next = 47;
            return chrome.tabs.create({
              index: _tab.index,
              url: _tab.url,
              active: _tab.active,
              pinned: _tab.pinned
            });

          case 47:
            _iteratorNormalCompletion2 = true;
            _context5.next = 41;
            break;

          case 50:
            _context5.next = 56;
            break;

          case 52:
            _context5.prev = 52;
            _context5.t1 = _context5["catch"](39);
            _didIteratorError2 = true;
            _iteratorError2 = _context5.t1;

          case 56:
            _context5.prev = 56;
            _context5.prev = 57;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 59:
            _context5.prev = 59;

            if (!_didIteratorError2) {
              _context5.next = 62;
              break;
            }

            throw _iteratorError2;

          case 62:
            return _context5.finish(59);

          case 63:
            return _context5.finish(56);

          case 64:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[11, 24, 28, 36], [29,, 31, 35], [39, 52, 56, 64], [57,, 59, 63]]);
  }));
  return _setLocalStateFromRemote.apply(this, arguments);
}

function setRemoteStateFromLocal(_x2) {
  return _setRemoteStateFromLocal.apply(this, arguments);
}

function _setRemoteStateFromLocal() {
  _setRemoteStateFromLocal = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(localState) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("setting remote state from local: localState = ".concat(JSON.stringify(localState)));
            _context6.next = 3;
            return chrome.storage.sync.set(localState);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _setRemoteStateFromLocal.apply(this, arguments);
}

},{"chrome-extension-async":2}],2:[function(require,module,exports){
/** Wrap an API that uses callbacks with Promises
 * This expects the pattern function withCallback(arg1, arg2, ... argN, callback)
 * @author Keith Henry <keith.henry@evolutionjobs.co.uk>
 * @license MIT */
(function () {
    'use strict';

    /** Wrap a function with a callback with a Promise.
     * @param {function} f The function to wrap, should be pattern: withCallback(arg1, arg2, ... argN, callback).
     * @param {function} parseCB Optional function to parse multiple callback parameters into a single object.
     * @returns {Promise} Promise that resolves when the callback fires. */
    function promisify(f, parseCB) {
        return (...args) => {
            let safeArgs = args;
            let callback;
            // The Chrome API functions all use arguments, so we can't use f.length to check

            // If there is a last arg
            if (args && args.length > 0) {

                // ... and the last arg is a function
                const last = args[args.length - 1];
                if (typeof last === 'function') {
                    // Trim the last callback arg if it's been passed
                    safeArgs = args.slice(0, args.length - 1);
                    callback = last;
                }
            }

            // Return a promise
            return new Promise((resolve, reject) => {
                try {
                    // Try to run the original function, with the trimmed args list
                    f(...safeArgs, (...cbArgs) => {

                        // If a callback was passed at the end of the original arguments
                        if (callback) {
                            // Don't allow a bug in the callback to stop the promise resolving
                            try { callback(...cbArgs); }
                            catch (cbErr) { reject(cbErr); }
                        }

                        // Chrome extensions always fire the callback, but populate chrome.runtime.lastError with exception details
                        if (chrome.runtime.lastError)
                            // Return as an error for the awaited catch block
                            reject(new Error(chrome.runtime.lastError.message || `Error thrown by API ${chrome.runtime.lastError}`));
                        else {
                            if (parseCB) {
                                const cbObj = parseCB(...cbArgs);
                                resolve(cbObj);
                            }
                            else if (!cbArgs || cbArgs.length === 0)
                                resolve();
                            else if (cbArgs.length === 1)
                                resolve(cbArgs[0]);
                            else
                                resolve(cbArgs);
                        }
                    });
                }
                catch (err) { reject(err); }
            });
        }
    }

    /** Promisify all the known functions in the map 
     * @param {object} api The Chrome native API to extend
     * @param {Array} apiMap Collection of sub-API and functions to promisify */
    function applyMap(api, apiMap) {
        if (!api)
            // Not supported by current permissions
            return;

        for (let funcDef of apiMap) {
            let funcName;
            if (typeof funcDef === 'string')
                funcName = funcDef;
            else {
                funcName = funcDef.n;
            }

            if (!api.hasOwnProperty(funcName))
                // Member not in API
                continue;

            const m = api[funcName];
            if (typeof m === 'function')
                // This is a function, wrap in a promise
                api[funcName] = promisify(m.bind(api), funcDef.cb);
            else
                // Sub-API, recurse this func with the mapped props
                applyMap(m, funcDef.props);
        }
    }

    /** Apply promise-maps to the Chrome native API.
     * @param {object} apiMaps The API to apply. */
    function applyMaps(apiMaps) {
        for (let apiName in apiMaps) {
            const callbackApi = chrome[apiName];
            if (!callbackApi)
                // Not supported by current permissions
                continue;

            const apiMap = apiMaps[apiName];
            applyMap(callbackApi, apiMap);
        }
    }

    // accessibilityFeatures https://developer.chrome.com/extensions/accessibilityFeatures
    const knownA11ySetting = ['get', 'set', 'clear'];

    // ContentSetting https://developer.chrome.com/extensions/contentSettings#type-ContentSetting
    const knownInContentSetting = ['clear', 'get', 'set', 'getResourceIdentifiers'];

    // StorageArea https://developer.chrome.com/extensions/storage#type-StorageArea
    const knownInStorageArea = ['get', 'getBytesInUse', 'set', 'remove', 'clear'];

    /** Map of API functions that follow the callback pattern that we can 'promisify' */
    applyMaps({
        accessibilityFeatures: [  // Todo: this should extend AccessibilityFeaturesSetting.prototype instead
            { n: 'spokenFeedback', props: knownA11ySetting },
            { n: 'largeCursor', props: knownA11ySetting },
            { n: 'stickyKeys', props: knownA11ySetting },
            { n: 'highContrast', props: knownA11ySetting },
            { n: 'screenMagnifier', props: knownA11ySetting },
            { n: 'autoclick', props: knownA11ySetting },
            { n: 'virtualKeyboard', props: knownA11ySetting },
            { n: 'animationPolicy', props: knownA11ySetting }],
        alarms: ['get', 'getAll', 'clear', 'clearAll'],
        bookmarks: [
            'get', 'getChildren', 'getRecent', 'getTree', 'getSubTree',
            'search', 'create', 'move', 'update', 'remove', 'removeTree'],
        browser: ['openTab'],
        browserAction: [
            'getTitle', 'setIcon', 'getPopup', 'getBadgeText', 'getBadgeBackgroundColor'],
        browsingData: [
            'settings', 'remove', 'removeAppcache', 'removeCache',
            'removeCookies', 'removeDownloads', 'removeFileSystems',
            'removeFormData', 'removeHistory', 'removeIndexedDB',
            'removeLocalStorage', 'removePluginData', 'removePasswords',
            'removeWebSQL'],
        commands: ['getAll'],
        contentSettings: [  // Todo: this should extend ContentSetting.prototype instead
            { n: 'cookies', props: knownInContentSetting },
            { n: 'images', props: knownInContentSetting },
            { n: 'javascript', props: knownInContentSetting },
            { n: 'location', props: knownInContentSetting },
            { n: 'plugins', props: knownInContentSetting },
            { n: 'popups', props: knownInContentSetting },
            { n: 'notifications', props: knownInContentSetting },
            { n: 'fullscreen', props: knownInContentSetting },
            { n: 'mouselock', props: knownInContentSetting },
            { n: 'microphone', props: knownInContentSetting },
            { n: 'camera', props: knownInContentSetting },
            { n: 'unsandboxedPlugins', props: knownInContentSetting },
            { n: 'automaticDownloads', props: knownInContentSetting }],
        contextMenus: ['create', 'update', 'remove', 'removeAll'],
        cookies: ['get', 'getAll', 'set', 'remove', 'getAllCookieStores'],
        debugger: ['attach', 'detach', 'sendCommand', 'getTargets'],
        desktopCapture: ['chooseDesktopMedia'],
        // TODO: devtools.*
        documentScan: ['scan'],
        downloads: [
            'download', 'search', 'pause', 'resume', 'cancel',
            'getFileIcon', 'erase', 'removeFile', 'acceptDanger'],
        enterprise: [{ n: 'platformKeys', props: ['getToken', 'getCertificates', 'importCertificate', 'removeCertificate'] }],
        extension: ['isAllowedIncognitoAccess', 'isAllowedFileSchemeAccess'], // mostly deprecated in favour of runtime
        fileBrowserHandler: ['selectFile'],
        fileSystemProvider: ['mount', 'unmount', 'getAll', 'get', 'notify'],
        fontSettings: [
            'setDefaultFontSize', 'getFont', 'getDefaultFontSize', 'getMinimumFontSize',
            'setMinimumFontSize', 'getDefaultFixedFontSize', 'clearDefaultFontSize',
            'setDefaultFixedFontSize', 'clearFont', 'setFont', 'clearMinimumFontSize',
            'getFontList', 'clearDefaultFixedFontSize'],
        gcm: ['register', 'unregister', 'send'],
        history: ['search', 'getVisits', 'addUrl', 'deleteUrl', 'deleteRange', 'deleteAll'],
        i18n: ['getAcceptLanguages', 'detectLanguage'],
        identity: [
            'getAuthToken', 'getProfileUserInfo', 'removeCachedAuthToken', 'launchWebAuthFlow'],
        idle: ['queryState'],
        input: [{
            n: 'ime', props: [
                'setMenuItems', 'commitText', 'setCandidates', 'setComposition', 'updateMenuItems',
                'setCandidateWindowProperties', 'clearComposition', 'setCursorPosition', 'sendKeyEvents',
                'deleteSurroundingText']
        }],
        management: [
            'setEnabled', 'getPermissionWarningsById', 'get', 'getAll',
            'getPermissionWarningsByManifest', 'launchApp', 'uninstall', 'getSelf',
            'uninstallSelf', 'createAppShortcut', 'setLaunchType', 'generateAppForLink'],
        networking: [{ n: 'config', props: ['setNetworkFilter', 'finishAuthentication'] }],
        notifications: ['create', 'update', 'clear', 'getAll', 'getPermissionLevel'],
        pageAction: ['getTitle', 'setIcon', 'getPopup'],
        pageCapture: ['saveAsMHTML'],
        permissions: ['getAll', 'contains', 'request', 'remove'],
        platformKeys: ['selectClientCertificates', 'verifyTLSServerCertificate',
            { n: "getKeyPair", cb: (publicKey, privateKey) => { return { publicKey, privateKey }; } }],
        runtime: [
            'getBackgroundPage', 'openOptionsPage', 'setUninstallURL',
            'restartAfterDelay', 'sendMessage',
            'sendNativeMessage', 'getPlatformInfo', 'getPackageDirectoryEntry',
            { n: "requestUpdateCheck", cb: (status, details) => { return { status, details }; } }],
        scriptBadge: ['getPopup'],
        sessions: ['getRecentlyClosed', 'getDevices', 'restore'],
        storage: [          // Todo: this should extend StorageArea.prototype instead
            { n: 'sync', props: knownInStorageArea },
            { n: 'local', props: knownInStorageArea },
            { n: 'managed', props: knownInStorageArea }],
        socket: [
            'create', 'connect', 'bind', 'read', 'write', 'recvFrom', 'sendTo',
            'listen', 'accept', 'setKeepAlive', 'setNoDelay', 'getInfo', 'getNetworkList'],
        sockets: [
            { n: 'tcp', props: [
                'create','update','setPaused','setKeepAlive','setNoDelay','connect',
                'disconnect','secure','send','close','getInfo','getSockets'] },
            { n: 'tcpServer', props: [
                'create','update','setPaused','listen','disconnect','close','getInfo','getSockets'] }, 
            { n: 'udp', props: [
                'create','update','setPaused','bind','send','close','getInfo',
                'getSockets','joinGroup','leaveGroup','setMulticastTimeToLive',
                'setMulticastLoopbackMode','getJoinedGroups','setBroadcast'] }],
        system: [
            { n: 'cpu', props: ['getInfo'] },
            { n: 'memory', props: ['getInfo'] },
            { n: 'storage', props: ['getInfo', 'ejectDevice', 'getAvailableCapacity'] }],
        tabCapture: ['capture', 'getCapturedTabs'],
        tabs: [
            'get', 'getCurrent', 'sendMessage', 'create', 'duplicate',
            'query', 'highlight', 'update', 'move', 'reload', 'remove',
            'detectLanguage', 'captureVisibleTab', 'executeScript',
            'insertCSS', 'setZoom', 'getZoom', 'setZoomSettings',
            'getZoomSettings', 'discard'],
        topSites: ['get'],
        tts: ['isSpeaking', 'getVoices', 'speak'],
        types: ['set', 'get', 'clear'],
        vpnProvider: ['createConfig', 'destroyConfig', 'setParameters', 'sendPacket', 'notifyConnectionStateChanged'],
        wallpaper: ['setWallpaper'],
        webNavigation: ['getFrame', 'getAllFrames', 'handlerBehaviorChanged'],
        windows: ['get', 'getCurrent', 'getLastFocused', 'getAll', 'create', 'update', 'remove']
    });
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy5iYWJlbC9iYWNrZ3JvdW5kLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9tZS1leHRlbnNpb24tYXN5bmMvY2hyb21lLWV4dGVuc2lvbi1hc3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGdCQUFnQixHQUFHLElBQUksR0FBSixDQUFRLENBQUMsTUFBRCxFQUFTLFdBQVQsQ0FBUixDQUF6QjtBQUNBLElBQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFKLENBQVEsQ0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixRQUFqQixFQUEyQixRQUEzQixDQUFSLENBQTVCO0FBRUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxXQUFmLENBQTJCLFdBQTNCLENBQXVDLHdCQUF2QztBQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixDQUF5QixXQUF6QixDQUFxQyxXQUFyQztBQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixDQUF5QixXQUF6QixDQUFxQyxzQkFBckM7QUFFQSxNQUFNLENBQUMsSUFBUCxDQUFZLFNBQVosQ0FBc0IsV0FBdEIsQ0FBa0MsV0FBbEMsRSxDQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxTQUFTLHdCQUFULENBQWtDLE9BQWxDLEVBQTJDO0FBQ3pDLEVBQUEsT0FBTyxDQUFDLEdBQVIsb0RBQXdELE9BQU8sQ0FBQyxlQUFoRSxHQUR5QyxDQUV6Qzs7QUFDQSxFQUFBLFdBQVc7QUFDWjs7QUFFRCxTQUFTLHNCQUFULENBQWdDLE9BQWhDLEVBQXlDLFFBQXpDLEVBQW1EO0FBQ2pELE1BQUksUUFBUSxLQUFLLE1BQWpCLEVBQXlCLE9BRHdCLENBRWpEOztBQUNBLEVBQUEsV0FBVztBQUNaOztBQUVELFNBQVMsV0FBVCxHQUF1QjtBQUNyQjtBQUNB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAnY2hyb21lLWV4dGVuc2lvbi1hc3luYyc7XG5cbmNvbnN0IFNUQVRFX1BST1BFUlRJRVMgPSBuZXcgU2V0KFsndGFicycsICd0aW1lc3RhbXAnXSk7XG5jb25zdCBUQUJfU1lOQ19QUk9QRVJUSUVTID0gbmV3IFNldChbJ2luZGV4JywgJ3VybCcsICdhY3RpdmUnLCAncGlubmVkJ10pO1xuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihoYW5kbGVSdW50aW1lT25JbnN0YWxsZWQpO1xuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwLmFkZExpc3RlbmVyKGhhbmRsZU1lcmdlKTtcblxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKGhhbmRsZVN0b3JhZ2VPbkNoYW5nZWQpO1xuXG5jaHJvbWUudGFicy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIoaGFuZGxlTWVyZ2UpO1xuLy8gY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKGhhbmRsZU1lcmdlKTtcbi8vIGNocm9tZS50YWJzLm9uTW92ZWQuYWRkTGlzdGVuZXIoaGFuZGxlTWVyZ2UpO1xuLy8gY2hyb21lLnRhYnMub25BY3RpdmF0ZWQuYWRkTGlzdGVuZXIoaGFuZGxlTWVyZ2UpO1xuLy8gY2hyb21lLnRhYnMub25SZW1vdmVkLmFkZExpc3RlbmVyKGhhbmRsZU1lcmdlKTtcbi8vIGNocm9tZS50YWJzLm9uUmVwbGFjZWQuYWRkTGlzdGVuZXIoaGFuZGxlTWVyZ2UpO1xuXG4vLyBUT0RPOiBpbmNsdWRlIGluZm9ybWF0aW9uIGFib3V0IHdpbmRvd3MsIGNyZWF0ZSBwcm94eSBtYXBzIGJldHdlZW4gd2luZG93IGlkcyBhbmQgbWF0Y2ggYmFzZWQgb24gc2ltaWxhcml0eVxuLy8gY2hyb21lLnRhYnMub25BdHRhY2hlZFxuLy8gY2hyb21lLnRhYnMub25EZXRhY2hlZFxuLy8gY2hyb21lLnRhYnMub25IaWdobGlnaHRlZFxuXG5cbmZ1bmN0aW9uIGhhbmRsZVJ1bnRpbWVPbkluc3RhbGxlZChkZXRhaWxzKSB7XG4gIGNvbnNvbGUubG9nKGBJbnN0YWxsZWQgbmV3IHZlcnNpb24uIHByZXZpb3VzVmVyc2lvbiA9ICR7ZGV0YWlscy5wcmV2aW91c1ZlcnNpb259YCk7XG4gIC8vIG5vaW5zcGVjdGlvbiBKU0lnbm9yZWRQcm9taXNlRnJvbUNhbGxcbiAgbWVyZ2VTdGF0ZXMoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU3RvcmFnZU9uQ2hhbmdlZChjaGFuZ2VzLCBhcmVhTmFtZSkge1xuICBpZiAoYXJlYU5hbWUgIT09ICdzeW5jJykgcmV0dXJuO1xuICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gIG1lcmdlU3RhdGVzKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1lcmdlKCkge1xuICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gIG1lcmdlU3RhdGVzKCk7XG59XG5cbmNsYXNzIFRhYiB7XG5cbiAgc3RhdGljIGdldCBwcm9wZXJ0aWVzKCkge1xuICAgIHJldHVybiBUQUJfU1lOQ19QUk9QRVJUSUVTO1xuICB9XG5cbiAgY29uc3RydWN0b3IoaW5kZXgsIHVybCwgYWN0aXZlLCBwaW5uZWQpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5hY3RpdmUgPSBhY3RpdmU7XG4gICAgdGhpcy5waW5uZWQgPSBwaW5uZWQ7XG4gIH1cblxuICBzdGF0aWMgZnJvbU9iamVjdChvYmplY3QpIHtcbiAgICBjb25zb2xlLmxvZyhgY29udmVydGluZyBvYmplY3QgdG8gVGFiOiBvYmplY3QgPSAke0pTT04uc3RyaW5naWZ5KG9iamVjdCl9YCk7XG4gICAgaWYgKCEob2JqZWN0ICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ2luZGV4JykgJiZcbiAgICAgIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgndXJsJykgJiZcbiAgICAgIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgnYWN0aXZlJykgJiZcbiAgICAgIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgncGlubmVkJykpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gbmV3IFRhYihvYmplY3QuaW5kZXgsIG9iamVjdC51cmwsIG9iamVjdC5hY3RpdmUsIG9iamVjdC5waW5uZWQpO1xuICB9XG59XG5cbmNsYXNzIFN0YXRlIHtcblxuICBzdGF0aWMgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgcmV0dXJuIFNUQVRFX1BST1BFUlRJRVM7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih0aW1lc3RhbXAgPSAwLCB0YWJzID0gW10pIHtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICB0aGlzLnRhYnMgPSB0YWJzO1xuICB9XG5cbiAgc3RhdGljIGZyb21PYmplY3Qob2JqZWN0KSB7XG4gICAgY29uc29sZS5sb2coYGNvbnZlcnRpbmcgb2JqZWN0IHRvIFN0YXRlOiBvYmplY3QgPSAke0pTT04uc3RyaW5naWZ5KG9iamVjdCl9YCk7XG4gICAgaWYgKCEob2JqZWN0XG4gICAgICAmJiBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3RpbWVzdGFtcCcpXG4gICAgICAmJiBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3RhYnMnKSkpIHJldHVybiBuZXcgU3RhdGUoKTtcbiAgICByZXR1cm4gbmV3IFN0YXRlKG9iamVjdC50aW1lc3RhbXAsIG9iamVjdC50YWJzLm1hcChUYWIuZnJvbU9iamVjdCkpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1lcmdlU3RhdGVzKCkge1xuICBsZXQgbG9jYWxTdGF0ZSA9IGF3YWl0IGdldE9yQ3JlYXRlTG9jYWxTdGF0ZSgpO1xuICBsZXQgcmVtb3RlU3RhdGUgPSBhd2FpdCBnZXRSZW1vdGVTdGF0ZSgpO1xuXG4gIGlmICghKHJlbW90ZVN0YXRlIGluc3RhbmNlb2YgU3RhdGUpIHx8IHJlbW90ZVN0YXRlLnRpbWVzdGFtcCA8IGxvY2FsU3RhdGUudGltZXN0YW1wKSB7XG4gICAgY29uc29sZS5sb2coYG92ZXJ3cml0aW5nIHJlbW90ZSBzdGF0ZSB0byBtZXJnZTogbG9jYWxTdGF0ZSA9ICR7SlNPTi5zdHJpbmdpZnkobG9jYWxTdGF0ZSl9LCByZW1vdGVTdGF0ZSA9ICR7SlNPTi5zdHJpbmdpZnkocmVtb3RlU3RhdGUpfWApO1xuICAgIGF3YWl0IHNldFJlbW90ZVN0YXRlRnJvbUxvY2FsKGxvY2FsU3RhdGUpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKGBvdmVyd3JpdGluZyBsb2NhbCBzdGF0ZSB0byBtZXJnZTogbG9jYWxTdGF0ZSA9ICR7SlNPTi5zdHJpbmdpZnkobG9jYWxTdGF0ZSl9LCByZW1vdGVTdGF0ZSA9ICR7SlNPTi5zdHJpbmdpZnkocmVtb3RlU3RhdGUpfWApO1xuICAgIGF3YWl0IHNldExvY2FsU3RhdGVGcm9tUmVtb3RlKHJlbW90ZVN0YXRlKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVMb2NhbFN0YXRlKCkge1xuICBsZXQgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt9KTtcbiAgbGV0IGxvY2FsU3RhdGUgPSBuZXcgU3RhdGUoXG4gICAgRGF0ZS5ub3coKSxcbiAgICB0YWJzLm1hcChUYWIuZnJvbU9iamVjdCksXG4gICk7XG5cbiAgY29uc29sZS5sb2coYGNyZWF0ZWQgbG9jYWwgc3RhdGU6IGxvY2FsU3RhdGUgPSAke0pTT04uc3RyaW5naWZ5KGxvY2FsU3RhdGUpfWApO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQobG9jYWxTdGF0ZSk7XG4gIHJldHVybiBsb2NhbFN0YXRlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRPckNyZWF0ZUxvY2FsU3RhdGUoKSB7XG4gIGxldCBsb2NhbFN0YXRlID0gU3RhdGUuZnJvbU9iamVjdChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU3RhdGUucHJvcGVydGllcykpO1xuICBpZiAobG9jYWxTdGF0ZSBpbnN0YW5jZW9mIFN0YXRlKSByZXR1cm4gbG9jYWxTdGF0ZTtcblxuICByZXR1cm4gYXdhaXQgY3JlYXRlTG9jYWxTdGF0ZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRSZW1vdGVTdGF0ZSgpIHtcbiAgcmV0dXJuIFN0YXRlLmZyb21PYmplY3QoYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU3RhdGUucHJvcGVydGllcykpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRMb2NhbFN0YXRlRnJvbVJlbW90ZShyZW1vdGVTdGF0ZSkge1xuICBsZXQgbG9jYWxTdGF0ZSA9IGF3YWl0IGdldE9yQ3JlYXRlTG9jYWxTdGF0ZSgpO1xuXG4gIGNvbnNvbGUubG9nKGBzZXR0aW5nIGxvY2FsIHN0YXRlIGZyb20gcmVtb3RlOiByZW1vdGVTdGF0ZSA9ICR7SlNPTi5zdHJpbmdpZnkocmVtb3RlU3RhdGUpfWApO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQocmVtb3RlU3RhdGUpO1xuXG4gIGxldCByZW1vdGVVcmxzID0gbmV3IFNldChyZW1vdGVTdGF0ZS50YWJzLm1hcCgodGFiKSA9PiB0YWIudXJsKSk7XG4gIGxldCBsb2NhbFVybHMgPSBuZXcgU2V0KGxvY2FsU3RhdGUudGFicy5tYXAoKHRhYikgPT4gdGFiLnVybCkpO1xuXG4gIC8vIHJlbW92ZSB0YWJzIG5vdCBwcmVzZW50IGluIHJlbW90ZVxuICBmb3IgKGxldCB0YWIgb2YgbG9jYWxTdGF0ZS50YWJzKSB7XG4gICAgaWYgKCFyZW1vdGVVcmxzLmhhcyh0YWIudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coYHJlbW92aW5nIGxvY2FsIHRhYjogdGFiVXJsID0gJHt0YWIudXJsfWApO1xuICAgICAgYXdhaXQgY2hyb21lLnRhYnMucmVtb3ZlKHRhYi5pZCk7XG4gICAgfVxuICB9XG5cbiAgLy8gYWRkIHRhYnMgbm90IHByZXNlbnQgaW4gbG9jYWxcbiAgZm9yIChsZXQgdGFiIG9mIHJlbW90ZVN0YXRlLnRhYnMpIHtcbiAgICBpZiAoIWxvY2FsVXJscy5oYXModGFiLnVybCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBjcmVhdGluZyBsb2NhbCB0YWI6IHRhYlVybCA9ICR7dGFiLnVybH1gKTtcbiAgICAgIGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7XG4gICAgICAgIGluZGV4OiB0YWIuaW5kZXgsXG4gICAgICAgIHVybDogdGFiLnVybCxcbiAgICAgICAgYWN0aXZlOiB0YWIuYWN0aXZlLFxuICAgICAgICBwaW5uZWQ6IHRhYi5waW5uZWQsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0UmVtb3RlU3RhdGVGcm9tTG9jYWwobG9jYWxTdGF0ZSkge1xuICBjb25zb2xlLmxvZyhgc2V0dGluZyByZW1vdGUgc3RhdGUgZnJvbSBsb2NhbDogbG9jYWxTdGF0ZSA9ICR7SlNPTi5zdHJpbmdpZnkobG9jYWxTdGF0ZSl9YCk7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KGxvY2FsU3RhdGUpO1xufVxuIiwiLyoqIFdyYXAgYW4gQVBJIHRoYXQgdXNlcyBjYWxsYmFja3Mgd2l0aCBQcm9taXNlc1xyXG4gKiBUaGlzIGV4cGVjdHMgdGhlIHBhdHRlcm4gZnVuY3Rpb24gd2l0aENhbGxiYWNrKGFyZzEsIGFyZzIsIC4uLiBhcmdOLCBjYWxsYmFjaylcclxuICogQGF1dGhvciBLZWl0aCBIZW5yeSA8a2VpdGguaGVucnlAZXZvbHV0aW9uam9icy5jby51az5cclxuICogQGxpY2Vuc2UgTUlUICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLyoqIFdyYXAgYSBmdW5jdGlvbiB3aXRoIGEgY2FsbGJhY2sgd2l0aCBhIFByb21pc2UuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmIFRoZSBmdW5jdGlvbiB0byB3cmFwLCBzaG91bGQgYmUgcGF0dGVybjogd2l0aENhbGxiYWNrKGFyZzEsIGFyZzIsIC4uLiBhcmdOLCBjYWxsYmFjaykuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXJzZUNCIE9wdGlvbmFsIGZ1bmN0aW9uIHRvIHBhcnNlIG11bHRpcGxlIGNhbGxiYWNrIHBhcmFtZXRlcnMgaW50byBhIHNpbmdsZSBvYmplY3QuXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGNhbGxiYWNrIGZpcmVzLiAqL1xyXG4gICAgZnVuY3Rpb24gcHJvbWlzaWZ5KGYsIHBhcnNlQ0IpIHtcclxuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNhZmVBcmdzID0gYXJncztcclxuICAgICAgICAgICAgbGV0IGNhbGxiYWNrO1xyXG4gICAgICAgICAgICAvLyBUaGUgQ2hyb21lIEFQSSBmdW5jdGlvbnMgYWxsIHVzZSBhcmd1bWVudHMsIHNvIHdlIGNhbid0IHVzZSBmLmxlbmd0aCB0byBjaGVja1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBsYXN0IGFyZ1xyXG4gICAgICAgICAgICBpZiAoYXJncyAmJiBhcmdzLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAuLi4gYW5kIHRoZSBsYXN0IGFyZyBpcyBhIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0ID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsYXN0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJpbSB0aGUgbGFzdCBjYWxsYmFjayBhcmcgaWYgaXQncyBiZWVuIHBhc3NlZFxyXG4gICAgICAgICAgICAgICAgICAgIHNhZmVBcmdzID0gYXJncy5zbGljZSgwLCBhcmdzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gbGFzdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUcnkgdG8gcnVuIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiwgd2l0aCB0aGUgdHJpbW1lZCBhcmdzIGxpc3RcclxuICAgICAgICAgICAgICAgICAgICBmKC4uLnNhZmVBcmdzLCAoLi4uY2JBcmdzKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhIGNhbGxiYWNrIHdhcyBwYXNzZWQgYXQgdGhlIGVuZCBvZiB0aGUgb3JpZ2luYWwgYXJndW1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgYWxsb3cgYSBidWcgaW4gdGhlIGNhbGxiYWNrIHRvIHN0b3AgdGhlIHByb21pc2UgcmVzb2x2aW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkgeyBjYWxsYmFjayguLi5jYkFyZ3MpOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoY2JFcnIpIHsgcmVqZWN0KGNiRXJyKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgZXh0ZW5zaW9ucyBhbHdheXMgZmlyZSB0aGUgY2FsbGJhY2ssIGJ1dCBwb3B1bGF0ZSBjaHJvbWUucnVudGltZS5sYXN0RXJyb3Igd2l0aCBleGNlcHRpb24gZGV0YWlsc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIGFzIGFuIGVycm9yIGZvciB0aGUgYXdhaXRlZCBjYXRjaCBibG9ja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSB8fCBgRXJyb3IgdGhyb3duIGJ5IEFQSSAke2Nocm9tZS5ydW50aW1lLmxhc3RFcnJvcn1gKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlQ0IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYk9iaiA9IHBhcnNlQ0IoLi4uY2JBcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNiT2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFjYkFyZ3MgfHwgY2JBcmdzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjYkFyZ3MubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2JBcmdzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNiQXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHsgcmVqZWN0KGVycik7IH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBQcm9taXNpZnkgYWxsIHRoZSBrbm93biBmdW5jdGlvbnMgaW4gdGhlIG1hcCBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhcGkgVGhlIENocm9tZSBuYXRpdmUgQVBJIHRvIGV4dGVuZFxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXBpTWFwIENvbGxlY3Rpb24gb2Ygc3ViLUFQSSBhbmQgZnVuY3Rpb25zIHRvIHByb21pc2lmeSAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlNYXAoYXBpLCBhcGlNYXApIHtcclxuICAgICAgICBpZiAoIWFwaSlcclxuICAgICAgICAgICAgLy8gTm90IHN1cHBvcnRlZCBieSBjdXJyZW50IHBlcm1pc3Npb25zXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZnVuY0RlZiBvZiBhcGlNYXApIHtcclxuICAgICAgICAgICAgbGV0IGZ1bmNOYW1lO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmNEZWYgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgZnVuY05hbWUgPSBmdW5jRGVmO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lID0gZnVuY0RlZi5uO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWFwaS5oYXNPd25Qcm9wZXJ0eShmdW5jTmFtZSkpXHJcbiAgICAgICAgICAgICAgICAvLyBNZW1iZXIgbm90IGluIEFQSVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtID0gYXBpW2Z1bmNOYW1lXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGZ1bmN0aW9uLCB3cmFwIGluIGEgcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgYXBpW2Z1bmNOYW1lXSA9IHByb21pc2lmeShtLmJpbmQoYXBpKSwgZnVuY0RlZi5jYik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIC8vIFN1Yi1BUEksIHJlY3Vyc2UgdGhpcyBmdW5jIHdpdGggdGhlIG1hcHBlZCBwcm9wc1xyXG4gICAgICAgICAgICAgICAgYXBwbHlNYXAobSwgZnVuY0RlZi5wcm9wcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBcHBseSBwcm9taXNlLW1hcHMgdG8gdGhlIENocm9tZSBuYXRpdmUgQVBJLlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFwaU1hcHMgVGhlIEFQSSB0byBhcHBseS4gKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5TWFwcyhhcGlNYXBzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgYXBpTmFtZSBpbiBhcGlNYXBzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrQXBpID0gY2hyb21lW2FwaU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrQXBpKVxyXG4gICAgICAgICAgICAgICAgLy8gTm90IHN1cHBvcnRlZCBieSBjdXJyZW50IHBlcm1pc3Npb25zXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFwaU1hcCA9IGFwaU1hcHNbYXBpTmFtZV07XHJcbiAgICAgICAgICAgIGFwcGx5TWFwKGNhbGxiYWNrQXBpLCBhcGlNYXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBhY2Nlc3NpYmlsaXR5RmVhdHVyZXMgaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL2FjY2Vzc2liaWxpdHlGZWF0dXJlc1xyXG4gICAgY29uc3Qga25vd25BMTF5U2V0dGluZyA9IFsnZ2V0JywgJ3NldCcsICdjbGVhciddO1xyXG5cclxuICAgIC8vIENvbnRlbnRTZXR0aW5nIGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9jb250ZW50U2V0dGluZ3MjdHlwZS1Db250ZW50U2V0dGluZ1xyXG4gICAgY29uc3Qga25vd25JbkNvbnRlbnRTZXR0aW5nID0gWydjbGVhcicsICdnZXQnLCAnc2V0JywgJ2dldFJlc291cmNlSWRlbnRpZmllcnMnXTtcclxuXHJcbiAgICAvLyBTdG9yYWdlQXJlYSBodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvc3RvcmFnZSN0eXBlLVN0b3JhZ2VBcmVhXHJcbiAgICBjb25zdCBrbm93bkluU3RvcmFnZUFyZWEgPSBbJ2dldCcsICdnZXRCeXRlc0luVXNlJywgJ3NldCcsICdyZW1vdmUnLCAnY2xlYXInXTtcclxuXHJcbiAgICAvKiogTWFwIG9mIEFQSSBmdW5jdGlvbnMgdGhhdCBmb2xsb3cgdGhlIGNhbGxiYWNrIHBhdHRlcm4gdGhhdCB3ZSBjYW4gJ3Byb21pc2lmeScgKi9cclxuICAgIGFwcGx5TWFwcyh7XHJcbiAgICAgICAgYWNjZXNzaWJpbGl0eUZlYXR1cmVzOiBbICAvLyBUb2RvOiB0aGlzIHNob3VsZCBleHRlbmQgQWNjZXNzaWJpbGl0eUZlYXR1cmVzU2V0dGluZy5wcm90b3R5cGUgaW5zdGVhZFxyXG4gICAgICAgICAgICB7IG46ICdzcG9rZW5GZWVkYmFjaycsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2xhcmdlQ3Vyc29yJywgcHJvcHM6IGtub3duQTExeVNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnc3RpY2t5S2V5cycsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2hpZ2hDb250cmFzdCcsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3NjcmVlbk1hZ25pZmllcicsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2F1dG9jbGljaycsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3ZpcnR1YWxLZXlib2FyZCcsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2FuaW1hdGlvblBvbGljeScsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH1dLFxyXG4gICAgICAgIGFsYXJtczogWydnZXQnLCAnZ2V0QWxsJywgJ2NsZWFyJywgJ2NsZWFyQWxsJ10sXHJcbiAgICAgICAgYm9va21hcmtzOiBbXHJcbiAgICAgICAgICAgICdnZXQnLCAnZ2V0Q2hpbGRyZW4nLCAnZ2V0UmVjZW50JywgJ2dldFRyZWUnLCAnZ2V0U3ViVHJlZScsXHJcbiAgICAgICAgICAgICdzZWFyY2gnLCAnY3JlYXRlJywgJ21vdmUnLCAndXBkYXRlJywgJ3JlbW92ZScsICdyZW1vdmVUcmVlJ10sXHJcbiAgICAgICAgYnJvd3NlcjogWydvcGVuVGFiJ10sXHJcbiAgICAgICAgYnJvd3NlckFjdGlvbjogW1xyXG4gICAgICAgICAgICAnZ2V0VGl0bGUnLCAnc2V0SWNvbicsICdnZXRQb3B1cCcsICdnZXRCYWRnZVRleHQnLCAnZ2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3InXSxcclxuICAgICAgICBicm93c2luZ0RhdGE6IFtcclxuICAgICAgICAgICAgJ3NldHRpbmdzJywgJ3JlbW92ZScsICdyZW1vdmVBcHBjYWNoZScsICdyZW1vdmVDYWNoZScsXHJcbiAgICAgICAgICAgICdyZW1vdmVDb29raWVzJywgJ3JlbW92ZURvd25sb2FkcycsICdyZW1vdmVGaWxlU3lzdGVtcycsXHJcbiAgICAgICAgICAgICdyZW1vdmVGb3JtRGF0YScsICdyZW1vdmVIaXN0b3J5JywgJ3JlbW92ZUluZGV4ZWREQicsXHJcbiAgICAgICAgICAgICdyZW1vdmVMb2NhbFN0b3JhZ2UnLCAncmVtb3ZlUGx1Z2luRGF0YScsICdyZW1vdmVQYXNzd29yZHMnLFxyXG4gICAgICAgICAgICAncmVtb3ZlV2ViU1FMJ10sXHJcbiAgICAgICAgY29tbWFuZHM6IFsnZ2V0QWxsJ10sXHJcbiAgICAgICAgY29udGVudFNldHRpbmdzOiBbICAvLyBUb2RvOiB0aGlzIHNob3VsZCBleHRlbmQgQ29udGVudFNldHRpbmcucHJvdG90eXBlIGluc3RlYWRcclxuICAgICAgICAgICAgeyBuOiAnY29va2llcycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnaW1hZ2VzJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdqYXZhc2NyaXB0JywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdsb2NhdGlvbicsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAncGx1Z2lucycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAncG9wdXBzJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdub3RpZmljYXRpb25zJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdmdWxsc2NyZWVuJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdtb3VzZWxvY2snLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ21pY3JvcGhvbmUnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2NhbWVyYScsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAndW5zYW5kYm94ZWRQbHVnaW5zJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdhdXRvbWF0aWNEb3dubG9hZHMnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH1dLFxyXG4gICAgICAgIGNvbnRleHRNZW51czogWydjcmVhdGUnLCAndXBkYXRlJywgJ3JlbW92ZScsICdyZW1vdmVBbGwnXSxcclxuICAgICAgICBjb29raWVzOiBbJ2dldCcsICdnZXRBbGwnLCAnc2V0JywgJ3JlbW92ZScsICdnZXRBbGxDb29raWVTdG9yZXMnXSxcclxuICAgICAgICBkZWJ1Z2dlcjogWydhdHRhY2gnLCAnZGV0YWNoJywgJ3NlbmRDb21tYW5kJywgJ2dldFRhcmdldHMnXSxcclxuICAgICAgICBkZXNrdG9wQ2FwdHVyZTogWydjaG9vc2VEZXNrdG9wTWVkaWEnXSxcclxuICAgICAgICAvLyBUT0RPOiBkZXZ0b29scy4qXHJcbiAgICAgICAgZG9jdW1lbnRTY2FuOiBbJ3NjYW4nXSxcclxuICAgICAgICBkb3dubG9hZHM6IFtcclxuICAgICAgICAgICAgJ2Rvd25sb2FkJywgJ3NlYXJjaCcsICdwYXVzZScsICdyZXN1bWUnLCAnY2FuY2VsJyxcclxuICAgICAgICAgICAgJ2dldEZpbGVJY29uJywgJ2VyYXNlJywgJ3JlbW92ZUZpbGUnLCAnYWNjZXB0RGFuZ2VyJ10sXHJcbiAgICAgICAgZW50ZXJwcmlzZTogW3sgbjogJ3BsYXRmb3JtS2V5cycsIHByb3BzOiBbJ2dldFRva2VuJywgJ2dldENlcnRpZmljYXRlcycsICdpbXBvcnRDZXJ0aWZpY2F0ZScsICdyZW1vdmVDZXJ0aWZpY2F0ZSddIH1dLFxyXG4gICAgICAgIGV4dGVuc2lvbjogWydpc0FsbG93ZWRJbmNvZ25pdG9BY2Nlc3MnLCAnaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2VzcyddLCAvLyBtb3N0bHkgZGVwcmVjYXRlZCBpbiBmYXZvdXIgb2YgcnVudGltZVxyXG4gICAgICAgIGZpbGVCcm93c2VySGFuZGxlcjogWydzZWxlY3RGaWxlJ10sXHJcbiAgICAgICAgZmlsZVN5c3RlbVByb3ZpZGVyOiBbJ21vdW50JywgJ3VubW91bnQnLCAnZ2V0QWxsJywgJ2dldCcsICdub3RpZnknXSxcclxuICAgICAgICBmb250U2V0dGluZ3M6IFtcclxuICAgICAgICAgICAgJ3NldERlZmF1bHRGb250U2l6ZScsICdnZXRGb250JywgJ2dldERlZmF1bHRGb250U2l6ZScsICdnZXRNaW5pbXVtRm9udFNpemUnLFxyXG4gICAgICAgICAgICAnc2V0TWluaW11bUZvbnRTaXplJywgJ2dldERlZmF1bHRGaXhlZEZvbnRTaXplJywgJ2NsZWFyRGVmYXVsdEZvbnRTaXplJyxcclxuICAgICAgICAgICAgJ3NldERlZmF1bHRGaXhlZEZvbnRTaXplJywgJ2NsZWFyRm9udCcsICdzZXRGb250JywgJ2NsZWFyTWluaW11bUZvbnRTaXplJyxcclxuICAgICAgICAgICAgJ2dldEZvbnRMaXN0JywgJ2NsZWFyRGVmYXVsdEZpeGVkRm9udFNpemUnXSxcclxuICAgICAgICBnY206IFsncmVnaXN0ZXInLCAndW5yZWdpc3RlcicsICdzZW5kJ10sXHJcbiAgICAgICAgaGlzdG9yeTogWydzZWFyY2gnLCAnZ2V0VmlzaXRzJywgJ2FkZFVybCcsICdkZWxldGVVcmwnLCAnZGVsZXRlUmFuZ2UnLCAnZGVsZXRlQWxsJ10sXHJcbiAgICAgICAgaTE4bjogWydnZXRBY2NlcHRMYW5ndWFnZXMnLCAnZGV0ZWN0TGFuZ3VhZ2UnXSxcclxuICAgICAgICBpZGVudGl0eTogW1xyXG4gICAgICAgICAgICAnZ2V0QXV0aFRva2VuJywgJ2dldFByb2ZpbGVVc2VySW5mbycsICdyZW1vdmVDYWNoZWRBdXRoVG9rZW4nLCAnbGF1bmNoV2ViQXV0aEZsb3cnXSxcclxuICAgICAgICBpZGxlOiBbJ3F1ZXJ5U3RhdGUnXSxcclxuICAgICAgICBpbnB1dDogW3tcclxuICAgICAgICAgICAgbjogJ2ltZScsIHByb3BzOiBbXHJcbiAgICAgICAgICAgICAgICAnc2V0TWVudUl0ZW1zJywgJ2NvbW1pdFRleHQnLCAnc2V0Q2FuZGlkYXRlcycsICdzZXRDb21wb3NpdGlvbicsICd1cGRhdGVNZW51SXRlbXMnLFxyXG4gICAgICAgICAgICAgICAgJ3NldENhbmRpZGF0ZVdpbmRvd1Byb3BlcnRpZXMnLCAnY2xlYXJDb21wb3NpdGlvbicsICdzZXRDdXJzb3JQb3NpdGlvbicsICdzZW5kS2V5RXZlbnRzJyxcclxuICAgICAgICAgICAgICAgICdkZWxldGVTdXJyb3VuZGluZ1RleHQnXVxyXG4gICAgICAgIH1dLFxyXG4gICAgICAgIG1hbmFnZW1lbnQ6IFtcclxuICAgICAgICAgICAgJ3NldEVuYWJsZWQnLCAnZ2V0UGVybWlzc2lvbldhcm5pbmdzQnlJZCcsICdnZXQnLCAnZ2V0QWxsJyxcclxuICAgICAgICAgICAgJ2dldFBlcm1pc3Npb25XYXJuaW5nc0J5TWFuaWZlc3QnLCAnbGF1bmNoQXBwJywgJ3VuaW5zdGFsbCcsICdnZXRTZWxmJyxcclxuICAgICAgICAgICAgJ3VuaW5zdGFsbFNlbGYnLCAnY3JlYXRlQXBwU2hvcnRjdXQnLCAnc2V0TGF1bmNoVHlwZScsICdnZW5lcmF0ZUFwcEZvckxpbmsnXSxcclxuICAgICAgICBuZXR3b3JraW5nOiBbeyBuOiAnY29uZmlnJywgcHJvcHM6IFsnc2V0TmV0d29ya0ZpbHRlcicsICdmaW5pc2hBdXRoZW50aWNhdGlvbiddIH1dLFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbnM6IFsnY3JlYXRlJywgJ3VwZGF0ZScsICdjbGVhcicsICdnZXRBbGwnLCAnZ2V0UGVybWlzc2lvbkxldmVsJ10sXHJcbiAgICAgICAgcGFnZUFjdGlvbjogWydnZXRUaXRsZScsICdzZXRJY29uJywgJ2dldFBvcHVwJ10sXHJcbiAgICAgICAgcGFnZUNhcHR1cmU6IFsnc2F2ZUFzTUhUTUwnXSxcclxuICAgICAgICBwZXJtaXNzaW9uczogWydnZXRBbGwnLCAnY29udGFpbnMnLCAncmVxdWVzdCcsICdyZW1vdmUnXSxcclxuICAgICAgICBwbGF0Zm9ybUtleXM6IFsnc2VsZWN0Q2xpZW50Q2VydGlmaWNhdGVzJywgJ3ZlcmlmeVRMU1NlcnZlckNlcnRpZmljYXRlJyxcclxuICAgICAgICAgICAgeyBuOiBcImdldEtleVBhaXJcIiwgY2I6IChwdWJsaWNLZXksIHByaXZhdGVLZXkpID0+IHsgcmV0dXJuIHsgcHVibGljS2V5LCBwcml2YXRlS2V5IH07IH0gfV0sXHJcbiAgICAgICAgcnVudGltZTogW1xyXG4gICAgICAgICAgICAnZ2V0QmFja2dyb3VuZFBhZ2UnLCAnb3Blbk9wdGlvbnNQYWdlJywgJ3NldFVuaW5zdGFsbFVSTCcsXHJcbiAgICAgICAgICAgICdyZXN0YXJ0QWZ0ZXJEZWxheScsICdzZW5kTWVzc2FnZScsXHJcbiAgICAgICAgICAgICdzZW5kTmF0aXZlTWVzc2FnZScsICdnZXRQbGF0Zm9ybUluZm8nLCAnZ2V0UGFja2FnZURpcmVjdG9yeUVudHJ5JyxcclxuICAgICAgICAgICAgeyBuOiBcInJlcXVlc3RVcGRhdGVDaGVja1wiLCBjYjogKHN0YXR1cywgZGV0YWlscykgPT4geyByZXR1cm4geyBzdGF0dXMsIGRldGFpbHMgfTsgfSB9XSxcclxuICAgICAgICBzY3JpcHRCYWRnZTogWydnZXRQb3B1cCddLFxyXG4gICAgICAgIHNlc3Npb25zOiBbJ2dldFJlY2VudGx5Q2xvc2VkJywgJ2dldERldmljZXMnLCAncmVzdG9yZSddLFxyXG4gICAgICAgIHN0b3JhZ2U6IFsgICAgICAgICAgLy8gVG9kbzogdGhpcyBzaG91bGQgZXh0ZW5kIFN0b3JhZ2VBcmVhLnByb3RvdHlwZSBpbnN0ZWFkXHJcbiAgICAgICAgICAgIHsgbjogJ3N5bmMnLCBwcm9wczoga25vd25JblN0b3JhZ2VBcmVhIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2xvY2FsJywgcHJvcHM6IGtub3duSW5TdG9yYWdlQXJlYSB9LFxyXG4gICAgICAgICAgICB7IG46ICdtYW5hZ2VkJywgcHJvcHM6IGtub3duSW5TdG9yYWdlQXJlYSB9XSxcclxuICAgICAgICBzb2NrZXQ6IFtcclxuICAgICAgICAgICAgJ2NyZWF0ZScsICdjb25uZWN0JywgJ2JpbmQnLCAncmVhZCcsICd3cml0ZScsICdyZWN2RnJvbScsICdzZW5kVG8nLFxyXG4gICAgICAgICAgICAnbGlzdGVuJywgJ2FjY2VwdCcsICdzZXRLZWVwQWxpdmUnLCAnc2V0Tm9EZWxheScsICdnZXRJbmZvJywgJ2dldE5ldHdvcmtMaXN0J10sXHJcbiAgICAgICAgc29ja2V0czogW1xyXG4gICAgICAgICAgICB7IG46ICd0Y3AnLCBwcm9wczogW1xyXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZScsJ3VwZGF0ZScsJ3NldFBhdXNlZCcsJ3NldEtlZXBBbGl2ZScsJ3NldE5vRGVsYXknLCdjb25uZWN0JyxcclxuICAgICAgICAgICAgICAgICdkaXNjb25uZWN0Jywnc2VjdXJlJywnc2VuZCcsJ2Nsb3NlJywnZ2V0SW5mbycsJ2dldFNvY2tldHMnXSB9LFxyXG4gICAgICAgICAgICB7IG46ICd0Y3BTZXJ2ZXInLCBwcm9wczogW1xyXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZScsJ3VwZGF0ZScsJ3NldFBhdXNlZCcsJ2xpc3RlbicsJ2Rpc2Nvbm5lY3QnLCdjbG9zZScsJ2dldEluZm8nLCdnZXRTb2NrZXRzJ10gfSwgXHJcbiAgICAgICAgICAgIHsgbjogJ3VkcCcsIHByb3BzOiBbXHJcbiAgICAgICAgICAgICAgICAnY3JlYXRlJywndXBkYXRlJywnc2V0UGF1c2VkJywnYmluZCcsJ3NlbmQnLCdjbG9zZScsJ2dldEluZm8nLFxyXG4gICAgICAgICAgICAgICAgJ2dldFNvY2tldHMnLCdqb2luR3JvdXAnLCdsZWF2ZUdyb3VwJywnc2V0TXVsdGljYXN0VGltZVRvTGl2ZScsXHJcbiAgICAgICAgICAgICAgICAnc2V0TXVsdGljYXN0TG9vcGJhY2tNb2RlJywnZ2V0Sm9pbmVkR3JvdXBzJywnc2V0QnJvYWRjYXN0J10gfV0sXHJcbiAgICAgICAgc3lzdGVtOiBbXHJcbiAgICAgICAgICAgIHsgbjogJ2NwdScsIHByb3BzOiBbJ2dldEluZm8nXSB9LFxyXG4gICAgICAgICAgICB7IG46ICdtZW1vcnknLCBwcm9wczogWydnZXRJbmZvJ10gfSxcclxuICAgICAgICAgICAgeyBuOiAnc3RvcmFnZScsIHByb3BzOiBbJ2dldEluZm8nLCAnZWplY3REZXZpY2UnLCAnZ2V0QXZhaWxhYmxlQ2FwYWNpdHknXSB9XSxcclxuICAgICAgICB0YWJDYXB0dXJlOiBbJ2NhcHR1cmUnLCAnZ2V0Q2FwdHVyZWRUYWJzJ10sXHJcbiAgICAgICAgdGFiczogW1xyXG4gICAgICAgICAgICAnZ2V0JywgJ2dldEN1cnJlbnQnLCAnc2VuZE1lc3NhZ2UnLCAnY3JlYXRlJywgJ2R1cGxpY2F0ZScsXHJcbiAgICAgICAgICAgICdxdWVyeScsICdoaWdobGlnaHQnLCAndXBkYXRlJywgJ21vdmUnLCAncmVsb2FkJywgJ3JlbW92ZScsXHJcbiAgICAgICAgICAgICdkZXRlY3RMYW5ndWFnZScsICdjYXB0dXJlVmlzaWJsZVRhYicsICdleGVjdXRlU2NyaXB0JyxcclxuICAgICAgICAgICAgJ2luc2VydENTUycsICdzZXRab29tJywgJ2dldFpvb20nLCAnc2V0Wm9vbVNldHRpbmdzJyxcclxuICAgICAgICAgICAgJ2dldFpvb21TZXR0aW5ncycsICdkaXNjYXJkJ10sXHJcbiAgICAgICAgdG9wU2l0ZXM6IFsnZ2V0J10sXHJcbiAgICAgICAgdHRzOiBbJ2lzU3BlYWtpbmcnLCAnZ2V0Vm9pY2VzJywgJ3NwZWFrJ10sXHJcbiAgICAgICAgdHlwZXM6IFsnc2V0JywgJ2dldCcsICdjbGVhciddLFxyXG4gICAgICAgIHZwblByb3ZpZGVyOiBbJ2NyZWF0ZUNvbmZpZycsICdkZXN0cm95Q29uZmlnJywgJ3NldFBhcmFtZXRlcnMnLCAnc2VuZFBhY2tldCcsICdub3RpZnlDb25uZWN0aW9uU3RhdGVDaGFuZ2VkJ10sXHJcbiAgICAgICAgd2FsbHBhcGVyOiBbJ3NldFdhbGxwYXBlciddLFxyXG4gICAgICAgIHdlYk5hdmlnYXRpb246IFsnZ2V0RnJhbWUnLCAnZ2V0QWxsRnJhbWVzJywgJ2hhbmRsZXJCZWhhdmlvckNoYW5nZWQnXSxcclxuICAgICAgICB3aW5kb3dzOiBbJ2dldCcsICdnZXRDdXJyZW50JywgJ2dldExhc3RGb2N1c2VkJywgJ2dldEFsbCcsICdjcmVhdGUnLCAndXBkYXRlJywgJ3JlbW92ZSddXHJcbiAgICB9KTtcclxufSkoKTtcclxuIl19
