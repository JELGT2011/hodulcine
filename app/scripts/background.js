(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'; // this import should come first because it modifies the chromium api

require("chrome-extension-async");

var _v = _interopRequireDefault(require("uuid/v4"));

var _tab2 = _interopRequireDefault(require("./tab"));

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function prettyPrint(obj) {
  return JSON.stringify(obj, null, '\t');
}

chrome.runtime.onInstalled.addListener(handleRuntimeOnInstalled);
chrome.runtime.onStartup.addListener(handleRuntimeOnStartup);
chrome.storage.onChanged.addListener(handleStorageOnChanged);
chrome.tabs.onCreated.addListener(handleTabEvent);
chrome.tabs.onUpdated.addListener(handleTabEvent);
chrome.tabs.onMoved.addListener(handleTabEvent);
chrome.tabs.onRemoved.addListener(handleTabEvent);
chrome.tabs.onReplaced.addListener(handleTabEvent); // TODO: include information about windows, create proxy maps between window ids and match based on similarity
// chrome.tabs.onAttached
// chrome.tabs.onDetached
// chrome.tabs.onHighlighted

var clientId = null;

function handleRuntimeOnInstalled(details) {
  console.log("Installed new version. previousVersion = ".concat(details.previousVersion));
  clientId = clientId || (0, _v["default"])();
}

function handleRuntimeOnStartup() {
  clientId = clientId || (0, _v["default"])(); // noinspection JSIgnoredPromiseFromCall

  mergeStatesByTimestamp();
}

function handleStorageOnChanged(changes, areaName) {
  if (areaName !== 'sync') return;
  if (changes && changes.clientId && changes.clientId === clientId) return; // noinspection JSIgnoredPromiseFromCall

  setRemoteStateFromLocal();
}

function handleTabEvent(tab) {
  // noinspection JSIgnoredPromiseFromCall
  setRemoteStateFromLocal();
}

function setRemoteStateFromLocal() {
  return _setRemoteStateFromLocal.apply(this, arguments);
}

function _setRemoteStateFromLocal() {
  _setRemoteStateFromLocal = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var localState;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getLocalState();

          case 2:
            localState = _context.sent;
            _context.next = 5;
            return setRemoteState(localState);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _setRemoteStateFromLocal.apply(this, arguments);
}

function mergeStatesByTimestamp() {
  return _mergeStatesByTimestamp.apply(this, arguments);
}

function _mergeStatesByTimestamp() {
  _mergeStatesByTimestamp = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var localState, remoteState;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getLocalState();

          case 2:
            localState = _context2.sent;
            _context2.next = 5;
            return getRemoteState();

          case 5:
            remoteState = _context2.sent;

            if (remoteState instanceof _state["default"]) {
              _context2.next = 11;
              break;
            }

            console.log("remoteState does not exist, overwriting: localState = ".concat(prettyPrint(localState)));
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

            console.log("overwriting remote state to merge: localState = ".concat(prettyPrint(localState), ", remoteState = ").concat(prettyPrint(remoteState)));
            _context2.next = 18;
            return setRemoteState(localState);

          case 18:
            _context2.next = 23;
            break;

          case 20:
            console.log("overwriting local state to merge: localState = ".concat(prettyPrint(localState), ", remoteState = ").concat(prettyPrint(remoteState)));
            _context2.next = 23;
            return setLocalState(remoteState);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _mergeStatesByTimestamp.apply(this, arguments);
}

function getLocalState() {
  return _getLocalState.apply(this, arguments);
}

function _getLocalState() {
  _getLocalState = _asyncToGenerator(
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
            localState = new _state["default"](clientId, Date.now(), tabs.map(_tab2["default"].fromObject));
            console.log("created local state: localState = ".concat(prettyPrint(localState)));
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
  return _getLocalState.apply(this, arguments);
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
            _context4.t0 = _state["default"];
            _context4.next = 3;
            return chrome.storage.sync.get(_state["default"].properties);

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

function setLocalState(_x) {
  return _setLocalState.apply(this, arguments);
}

function _setLocalState() {
  _setLocalState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(remoteState) {
    var localState, remoteUrls, localUrls, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tab, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _tab;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getLocalState();

          case 2:
            localState = _context5.sent;
            console.log("setting local state from remote: remoteState = ".concat(prettyPrint(remoteState)));
            _context5.next = 6;
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
  return _setLocalState.apply(this, arguments);
}

function setRemoteState(_x2) {
  return _setRemoteState.apply(this, arguments);
}

function _setRemoteState() {
  _setRemoteState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(localState) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("setting remote state from local: localState = ".concat(prettyPrint(localState)));
            _context6.next = 3;
            return chrome.storage.sync.set(localState.toObject());

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _setRemoteState.apply(this, arguments);
}

},{"./state":2,"./tab":3,"chrome-extension-async":4,"uuid/v4":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tab = _interopRequireDefault(require("./tab"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STATE_PROPERTIES = new Set(['clientId', 'tabs', 'timestamp']);

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
    var clientId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var tabs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, State);

    this.clientId = clientId;
    this.timestamp = timestamp;
    this.tabs = tabs;
  }

  _createClass(State, [{
    key: "toObject",
    value: function toObject() {
      return {
        clientId: this.clientId,
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
      if (!(object && object.hasOwnProperty('clientId') && object.hasOwnProperty('timestamp') && object.hasOwnProperty('tabs'))) return null;
      return new State(object.clientId, object.timestamp, object.tabs.map(_tab["default"].fromObject));
    }
  }]);

  return State;
}();

exports["default"] = State;

},{"./tab":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TAB_SYNC_PROPERTIES = new Set(['index', 'url', 'active', 'pinned']);

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

exports["default"] = Tab;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;

},{}],6:[function(require,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],7:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":5,"./lib/rng":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy5iYWJlbC9iYWNrZ3JvdW5kLmpzIiwiYXBwL3NjcmlwdHMuYmFiZWwvc3RhdGUuanMiLCJhcHAvc2NyaXB0cy5iYWJlbC90YWIuanMiLCJub2RlX21vZHVsZXMvY2hyb21lLWV4dGVuc2lvbi1hc3luYy9jaHJvbWUtZXh0ZW5zaW9uLWFzeW5jLmpzIiwibm9kZV9tb2R1bGVzL3V1aWQvbGliL2J5dGVzVG9VdWlkLmpzIiwibm9kZV9tb2R1bGVzL3V1aWQvbGliL3JuZy1icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V1aWQvdjQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxhLENBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBUyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQ3hCLFNBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxHQUFmLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQVA7QUFDRDs7QUFFRCxNQUFNLENBQUMsT0FBUCxDQUFlLFdBQWYsQ0FBMkIsV0FBM0IsQ0FBdUMsd0JBQXZDO0FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxTQUFmLENBQXlCLFdBQXpCLENBQXFDLHNCQUFyQztBQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixDQUF5QixXQUF6QixDQUFxQyxzQkFBckM7QUFFQSxNQUFNLENBQUMsSUFBUCxDQUFZLFNBQVosQ0FBc0IsV0FBdEIsQ0FBa0MsY0FBbEM7QUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLFNBQVosQ0FBc0IsV0FBdEIsQ0FBa0MsY0FBbEM7QUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosQ0FBb0IsV0FBcEIsQ0FBZ0MsY0FBaEM7QUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLFNBQVosQ0FBc0IsV0FBdEIsQ0FBa0MsY0FBbEM7QUFDQSxNQUFNLENBQUMsSUFBUCxD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbi8vIHRoaXMgaW1wb3J0IHNob3VsZCBjb21lIGZpcnN0IGJlY2F1c2UgaXQgbW9kaWZpZXMgdGhlIGNocm9taXVtIGFwaVxuaW1wb3J0ICdjaHJvbWUtZXh0ZW5zaW9uLWFzeW5jJztcbmltcG9ydCB1dWlkNCBmcm9tICd1dWlkL3Y0JztcbmltcG9ydCBUYWIgZnJvbSAnLi90YWInO1xuaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUnO1xuXG5mdW5jdGlvbiBwcmV0dHlQcmludChvYmopIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgbnVsbCwgJ1xcdCcpO1xufVxuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihoYW5kbGVSdW50aW1lT25JbnN0YWxsZWQpO1xuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwLmFkZExpc3RlbmVyKGhhbmRsZVJ1bnRpbWVPblN0YXJ0dXApO1xuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoaGFuZGxlU3RvcmFnZU9uQ2hhbmdlZCk7XG5cbmNocm9tZS50YWJzLm9uQ3JlYXRlZC5hZGRMaXN0ZW5lcihoYW5kbGVUYWJFdmVudCk7XG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoaGFuZGxlVGFiRXZlbnQpO1xuY2hyb21lLnRhYnMub25Nb3ZlZC5hZGRMaXN0ZW5lcihoYW5kbGVUYWJFdmVudCk7XG5jaHJvbWUudGFicy5vblJlbW92ZWQuYWRkTGlzdGVuZXIoaGFuZGxlVGFiRXZlbnQpO1xuY2hyb21lLnRhYnMub25SZXBsYWNlZC5hZGRMaXN0ZW5lcihoYW5kbGVUYWJFdmVudCk7XG5cbi8vIFRPRE86IGluY2x1ZGUgaW5mb3JtYXRpb24gYWJvdXQgd2luZG93cywgY3JlYXRlIHByb3h5IG1hcHMgYmV0d2VlbiB3aW5kb3cgaWRzIGFuZCBtYXRjaCBiYXNlZCBvbiBzaW1pbGFyaXR5XG4vLyBjaHJvbWUudGFicy5vbkF0dGFjaGVkXG4vLyBjaHJvbWUudGFicy5vbkRldGFjaGVkXG4vLyBjaHJvbWUudGFicy5vbkhpZ2hsaWdodGVkXG5cbmxldCBjbGllbnRJZCA9IG51bGw7XG5cbmZ1bmN0aW9uIGhhbmRsZVJ1bnRpbWVPbkluc3RhbGxlZChkZXRhaWxzKSB7XG4gIGNvbnNvbGUubG9nKGBJbnN0YWxsZWQgbmV3IHZlcnNpb24uIHByZXZpb3VzVmVyc2lvbiA9ICR7ZGV0YWlscy5wcmV2aW91c1ZlcnNpb259YCk7XG4gIGNsaWVudElkID0gY2xpZW50SWQgfHwgdXVpZDQoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUnVudGltZU9uU3RhcnR1cCgpIHtcbiAgY2xpZW50SWQgPSBjbGllbnRJZCB8fCB1dWlkNCgpO1xuICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gIG1lcmdlU3RhdGVzQnlUaW1lc3RhbXAoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU3RvcmFnZU9uQ2hhbmdlZChjaGFuZ2VzLCBhcmVhTmFtZSkge1xuICBpZiAoYXJlYU5hbWUgIT09ICdzeW5jJykgcmV0dXJuO1xuICBpZiAoY2hhbmdlcyAmJiBjaGFuZ2VzLmNsaWVudElkICYmIGNoYW5nZXMuY2xpZW50SWQgPT09IGNsaWVudElkKSByZXR1cm47XG4gIC8vIG5vaW5zcGVjdGlvbiBKU0lnbm9yZWRQcm9taXNlRnJvbUNhbGxcbiAgc2V0UmVtb3RlU3RhdGVGcm9tTG9jYWwoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlVGFiRXZlbnQodGFiKSB7XG4gIC8vIG5vaW5zcGVjdGlvbiBKU0lnbm9yZWRQcm9taXNlRnJvbUNhbGxcbiAgc2V0UmVtb3RlU3RhdGVGcm9tTG9jYWwoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0UmVtb3RlU3RhdGVGcm9tTG9jYWwoKSB7XG4gIGxldCBsb2NhbFN0YXRlID0gYXdhaXQgZ2V0TG9jYWxTdGF0ZSgpO1xuICBhd2FpdCBzZXRSZW1vdGVTdGF0ZShsb2NhbFN0YXRlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbWVyZ2VTdGF0ZXNCeVRpbWVzdGFtcCgpIHtcbiAgbGV0IGxvY2FsU3RhdGUgPSBhd2FpdCBnZXRMb2NhbFN0YXRlKCk7XG4gIGxldCByZW1vdGVTdGF0ZSA9IGF3YWl0IGdldFJlbW90ZVN0YXRlKCk7XG5cbiAgaWYgKCEocmVtb3RlU3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSkpIHtcbiAgICBjb25zb2xlLmxvZyhgcmVtb3RlU3RhdGUgZG9lcyBub3QgZXhpc3QsIG92ZXJ3cml0aW5nOiBsb2NhbFN0YXRlID0gJHtwcmV0dHlQcmludChsb2NhbFN0YXRlKX1gKTtcbiAgICBhd2FpdCBzZXRSZW1vdGVTdGF0ZShsb2NhbFN0YXRlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocmVtb3RlU3RhdGUudXJscyA9PT0gbG9jYWxTdGF0ZS51cmxzKSB7XG4gICAgY29uc29sZS5sb2coYHJlbW90ZSBhbmQgbG9jYWwgdXJscyBhcmUgdGhlIHNhbWUsIG5vLW9wOiByZW1vdGVVcmxzID0gJHtyZW1vdGVTdGF0ZS51cmxzfSwgbG9jYWxVcmxzID0gJHtsb2NhbFN0YXRlLnVybHN9YCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHJlbW90ZVN0YXRlLnRpbWVzdGFtcCA8IGxvY2FsU3RhdGUudGltZXN0YW1wKSB7XG4gICAgY29uc29sZS5sb2coYG92ZXJ3cml0aW5nIHJlbW90ZSBzdGF0ZSB0byBtZXJnZTogbG9jYWxTdGF0ZSA9ICR7cHJldHR5UHJpbnQobG9jYWxTdGF0ZSl9LCByZW1vdGVTdGF0ZSA9ICR7cHJldHR5UHJpbnQocmVtb3RlU3RhdGUpfWApO1xuICAgIGF3YWl0IHNldFJlbW90ZVN0YXRlKGxvY2FsU3RhdGUpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKGBvdmVyd3JpdGluZyBsb2NhbCBzdGF0ZSB0byBtZXJnZTogbG9jYWxTdGF0ZSA9ICR7cHJldHR5UHJpbnQobG9jYWxTdGF0ZSl9LCByZW1vdGVTdGF0ZSA9ICR7cHJldHR5UHJpbnQocmVtb3RlU3RhdGUpfWApO1xuICAgIGF3YWl0IHNldExvY2FsU3RhdGUocmVtb3RlU3RhdGUpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldExvY2FsU3RhdGUoKSB7XG4gIC8vIFRPRE86IGZpbGwgaW4gcXVlcnlJbmZvXG4gIGxldCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe30pO1xuICBsZXQgbG9jYWxTdGF0ZSA9IG5ldyBTdGF0ZShcbiAgICBjbGllbnRJZCxcbiAgICBEYXRlLm5vdygpLFxuICAgIHRhYnMubWFwKFRhYi5mcm9tT2JqZWN0KSxcbiAgKTtcblxuICBjb25zb2xlLmxvZyhgY3JlYXRlZCBsb2NhbCBzdGF0ZTogbG9jYWxTdGF0ZSA9ICR7cHJldHR5UHJpbnQobG9jYWxTdGF0ZSl9YCk7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChsb2NhbFN0YXRlLnRvT2JqZWN0KCkpO1xuICByZXR1cm4gbG9jYWxTdGF0ZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVtb3RlU3RhdGUoKSB7XG4gIHJldHVybiBTdGF0ZS5mcm9tT2JqZWN0KGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFN0YXRlLnByb3BlcnRpZXMpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0TG9jYWxTdGF0ZShyZW1vdGVTdGF0ZSkge1xuICBsZXQgbG9jYWxTdGF0ZSA9IGF3YWl0IGdldExvY2FsU3RhdGUoKTtcblxuICBjb25zb2xlLmxvZyhgc2V0dGluZyBsb2NhbCBzdGF0ZSBmcm9tIHJlbW90ZTogcmVtb3RlU3RhdGUgPSAke3ByZXR0eVByaW50KHJlbW90ZVN0YXRlKX1gKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHJlbW90ZVN0YXRlLnRvT2JqZWN0KCkpO1xuXG4gIGxldCByZW1vdGVVcmxzID0gbmV3IFNldChyZW1vdGVTdGF0ZS50YWJzLm1hcCgodGFiKSA9PiB0YWIudXJsKSk7XG4gIGxldCBsb2NhbFVybHMgPSBuZXcgU2V0KGxvY2FsU3RhdGUudGFicy5tYXAoKHRhYikgPT4gdGFiLnVybCkpO1xuXG4gIGZvciAobGV0IHRhYiBvZiBsb2NhbFN0YXRlLnRhYnMpIHtcbiAgICBpZiAoIXJlbW90ZVVybHMuaGFzKHRhYi51cmwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhgcmVtb3ZpbmcgbG9jYWwgdGFiOiB0YWJVcmwgPSAke3RhYi51cmx9YCk7XG4gICAgICBhd2FpdCBjaHJvbWUudGFicy5yZW1vdmUodGFiLmlkKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCB0YWIgb2YgcmVtb3RlU3RhdGUudGFicykge1xuICAgIGlmICghbG9jYWxVcmxzLmhhcyh0YWIudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coYGNyZWF0aW5nIGxvY2FsIHRhYjogdGFiVXJsID0gJHt0YWIudXJsfWApO1xuICAgICAgYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHtcbiAgICAgICAgaW5kZXg6IHRhYi5pbmRleCxcbiAgICAgICAgdXJsOiB0YWIudXJsLFxuICAgICAgICBhY3RpdmU6IHRhYi5hY3RpdmUsXG4gICAgICAgIHBpbm5lZDogdGFiLnBpbm5lZCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRSZW1vdGVTdGF0ZShsb2NhbFN0YXRlKSB7XG4gIGNvbnNvbGUubG9nKGBzZXR0aW5nIHJlbW90ZSBzdGF0ZSBmcm9tIGxvY2FsOiBsb2NhbFN0YXRlID0gJHtwcmV0dHlQcmludChsb2NhbFN0YXRlKX1gKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQobG9jYWxTdGF0ZS50b09iamVjdCgpKTtcbn1cbiIsImltcG9ydCBUYWIgZnJvbSAnLi90YWInO1xuXG5jb25zdCBTVEFURV9QUk9QRVJUSUVTID0gbmV3IFNldChbJ2NsaWVudElkJywgJ3RhYnMnLCAndGltZXN0YW1wJ10pO1xuXG5jbGFzcyBTdGF0ZSB7XG5cbiAgc3RhdGljIGdldCBwcm9wZXJ0aWVzKCkge1xuICAgIHJldHVybiBTVEFURV9QUk9QRVJUSUVTO1xuICB9XG5cbiAgY29uc3RydWN0b3IoY2xpZW50SWQgPSBudWxsLCB0aW1lc3RhbXAgPSAwLCB0YWJzID0gW10pIHtcbiAgICB0aGlzLmNsaWVudElkID0gY2xpZW50SWQ7XG4gICAgdGhpcy50aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgdGhpcy50YWJzID0gdGFicztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tT2JqZWN0KG9iamVjdCkge1xuICAgIGlmICghKG9iamVjdFxuICAgICAgJiYgb2JqZWN0Lmhhc093blByb3BlcnR5KCdjbGllbnRJZCcpXG4gICAgICAmJiBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3RpbWVzdGFtcCcpXG4gICAgICAmJiBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3RhYnMnKSkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBuZXcgU3RhdGUob2JqZWN0LmNsaWVudElkLCBvYmplY3QudGltZXN0YW1wLCBvYmplY3QudGFicy5tYXAoVGFiLmZyb21PYmplY3QpKTtcbiAgfVxuXG4gIHRvT2JqZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGllbnRJZDogdGhpcy5jbGllbnRJZCxcbiAgICAgIHRpbWVzdGFtcDogdGhpcy50aW1lc3RhbXAsXG4gICAgICB0YWJzOiB0aGlzLnRhYnMubWFwKCh0YWIpID0+IHRhYi50b09iamVjdCgpKSxcbiAgICB9XG4gIH1cblxuICBnZXQgdXJscygpIHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzLnRhYnMubWFwKCh0YWIpID0+IHRhYi51cmwpKVxuICB9XG59XG5cbmV4cG9ydCB7IFN0YXRlIGFzIGRlZmF1bHQgfTtcbiIsIlxuY29uc3QgVEFCX1NZTkNfUFJPUEVSVElFUyA9IG5ldyBTZXQoWydpbmRleCcsICd1cmwnLCAnYWN0aXZlJywgJ3Bpbm5lZCddKTtcblxuY2xhc3MgVGFiIHtcblxuICBzdGF0aWMgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgcmV0dXJuIFRBQl9TWU5DX1BST1BFUlRJRVM7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihpbmRleCwgdXJsLCBhY3RpdmUsIHBpbm5lZCkge1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLmFjdGl2ZSA9IGFjdGl2ZTtcbiAgICB0aGlzLnBpbm5lZCA9IHBpbm5lZDtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tT2JqZWN0KG9iamVjdCkge1xuICAgIGlmICghKG9iamVjdCAmJlxuICAgICAgb2JqZWN0Lmhhc093blByb3BlcnR5KCdpbmRleCcpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3VybCcpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ2FjdGl2ZScpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3Bpbm5lZCcpKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIG5ldyBUYWIob2JqZWN0LmluZGV4LCBvYmplY3QudXJsLCBvYmplY3QuYWN0aXZlLCBvYmplY3QucGlubmVkKTtcbiAgfVxuXG4gIHRvT2JqZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICBhY3RpdmU6IHRoaXMuYWN0aXZlLFxuICAgICAgcGlubmVkOiB0aGlzLnBpbm5lZCxcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgVGFiIGFzIGRlZmF1bHQgfTtcbiIsIi8qKiBXcmFwIGFuIEFQSSB0aGF0IHVzZXMgY2FsbGJhY2tzIHdpdGggUHJvbWlzZXNcclxuICogVGhpcyBleHBlY3RzIHRoZSBwYXR0ZXJuIGZ1bmN0aW9uIHdpdGhDYWxsYmFjayhhcmcxLCBhcmcyLCAuLi4gYXJnTiwgY2FsbGJhY2spXHJcbiAqIEBhdXRob3IgS2VpdGggSGVucnkgPGtlaXRoLmhlbnJ5QGV2b2x1dGlvbmpvYnMuY28udWs+XHJcbiAqIEBsaWNlbnNlIE1JVCAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qKiBXcmFwIGEgZnVuY3Rpb24gd2l0aCBhIGNhbGxiYWNrIHdpdGggYSBQcm9taXNlLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZiBUaGUgZnVuY3Rpb24gdG8gd3JhcCwgc2hvdWxkIGJlIHBhdHRlcm46IHdpdGhDYWxsYmFjayhhcmcxLCBhcmcyLCAuLi4gYXJnTiwgY2FsbGJhY2spLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcGFyc2VDQiBPcHRpb25hbCBmdW5jdGlvbiB0byBwYXJzZSBtdWx0aXBsZSBjYWxsYmFjayBwYXJhbWV0ZXJzIGludG8gYSBzaW5nbGUgb2JqZWN0LlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBjYWxsYmFjayBmaXJlcy4gKi9cclxuICAgIGZ1bmN0aW9uIHByb21pc2lmeShmLCBwYXJzZUNCKSB7XHJcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzYWZlQXJncyA9IGFyZ3M7XHJcbiAgICAgICAgICAgIGxldCBjYWxsYmFjaztcclxuICAgICAgICAgICAgLy8gVGhlIENocm9tZSBBUEkgZnVuY3Rpb25zIGFsbCB1c2UgYXJndW1lbnRzLCBzbyB3ZSBjYW4ndCB1c2UgZi5sZW5ndGggdG8gY2hlY2tcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgbGFzdCBhcmdcclxuICAgICAgICAgICAgaWYgKGFyZ3MgJiYgYXJncy5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gLi4uIGFuZCB0aGUgbGFzdCBhcmcgaXMgYSBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdCA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbGFzdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyaW0gdGhlIGxhc3QgY2FsbGJhY2sgYXJnIGlmIGl0J3MgYmVlbiBwYXNzZWRcclxuICAgICAgICAgICAgICAgICAgICBzYWZlQXJncyA9IGFyZ3Muc2xpY2UoMCwgYXJncy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGxhc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHRvIHJ1biB0aGUgb3JpZ2luYWwgZnVuY3Rpb24sIHdpdGggdGhlIHRyaW1tZWQgYXJncyBsaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgZiguLi5zYWZlQXJncywgKC4uLmNiQXJncykgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBjYWxsYmFjayB3YXMgcGFzc2VkIGF0IHRoZSBlbmQgb2YgdGhlIG9yaWdpbmFsIGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGFsbG93IGEgYnVnIGluIHRoZSBjYWxsYmFjayB0byBzdG9wIHRoZSBwcm9taXNlIHJlc29sdmluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHsgY2FsbGJhY2soLi4uY2JBcmdzKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGNiRXJyKSB7IHJlamVjdChjYkVycik7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIGV4dGVuc2lvbnMgYWx3YXlzIGZpcmUgdGhlIGNhbGxiYWNrLCBidXQgcG9wdWxhdGUgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yIHdpdGggZXhjZXB0aW9uIGRldGFpbHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiBhcyBhbiBlcnJvciBmb3IgdGhlIGF3YWl0ZWQgY2F0Y2ggYmxvY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgfHwgYEVycm9yIHRocm93biBieSBBUEkgJHtjaHJvbWUucnVudGltZS5sYXN0RXJyb3J9YCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUNCKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2JPYmogPSBwYXJzZUNCKC4uLmNiQXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYk9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghY2JBcmdzIHx8IGNiQXJncy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2JBcmdzLmxlbmd0aCA9PT0gMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNiQXJnc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYkFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7IHJlamVjdChlcnIpOyB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogUHJvbWlzaWZ5IGFsbCB0aGUga25vd24gZnVuY3Rpb25zIGluIHRoZSBtYXAgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYXBpIFRoZSBDaHJvbWUgbmF0aXZlIEFQSSB0byBleHRlbmRcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFwaU1hcCBDb2xsZWN0aW9uIG9mIHN1Yi1BUEkgYW5kIGZ1bmN0aW9ucyB0byBwcm9taXNpZnkgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5TWFwKGFwaSwgYXBpTWFwKSB7XHJcbiAgICAgICAgaWYgKCFhcGkpXHJcbiAgICAgICAgICAgIC8vIE5vdCBzdXBwb3J0ZWQgYnkgY3VycmVudCBwZXJtaXNzaW9uc1xyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAobGV0IGZ1bmNEZWYgb2YgYXBpTWFwKSB7XHJcbiAgICAgICAgICAgIGxldCBmdW5jTmFtZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jRGVmID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lID0gZnVuY0RlZjtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jTmFtZSA9IGZ1bmNEZWYubjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFhcGkuaGFzT3duUHJvcGVydHkoZnVuY05hbWUpKVxyXG4gICAgICAgICAgICAgICAgLy8gTWVtYmVyIG5vdCBpbiBBUElcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbSA9IGFwaVtmdW5jTmFtZV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBmdW5jdGlvbiwgd3JhcCBpbiBhIHByb21pc2VcclxuICAgICAgICAgICAgICAgIGFwaVtmdW5jTmFtZV0gPSBwcm9taXNpZnkobS5iaW5kKGFwaSksIGZ1bmNEZWYuY2IpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAvLyBTdWItQVBJLCByZWN1cnNlIHRoaXMgZnVuYyB3aXRoIHRoZSBtYXBwZWQgcHJvcHNcclxuICAgICAgICAgICAgICAgIGFwcGx5TWFwKG0sIGZ1bmNEZWYucHJvcHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQXBwbHkgcHJvbWlzZS1tYXBzIHRvIHRoZSBDaHJvbWUgbmF0aXZlIEFQSS5cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhcGlNYXBzIFRoZSBBUEkgdG8gYXBwbHkuICovXHJcbiAgICBmdW5jdGlvbiBhcHBseU1hcHMoYXBpTWFwcykge1xyXG4gICAgICAgIGZvciAobGV0IGFwaU5hbWUgaW4gYXBpTWFwcykge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja0FwaSA9IGNocm9tZVthcGlOYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjYWxsYmFja0FwaSlcclxuICAgICAgICAgICAgICAgIC8vIE5vdCBzdXBwb3J0ZWQgYnkgY3VycmVudCBwZXJtaXNzaW9uc1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhcGlNYXAgPSBhcGlNYXBzW2FwaU5hbWVdO1xyXG4gICAgICAgICAgICBhcHBseU1hcChjYWxsYmFja0FwaSwgYXBpTWFwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWNjZXNzaWJpbGl0eUZlYXR1cmVzIGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9hY2Nlc3NpYmlsaXR5RmVhdHVyZXNcclxuICAgIGNvbnN0IGtub3duQTExeVNldHRpbmcgPSBbJ2dldCcsICdzZXQnLCAnY2xlYXInXTtcclxuXHJcbiAgICAvLyBDb250ZW50U2V0dGluZyBodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvY29udGVudFNldHRpbmdzI3R5cGUtQ29udGVudFNldHRpbmdcclxuICAgIGNvbnN0IGtub3duSW5Db250ZW50U2V0dGluZyA9IFsnY2xlYXInLCAnZ2V0JywgJ3NldCcsICdnZXRSZXNvdXJjZUlkZW50aWZpZXJzJ107XHJcblxyXG4gICAgLy8gU3RvcmFnZUFyZWEgaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3N0b3JhZ2UjdHlwZS1TdG9yYWdlQXJlYVxyXG4gICAgY29uc3Qga25vd25JblN0b3JhZ2VBcmVhID0gWydnZXQnLCAnZ2V0Qnl0ZXNJblVzZScsICdzZXQnLCAncmVtb3ZlJywgJ2NsZWFyJ107XHJcblxyXG4gICAgLyoqIE1hcCBvZiBBUEkgZnVuY3Rpb25zIHRoYXQgZm9sbG93IHRoZSBjYWxsYmFjayBwYXR0ZXJuIHRoYXQgd2UgY2FuICdwcm9taXNpZnknICovXHJcbiAgICBhcHBseU1hcHMoe1xyXG4gICAgICAgIGFjY2Vzc2liaWxpdHlGZWF0dXJlczogWyAgLy8gVG9kbzogdGhpcyBzaG91bGQgZXh0ZW5kIEFjY2Vzc2liaWxpdHlGZWF0dXJlc1NldHRpbmcucHJvdG90eXBlIGluc3RlYWRcclxuICAgICAgICAgICAgeyBuOiAnc3Bva2VuRmVlZGJhY2snLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdsYXJnZUN1cnNvcicsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3N0aWNreUtleXMnLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdoaWdoQ29udHJhc3QnLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdzY3JlZW5NYWduaWZpZXInLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdhdXRvY2xpY2snLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICd2aXJ0dWFsS2V5Ym9hcmQnLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdhbmltYXRpb25Qb2xpY3knLCBwcm9wczoga25vd25BMTF5U2V0dGluZyB9XSxcclxuICAgICAgICBhbGFybXM6IFsnZ2V0JywgJ2dldEFsbCcsICdjbGVhcicsICdjbGVhckFsbCddLFxyXG4gICAgICAgIGJvb2ttYXJrczogW1xyXG4gICAgICAgICAgICAnZ2V0JywgJ2dldENoaWxkcmVuJywgJ2dldFJlY2VudCcsICdnZXRUcmVlJywgJ2dldFN1YlRyZWUnLFxyXG4gICAgICAgICAgICAnc2VhcmNoJywgJ2NyZWF0ZScsICdtb3ZlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAncmVtb3ZlVHJlZSddLFxyXG4gICAgICAgIGJyb3dzZXI6IFsnb3BlblRhYiddLFxyXG4gICAgICAgIGJyb3dzZXJBY3Rpb246IFtcclxuICAgICAgICAgICAgJ2dldFRpdGxlJywgJ3NldEljb24nLCAnZ2V0UG9wdXAnLCAnZ2V0QmFkZ2VUZXh0JywgJ2dldEJhZGdlQmFja2dyb3VuZENvbG9yJ10sXHJcbiAgICAgICAgYnJvd3NpbmdEYXRhOiBbXHJcbiAgICAgICAgICAgICdzZXR0aW5ncycsICdyZW1vdmUnLCAncmVtb3ZlQXBwY2FjaGUnLCAncmVtb3ZlQ2FjaGUnLFxyXG4gICAgICAgICAgICAncmVtb3ZlQ29va2llcycsICdyZW1vdmVEb3dubG9hZHMnLCAncmVtb3ZlRmlsZVN5c3RlbXMnLFxyXG4gICAgICAgICAgICAncmVtb3ZlRm9ybURhdGEnLCAncmVtb3ZlSGlzdG9yeScsICdyZW1vdmVJbmRleGVkREInLFxyXG4gICAgICAgICAgICAncmVtb3ZlTG9jYWxTdG9yYWdlJywgJ3JlbW92ZVBsdWdpbkRhdGEnLCAncmVtb3ZlUGFzc3dvcmRzJyxcclxuICAgICAgICAgICAgJ3JlbW92ZVdlYlNRTCddLFxyXG4gICAgICAgIGNvbW1hbmRzOiBbJ2dldEFsbCddLFxyXG4gICAgICAgIGNvbnRlbnRTZXR0aW5nczogWyAgLy8gVG9kbzogdGhpcyBzaG91bGQgZXh0ZW5kIENvbnRlbnRTZXR0aW5nLnByb3RvdHlwZSBpbnN0ZWFkXHJcbiAgICAgICAgICAgIHsgbjogJ2Nvb2tpZXMnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2ltYWdlcycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnamF2YXNjcmlwdCcsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnbG9jYXRpb24nLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3BsdWdpbnMnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3BvcHVwcycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnbm90aWZpY2F0aW9ucycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnZnVsbHNjcmVlbicsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnbW91c2Vsb2NrJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdtaWNyb3Bob25lJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdjYW1lcmEnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3Vuc2FuZGJveGVkUGx1Z2lucycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnYXV0b21hdGljRG93bmxvYWRzJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9XSxcclxuICAgICAgICBjb250ZXh0TWVudXM6IFsnY3JlYXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAncmVtb3ZlQWxsJ10sXHJcbiAgICAgICAgY29va2llczogWydnZXQnLCAnZ2V0QWxsJywgJ3NldCcsICdyZW1vdmUnLCAnZ2V0QWxsQ29va2llU3RvcmVzJ10sXHJcbiAgICAgICAgZGVidWdnZXI6IFsnYXR0YWNoJywgJ2RldGFjaCcsICdzZW5kQ29tbWFuZCcsICdnZXRUYXJnZXRzJ10sXHJcbiAgICAgICAgZGVza3RvcENhcHR1cmU6IFsnY2hvb3NlRGVza3RvcE1lZGlhJ10sXHJcbiAgICAgICAgLy8gVE9ETzogZGV2dG9vbHMuKlxyXG4gICAgICAgIGRvY3VtZW50U2NhbjogWydzY2FuJ10sXHJcbiAgICAgICAgZG93bmxvYWRzOiBbXHJcbiAgICAgICAgICAgICdkb3dubG9hZCcsICdzZWFyY2gnLCAncGF1c2UnLCAncmVzdW1lJywgJ2NhbmNlbCcsXHJcbiAgICAgICAgICAgICdnZXRGaWxlSWNvbicsICdlcmFzZScsICdyZW1vdmVGaWxlJywgJ2FjY2VwdERhbmdlciddLFxyXG4gICAgICAgIGVudGVycHJpc2U6IFt7IG46ICdwbGF0Zm9ybUtleXMnLCBwcm9wczogWydnZXRUb2tlbicsICdnZXRDZXJ0aWZpY2F0ZXMnLCAnaW1wb3J0Q2VydGlmaWNhdGUnLCAncmVtb3ZlQ2VydGlmaWNhdGUnXSB9XSxcclxuICAgICAgICBleHRlbnNpb246IFsnaXNBbGxvd2VkSW5jb2duaXRvQWNjZXNzJywgJ2lzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3MnXSwgLy8gbW9zdGx5IGRlcHJlY2F0ZWQgaW4gZmF2b3VyIG9mIHJ1bnRpbWVcclxuICAgICAgICBmaWxlQnJvd3NlckhhbmRsZXI6IFsnc2VsZWN0RmlsZSddLFxyXG4gICAgICAgIGZpbGVTeXN0ZW1Qcm92aWRlcjogWydtb3VudCcsICd1bm1vdW50JywgJ2dldEFsbCcsICdnZXQnLCAnbm90aWZ5J10sXHJcbiAgICAgICAgZm9udFNldHRpbmdzOiBbXHJcbiAgICAgICAgICAgICdzZXREZWZhdWx0Rm9udFNpemUnLCAnZ2V0Rm9udCcsICdnZXREZWZhdWx0Rm9udFNpemUnLCAnZ2V0TWluaW11bUZvbnRTaXplJyxcclxuICAgICAgICAgICAgJ3NldE1pbmltdW1Gb250U2l6ZScsICdnZXREZWZhdWx0Rml4ZWRGb250U2l6ZScsICdjbGVhckRlZmF1bHRGb250U2l6ZScsXHJcbiAgICAgICAgICAgICdzZXREZWZhdWx0Rml4ZWRGb250U2l6ZScsICdjbGVhckZvbnQnLCAnc2V0Rm9udCcsICdjbGVhck1pbmltdW1Gb250U2l6ZScsXHJcbiAgICAgICAgICAgICdnZXRGb250TGlzdCcsICdjbGVhckRlZmF1bHRGaXhlZEZvbnRTaXplJ10sXHJcbiAgICAgICAgZ2NtOiBbJ3JlZ2lzdGVyJywgJ3VucmVnaXN0ZXInLCAnc2VuZCddLFxyXG4gICAgICAgIGhpc3Rvcnk6IFsnc2VhcmNoJywgJ2dldFZpc2l0cycsICdhZGRVcmwnLCAnZGVsZXRlVXJsJywgJ2RlbGV0ZVJhbmdlJywgJ2RlbGV0ZUFsbCddLFxyXG4gICAgICAgIGkxOG46IFsnZ2V0QWNjZXB0TGFuZ3VhZ2VzJywgJ2RldGVjdExhbmd1YWdlJ10sXHJcbiAgICAgICAgaWRlbnRpdHk6IFtcclxuICAgICAgICAgICAgJ2dldEF1dGhUb2tlbicsICdnZXRQcm9maWxlVXNlckluZm8nLCAncmVtb3ZlQ2FjaGVkQXV0aFRva2VuJywgJ2xhdW5jaFdlYkF1dGhGbG93J10sXHJcbiAgICAgICAgaWRsZTogWydxdWVyeVN0YXRlJ10sXHJcbiAgICAgICAgaW5wdXQ6IFt7XHJcbiAgICAgICAgICAgIG46ICdpbWUnLCBwcm9wczogW1xyXG4gICAgICAgICAgICAgICAgJ3NldE1lbnVJdGVtcycsICdjb21taXRUZXh0JywgJ3NldENhbmRpZGF0ZXMnLCAnc2V0Q29tcG9zaXRpb24nLCAndXBkYXRlTWVudUl0ZW1zJyxcclxuICAgICAgICAgICAgICAgICdzZXRDYW5kaWRhdGVXaW5kb3dQcm9wZXJ0aWVzJywgJ2NsZWFyQ29tcG9zaXRpb24nLCAnc2V0Q3Vyc29yUG9zaXRpb24nLCAnc2VuZEtleUV2ZW50cycsXHJcbiAgICAgICAgICAgICAgICAnZGVsZXRlU3Vycm91bmRpbmdUZXh0J11cclxuICAgICAgICB9XSxcclxuICAgICAgICBtYW5hZ2VtZW50OiBbXHJcbiAgICAgICAgICAgICdzZXRFbmFibGVkJywgJ2dldFBlcm1pc3Npb25XYXJuaW5nc0J5SWQnLCAnZ2V0JywgJ2dldEFsbCcsXHJcbiAgICAgICAgICAgICdnZXRQZXJtaXNzaW9uV2FybmluZ3NCeU1hbmlmZXN0JywgJ2xhdW5jaEFwcCcsICd1bmluc3RhbGwnLCAnZ2V0U2VsZicsXHJcbiAgICAgICAgICAgICd1bmluc3RhbGxTZWxmJywgJ2NyZWF0ZUFwcFNob3J0Y3V0JywgJ3NldExhdW5jaFR5cGUnLCAnZ2VuZXJhdGVBcHBGb3JMaW5rJ10sXHJcbiAgICAgICAgbmV0d29ya2luZzogW3sgbjogJ2NvbmZpZycsIHByb3BzOiBbJ3NldE5ldHdvcmtGaWx0ZXInLCAnZmluaXNoQXV0aGVudGljYXRpb24nXSB9XSxcclxuICAgICAgICBub3RpZmljYXRpb25zOiBbJ2NyZWF0ZScsICd1cGRhdGUnLCAnY2xlYXInLCAnZ2V0QWxsJywgJ2dldFBlcm1pc3Npb25MZXZlbCddLFxyXG4gICAgICAgIHBhZ2VBY3Rpb246IFsnZ2V0VGl0bGUnLCAnc2V0SWNvbicsICdnZXRQb3B1cCddLFxyXG4gICAgICAgIHBhZ2VDYXB0dXJlOiBbJ3NhdmVBc01IVE1MJ10sXHJcbiAgICAgICAgcGVybWlzc2lvbnM6IFsnZ2V0QWxsJywgJ2NvbnRhaW5zJywgJ3JlcXVlc3QnLCAncmVtb3ZlJ10sXHJcbiAgICAgICAgcGxhdGZvcm1LZXlzOiBbJ3NlbGVjdENsaWVudENlcnRpZmljYXRlcycsICd2ZXJpZnlUTFNTZXJ2ZXJDZXJ0aWZpY2F0ZScsXHJcbiAgICAgICAgICAgIHsgbjogXCJnZXRLZXlQYWlyXCIsIGNiOiAocHVibGljS2V5LCBwcml2YXRlS2V5KSA9PiB7IHJldHVybiB7IHB1YmxpY0tleSwgcHJpdmF0ZUtleSB9OyB9IH1dLFxyXG4gICAgICAgIHJ1bnRpbWU6IFtcclxuICAgICAgICAgICAgJ2dldEJhY2tncm91bmRQYWdlJywgJ29wZW5PcHRpb25zUGFnZScsICdzZXRVbmluc3RhbGxVUkwnLFxyXG4gICAgICAgICAgICAncmVzdGFydEFmdGVyRGVsYXknLCAnc2VuZE1lc3NhZ2UnLFxyXG4gICAgICAgICAgICAnc2VuZE5hdGl2ZU1lc3NhZ2UnLCAnZ2V0UGxhdGZvcm1JbmZvJywgJ2dldFBhY2thZ2VEaXJlY3RvcnlFbnRyeScsXHJcbiAgICAgICAgICAgIHsgbjogXCJyZXF1ZXN0VXBkYXRlQ2hlY2tcIiwgY2I6IChzdGF0dXMsIGRldGFpbHMpID0+IHsgcmV0dXJuIHsgc3RhdHVzLCBkZXRhaWxzIH07IH0gfV0sXHJcbiAgICAgICAgc2NyaXB0QmFkZ2U6IFsnZ2V0UG9wdXAnXSxcclxuICAgICAgICBzZXNzaW9uczogWydnZXRSZWNlbnRseUNsb3NlZCcsICdnZXREZXZpY2VzJywgJ3Jlc3RvcmUnXSxcclxuICAgICAgICBzdG9yYWdlOiBbICAgICAgICAgIC8vIFRvZG86IHRoaXMgc2hvdWxkIGV4dGVuZCBTdG9yYWdlQXJlYS5wcm90b3R5cGUgaW5zdGVhZFxyXG4gICAgICAgICAgICB7IG46ICdzeW5jJywgcHJvcHM6IGtub3duSW5TdG9yYWdlQXJlYSB9LFxyXG4gICAgICAgICAgICB7IG46ICdsb2NhbCcsIHByb3BzOiBrbm93bkluU3RvcmFnZUFyZWEgfSxcclxuICAgICAgICAgICAgeyBuOiAnbWFuYWdlZCcsIHByb3BzOiBrbm93bkluU3RvcmFnZUFyZWEgfV0sXHJcbiAgICAgICAgc29ja2V0OiBbXHJcbiAgICAgICAgICAgICdjcmVhdGUnLCAnY29ubmVjdCcsICdiaW5kJywgJ3JlYWQnLCAnd3JpdGUnLCAncmVjdkZyb20nLCAnc2VuZFRvJyxcclxuICAgICAgICAgICAgJ2xpc3RlbicsICdhY2NlcHQnLCAnc2V0S2VlcEFsaXZlJywgJ3NldE5vRGVsYXknLCAnZ2V0SW5mbycsICdnZXROZXR3b3JrTGlzdCddLFxyXG4gICAgICAgIHNvY2tldHM6IFtcclxuICAgICAgICAgICAgeyBuOiAndGNwJywgcHJvcHM6IFtcclxuICAgICAgICAgICAgICAgICdjcmVhdGUnLCd1cGRhdGUnLCdzZXRQYXVzZWQnLCdzZXRLZWVwQWxpdmUnLCdzZXROb0RlbGF5JywnY29ubmVjdCcsXHJcbiAgICAgICAgICAgICAgICAnZGlzY29ubmVjdCcsJ3NlY3VyZScsJ3NlbmQnLCdjbG9zZScsJ2dldEluZm8nLCdnZXRTb2NrZXRzJ10gfSxcclxuICAgICAgICAgICAgeyBuOiAndGNwU2VydmVyJywgcHJvcHM6IFtcclxuICAgICAgICAgICAgICAgICdjcmVhdGUnLCd1cGRhdGUnLCdzZXRQYXVzZWQnLCdsaXN0ZW4nLCdkaXNjb25uZWN0JywnY2xvc2UnLCdnZXRJbmZvJywnZ2V0U29ja2V0cyddIH0sIFxyXG4gICAgICAgICAgICB7IG46ICd1ZHAnLCBwcm9wczogW1xyXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZScsJ3VwZGF0ZScsJ3NldFBhdXNlZCcsJ2JpbmQnLCdzZW5kJywnY2xvc2UnLCdnZXRJbmZvJyxcclxuICAgICAgICAgICAgICAgICdnZXRTb2NrZXRzJywnam9pbkdyb3VwJywnbGVhdmVHcm91cCcsJ3NldE11bHRpY2FzdFRpbWVUb0xpdmUnLFxyXG4gICAgICAgICAgICAgICAgJ3NldE11bHRpY2FzdExvb3BiYWNrTW9kZScsJ2dldEpvaW5lZEdyb3VwcycsJ3NldEJyb2FkY2FzdCddIH1dLFxyXG4gICAgICAgIHN5c3RlbTogW1xyXG4gICAgICAgICAgICB7IG46ICdjcHUnLCBwcm9wczogWydnZXRJbmZvJ10gfSxcclxuICAgICAgICAgICAgeyBuOiAnbWVtb3J5JywgcHJvcHM6IFsnZ2V0SW5mbyddIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3N0b3JhZ2UnLCBwcm9wczogWydnZXRJbmZvJywgJ2VqZWN0RGV2aWNlJywgJ2dldEF2YWlsYWJsZUNhcGFjaXR5J10gfV0sXHJcbiAgICAgICAgdGFiQ2FwdHVyZTogWydjYXB0dXJlJywgJ2dldENhcHR1cmVkVGFicyddLFxyXG4gICAgICAgIHRhYnM6IFtcclxuICAgICAgICAgICAgJ2dldCcsICdnZXRDdXJyZW50JywgJ3NlbmRNZXNzYWdlJywgJ2NyZWF0ZScsICdkdXBsaWNhdGUnLFxyXG4gICAgICAgICAgICAncXVlcnknLCAnaGlnaGxpZ2h0JywgJ3VwZGF0ZScsICdtb3ZlJywgJ3JlbG9hZCcsICdyZW1vdmUnLFxyXG4gICAgICAgICAgICAnZGV0ZWN0TGFuZ3VhZ2UnLCAnY2FwdHVyZVZpc2libGVUYWInLCAnZXhlY3V0ZVNjcmlwdCcsXHJcbiAgICAgICAgICAgICdpbnNlcnRDU1MnLCAnc2V0Wm9vbScsICdnZXRab29tJywgJ3NldFpvb21TZXR0aW5ncycsXHJcbiAgICAgICAgICAgICdnZXRab29tU2V0dGluZ3MnLCAnZGlzY2FyZCddLFxyXG4gICAgICAgIHRvcFNpdGVzOiBbJ2dldCddLFxyXG4gICAgICAgIHR0czogWydpc1NwZWFraW5nJywgJ2dldFZvaWNlcycsICdzcGVhayddLFxyXG4gICAgICAgIHR5cGVzOiBbJ3NldCcsICdnZXQnLCAnY2xlYXInXSxcclxuICAgICAgICB2cG5Qcm92aWRlcjogWydjcmVhdGVDb25maWcnLCAnZGVzdHJveUNvbmZpZycsICdzZXRQYXJhbWV0ZXJzJywgJ3NlbmRQYWNrZXQnLCAnbm90aWZ5Q29ubmVjdGlvblN0YXRlQ2hhbmdlZCddLFxyXG4gICAgICAgIHdhbGxwYXBlcjogWydzZXRXYWxscGFwZXInXSxcclxuICAgICAgICB3ZWJOYXZpZ2F0aW9uOiBbJ2dldEZyYW1lJywgJ2dldEFsbEZyYW1lcycsICdoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkJ10sXHJcbiAgICAgICAgd2luZG93czogWydnZXQnLCAnZ2V0Q3VycmVudCcsICdnZXRMYXN0Rm9jdXNlZCcsICdnZXRBbGwnLCAnY3JlYXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnXVxyXG4gICAgfSk7XHJcbn0pKCk7XHJcbiIsIi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xudmFyIGJ5dGVUb0hleCA9IFtdO1xuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xufVxuXG5mdW5jdGlvbiBieXRlc1RvVXVpZChidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IG9mZnNldCB8fCAwO1xuICB2YXIgYnRoID0gYnl0ZVRvSGV4O1xuICAvLyBqb2luIHVzZWQgdG8gZml4IG1lbW9yeSBpc3N1ZSBjYXVzZWQgYnkgY29uY2F0ZW5hdGlvbjogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzE3NSNjNFxuICByZXR1cm4gKFtidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCBcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dXSkuam9pbignJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnl0ZXNUb1V1aWQ7XG4iLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxuXG4vLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG9cbi8vIGltcGxlbWVudGF0aW9uLiBBbHNvLCBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gb24gSUUxMS5cbnZhciBnZXRSYW5kb21WYWx1ZXMgPSAodHlwZW9mKGNyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mKG1zQ3J5cHRvKSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93Lm1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKSk7XG5cbmlmIChnZXRSYW5kb21WYWx1ZXMpIHtcbiAgLy8gV0hBVFdHIGNyeXB0byBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG4gIHZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG4gICAgcmV0dXJuIHJuZHM4O1xuICB9O1xufSBlbHNlIHtcbiAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAvL1xuICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAvLyBxdWFsaXR5LlxuICB2YXIgcm5kcyA9IG5ldyBBcnJheSgxNik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXRoUk5HKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgIH1cblxuICAgIHJldHVybiBybmRzO1xuICB9O1xufVxuIiwidmFyIHJuZyA9IHJlcXVpcmUoJy4vbGliL3JuZycpO1xudmFyIGJ5dGVzVG9VdWlkID0gcmVxdWlyZSgnLi9saWIvYnl0ZXNUb1V1aWQnKTtcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG5cbiAgaWYgKHR5cGVvZihvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgIGJ1ZiA9IG9wdGlvbnMgPT09ICdiaW5hcnknID8gbmV3IEFycmF5KDE2KSA6IG51bGw7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgcm5kc1s2XSA9IChybmRzWzZdICYgMHgwZikgfCAweDQwO1xuICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG5cbiAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gIGlmIChidWYpIHtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgMTY7ICsraWkpIHtcbiAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCBieXRlc1RvVXVpZChybmRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2NDtcbiJdfQ==
