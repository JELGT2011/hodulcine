(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

require("chrome-extension-async");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var STATE_PROPERTIES = new Set(['tabs', 'timestamp']);
var TAB_SYNC_PROPERTIES = new Set(['index', 'url', 'active', 'pinned']);
chrome.runtime.onInstalled.addListener(handleRuntimeOnInstalled);
chrome.runtime.onStartup.addListener(handleMerge);
chrome.storage.onChanged.addListener(handleStorageOnChanged);
chrome.tabs.onCreated.addListener(handleMerge); // TODO: look up docs for these functions
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
  console.log("Installed new version. previousVersion = ".concat(details.previousVersion));
} // TODO: handle shouldn't execute if this client just updated the remote


function handleStorageOnChanged(changes, areaName) {
  if (areaName !== 'sync') return; // noinspection JSIgnoredPromiseFromCall

  setLocalStateFromRemote();
}

function handleMerge() {
  // noinspection JSIgnoredPromiseFromCall
  mergeStates();
}

function setLocalStateFromRemote() {
  return _setLocalStateFromRemote.apply(this, arguments);
}

function _setLocalStateFromRemote() {
  _setLocalStateFromRemote = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var remoteState;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getRemoteState();

          case 2:
            remoteState = _context.sent;
            _context.next = 5;
            return setLocalState(remoteState);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _setLocalStateFromRemote.apply(this, arguments);
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

  _createClass(Tab, [{
    key: "toObject",
    value: function toObject() {
      return {
        index: this.index,
        url: this.url,
        active: this.active,
        pinned: this.pinned
      };
    }
  }], [{
    key: "fromObject",
    value: function fromObject(object) {
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

  _createClass(State, [{
    key: "toObject",
    value: function toObject() {
      return {
        timestamp: this.timestamp,
        tabs: this.tabs.map(function (tab) {
          return tab.toObject();
        })
      };
    }
  }, {
    key: "urls",
    get: function get() {
      return new Set(this.tabs.map(function (tab) {
        return tab.url;
      }));
    }
  }], [{
    key: "fromObject",
    value: function fromObject(object) {
      if (!(object && object.hasOwnProperty('timestamp') && object.hasOwnProperty('tabs'))) return null;
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
  regeneratorRuntime.mark(function _callee2() {
    var localState, remoteState;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getOrCreateLocalState();

          case 2:
            localState = _context2.sent;
            _context2.next = 5;
            return getRemoteState();

          case 5:
            remoteState = _context2.sent;

            if (remoteState instanceof State) {
              _context2.next = 11;
              break;
            }

            console.log("remoteState does not exist, overwriting: localState = ".concat(JSON.stringify(localState)));
            _context2.next = 10;
            return setRemoteState(localState);

          case 10:
            return _context2.abrupt("return");

          case 11:
            if (!(remoteState.urls === localState.urls)) {
              _context2.next = 14;
              break;
            }

            console.log("remote and local urls are the same, no-op: remoteUrls = ".concat(remoteState.urls, ", localUrls = ").concat(localState.urls));
            return _context2.abrupt("return");

          case 14:
            if (!(remoteState.timestamp < localState.timestamp)) {
              _context2.next = 20;
              break;
            }

            console.log("overwriting remote state to merge: localState = ".concat(JSON.stringify(localState), ", remoteState = ").concat(JSON.stringify(remoteState)));
            _context2.next = 18;
            return setRemoteState(localState);

          case 18:
            _context2.next = 23;
            break;

          case 20:
            console.log("overwriting local state to merge: localState = ".concat(JSON.stringify(localState), ", remoteState = ").concat(JSON.stringify(remoteState)));
            _context2.next = 23;
            return setLocalState(remoteState);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _mergeStates.apply(this, arguments);
}

function createLocalState() {
  return _createLocalState.apply(this, arguments);
}

function _createLocalState() {
  _createLocalState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var tabs, localState;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return chrome.tabs.query({});

          case 2:
            tabs = _context3.sent;
            localState = new State(Date.now(), tabs.map(Tab.fromObject));
            console.log("created local state: localState = ".concat(JSON.stringify(localState)));
            _context3.next = 7;
            return chrome.storage.local.set(localState.toObject());

          case 7:
            return _context3.abrupt("return", localState);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _createLocalState.apply(this, arguments);
}

function getOrCreateLocalState() {
  return _getOrCreateLocalState.apply(this, arguments);
}

function _getOrCreateLocalState() {
  _getOrCreateLocalState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var localState;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = State;
            _context4.next = 3;
            return chrome.storage.local.get(State.properties);

          case 3:
            _context4.t1 = _context4.sent;
            localState = _context4.t0.fromObject.call(_context4.t0, _context4.t1);
            console.log("fetched local state: localState = ".concat(JSON.stringify(localState)));

            if (!(localState instanceof State)) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", localState);

          case 8:
            _context4.next = 10;
            return createLocalState();

          case 10:
            return _context4.abrupt("return", _context4.sent);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getOrCreateLocalState.apply(this, arguments);
}

function getRemoteState() {
  return _getRemoteState.apply(this, arguments);
}

function _getRemoteState() {
  _getRemoteState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.t0 = State;
            _context5.next = 3;
            return chrome.storage.sync.get(State.properties);

          case 3:
            _context5.t1 = _context5.sent;
            return _context5.abrupt("return", _context5.t0.fromObject.call(_context5.t0, _context5.t1));

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getRemoteState.apply(this, arguments);
}

function setLocalState(_x) {
  return _setLocalState.apply(this, arguments);
}

function _setLocalState() {
  _setLocalState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(remoteState) {
    var localState, remoteUrls, localUrls, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tab, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _tab;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getOrCreateLocalState();

          case 2:
            localState = _context6.sent;
            console.log("setting local state from remote: remoteState = ".concat(JSON.stringify(remoteState)));
            _context6.next = 6;
            return chrome.storage.local.set(remoteState.toObject());

          case 6:
            remoteUrls = new Set(remoteState.tabs.map(function (tab) {
              return tab.url;
            }));
            localUrls = new Set(localState.tabs.map(function (tab) {
              return tab.url;
            }));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context6.prev = 11;
            _iterator = localState.tabs[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context6.next = 22;
              break;
            }

            tab = _step.value;

            if (remoteUrls.has(tab.url)) {
              _context6.next = 19;
              break;
            }

            console.log("removing local tab: tabUrl = ".concat(tab.url));
            _context6.next = 19;
            return chrome.tabs.remove(tab.id);

          case 19:
            _iteratorNormalCompletion = true;
            _context6.next = 13;
            break;

          case 22:
            _context6.next = 28;
            break;

          case 24:
            _context6.prev = 24;
            _context6.t0 = _context6["catch"](11);
            _didIteratorError = true;
            _iteratorError = _context6.t0;

          case 28:
            _context6.prev = 28;
            _context6.prev = 29;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 31:
            _context6.prev = 31;

            if (!_didIteratorError) {
              _context6.next = 34;
              break;
            }

            throw _iteratorError;

          case 34:
            return _context6.finish(31);

          case 35:
            return _context6.finish(28);

          case 36:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context6.prev = 39;
            _iterator2 = remoteState.tabs[Symbol.iterator]();

          case 41:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context6.next = 50;
              break;
            }

            _tab = _step2.value;

            if (localUrls.has(_tab.url)) {
              _context6.next = 47;
              break;
            }

            console.log("creating local tab: tabUrl = ".concat(_tab.url));
            _context6.next = 47;
            return chrome.tabs.create({
              index: _tab.index,
              url: _tab.url,
              active: _tab.active,
              pinned: _tab.pinned
            });

          case 47:
            _iteratorNormalCompletion2 = true;
            _context6.next = 41;
            break;

          case 50:
            _context6.next = 56;
            break;

          case 52:
            _context6.prev = 52;
            _context6.t1 = _context6["catch"](39);
            _didIteratorError2 = true;
            _iteratorError2 = _context6.t1;

          case 56:
            _context6.prev = 56;
            _context6.prev = 57;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 59:
            _context6.prev = 59;

            if (!_didIteratorError2) {
              _context6.next = 62;
              break;
            }

            throw _iteratorError2;

          case 62:
            return _context6.finish(59);

          case 63:
            return _context6.finish(56);

          case 64:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[11, 24, 28, 36], [29,, 31, 35], [39, 52, 56, 64], [57,, 59, 63]]);
  }));
  return _setLocalState.apply(this, arguments);
}

function setRemoteState(_x2) {
  return _setRemoteState.apply(this, arguments);
}

function _setRemoteState() {
  _setRemoteState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(localState) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log("setting remote state from local: localState = ".concat(JSON.stringify(localState)));
            _context7.next = 3;
            return chrome.storage.sync.set(localState.toObject());

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _setRemoteState.apply(this, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy5iYWJlbC9iYWNrZ3JvdW5kLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9tZS1leHRlbnNpb24tYXN5bmMvY2hyb21lLWV4dGVuc2lvbi1hc3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGdCQUFnQixHQUFHLElBQUksR0FBSixDQUFRLENBQUMsTUFBRCxFQUFTLFdBQVQsQ0FBUixDQUF6QjtBQUNBLElBQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFKLENBQVEsQ0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixRQUFqQixFQUEyQixRQUEzQixDQUFSLENBQTVCO0FBRUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxXQUFmLENBQTJCLFdBQTNCLENBQXVDLHdCQUF2QztBQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixDQUF5QixXQUF6QixDQUFxQyxXQUFyQztBQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixDQUF5QixXQUF6QixDQUFxQyxzQkFBckM7QUFFQSxNQUFNLENBQUMsSUFBUCxDQUFZLFNBQVosQ0FBc0IsV0FBdEIsQ0FBa0MsV0FBbEMsRSxDQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLFNBQVMsd0JBQVQsQ0FBa0MsT0FBbEMsRUFBMkM7QUFDekMsRUFBQSxPQUFPLENBQUMsR0FBUixvREFBd0QsT0FBTyxDQUFDLGVBQWhFO0FBQ0QsQyxDQUVEOzs7QUFDQSxTQUFTLHNCQUFULENBQWdDLE9BQWhDLEVBQXlDLFFBQXpDLEVBQW1EO0FBQ2pELE1BQUksUUFBUSxLQUFLLE1BQWpCLEVBQXlCLE9BRHdCLENBRWpEOztBQUNBLEVBQUEsdUJBQXVCO0FBQ3hCOztBQUVELFNBQVMsV0FBVCxHQUF1QjtBQUNyQjtBQUNBLEVBQUEsV0FBVztB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAnY2hyb21lLWV4dGVuc2lvbi1hc3luYyc7XG5cbmNvbnN0IFNUQVRFX1BST1BFUlRJRVMgPSBuZXcgU2V0KFsndGFicycsICd0aW1lc3RhbXAnXSk7XG5jb25zdCBUQUJfU1lOQ19QUk9QRVJUSUVTID0gbmV3IFNldChbJ2luZGV4JywgJ3VybCcsICdhY3RpdmUnLCAncGlubmVkJ10pO1xuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihoYW5kbGVSdW50aW1lT25JbnN0YWxsZWQpO1xuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwLmFkZExpc3RlbmVyKGhhbmRsZU1lcmdlKTtcblxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKGhhbmRsZVN0b3JhZ2VPbkNoYW5nZWQpO1xuXG5jaHJvbWUudGFicy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIoaGFuZGxlTWVyZ2UpO1xuXG4vLyBUT0RPOiBsb29rIHVwIGRvY3MgZm9yIHRoZXNlIGZ1bmN0aW9uc1xuLy8gY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKGhhbmRsZU1lcmdlKTtcbi8vIGNocm9tZS50YWJzLm9uTW92ZWQuYWRkTGlzdGVuZXIoaGFuZGxlTWVyZ2UpO1xuLy8gY2hyb21lLnRhYnMub25BY3RpdmF0ZWQuYWRkTGlzdGVuZXIoaGFuZGxlTWVyZ2UpO1xuLy8gY2hyb21lLnRhYnMub25SZW1vdmVkLmFkZExpc3RlbmVyKGhhbmRsZU1lcmdlKTtcbi8vIGNocm9tZS50YWJzLm9uUmVwbGFjZWQuYWRkTGlzdGVuZXIoaGFuZGxlTWVyZ2UpO1xuXG4vLyBUT0RPOiBpbmNsdWRlIGluZm9ybWF0aW9uIGFib3V0IHdpbmRvd3MsIGNyZWF0ZSBwcm94eSBtYXBzIGJldHdlZW4gd2luZG93IGlkcyBhbmQgbWF0Y2ggYmFzZWQgb24gc2ltaWxhcml0eVxuLy8gY2hyb21lLnRhYnMub25BdHRhY2hlZFxuLy8gY2hyb21lLnRhYnMub25EZXRhY2hlZFxuLy8gY2hyb21lLnRhYnMub25IaWdobGlnaHRlZFxuXG5cbmZ1bmN0aW9uIGhhbmRsZVJ1bnRpbWVPbkluc3RhbGxlZChkZXRhaWxzKSB7XG4gIGNvbnNvbGUubG9nKGBJbnN0YWxsZWQgbmV3IHZlcnNpb24uIHByZXZpb3VzVmVyc2lvbiA9ICR7ZGV0YWlscy5wcmV2aW91c1ZlcnNpb259YCk7XG59XG5cbi8vIFRPRE86IGhhbmRsZSBzaG91bGRuJ3QgZXhlY3V0ZSBpZiB0aGlzIGNsaWVudCBqdXN0IHVwZGF0ZWQgdGhlIHJlbW90ZVxuZnVuY3Rpb24gaGFuZGxlU3RvcmFnZU9uQ2hhbmdlZChjaGFuZ2VzLCBhcmVhTmFtZSkge1xuICBpZiAoYXJlYU5hbWUgIT09ICdzeW5jJykgcmV0dXJuO1xuICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gIHNldExvY2FsU3RhdGVGcm9tUmVtb3RlKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1lcmdlKCkge1xuICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gIG1lcmdlU3RhdGVzKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldExvY2FsU3RhdGVGcm9tUmVtb3RlKCkge1xuICBsZXQgcmVtb3RlU3RhdGUgPSBhd2FpdCBnZXRSZW1vdGVTdGF0ZSgpO1xuICBhd2FpdCBzZXRMb2NhbFN0YXRlKHJlbW90ZVN0YXRlKTtcbn1cblxuY2xhc3MgVGFiIHtcblxuICBzdGF0aWMgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgcmV0dXJuIFRBQl9TWU5DX1BST1BFUlRJRVM7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihpbmRleCwgdXJsLCBhY3RpdmUsIHBpbm5lZCkge1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLmFjdGl2ZSA9IGFjdGl2ZTtcbiAgICB0aGlzLnBpbm5lZCA9IHBpbm5lZDtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tT2JqZWN0KG9iamVjdCkge1xuICAgIGlmICghKG9iamVjdCAmJlxuICAgICAgb2JqZWN0Lmhhc093blByb3BlcnR5KCdpbmRleCcpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3VybCcpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ2FjdGl2ZScpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3Bpbm5lZCcpKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIG5ldyBUYWIob2JqZWN0LmluZGV4LCBvYmplY3QudXJsLCBvYmplY3QuYWN0aXZlLCBvYmplY3QucGlubmVkKTtcbiAgfVxuXG4gIHRvT2JqZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICBhY3RpdmU6IHRoaXMuYWN0aXZlLFxuICAgICAgcGlubmVkOiB0aGlzLnBpbm5lZCxcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU3RhdGUge1xuXG4gIHN0YXRpYyBnZXQgcHJvcGVydGllcygpIHtcbiAgICByZXR1cm4gU1RBVEVfUFJPUEVSVElFUztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHRpbWVzdGFtcCA9IDAsIHRhYnMgPSBbXSkge1xuICAgIHRoaXMudGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIHRoaXMudGFicyA9IHRhYnM7XG4gIH1cblxuICBzdGF0aWMgZnJvbU9iamVjdChvYmplY3QpIHtcbiAgICBpZiAoIShvYmplY3RcbiAgICAgICYmIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgndGltZXN0YW1wJylcbiAgICAgICYmIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgndGFicycpKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZShvYmplY3QudGltZXN0YW1wLCBvYmplY3QudGFicy5tYXAoVGFiLmZyb21PYmplY3QpKTtcbiAgfVxuXG4gIHRvT2JqZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lc3RhbXA6IHRoaXMudGltZXN0YW1wLFxuICAgICAgdGFiczogdGhpcy50YWJzLm1hcCgodGFiKSA9PiB0YWIudG9PYmplY3QoKSksXG4gICAgfVxuICB9XG5cbiAgZ2V0IHVybHMoKSB7XG4gICAgcmV0dXJuIG5ldyBTZXQodGhpcy50YWJzLm1hcCgodGFiKSA9PiB0YWIudXJsKSlcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtZXJnZVN0YXRlcygpIHtcbiAgbGV0IGxvY2FsU3RhdGUgPSBhd2FpdCBnZXRPckNyZWF0ZUxvY2FsU3RhdGUoKTtcbiAgbGV0IHJlbW90ZVN0YXRlID0gYXdhaXQgZ2V0UmVtb3RlU3RhdGUoKTtcblxuICBpZiAoIShyZW1vdGVTdGF0ZSBpbnN0YW5jZW9mIFN0YXRlKSkge1xuICAgIGNvbnNvbGUubG9nKGByZW1vdGVTdGF0ZSBkb2VzIG5vdCBleGlzdCwgb3ZlcndyaXRpbmc6IGxvY2FsU3RhdGUgPSAke0pTT04uc3RyaW5naWZ5KGxvY2FsU3RhdGUpfWApO1xuICAgIGF3YWl0IHNldFJlbW90ZVN0YXRlKGxvY2FsU3RhdGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChyZW1vdGVTdGF0ZS51cmxzID09PSBsb2NhbFN0YXRlLnVybHMpIHtcbiAgICBjb25zb2xlLmxvZyhgcmVtb3RlIGFuZCBsb2NhbCB1cmxzIGFyZSB0aGUgc2FtZSwgbm8tb3A6IHJlbW90ZVVybHMgPSAke3JlbW90ZVN0YXRlLnVybHN9LCBsb2NhbFVybHMgPSAke2xvY2FsU3RhdGUudXJsc31gKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocmVtb3RlU3RhdGUudGltZXN0YW1wIDwgbG9jYWxTdGF0ZS50aW1lc3RhbXApIHtcbiAgICBjb25zb2xlLmxvZyhgb3ZlcndyaXRpbmcgcmVtb3RlIHN0YXRlIHRvIG1lcmdlOiBsb2NhbFN0YXRlID0gJHtKU09OLnN0cmluZ2lmeShsb2NhbFN0YXRlKX0sIHJlbW90ZVN0YXRlID0gJHtKU09OLnN0cmluZ2lmeShyZW1vdGVTdGF0ZSl9YCk7XG4gICAgYXdhaXQgc2V0UmVtb3RlU3RhdGUobG9jYWxTdGF0ZSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coYG92ZXJ3cml0aW5nIGxvY2FsIHN0YXRlIHRvIG1lcmdlOiBsb2NhbFN0YXRlID0gJHtKU09OLnN0cmluZ2lmeShsb2NhbFN0YXRlKX0sIHJlbW90ZVN0YXRlID0gJHtKU09OLnN0cmluZ2lmeShyZW1vdGVTdGF0ZSl9YCk7XG4gICAgYXdhaXQgc2V0TG9jYWxTdGF0ZShyZW1vdGVTdGF0ZSk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTG9jYWxTdGF0ZSgpIHtcbiAgLy8gVE9ETzogZmlsbCBpbiBxdWVyeUluZm9cbiAgbGV0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7XG4gIGxldCBsb2NhbFN0YXRlID0gbmV3IFN0YXRlKFxuICAgIERhdGUubm93KCksXG4gICAgdGFicy5tYXAoVGFiLmZyb21PYmplY3QpLFxuICApO1xuXG4gIGNvbnNvbGUubG9nKGBjcmVhdGVkIGxvY2FsIHN0YXRlOiBsb2NhbFN0YXRlID0gJHtKU09OLnN0cmluZ2lmeShsb2NhbFN0YXRlKX1gKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGxvY2FsU3RhdGUudG9PYmplY3QoKSk7XG4gIHJldHVybiBsb2NhbFN0YXRlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRPckNyZWF0ZUxvY2FsU3RhdGUoKSB7XG4gIGxldCBsb2NhbFN0YXRlID0gU3RhdGUuZnJvbU9iamVjdChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU3RhdGUucHJvcGVydGllcykpO1xuICBjb25zb2xlLmxvZyhgZmV0Y2hlZCBsb2NhbCBzdGF0ZTogbG9jYWxTdGF0ZSA9ICR7SlNPTi5zdHJpbmdpZnkobG9jYWxTdGF0ZSl9YCk7XG5cbiAgaWYgKGxvY2FsU3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSkgcmV0dXJuIGxvY2FsU3RhdGU7XG4gIHJldHVybiBhd2FpdCBjcmVhdGVMb2NhbFN0YXRlKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFJlbW90ZVN0YXRlKCkge1xuICByZXR1cm4gU3RhdGUuZnJvbU9iamVjdChhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChTdGF0ZS5wcm9wZXJ0aWVzKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldExvY2FsU3RhdGUocmVtb3RlU3RhdGUpIHtcbiAgbGV0IGxvY2FsU3RhdGUgPSBhd2FpdCBnZXRPckNyZWF0ZUxvY2FsU3RhdGUoKTtcblxuICBjb25zb2xlLmxvZyhgc2V0dGluZyBsb2NhbCBzdGF0ZSBmcm9tIHJlbW90ZTogcmVtb3RlU3RhdGUgPSAke0pTT04uc3RyaW5naWZ5KHJlbW90ZVN0YXRlKX1gKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHJlbW90ZVN0YXRlLnRvT2JqZWN0KCkpO1xuXG4gIGxldCByZW1vdGVVcmxzID0gbmV3IFNldChyZW1vdGVTdGF0ZS50YWJzLm1hcCgodGFiKSA9PiB0YWIudXJsKSk7XG4gIGxldCBsb2NhbFVybHMgPSBuZXcgU2V0KGxvY2FsU3RhdGUudGFicy5tYXAoKHRhYikgPT4gdGFiLnVybCkpO1xuXG4gIGZvciAobGV0IHRhYiBvZiBsb2NhbFN0YXRlLnRhYnMpIHtcbiAgICBpZiAoIXJlbW90ZVVybHMuaGFzKHRhYi51cmwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhgcmVtb3ZpbmcgbG9jYWwgdGFiOiB0YWJVcmwgPSAke3RhYi51cmx9YCk7XG4gICAgICBhd2FpdCBjaHJvbWUudGFicy5yZW1vdmUodGFiLmlkKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCB0YWIgb2YgcmVtb3RlU3RhdGUudGFicykge1xuICAgIGlmICghbG9jYWxVcmxzLmhhcyh0YWIudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coYGNyZWF0aW5nIGxvY2FsIHRhYjogdGFiVXJsID0gJHt0YWIudXJsfWApO1xuICAgICAgYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHtcbiAgICAgICAgaW5kZXg6IHRhYi5pbmRleCxcbiAgICAgICAgdXJsOiB0YWIudXJsLFxuICAgICAgICBhY3RpdmU6IHRhYi5hY3RpdmUsXG4gICAgICAgIHBpbm5lZDogdGFiLnBpbm5lZCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRSZW1vdGVTdGF0ZShsb2NhbFN0YXRlKSB7XG4gIGNvbnNvbGUubG9nKGBzZXR0aW5nIHJlbW90ZSBzdGF0ZSBmcm9tIGxvY2FsOiBsb2NhbFN0YXRlID0gJHtKU09OLnN0cmluZ2lmeShsb2NhbFN0YXRlKX1gKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQobG9jYWxTdGF0ZS50b09iamVjdCgpKTtcbn1cbiIsIi8qKiBXcmFwIGFuIEFQSSB0aGF0IHVzZXMgY2FsbGJhY2tzIHdpdGggUHJvbWlzZXNcclxuICogVGhpcyBleHBlY3RzIHRoZSBwYXR0ZXJuIGZ1bmN0aW9uIHdpdGhDYWxsYmFjayhhcmcxLCBhcmcyLCAuLi4gYXJnTiwgY2FsbGJhY2spXHJcbiAqIEBhdXRob3IgS2VpdGggSGVucnkgPGtlaXRoLmhlbnJ5QGV2b2x1dGlvbmpvYnMuY28udWs+XHJcbiAqIEBsaWNlbnNlIE1JVCAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qKiBXcmFwIGEgZnVuY3Rpb24gd2l0aCBhIGNhbGxiYWNrIHdpdGggYSBQcm9taXNlLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZiBUaGUgZnVuY3Rpb24gdG8gd3JhcCwgc2hvdWxkIGJlIHBhdHRlcm46IHdpdGhDYWxsYmFjayhhcmcxLCBhcmcyLCAuLi4gYXJnTiwgY2FsbGJhY2spLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcGFyc2VDQiBPcHRpb25hbCBmdW5jdGlvbiB0byBwYXJzZSBtdWx0aXBsZSBjYWxsYmFjayBwYXJhbWV0ZXJzIGludG8gYSBzaW5nbGUgb2JqZWN0LlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBjYWxsYmFjayBmaXJlcy4gKi9cclxuICAgIGZ1bmN0aW9uIHByb21pc2lmeShmLCBwYXJzZUNCKSB7XHJcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzYWZlQXJncyA9IGFyZ3M7XHJcbiAgICAgICAgICAgIGxldCBjYWxsYmFjaztcclxuICAgICAgICAgICAgLy8gVGhlIENocm9tZSBBUEkgZnVuY3Rpb25zIGFsbCB1c2UgYXJndW1lbnRzLCBzbyB3ZSBjYW4ndCB1c2UgZi5sZW5ndGggdG8gY2hlY2tcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgbGFzdCBhcmdcclxuICAgICAgICAgICAgaWYgKGFyZ3MgJiYgYXJncy5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gLi4uIGFuZCB0aGUgbGFzdCBhcmcgaXMgYSBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdCA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbGFzdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyaW0gdGhlIGxhc3QgY2FsbGJhY2sgYXJnIGlmIGl0J3MgYmVlbiBwYXNzZWRcclxuICAgICAgICAgICAgICAgICAgICBzYWZlQXJncyA9IGFyZ3Muc2xpY2UoMCwgYXJncy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGxhc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHRvIHJ1biB0aGUgb3JpZ2luYWwgZnVuY3Rpb24sIHdpdGggdGhlIHRyaW1tZWQgYXJncyBsaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgZiguLi5zYWZlQXJncywgKC4uLmNiQXJncykgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBjYWxsYmFjayB3YXMgcGFzc2VkIGF0IHRoZSBlbmQgb2YgdGhlIG9yaWdpbmFsIGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGFsbG93IGEgYnVnIGluIHRoZSBjYWxsYmFjayB0byBzdG9wIHRoZSBwcm9taXNlIHJlc29sdmluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHsgY2FsbGJhY2soLi4uY2JBcmdzKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGNiRXJyKSB7IHJlamVjdChjYkVycik7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIGV4dGVuc2lvbnMgYWx3YXlzIGZpcmUgdGhlIGNhbGxiYWNrLCBidXQgcG9wdWxhdGUgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yIHdpdGggZXhjZXB0aW9uIGRldGFpbHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiBhcyBhbiBlcnJvciBmb3IgdGhlIGF3YWl0ZWQgY2F0Y2ggYmxvY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgfHwgYEVycm9yIHRocm93biBieSBBUEkgJHtjaHJvbWUucnVudGltZS5sYXN0RXJyb3J9YCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUNCKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2JPYmogPSBwYXJzZUNCKC4uLmNiQXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYk9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghY2JBcmdzIHx8IGNiQXJncy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2JBcmdzLmxlbmd0aCA9PT0gMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNiQXJnc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYkFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7IHJlamVjdChlcnIpOyB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogUHJvbWlzaWZ5IGFsbCB0aGUga25vd24gZnVuY3Rpb25zIGluIHRoZSBtYXAgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYXBpIFRoZSBDaHJvbWUgbmF0aXZlIEFQSSB0byBleHRlbmRcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFwaU1hcCBDb2xsZWN0aW9uIG9mIHN1Yi1BUEkgYW5kIGZ1bmN0aW9ucyB0byBwcm9taXNpZnkgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5TWFwKGFwaSwgYXBpTWFwKSB7XHJcbiAgICAgICAgaWYgKCFhcGkpXHJcbiAgICAgICAgICAgIC8vIE5vdCBzdXBwb3J0ZWQgYnkgY3VycmVudCBwZXJtaXNzaW9uc1xyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAobGV0IGZ1bmNEZWYgb2YgYXBpTWFwKSB7XHJcbiAgICAgICAgICAgIGxldCBmdW5jTmFtZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jRGVmID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lID0gZnVuY0RlZjtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jTmFtZSA9IGZ1bmNEZWYubjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFhcGkuaGFzT3duUHJvcGVydHkoZnVuY05hbWUpKVxyXG4gICAgICAgICAgICAgICAgLy8gTWVtYmVyIG5vdCBpbiBBUElcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbSA9IGFwaVtmdW5jTmFtZV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBmdW5jdGlvbiwgd3JhcCBpbiBhIHByb21pc2VcclxuICAgICAgICAgICAgICAgIGFwaVtmdW5jTmFtZV0gPSBwcm9taXNpZnkobS5iaW5kKGFwaSksIGZ1bmNEZWYuY2IpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAvLyBTdWItQVBJLCByZWN1cnNlIHRoaXMgZnVuYyB3aXRoIHRoZSBtYXBwZWQgcHJvcHNcclxuICAgICAgICAgICAgICAgIGFwcGx5TWFwKG0sIGZ1bmNEZWYucHJvcHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQXBwbHkgcHJvbWlzZS1tYXBzIHRvIHRoZSBDaHJvbWUgbmF0aXZlIEFQSS5cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhcGlNYXBzIFRoZSBBUEkgdG8gYXBwbHkuICovXHJcbiAgICBmdW5jdGlvbiBhcHBseU1hcHMoYXBpTWFwcykge1xyXG4gICAgICAgIGZvciAobGV0IGFwaU5hbWUgaW4gYXBpTWFwcykge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja0FwaSA9IGNocm9tZVthcGlOYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjYWxsYmFja0FwaSlcclxuICAgICAgICAgICAgICAgIC8vIE5vdCBzdXBwb3J0ZWQgYnkgY3VycmVudCBwZXJtaXNzaW9uc1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhcGlNYXAgPSBhcGlNYXBzW2FwaU5hbWVdO1xyXG4gICAgICAgICAgICBhcHBseU1hcChjYWxsYmFja0FwaSwgYXBpTWFwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWNjZXNzaWJpbGl0eUZlYXR1cmVzIGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9hY2Nlc3NpYmlsaXR5RmVhdHVyZXNcclxuICAgIGNvbnN0IGtub3duQTExeVNldHRpbmcgPSBbJ2dldCcsICdzZXQnLCAnY2xlYXInXTtcclxuXHJcbiAgICAvLyBDb250ZW50U2V0dGluZyBodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvY29udGVudFNldHRpbmdzI3R5cGUtQ29udGVudFNldHRpbmdcclxuICAgIGNvbnN0IGtub3duSW5Db250ZW50U2V0dGluZyA9IFsnY2xlYXInLCAnZ2V0JywgJ3NldCcsICdnZXRSZXNvdXJjZUlkZW50aWZpZXJzJ107XHJcblxyXG4gICAgLy8gU3RvcmFnZUFyZWEgaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3N0b3JhZ2UjdHlwZS1TdG9yYWdlQXJlYVxyXG4gICAgY29uc3Qga25vd25JblN0b3JhZ2VBcmVhID0gWydnZXQnLCAnZ2V0Qnl0ZXNJblVzZScsICdzZXQnLCAncmVtb3ZlJywgJ2NsZWFyJ107XHJcblxyXG4gICAgLyoqIE1hcCBvZiBBUEkgZnVuY3Rpb25zIHRoYXQgZm9sbG93IHRoZSBjYWxsYmFjayBwYXR0ZXJuIHRoYXQgd2UgY2FuICdwcm9taXNpZnknICovXHJcbiAgICBhcHBseU1hcHMoe1xyXG4gICAgICAgIGFjY2Vzc2liaWxpdHlGZWF0dXJlczogWyAgLy8gVG9kbzogdGhpcyBzaG91bGQgZXh0ZW5kIEFjY2Vzc2liaWxpdHlGZWF0dXJlc1NldHRpbmcucHJvdG90eXBlIGluc3RlYWRcclxuICAgICAgICAgICAgeyBuOiAnc3Bva2VuRmVlZGJhY2snLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdsYXJnZUN1cnNvcicsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3N0aWNreUtleXMnLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdoaWdoQ29udHJhc3QnLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdzY3JlZW5NYWduaWZpZXInLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdhdXRvY2xpY2snLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICd2aXJ0dWFsS2V5Ym9hcmQnLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdhbmltYXRpb25Qb2xpY3knLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9XSxcclxuICAgICAgICBhbGFybXM6IFsnZ2V0JywgJ2dldEFsbCcsICdjbGVhcicsICdjbGVhckFsbCddLFxyXG4gICAgICAgIGJvb2ttYXJrczogW1xyXG4gICAgICAgICAgICAnZ2V0JywgJ2dldENoaWxkcmVuJywgJ2dldFJlY2VudCcsICdnZXRUcmVlJywgJ2dldFN1YlRyZWUnLFxyXG4gICAgICAgICAgICAnc2VhcmNoJywgJ2NyZWF0ZScsICdtb3ZlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAncmVtb3ZlVHJlZSddLFxyXG4gICAgICAgIGJyb3dzZXI6IFsnb3BlblRhYiddLFxyXG4gICAgICAgIGJyb3dzZXJBY3Rpb246IFtcclxuICAgICAgICAgICAgJ2dldFRpdGxlJywgJ3NldEljb24nLCAnZ2V0UG9wdXAnLCAnZ2V0QmFkZ2VUZXh0JywgJ2dldEJhZGdlQmFja2dyb3VuZENvbG9yJ10sXHJcbiAgICAgICAgYnJvd3NpbmdEYXRhOiBbXHJcbiAgICAgICAgICAgICdzZXR0aW5ncycsICdyZW1vdmUnLCAncmVtb3ZlQXBwY2FjaGUnLCAncmVtb3ZlQ2FjaGUnLFxyXG4gICAgICAgICAgICAncmVtb3ZlQ29va2llcycsICdyZW1vdmVEb3dubG9hZHMnLCAncmVtb3ZlRmlsZVN5c3RlbXMnLFxyXG4gICAgICAgICAgICAncmVtb3ZlRm9ybURhdGEnLCAncmVtb3ZlSGlzdG9yeScsICdyZW1vdmVJbmRleGVkREInLFxyXG4gICAgICAgICAgICAncmVtb3ZlTG9jYWxTdG9yYWdlJywgJ3JlbW92ZVBsdWdpbkRhdGEnLCAncmVtb3ZlUGFzc3dvcmRzJyxcclxuICAgICAgICAgICAgJ3JlbW92ZVdlYlNRTCddLFxyXG4gICAgICAgIGNvbW1hbmRzOiBbJ2dldEFsbCddLFxyXG4gICAgICAgIGNvbnRlbnRTZXR0aW5nczogWyAgLy8gVG9kbzogdGhpcyBzaG91bGQgZXh0ZW5kIENvbnRlbnRTZXR0aW5nLnByb3RvdHlwZSBpbnN0ZWFkXHJcbiAgICAgICAgICAgIHsgbjogJ2Nvb2tpZXMnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2ltYWdlcycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnamF2YXNjcmlwdCcsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnbG9jYXRpb24nLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3BsdWdpbnMnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3BvcHVwcycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnbm90aWZpY2F0aW9ucycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnZnVsbHNjcmVlbicsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnbW91c2Vsb2NrJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdtaWNyb3Bob25lJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdjYW1lcmEnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3Vuc2FuZGJveGVkUGx1Z2lucycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnYXV0b21hdGljRG93bmxvYWRzJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9XSxcclxuICAgICAgICBjb250ZXh0TWVudXM6IFsnY3JlYXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAncmVtb3ZlQWxsJ10sXHJcbiAgICAgICAgY29va2llczogWydnZXQnLCAnZ2V0QWxsJywgJ3NldCcsICdyZW1vdmUnLCAnZ2V0QWxsQ29va2llU3RvcmVzJ10sXHJcbiAgICAgICAgZGVidWdnZXI6IFsnYXR0YWNoJywgJ2RldGFjaCcsICdzZW5kQ29tbWFuZCcsICdnZXRUYXJnZXRzJ10sXHJcbiAgICAgICAgZGVza3RvcENhcHR1cmU6IFsnY2hvb3NlRGVza3RvcE1lZGlhJ10sXHJcbiAgICAgICAgLy8gVE9ETzogZGV2dG9vbHMuKlxyXG4gICAgICAgIGRvY3VtZW50U2NhbjogWydzY2FuJ10sXHJcbiAgICAgICAgZG93bmxvYWRzOiBbXHJcbiAgICAgICAgICAgICdkb3dubG9hZCcsICdzZWFyY2gnLCAncGF1c2UnLCAncmVzdW1lJywgJ2NhbmNlbCcsXHJcbiAgICAgICAgICAgICdnZXRGaWxlSWNvbicsICdlcmFzZScsICdyZW1vdmVGaWxlJywgJ2FjY2VwdERhbmdlciddLFxyXG4gICAgICAgIGVudGVycHJpc2U6IFt7IG46ICdwbGF0Zm9ybUtleXMnLCBwcm9wczogWydnZXRUb2tlbicsICdnZXRDZXJ0aWZpY2F0ZXMnLCAnaW1wb3J0Q2VydGlmaWNhdGUnLCAncmVtb3ZlQ2VydGlmaWNhdGUnXSB9XSxcclxuICAgICAgICBleHRlbnNpb246IFsnaXNBbGxvd2VkSW5jb2duaXRvQWNjZXNzJywgJ2lzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3MnXSwgLy8gbW9zdGx5IGRlcHJlY2F0ZWQgaW4gZmF2b3VyIG9mIHJ1bnRpbWVcclxuICAgICAgICBmaWxlQnJvd3NlckhhbmRsZXI6IFsnc2VsZWN0RmlsZSddLFxyXG4gICAgICAgIGZpbGVTeXN0ZW1Qcm92aWRlcjogWydtb3VudCcsICd1bm1vdW50JywgJ2dldEFsbCcsICdnZXQnLCAnbm90aWZ5J10sXHJcbiAgICAgICAgZm9udFNldHRpbmdzOiBbXHJcbiAgICAgICAgICAgICdzZXREZWZhdWx0Rm9udFNpemUnLCAnZ2V0Rm9udCcsICdnZXREZWZhdWx0Rm9udFNpemUnLCAnZ2V0TWluaW11bUZvbnRTaXplJyxcclxuICAgICAgICAgICAgJ3NldE1pbmltdW1Gb250U2l6ZScsICdnZXREZWZhdWx0Rml4ZWRGb250U2l6ZScsICdjbGVhckRlZmF1bHRGb250U2l6ZScsXHJcbiAgICAgICAgICAgICdzZXREZWZhdWx0Rml4ZWRGb250U2l6ZScsICdjbGVhckZvbnQnLCAnc2V0Rm9udCcsICdjbGVhck1pbmltdW1Gb250U2l6ZScsXHJcbiAgICAgICAgICAgICdnZXRGb250TGlzdCcsICdjbGVhckRlZmF1bHRGaXhlZEZvbnRTaXplJ10sXHJcbiAgICAgICAgZ2NtOiBbJ3JlZ2lzdGVyJywgJ3VucmVnaXN0ZXInLCAnc2VuZCddLFxyXG4gICAgICAgIGhpc3Rvcnk6IFsnc2VhcmNoJywgJ2dldFZpc2l0cycsICdhZGRVcmwnLCAnZGVsZXRlVXJsJywgJ2RlbGV0ZVJhbmdlJywgJ2RlbGV0ZUFsbCddLFxyXG4gICAgICAgIGkxOG46IFsnZ2V0QWNjZXB0TGFuZ3VhZ2VzJywgJ2RldGVjdExhbmd1YWdlJ10sXHJcbiAgICAgICAgaWRlbnRpdHk6IFtcclxuICAgICAgICAgICAgJ2dldEF1dGhUb2tlbicsICdnZXRQcm9maWxlVXNlckluZm8nLCAncmVtb3ZlQ2FjaGVkQXV0aFRva2VuJywgJ2xhdW5jaFdlYkF1dGhGbG93J10sXHJcbiAgICAgICAgaWRsZTogWydxdWVyeVN0YXRlJ10sXHJcbiAgICAgICAgaW5wdXQ6IFt7XHJcbiAgICAgICAgICAgIG46ICdpbWUnLCBwcm9wczogW1xyXG4gICAgICAgICAgICAgICAgJ3NldE1lbnVJdGVtcycsICdjb21taXRUZXh0JywgJ3NldENhbmRpZGF0ZXMnLCAnc2V0Q29tcG9zaXRpb24nLCAndXBkYXRlTWVudUl0ZW1zJyxcclxuICAgICAgICAgICAgICAgICdzZXRDYW5kaWRhdGVXaW5kb3dQcm9wZXJ0aWVzJywgJ2NsZWFyQ29tcG9zaXRpb24nLCAnc2V0Q3Vyc29yUG9zaXRpb24nLCAnc2VuZEtleUV2ZW50cycsXHJcbiAgICAgICAgICAgICAgICAnZGVsZXRlU3Vycm91bmRpbmdUZXh0J11cclxuICAgICAgICB9XSxcclxuICAgICAgICBtYW5hZ2VtZW50OiBbXHJcbiAgICAgICAgICAgICdzZXRFbmFibGVkJywgJ2dldFBlcm1pc3Npb25XYXJuaW5nc0J5SWQnLCAnZ2V0JywgJ2dldEFsbCcsXHJcbiAgICAgICAgICAgICdnZXRQZXJtaXNzaW9uV2FybmluZ3NCeU1hbmlmZXN0JywgJ2xhdW5jaEFwcCcsICd1bmluc3RhbGwnLCAnZ2V0U2VsZicsXHJcbiAgICAgICAgICAgICd1bmluc3RhbGxTZWxmJywgJ2NyZWF0ZUFwcFNob3J0Y3V0JywgJ3NldExhdW5jaFR5cGUnLCAnZ2VuZXJhdGVBcHBGb3JMaW5rJ10sXHJcbiAgICAgICAgbmV0d29ya2luZzogW3sgbjogJ2NvbmZpZycsIHByb3BzOiBbJ3NldE5ldHdvcmtGaWx0ZXInLCAnZmluaXNoQXV0aGVudGljYXRpb24nXSB9XSxcclxuICAgICAgICBub3RpZmljYXRpb25zOiBbJ2NyZWF0ZScsICd1cGRhdGUnLCAnY2xlYXInLCAnZ2V0QWxsJywgJ2dldFBlcm1pc3Npb25MZXZlbCddLFxyXG4gICAgICAgIHBhZ2VBY3Rpb246IFsnZ2V0VGl0bGUnLCAnc2V0SWNvbicsICdnZXRQb3B1cCddLFxyXG4gICAgICAgIHBhZ2VDYXB0dXJlOiBbJ3NhdmVBc01IVE1MJ10sXHJcbiAgICAgICAgcGVybWlzc2lvbnM6IFsnZ2V0QWxsJywgJ2NvbnRhaW5zJywgJ3JlcXVlc3QnLCAncmVtb3ZlJ10sXHJcbiAgICAgICAgcGxhdGZvcm1LZXlzOiBbJ3NlbGVjdENsaWVudENlcnRpZmljYXRlcycsICd2ZXJpZnlUTFNTZXJ2ZXJDZXJ0aWZpY2F0ZScsXHJcbiAgICAgICAgICAgIHsgbjogXCJnZXRLZXlQYWlyXCIsIGNiOiAocHVibGljS2V5LCBwcml2YXRlS2V5KSA9PiB7IHJldHVybiB7IHB1YmxpY0tleSwgcHJpdmF0ZUtleSB9OyB9IH1dLFxyXG4gICAgICAgIHJ1bnRpbWU6IFtcclxuICAgICAgICAgICAgJ2dldEJhY2tncm91bmRQYWdlJywgJ29wZW5PcHRpb25zUGFnZScsICdzZXRVbmluc3RhbGxVUkwnLFxyXG4gICAgICAgICAgICAncmVzdGFydEFmdGVyRGVsYXknLCAnc2VuZE1lc3NhZ2UnLFxyXG4gICAgICAgICAgICAnc2VuZE5hdGl2ZU1lc3NhZ2UnLCAnZ2V0UGxhdGZvcm1JbmZvJywgJ2dldFBhY2thZ2VEaXJlY3RvcnlFbnRyeScsXHJcbiAgICAgICAgICAgIHsgbjogXCJyZXF1ZXN0VXBkYXRlQ2hlY2tcIiwgY2I6IChzdGF0dXMsIGRldGFpbHMpID0+IHsgcmV0dXJuIHsgc3RhdHVzLCBkZXRhaWxzIH07IH0gfV0sXHJcbiAgICAgICAgc2NyaXB0QmFkZ2U6IFsnZ2V0UG9wdXAnXSxcclxuICAgICAgICBzZXNzaW9uczogWydnZXRSZWNlbnRseUNsb3NlZCcsICdnZXREZXZpY2VzJywgJ3Jlc3RvcmUnXSxcclxuICAgICAgICBzdG9yYWdlOiBbICAgICAgICAgIC8vIFRvZG86IHRoaXMgc2hvdWxkIGV4dGVuZCBTdG9yYWdlQXJlYS5wcm90b3R5cGUgaW5zdGVhZFxyXG4gICAgICAgICAgICB7IG46ICdzeW5jJywgcHJvcHM6IGtub3duSW5TdG9yYWdlQXJlYSB9LFxyXG4gICAgICAgICAgICB7IG46ICdsb2NhbCcsIHByb3BzOiBrbm93bkluU3RvcmFnZUFyZWEgfSxcclxuICAgICAgICAgICAgeyBuOiAnbWFuYWdlZCcsIHByb3BzOiBrbm93bkluU3RvcmFnZUFyZWEgfV0sXHJcbiAgICAgICAgc29ja2V0OiBbXHJcbiAgICAgICAgICAgICdjcmVhdGUnLCAnY29ubmVjdCcsICdiaW5kJywgJ3JlYWQnLCAnd3JpdGUnLCAncmVjdkZyb20nLCAnc2VuZFRvJyxcclxuICAgICAgICAgICAgJ2xpc3RlbicsICdhY2NlcHQnLCAnc2V0S2VlcEFsaXZlJywgJ3NldE5vRGVsYXknLCAnZ2V0SW5mbycsICdnZXROZXR3b3JrTGlzdCddLFxyXG4gICAgICAgIHNvY2tldHM6IFtcclxuICAgICAgICAgICAgeyBuOiAndGNwJywgcHJvcHM6IFtcclxuICAgICAgICAgICAgICAgICdjcmVhdGUnLCd1cGRhdGUnLCdzZXRQYXVzZWQnLCdzZXRLZWVwQWxpdmUnLCdzZXROb0RlbGF5JywnY29ubmVjdCcsXHJcbiAgICAgICAgICAgICAgICAnZGlzY29ubmVjdCcsJ3NlY3VyZScsJ3NlbmQnLCdjbG9zZScsJ2dldEluZm8nLCdnZXRTb2NrZXRzJ10gfSxcclxuICAgICAgICAgICAgeyBuOiAndGNwU2VydmVyJywgcHJvcHM6IFtcclxuICAgICAgICAgICAgICAgICdjcmVhdGUnLCd1cGRhdGUnLCdzZXRQYXVzZWQnLCdsaXN0ZW4nLCdkaXNjb25uZWN0JywnY2xvc2UnLCdnZXRJbmZvJywnZ2V0U29ja2V0cyddIH0sIFxyXG4gICAgICAgICAgICB7IG46ICd1ZHAnLCBwcm9wczogW1xyXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZScsJ3VwZGF0ZScsJ3NldFBhdXNlZCcsJ2JpbmQnLCdzZW5kJywnY2xvc2UnLCdnZXRJbmZvJyxcclxuICAgICAgICAgICAgICAgICdnZXRTb2NrZXRzJywnam9pbkdyb3VwJywnbGVhdmVHcm91cCcsJ3NldE11bHRpY2FzdFRpbWVUb0xpdmUnLFxyXG4gICAgICAgICAgICAgICAgJ3NldE11bHRpY2FzdExvb3BiYWNrTW9kZScsJ2dldEpvaW5lZEdyb3VwcycsJ3NldEJyb2FkY2FzdCddIH1dLFxyXG4gICAgICAgIHN5c3RlbTogW1xyXG4gICAgICAgICAgICB7IG46ICdjcHUnLCBwcm9wczogWydnZXRJbmZvJ10gfSxcclxuICAgICAgICAgICAgeyBuOiAnbWVtb3J5JywgcHJvcHM6IFsnZ2V0SW5mbyddIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3N0b3JhZ2UnLCBwcm9wczogWydnZXRJbmZvJywgJ2VqZWN0RGV2aWNlJywgJ2dldEF2YWlsYWJsZUNhcGFjaXR5J10gfV0sXHJcbiAgICAgICAgdGFiQ2FwdHVyZTogWydjYXB0dXJlJywgJ2dldENhcHR1cmVkVGFicyddLFxyXG4gICAgICAgIHRhYnM6IFtcclxuICAgICAgICAgICAgJ2dldCcsICdnZXRDdXJyZW50JywgJ3NlbmRNZXNzYWdlJywgJ2NyZWF0ZScsICdkdXBsaWNhdGUnLFxyXG4gICAgICAgICAgICAncXVlcnknLCAnaGlnaGxpZ2h0JywgJ3VwZGF0ZScsICdtb3ZlJywgJ3JlbG9hZCcsICdyZW1vdmUnLFxyXG4gICAgICAgICAgICAnZGV0ZWN0TGFuZ3VhZ2UnLCAnY2FwdHVyZVZpc2libGVUYWInLCAnZXhlY3V0ZVNjcmlwdCcsXHJcbiAgICAgICAgICAgICdpbnNlcnRDU1MnLCAnc2V0Wm9vbScsICdnZXRab29tJywgJ3NldFpvb21TZXR0aW5ncycsXHJcbiAgICAgICAgICAgICdnZXRab29tU2V0dGluZ3MnLCAnZGlzY2FyZCddLFxyXG4gICAgICAgIHRvcFNpdGVzOiBbJ2dldCddLFxyXG4gICAgICAgIHR0czogWydpc1NwZWFraW5nJywgJ2dldFZvaWNlcycsICdzcGVhayddLFxyXG4gICAgICAgIHR5cGVzOiBbJ3NldCcsICdnZXQnLCAnY2xlYXInXSxcclxuICAgICAgICB2cG5Qcm92aWRlcjogWydjcmVhdGVDb25maWcnLCAnZGVzdHJveUNvbmZpZycsICdzZXRQYXJhbWV0ZXJzJywgJ3NlbmRQYWNrZXQnLCAnbm90aWZ5Q29ubmVjdGlvblN0YXRlQ2hhbmdlZCddLFxyXG4gICAgICAgIHdhbGxwYXBlcjogWydzZXRXYWxscGFwZXInXSxcclxuICAgICAgICB3ZWJOYXZpZ2F0aW9uOiBbJ2dldEZyYW1lJywgJ2dldEFsbEZyYW1lcycsICdoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkJ10sXHJcbiAgICAgICAgd2luZG93czogWydnZXQnLCAnZ2V0Q3VycmVudCcsICdnZXRMYXN0Rm9jdXNlZCcsICdnZXRBbGwnLCAnY3JlYXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnXVxyXG4gICAgfSk7XHJcbn0pKCk7XHJcbiJdfQ==
