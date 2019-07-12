(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'; // this import should come first because it modifies the chromium api

require("chrome-extension-async");

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function prettyPrint(obj) {
  return JSON.stringify(obj, null, '\t');
}

var STATE_PROPERTIES = new Set(['clientId', 'tabs', 'timestamp']);
var TAB_SYNC_PROPERTIES = new Set(['index', 'url', 'active', 'pinned']);
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
  if (areaName !== 'sync') return; // noinspection JSIgnoredPromiseFromCall

  mergeStatesByClientId();
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

function mergeStatesByClientId() {
  return _mergeStatesByClientId.apply(this, arguments);
}

function _mergeStatesByClientId() {
  _mergeStatesByClientId = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var remoteState;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getRemoteState();

          case 2:
            remoteState = _context2.sent;

            if (!(remoteState && remoteState.clientId && remoteState.clientId !== clientId)) {
              _context2.next = 7;
              break;
            }

            console.log("remote state was updated by another client,\n      force updating local state:\n      localClientId = ".concat(clientId, ", remoteClientId = ").concat(remoteState.clientId));
            _context2.next = 7;
            return setLocalState(remoteState);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _mergeStatesByClientId.apply(this, arguments);
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
      return new State(object.clientId, object.timestamp, object.tabs.map(Tab.fromObject));
    }
  }]);

  return State;
}();

function mergeStatesByTimestamp() {
  return _mergeStatesByTimestamp.apply(this, arguments);
}

function _mergeStatesByTimestamp() {
  _mergeStatesByTimestamp = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var localState, remoteState;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getLocalState();

          case 2:
            localState = _context3.sent;
            _context3.next = 5;
            return getRemoteState();

          case 5:
            remoteState = _context3.sent;

            if (remoteState instanceof State) {
              _context3.next = 11;
              break;
            }

            console.log("remoteState does not exist, overwriting: localState = ".concat(prettyPrint(localState)));
            _context3.next = 10;
            return setRemoteState(localState);

          case 10:
            return _context3.abrupt("return");

          case 11:
            if (!(remoteState.urls === localState.urls)) {
              _context3.next = 14;
              break;
            }

            console.log("remote and local urls are the same, no-op: remoteUrls = ".concat(remoteState.urls, ", localUrls = ").concat(localState.urls));
            return _context3.abrupt("return");

          case 14:
            if (!(remoteState.timestamp < localState.timestamp)) {
              _context3.next = 20;
              break;
            }

            console.log("overwriting remote state to merge: localState = ".concat(prettyPrint(localState), ", remoteState = ").concat(prettyPrint(remoteState)));
            _context3.next = 18;
            return setRemoteState(localState);

          case 18:
            _context3.next = 23;
            break;

          case 20:
            console.log("overwriting local state to merge: localState = ".concat(prettyPrint(localState), ", remoteState = ").concat(prettyPrint(remoteState)));
            _context3.next = 23;
            return setLocalState(remoteState);

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _mergeStatesByTimestamp.apply(this, arguments);
}

function getLocalState() {
  return _getLocalState.apply(this, arguments);
}

function _getLocalState() {
  _getLocalState = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var tabs, localState;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return chrome.tabs.query({});

          case 2:
            tabs = _context4.sent;
            localState = new State(clientId, Date.now(), tabs.map(Tab.fromObject));
            console.log("created local state: localState = ".concat(prettyPrint(localState)));
            _context4.next = 7;
            return chrome.storage.local.set(localState.toObject());

          case 7:
            return _context4.abrupt("return", localState);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getLocalState.apply(this, arguments);
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
            return getLocalState();

          case 2:
            localState = _context6.sent;
            console.log("setting local state from remote: remoteState = ".concat(prettyPrint(remoteState)));
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
            console.log("setting remote state from local: localState = ".concat(prettyPrint(localState)));
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

},{"chrome-extension-async":2,"uuid/v4":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./lib/bytesToUuid":3,"./lib/rng":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy5iYWJlbC9iYWNrZ3JvdW5kLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9tZS1leHRlbnNpb24tYXN5bmMvY2hyb21lLWV4dGVuc2lvbi1hc3luYy5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL2xpYi9ieXRlc1RvVXVpZC5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL3Y0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsYSxDQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVMsV0FBVCxDQUFxQixHQUFyQixFQUEwQjtBQUN4QixTQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsR0FBZixFQUFvQixJQUFwQixFQUEwQixJQUExQixDQUFQO0FBQ0Q7O0FBRUQsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUosQ0FBUSxDQUFDLFVBQUQsRUFBYSxNQUFiLEVBQXFCLFdBQXJCLENBQVIsQ0FBekI7QUFDQSxJQUFNLG1CQUFtQixHQUFHLElBQUksR0FBSixDQUFRLENBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBMkIsUUFBM0IsQ0FBUixDQUE1QjtBQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsV0FBZixDQUEyQixXQUEzQixDQUF1Qyx3QkFBdkM7QUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLFNBQWYsQ0FBeUIsV0FBekIsQ0FBcUMsc0JBQXJDO0FBRUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxTQUFmLENBQXlCLFdBQXpCLENBQXFDLHNCQUFyQztBQUVBLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBWixDQUFzQixXQUF0QixDQUFrQyxjQUFsQztBQUNBLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBWixDQUFzQixXQUF0QixDQUFrQyxjQUFsQztBQUNBLE1BQU0sQ0FBQyxJQUFQ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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbi8vIHRoaXMgaW1wb3J0IHNob3VsZCBjb21lIGZpcnN0IGJlY2F1c2UgaXQgbW9kaWZpZXMgdGhlIGNocm9taXVtIGFwaVxuaW1wb3J0ICdjaHJvbWUtZXh0ZW5zaW9uLWFzeW5jJztcbmltcG9ydCB1dWlkNCBmcm9tICd1dWlkL3Y0JztcblxuZnVuY3Rpb24gcHJldHR5UHJpbnQob2JqKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsICdcXHQnKTtcbn1cblxuY29uc3QgU1RBVEVfUFJPUEVSVElFUyA9IG5ldyBTZXQoWydjbGllbnRJZCcsICd0YWJzJywgJ3RpbWVzdGFtcCddKTtcbmNvbnN0IFRBQl9TWU5DX1BST1BFUlRJRVMgPSBuZXcgU2V0KFsnaW5kZXgnLCAndXJsJywgJ2FjdGl2ZScsICdwaW5uZWQnXSk7XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGhhbmRsZVJ1bnRpbWVPbkluc3RhbGxlZCk7XG5jaHJvbWUucnVudGltZS5vblN0YXJ0dXAuYWRkTGlzdGVuZXIoaGFuZGxlUnVudGltZU9uU3RhcnR1cCk7XG5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcihoYW5kbGVTdG9yYWdlT25DaGFuZ2VkKTtcblxuY2hyb21lLnRhYnMub25DcmVhdGVkLmFkZExpc3RlbmVyKGhhbmRsZVRhYkV2ZW50KTtcbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcihoYW5kbGVUYWJFdmVudCk7XG5jaHJvbWUudGFicy5vbk1vdmVkLmFkZExpc3RlbmVyKGhhbmRsZVRhYkV2ZW50KTtcbmNocm9tZS50YWJzLm9uUmVtb3ZlZC5hZGRMaXN0ZW5lcihoYW5kbGVUYWJFdmVudCk7XG5jaHJvbWUudGFicy5vblJlcGxhY2VkLmFkZExpc3RlbmVyKGhhbmRsZVRhYkV2ZW50KTtcblxuLy8gVE9ETzogaW5jbHVkZSBpbmZvcm1hdGlvbiBhYm91dCB3aW5kb3dzLCBjcmVhdGUgcHJveHkgbWFwcyBiZXR3ZWVuIHdpbmRvdyBpZHMgYW5kIG1hdGNoIGJhc2VkIG9uIHNpbWlsYXJpdHlcbi8vIGNocm9tZS50YWJzLm9uQXR0YWNoZWRcbi8vIGNocm9tZS50YWJzLm9uRGV0YWNoZWRcbi8vIGNocm9tZS50YWJzLm9uSGlnaGxpZ2h0ZWRcblxubGV0IGNsaWVudElkID0gbnVsbDtcblxuZnVuY3Rpb24gaGFuZGxlUnVudGltZU9uSW5zdGFsbGVkKGRldGFpbHMpIHtcbiAgY29uc29sZS5sb2coYEluc3RhbGxlZCBuZXcgdmVyc2lvbi4gcHJldmlvdXNWZXJzaW9uID0gJHtkZXRhaWxzLnByZXZpb3VzVmVyc2lvbn1gKTtcbiAgY2xpZW50SWQgPSBjbGllbnRJZCB8fCB1dWlkNCgpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSdW50aW1lT25TdGFydHVwKCkge1xuICBjbGllbnRJZCA9IGNsaWVudElkIHx8IHV1aWQ0KCk7XG4gIC8vIG5vaW5zcGVjdGlvbiBKU0lnbm9yZWRQcm9taXNlRnJvbUNhbGxcbiAgbWVyZ2VTdGF0ZXNCeVRpbWVzdGFtcCgpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTdG9yYWdlT25DaGFuZ2VkKGNoYW5nZXMsIGFyZWFOYW1lKSB7XG4gIGlmIChhcmVhTmFtZSAhPT0gJ3N5bmMnKSByZXR1cm47XG4gIC8vIG5vaW5zcGVjdGlvbiBKU0lnbm9yZWRQcm9taXNlRnJvbUNhbGxcbiAgbWVyZ2VTdGF0ZXNCeUNsaWVudElkKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVRhYkV2ZW50KHRhYikge1xuICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gIHNldFJlbW90ZVN0YXRlRnJvbUxvY2FsKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldFJlbW90ZVN0YXRlRnJvbUxvY2FsKCkge1xuICBsZXQgbG9jYWxTdGF0ZSA9IGF3YWl0IGdldExvY2FsU3RhdGUoKTtcbiAgYXdhaXQgc2V0UmVtb3RlU3RhdGUobG9jYWxTdGF0ZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1lcmdlU3RhdGVzQnlDbGllbnRJZCgpIHtcbiAgbGV0IHJlbW90ZVN0YXRlID0gYXdhaXQgZ2V0UmVtb3RlU3RhdGUoKTtcbiAgaWYgKHJlbW90ZVN0YXRlICYmIHJlbW90ZVN0YXRlLmNsaWVudElkICYmIHJlbW90ZVN0YXRlLmNsaWVudElkICE9PSBjbGllbnRJZCkge1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYHJlbW90ZSBzdGF0ZSB3YXMgdXBkYXRlZCBieSBhbm90aGVyIGNsaWVudCxcbiAgICAgIGZvcmNlIHVwZGF0aW5nIGxvY2FsIHN0YXRlOlxuICAgICAgbG9jYWxDbGllbnRJZCA9ICR7Y2xpZW50SWR9LCByZW1vdGVDbGllbnRJZCA9ICR7cmVtb3RlU3RhdGUuY2xpZW50SWR9YFxuICAgICk7XG4gICAgYXdhaXQgc2V0TG9jYWxTdGF0ZShyZW1vdGVTdGF0ZSk7XG4gIH1cbn1cblxuY2xhc3MgVGFiIHtcblxuICBzdGF0aWMgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgcmV0dXJuIFRBQl9TWU5DX1BST1BFUlRJRVM7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihpbmRleCwgdXJsLCBhY3RpdmUsIHBpbm5lZCkge1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLmFjdGl2ZSA9IGFjdGl2ZTtcbiAgICB0aGlzLnBpbm5lZCA9IHBpbm5lZDtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tT2JqZWN0KG9iamVjdCkge1xuICAgIGlmICghKG9iamVjdCAmJlxuICAgICAgb2JqZWN0Lmhhc093blByb3BlcnR5KCdpbmRleCcpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3VybCcpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ2FjdGl2ZScpICYmXG4gICAgICBvYmplY3QuaGFzT3duUHJvcGVydHkoJ3Bpbm5lZCcpKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIG5ldyBUYWIob2JqZWN0LmluZGV4LCBvYmplY3QudXJsLCBvYmplY3QuYWN0aXZlLCBvYmplY3QucGlubmVkKTtcbiAgfVxuXG4gIHRvT2JqZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICBhY3RpdmU6IHRoaXMuYWN0aXZlLFxuICAgICAgcGlubmVkOiB0aGlzLnBpbm5lZCxcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU3RhdGUge1xuXG4gIHN0YXRpYyBnZXQgcHJvcGVydGllcygpIHtcbiAgICByZXR1cm4gU1RBVEVfUFJPUEVSVElFUztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGNsaWVudElkID0gbnVsbCwgdGltZXN0YW1wID0gMCwgdGFicyA9IFtdKSB7XG4gICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkO1xuICAgIHRoaXMudGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIHRoaXMudGFicyA9IHRhYnM7XG4gIH1cblxuICBzdGF0aWMgZnJvbU9iamVjdChvYmplY3QpIHtcbiAgICBpZiAoIShvYmplY3RcbiAgICAgICYmIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgnY2xpZW50SWQnKVxuICAgICAgJiYgb2JqZWN0Lmhhc093blByb3BlcnR5KCd0aW1lc3RhbXAnKVxuICAgICAgJiYgb2JqZWN0Lmhhc093blByb3BlcnR5KCd0YWJzJykpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gbmV3IFN0YXRlKG9iamVjdC5jbGllbnRJZCwgb2JqZWN0LnRpbWVzdGFtcCwgb2JqZWN0LnRhYnMubWFwKFRhYi5mcm9tT2JqZWN0KSk7XG4gIH1cblxuICB0b09iamVjdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2xpZW50SWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICB0aW1lc3RhbXA6IHRoaXMudGltZXN0YW1wLFxuICAgICAgdGFiczogdGhpcy50YWJzLm1hcCgodGFiKSA9PiB0YWIudG9PYmplY3QoKSksXG4gICAgfVxuICB9XG5cbiAgZ2V0IHVybHMoKSB7XG4gICAgcmV0dXJuIG5ldyBTZXQodGhpcy50YWJzLm1hcCgodGFiKSA9PiB0YWIudXJsKSlcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtZXJnZVN0YXRlc0J5VGltZXN0YW1wKCkge1xuICBsZXQgbG9jYWxTdGF0ZSA9IGF3YWl0IGdldExvY2FsU3RhdGUoKTtcbiAgbGV0IHJlbW90ZVN0YXRlID0gYXdhaXQgZ2V0UmVtb3RlU3RhdGUoKTtcblxuICBpZiAoIShyZW1vdGVTdGF0ZSBpbnN0YW5jZW9mIFN0YXRlKSkge1xuICAgIGNvbnNvbGUubG9nKGByZW1vdGVTdGF0ZSBkb2VzIG5vdCBleGlzdCwgb3ZlcndyaXRpbmc6IGxvY2FsU3RhdGUgPSAke3ByZXR0eVByaW50KGxvY2FsU3RhdGUpfWApO1xuICAgIGF3YWl0IHNldFJlbW90ZVN0YXRlKGxvY2FsU3RhdGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChyZW1vdGVTdGF0ZS51cmxzID09PSBsb2NhbFN0YXRlLnVybHMpIHtcbiAgICBjb25zb2xlLmxvZyhgcmVtb3RlIGFuZCBsb2NhbCB1cmxzIGFyZSB0aGUgc2FtZSwgbm8tb3A6IHJlbW90ZVVybHMgPSAke3JlbW90ZVN0YXRlLnVybHN9LCBsb2NhbFVybHMgPSAke2xvY2FsU3RhdGUudXJsc31gKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocmVtb3RlU3RhdGUudGltZXN0YW1wIDwgbG9jYWxTdGF0ZS50aW1lc3RhbXApIHtcbiAgICBjb25zb2xlLmxvZyhgb3ZlcndyaXRpbmcgcmVtb3RlIHN0YXRlIHRvIG1lcmdlOiBsb2NhbFN0YXRlID0gJHtwcmV0dHlQcmludChsb2NhbFN0YXRlKX0sIHJlbW90ZVN0YXRlID0gJHtwcmV0dHlQcmludChyZW1vdGVTdGF0ZSl9YCk7XG4gICAgYXdhaXQgc2V0UmVtb3RlU3RhdGUobG9jYWxTdGF0ZSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coYG92ZXJ3cml0aW5nIGxvY2FsIHN0YXRlIHRvIG1lcmdlOiBsb2NhbFN0YXRlID0gJHtwcmV0dHlQcmludChsb2NhbFN0YXRlKX0sIHJlbW90ZVN0YXRlID0gJHtwcmV0dHlQcmludChyZW1vdGVTdGF0ZSl9YCk7XG4gICAgYXdhaXQgc2V0TG9jYWxTdGF0ZShyZW1vdGVTdGF0ZSk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TG9jYWxTdGF0ZSgpIHtcbiAgLy8gVE9ETzogZmlsbCBpbiBxdWVyeUluZm9cbiAgbGV0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7XG4gIGxldCBsb2NhbFN0YXRlID0gbmV3IFN0YXRlKFxuICAgIGNsaWVudElkLFxuICAgIERhdGUubm93KCksXG4gICAgdGFicy5tYXAoVGFiLmZyb21PYmplY3QpLFxuICApO1xuXG4gIGNvbnNvbGUubG9nKGBjcmVhdGVkIGxvY2FsIHN0YXRlOiBsb2NhbFN0YXRlID0gJHtwcmV0dHlQcmludChsb2NhbFN0YXRlKX1gKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGxvY2FsU3RhdGUudG9PYmplY3QoKSk7XG4gIHJldHVybiBsb2NhbFN0YXRlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRSZW1vdGVTdGF0ZSgpIHtcbiAgcmV0dXJuIFN0YXRlLmZyb21PYmplY3QoYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU3RhdGUucHJvcGVydGllcykpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRMb2NhbFN0YXRlKHJlbW90ZVN0YXRlKSB7XG4gIGxldCBsb2NhbFN0YXRlID0gYXdhaXQgZ2V0TG9jYWxTdGF0ZSgpO1xuXG4gIGNvbnNvbGUubG9nKGBzZXR0aW5nIGxvY2FsIHN0YXRlIGZyb20gcmVtb3RlOiByZW1vdGVTdGF0ZSA9ICR7cHJldHR5UHJpbnQocmVtb3RlU3RhdGUpfWApO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQocmVtb3RlU3RhdGUudG9PYmplY3QoKSk7XG5cbiAgbGV0IHJlbW90ZVVybHMgPSBuZXcgU2V0KHJlbW90ZVN0YXRlLnRhYnMubWFwKCh0YWIpID0+IHRhYi51cmwpKTtcbiAgbGV0IGxvY2FsVXJscyA9IG5ldyBTZXQobG9jYWxTdGF0ZS50YWJzLm1hcCgodGFiKSA9PiB0YWIudXJsKSk7XG5cbiAgZm9yIChsZXQgdGFiIG9mIGxvY2FsU3RhdGUudGFicykge1xuICAgIGlmICghcmVtb3RlVXJscy5oYXModGFiLnVybCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKGByZW1vdmluZyBsb2NhbCB0YWI6IHRhYlVybCA9ICR7dGFiLnVybH1gKTtcbiAgICAgIGF3YWl0IGNocm9tZS50YWJzLnJlbW92ZSh0YWIuaWQpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHRhYiBvZiByZW1vdGVTdGF0ZS50YWJzKSB7XG4gICAgaWYgKCFsb2NhbFVybHMuaGFzKHRhYi51cmwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhgY3JlYXRpbmcgbG9jYWwgdGFiOiB0YWJVcmwgPSAke3RhYi51cmx9YCk7XG4gICAgICBhd2FpdCBjaHJvbWUudGFicy5jcmVhdGUoe1xuICAgICAgICBpbmRleDogdGFiLmluZGV4LFxuICAgICAgICB1cmw6IHRhYi51cmwsXG4gICAgICAgIGFjdGl2ZTogdGFiLmFjdGl2ZSxcbiAgICAgICAgcGlubmVkOiB0YWIucGlubmVkLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldFJlbW90ZVN0YXRlKGxvY2FsU3RhdGUpIHtcbiAgY29uc29sZS5sb2coYHNldHRpbmcgcmVtb3RlIHN0YXRlIGZyb20gbG9jYWw6IGxvY2FsU3RhdGUgPSAke3ByZXR0eVByaW50KGxvY2FsU3RhdGUpfWApO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldChsb2NhbFN0YXRlLnRvT2JqZWN0KCkpO1xufVxuIiwiLyoqIFdyYXAgYW4gQVBJIHRoYXQgdXNlcyBjYWxsYmFja3Mgd2l0aCBQcm9taXNlc1xyXG4gKiBUaGlzIGV4cGVjdHMgdGhlIHBhdHRlcm4gZnVuY3Rpb24gd2l0aENhbGxiYWNrKGFyZzEsIGFyZzIsIC4uLiBhcmdOLCBjYWxsYmFjaylcclxuICogQGF1dGhvciBLZWl0aCBIZW5yeSA8a2VpdGguaGVucnlAZXZvbHV0aW9uam9icy5jby51az5cclxuICogQGxpY2Vuc2UgTUlUICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLyoqIFdyYXAgYSBmdW5jdGlvbiB3aXRoIGEgY2FsbGJhY2sgd2l0aCBhIFByb21pc2UuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmIFRoZSBmdW5jdGlvbiB0byB3cmFwLCBzaG91bGQgYmUgcGF0dGVybjogd2l0aENhbGxiYWNrKGFyZzEsIGFyZzIsIC4uLiBhcmdOLCBjYWxsYmFjaykuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXJzZUNCIE9wdGlvbmFsIGZ1bmN0aW9uIHRvIHBhcnNlIG11bHRpcGxlIGNhbGxiYWNrIHBhcmFtZXRlcnMgaW50byBhIHNpbmdsZSBvYmplY3QuXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGNhbGxiYWNrIGZpcmVzLiAqL1xyXG4gICAgZnVuY3Rpb24gcHJvbWlzaWZ5KGYsIHBhcnNlQ0IpIHtcclxuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNhZmVBcmdzID0gYXJncztcclxuICAgICAgICAgICAgbGV0IGNhbGxiYWNrO1xyXG4gICAgICAgICAgICAvLyBUaGUgQ2hyb21lIEFQSSBmdW5jdGlvbnMgYWxsIHVzZSBhcmd1bWVudHMsIHNvIHdlIGNhbid0IHVzZSBmLmxlbmd0aCB0byBjaGVja1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBsYXN0IGFyZ1xyXG4gICAgICAgICAgICBpZiAoYXJncyAmJiBhcmdzLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAuLi4gYW5kIHRoZSBsYXN0IGFyZyBpcyBhIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0ID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsYXN0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJpbSB0aGUgbGFzdCBjYWxsYmFjayBhcmcgaWYgaXQncyBiZWVuIHBhc3NlZFxyXG4gICAgICAgICAgICAgICAgICAgIHNhZmVBcmdzID0gYXJncy5zbGljZSgwLCBhcmdzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gbGFzdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUcnkgdG8gcnVuIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiwgd2l0aCB0aGUgdHJpbW1lZCBhcmdzIGxpc3RcclxuICAgICAgICAgICAgICAgICAgICBmKC4uLnNhZmVBcmdzLCAoLi4uY2JBcmdzKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhIGNhbGxiYWNrIHdhcyBwYXNzZWQgYXQgdGhlIGVuZCBvZiB0aGUgb3JpZ2luYWwgYXJndW1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgYWxsb3cgYSBidWcgaW4gdGhlIGNhbGxiYWNrIHRvIHN0b3AgdGhlIHByb21pc2UgcmVzb2x2aW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkgeyBjYWxsYmFjayguLi5jYkFyZ3MpOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoY2JFcnIpIHsgcmVqZWN0KGNiRXJyKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgZXh0ZW5zaW9ucyBhbHdheXMgZmlyZSB0aGUgY2FsbGJhY2ssIGJ1dCBwb3B1bGF0ZSBjaHJvbWUucnVudGltZS5sYXN0RXJyb3Igd2l0aCBleGNlcHRpb24gZGV0YWlsc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIGFzIGFuIGVycm9yIGZvciB0aGUgYXdhaXRlZCBjYXRjaCBibG9ja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSB8fCBgRXJyb3IgdGhyb3duIGJ5IEFQSSAke2Nocm9tZS5ydW50aW1lLmxhc3RFcnJvcn1gKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlQ0IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYk9iaiA9IHBhcnNlQ0IoLi4uY2JBcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNiT2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFjYkFyZ3MgfHwgY2JBcmdzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjYkFyZ3MubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2JBcmdzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNiQXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHsgcmVqZWN0KGVycik7IH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBQcm9taXNpZnkgYWxsIHRoZSBrbm93biBmdW5jdGlvbnMgaW4gdGhlIG1hcCBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhcGkgVGhlIENocm9tZSBuYXRpdmUgQVBJIHRvIGV4dGVuZFxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXBpTWFwIENvbGxlY3Rpb24gb2Ygc3ViLUFQSSBhbmQgZnVuY3Rpb25zIHRvIHByb21pc2lmeSAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlNYXAoYXBpLCBhcGlNYXApIHtcclxuICAgICAgICBpZiAoIWFwaSlcclxuICAgICAgICAgICAgLy8gTm90IHN1cHBvcnRlZCBieSBjdXJyZW50IHBlcm1pc3Npb25zXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZnVuY0RlZiBvZiBhcGlNYXApIHtcclxuICAgICAgICAgICAgbGV0IGZ1bmNOYW1lO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmNEZWYgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgZnVuY05hbWUgPSBmdW5jRGVmO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lID0gZnVuY0RlZi5uO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWFwaS5oYXNPd25Qcm9wZXJ0eShmdW5jTmFtZSkpXHJcbiAgICAgICAgICAgICAgICAvLyBNZW1iZXIgbm90IGluIEFQSVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtID0gYXBpW2Z1bmNOYW1lXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGZ1bmN0aW9uLCB3cmFwIGluIGEgcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgYXBpW2Z1bmNOYW1lXSA9IHByb21pc2lmeShtLmJpbmQoYXBpKSwgZnVuY0RlZi5jYik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIC8vIFN1Yi1BUEksIHJlY3Vyc2UgdGhpcyBmdW5jIHdpdGggdGhlIG1hcHBlZCBwcm9wc1xyXG4gICAgICAgICAgICAgICAgYXBwbHlNYXAobSwgZnVuY0RlZi5wcm9wcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBcHBseSBwcm9taXNlLW1hcHMgdG8gdGhlIENocm9tZSBuYXRpdmUgQVBJLlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFwaU1hcHMgVGhlIEFQSSB0byBhcHBseS4gKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5TWFwcyhhcGlNYXBzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgYXBpTmFtZSBpbiBhcGlNYXBzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrQXBpID0gY2hyb21lW2FwaU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrQXBpKVxyXG4gICAgICAgICAgICAgICAgLy8gTm90IHN1cHBvcnRlZCBieSBjdXJyZW50IHBlcm1pc3Npb25zXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFwaU1hcCA9IGFwaU1hcHNbYXBpTmFtZV07XHJcbiAgICAgICAgICAgIGFwcGx5TWFwKGNhbGxiYWNrQXBpLCBhcGlNYXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBhY2Nlc3NpYmlsaXR5RmVhdHVyZXMgaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL2FjY2Vzc2liaWxpdHlGZWF0dXJlc1xyXG4gICAgY29uc3Qga25vd25BMTF5U2V0dGluZyA9IFsnZ2V0JywgJ3NldCcsICdjbGVhciddO1xyXG5cclxuICAgIC8vIENvbnRlbnRTZXR0aW5nIGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9jb250ZW50U2V0dGluZ3MjdHlwZS1Db250ZW50U2V0dGluZ1xyXG4gICAgY29uc3Qga25vd25JbkNvbnRlbnRTZXR0aW5nID0gWydjbGVhcicsICdnZXQnLCAnc2V0JywgJ2dldFJlc291cmNlSWRlbnRpZmllcnMnXTtcclxuXHJcbiAgICAvLyBTdG9yYWdlQXJlYSBodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvc3RvcmFnZSN0eXBlLVN0b3JhZ2VBcmVhXHJcbiAgICBjb25zdCBrbm93bkluU3RvcmFnZUFyZWEgPSBbJ2dldCcsICdnZXRCeXRlc0luVXNlJywgJ3NldCcsICdyZW1vdmUnLCAnY2xlYXInXTtcclxuXHJcbiAgICAvKiogTWFwIG9mIEFQSSBmdW5jdGlvbnMgdGhhdCBmb2xsb3cgdGhlIGNhbGxiYWNrIHBhdHRlcm4gdGhhdCB3ZSBjYW4gJ3Byb21pc2lmeScgKi9cclxuICAgIGFwcGx5TWFwcyh7XHJcbiAgICAgICAgYWNjZXNzaWJpbGl0eUZlYXR1cmVzOiBbICAvLyBUb2RvOiB0aGlzIHNob3VsZCBleHRlbmQgQWNjZXNzaWJpbGl0eUZlYXR1cmVzU2V0dGluZy5wcm90b3R5cGUgaW5zdGVhZFxyXG4gICAgICAgICAgICB7IG46ICdzcG9rZW5GZWVkYmFjaycsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2xhcmdlQ3Vyc29yJywgcHJvcHM6IGtub3duQTExeVNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnc3RpY2t5S2V5cycsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2hpZ2hDb250cmFzdCcsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3NjcmVlbk1hZ25pZmllcicsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2F1dG9jbGljaycsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ3ZpcnR1YWxLZXlib2FyZCcsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2FuaW1hdGlvblBvbGljeScsIHByb3BzOiBrbm93bkExMXlTZXR0aW5nIH1dLFxyXG4gICAgICAgIGFsYXJtczogWydnZXQnLCAnZ2V0QWxsJywgJ2NsZWFyJywgJ2NsZWFyQWxsJ10sXHJcbiAgICAgICAgYm9va21hcmtzOiBbXHJcbiAgICAgICAgICAgICdnZXQnLCAnZ2V0Q2hpbGRyZW4nLCAnZ2V0UmVjZW50JywgJ2dldFRyZWUnLCAnZ2V0U3ViVHJlZScsXHJcbiAgICAgICAgICAgICdzZWFyY2gnLCAnY3JlYXRlJywgJ21vdmUnLCAndXBkYXRlJywgJ3JlbW92ZScsICdyZW1vdmVUcmVlJ10sXHJcbiAgICAgICAgYnJvd3NlcjogWydvcGVuVGFiJ10sXHJcbiAgICAgICAgYnJvd3NlckFjdGlvbjogW1xyXG4gICAgICAgICAgICAnZ2V0VGl0bGUnLCAnc2V0SWNvbicsICdnZXRQb3B1cCcsICdnZXRCYWRnZVRleHQnLCAnZ2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3InXSxcclxuICAgICAgICBicm93c2luZ0RhdGE6IFtcclxuICAgICAgICAgICAgJ3NldHRpbmdzJywgJ3JlbW92ZScsICdyZW1vdmVBcHBjYWNoZScsICdyZW1vdmVDYWNoZScsXHJcbiAgICAgICAgICAgICdyZW1vdmVDb29raWVzJywgJ3JlbW92ZURvd25sb2FkcycsICdyZW1vdmVGaWxlU3lzdGVtcycsXHJcbiAgICAgICAgICAgICdyZW1vdmVGb3JtRGF0YScsICdyZW1vdmVIaXN0b3J5JywgJ3JlbW92ZUluZGV4ZWREQicsXHJcbiAgICAgICAgICAgICdyZW1vdmVMb2NhbFN0b3JhZ2UnLCAncmVtb3ZlUGx1Z2luRGF0YScsICdyZW1vdmVQYXNzd29yZHMnLFxyXG4gICAgICAgICAgICAncmVtb3ZlV2ViU1FMJ10sXHJcbiAgICAgICAgY29tbWFuZHM6IFsnZ2V0QWxsJ10sXHJcbiAgICAgICAgY29udGVudFNldHRpbmdzOiBbICAvLyBUb2RvOiB0aGlzIHNob3VsZCBleHRlbmQgQ29udGVudFNldHRpbmcucHJvdG90eXBlIGluc3RlYWRcclxuICAgICAgICAgICAgeyBuOiAnY29va2llcycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAnaW1hZ2VzJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdqYXZhc2NyaXB0JywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdsb2NhdGlvbicsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAncGx1Z2lucycsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAncG9wdXBzJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdub3RpZmljYXRpb25zJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdmdWxsc2NyZWVuJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdtb3VzZWxvY2snLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ21pY3JvcGhvbmUnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2NhbWVyYScsIHByb3BzOiBrbm93bkluQ29udGVudFNldHRpbmcgfSxcclxuICAgICAgICAgICAgeyBuOiAndW5zYW5kYm94ZWRQbHVnaW5zJywgcHJvcHM6IGtub3duSW5Db250ZW50U2V0dGluZyB9LFxyXG4gICAgICAgICAgICB7IG46ICdhdXRvbWF0aWNEb3dubG9hZHMnLCBwcm9wczoga25vd25JbkNvbnRlbnRTZXR0aW5nIH1dLFxyXG4gICAgICAgIGNvbnRleHRNZW51czogWydjcmVhdGUnLCAndXBkYXRlJywgJ3JlbW92ZScsICdyZW1vdmVBbGwnXSxcclxuICAgICAgICBjb29raWVzOiBbJ2dldCcsICdnZXRBbGwnLCAnc2V0JywgJ3JlbW92ZScsICdnZXRBbGxDb29raWVTdG9yZXMnXSxcclxuICAgICAgICBkZWJ1Z2dlcjogWydhdHRhY2gnLCAnZGV0YWNoJywgJ3NlbmRDb21tYW5kJywgJ2dldFRhcmdldHMnXSxcclxuICAgICAgICBkZXNrdG9wQ2FwdHVyZTogWydjaG9vc2VEZXNrdG9wTWVkaWEnXSxcclxuICAgICAgICAvLyBUT0RPOiBkZXZ0b29scy4qXHJcbiAgICAgICAgZG9jdW1lbnRTY2FuOiBbJ3NjYW4nXSxcclxuICAgICAgICBkb3dubG9hZHM6IFtcclxuICAgICAgICAgICAgJ2Rvd25sb2FkJywgJ3NlYXJjaCcsICdwYXVzZScsICdyZXN1bWUnLCAnY2FuY2VsJyxcclxuICAgICAgICAgICAgJ2dldEZpbGVJY29uJywgJ2VyYXNlJywgJ3JlbW92ZUZpbGUnLCAnYWNjZXB0RGFuZ2VyJ10sXHJcbiAgICAgICAgZW50ZXJwcmlzZTogW3sgbjogJ3BsYXRmb3JtS2V5cycsIHByb3BzOiBbJ2dldFRva2VuJywgJ2dldENlcnRpZmljYXRlcycsICdpbXBvcnRDZXJ0aWZpY2F0ZScsICdyZW1vdmVDZXJ0aWZpY2F0ZSddIH1dLFxyXG4gICAgICAgIGV4dGVuc2lvbjogWydpc0FsbG93ZWRJbmNvZ25pdG9BY2Nlc3MnLCAnaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2VzcyddLCAvLyBtb3N0bHkgZGVwcmVjYXRlZCBpbiBmYXZvdXIgb2YgcnVudGltZVxyXG4gICAgICAgIGZpbGVCcm93c2VySGFuZGxlcjogWydzZWxlY3RGaWxlJ10sXHJcbiAgICAgICAgZmlsZVN5c3RlbVByb3ZpZGVyOiBbJ21vdW50JywgJ3VubW91bnQnLCAnZ2V0QWxsJywgJ2dldCcsICdub3RpZnknXSxcclxuICAgICAgICBmb250U2V0dGluZ3M6IFtcclxuICAgICAgICAgICAgJ3NldERlZmF1bHRGb250U2l6ZScsICdnZXRGb250JywgJ2dldERlZmF1bHRGb250U2l6ZScsICdnZXRNaW5pbXVtRm9udFNpemUnLFxyXG4gICAgICAgICAgICAnc2V0TWluaW11bUZvbnRTaXplJywgJ2dldERlZmF1bHRGaXhlZEZvbnRTaXplJywgJ2NsZWFyRGVmYXVsdEZvbnRTaXplJyxcclxuICAgICAgICAgICAgJ3NldERlZmF1bHRGaXhlZEZvbnRTaXplJywgJ2NsZWFyRm9udCcsICdzZXRGb250JywgJ2NsZWFyTWluaW11bUZvbnRTaXplJyxcclxuICAgICAgICAgICAgJ2dldEZvbnRMaXN0JywgJ2NsZWFyRGVmYXVsdEZpeGVkRm9udFNpemUnXSxcclxuICAgICAgICBnY206IFsncmVnaXN0ZXInLCAndW5yZWdpc3RlcicsICdzZW5kJ10sXHJcbiAgICAgICAgaGlzdG9yeTogWydzZWFyY2gnLCAnZ2V0VmlzaXRzJywgJ2FkZFVybCcsICdkZWxldGVVcmwnLCAnZGVsZXRlUmFuZ2UnLCAnZGVsZXRlQWxsJ10sXHJcbiAgICAgICAgaTE4bjogWydnZXRBY2NlcHRMYW5ndWFnZXMnLCAnZGV0ZWN0TGFuZ3VhZ2UnXSxcclxuICAgICAgICBpZGVudGl0eTogW1xyXG4gICAgICAgICAgICAnZ2V0QXV0aFRva2VuJywgJ2dldFByb2ZpbGVVc2VySW5mbycsICdyZW1vdmVDYWNoZWRBdXRoVG9rZW4nLCAnbGF1bmNoV2ViQXV0aEZsb3cnXSxcclxuICAgICAgICBpZGxlOiBbJ3F1ZXJ5U3RhdGUnXSxcclxuICAgICAgICBpbnB1dDogW3tcclxuICAgICAgICAgICAgbjogJ2ltZScsIHByb3BzOiBbXHJcbiAgICAgICAgICAgICAgICAnc2V0TWVudUl0ZW1zJywgJ2NvbW1pdFRleHQnLCAnc2V0Q2FuZGlkYXRlcycsICdzZXRDb21wb3NpdGlvbicsICd1cGRhdGVNZW51SXRlbXMnLFxyXG4gICAgICAgICAgICAgICAgJ3NldENhbmRpZGF0ZVdpbmRvd1Byb3BlcnRpZXMnLCAnY2xlYXJDb21wb3NpdGlvbicsICdzZXRDdXJzb3JQb3NpdGlvbicsICdzZW5kS2V5RXZlbnRzJyxcclxuICAgICAgICAgICAgICAgICdkZWxldGVTdXJyb3VuZGluZ1RleHQnXVxyXG4gICAgICAgIH1dLFxyXG4gICAgICAgIG1hbmFnZW1lbnQ6IFtcclxuICAgICAgICAgICAgJ3NldEVuYWJsZWQnLCAnZ2V0UGVybWlzc2lvbldhcm5pbmdzQnlJZCcsICdnZXQnLCAnZ2V0QWxsJyxcclxuICAgICAgICAgICAgJ2dldFBlcm1pc3Npb25XYXJuaW5nc0J5TWFuaWZlc3QnLCAnbGF1bmNoQXBwJywgJ3VuaW5zdGFsbCcsICdnZXRTZWxmJyxcclxuICAgICAgICAgICAgJ3VuaW5zdGFsbFNlbGYnLCAnY3JlYXRlQXBwU2hvcnRjdXQnLCAnc2V0TGF1bmNoVHlwZScsICdnZW5lcmF0ZUFwcEZvckxpbmsnXSxcclxuICAgICAgICBuZXR3b3JraW5nOiBbeyBuOiAnY29uZmlnJywgcHJvcHM6IFsnc2V0TmV0d29ya0ZpbHRlcicsICdmaW5pc2hBdXRoZW50aWNhdGlvbiddIH1dLFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbnM6IFsnY3JlYXRlJywgJ3VwZGF0ZScsICdjbGVhcicsICdnZXRBbGwnLCAnZ2V0UGVybWlzc2lvbkxldmVsJ10sXHJcbiAgICAgICAgcGFnZUFjdGlvbjogWydnZXRUaXRsZScsICdzZXRJY29uJywgJ2dldFBvcHVwJ10sXHJcbiAgICAgICAgcGFnZUNhcHR1cmU6IFsnc2F2ZUFzTUhUTUwnXSxcclxuICAgICAgICBwZXJtaXNzaW9uczogWydnZXRBbGwnLCAnY29udGFpbnMnLCAncmVxdWVzdCcsICdyZW1vdmUnXSxcclxuICAgICAgICBwbGF0Zm9ybUtleXM6IFsnc2VsZWN0Q2xpZW50Q2VydGlmaWNhdGVzJywgJ3ZlcmlmeVRMU1NlcnZlckNlcnRpZmljYXRlJyxcclxuICAgICAgICAgICAgeyBuOiBcImdldEtleVBhaXJcIiwgY2I6IChwdWJsaWNLZXksIHByaXZhdGVLZXkpID0+IHsgcmV0dXJuIHsgcHVibGljS2V5LCBwcml2YXRlS2V5IH07IH0gfV0sXHJcbiAgICAgICAgcnVudGltZTogW1xyXG4gICAgICAgICAgICAnZ2V0QmFja2dyb3VuZFBhZ2UnLCAnb3Blbk9wdGlvbnNQYWdlJywgJ3NldFVuaW5zdGFsbFVSTCcsXHJcbiAgICAgICAgICAgICdyZXN0YXJ0QWZ0ZXJEZWxheScsICdzZW5kTWVzc2FnZScsXHJcbiAgICAgICAgICAgICdzZW5kTmF0aXZlTWVzc2FnZScsICdnZXRQbGF0Zm9ybUluZm8nLCAnZ2V0UGFja2FnZURpcmVjdG9yeUVudHJ5JyxcclxuICAgICAgICAgICAgeyBuOiBcInJlcXVlc3RVcGRhdGVDaGVja1wiLCBjYjogKHN0YXR1cywgZGV0YWlscykgPT4geyByZXR1cm4geyBzdGF0dXMsIGRldGFpbHMgfTsgfSB9XSxcclxuICAgICAgICBzY3JpcHRCYWRnZTogWydnZXRQb3B1cCddLFxyXG4gICAgICAgIHNlc3Npb25zOiBbJ2dldFJlY2VudGx5Q2xvc2VkJywgJ2dldERldmljZXMnLCAncmVzdG9yZSddLFxyXG4gICAgICAgIHN0b3JhZ2U6IFsgICAgICAgICAgLy8gVG9kbzogdGhpcyBzaG91bGQgZXh0ZW5kIFN0b3JhZ2VBcmVhLnByb3RvdHlwZSBpbnN0ZWFkXHJcbiAgICAgICAgICAgIHsgbjogJ3N5bmMnLCBwcm9wczoga25vd25JblN0b3JhZ2VBcmVhIH0sXHJcbiAgICAgICAgICAgIHsgbjogJ2xvY2FsJywgcHJvcHM6IGtub3duSW5TdG9yYWdlQXJlYSB9LFxyXG4gICAgICAgICAgICB7IG46ICdtYW5hZ2VkJywgcHJvcHM6IGtub3duSW5TdG9yYWdlQXJlYSB9XSxcclxuICAgICAgICBzb2NrZXQ6IFtcclxuICAgICAgICAgICAgJ2NyZWF0ZScsICdjb25uZWN0JywgJ2JpbmQnLCAncmVhZCcsICd3cml0ZScsICdyZWN2RnJvbScsICdzZW5kVG8nLFxyXG4gICAgICAgICAgICAnbGlzdGVuJywgJ2FjY2VwdCcsICdzZXRLZWVwQWxpdmUnLCAnc2V0Tm9EZWxheScsICdnZXRJbmZvJywgJ2dldE5ldHdvcmtMaXN0J10sXHJcbiAgICAgICAgc29ja2V0czogW1xyXG4gICAgICAgICAgICB7IG46ICd0Y3AnLCBwcm9wczogW1xyXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZScsJ3VwZGF0ZScsJ3NldFBhdXNlZCcsJ3NldEtlZXBBbGl2ZScsJ3NldE5vRGVsYXknLCdjb25uZWN0JyxcclxuICAgICAgICAgICAgICAgICdkaXNjb25uZWN0Jywnc2VjdXJlJywnc2VuZCcsJ2Nsb3NlJywnZ2V0SW5mbycsJ2dldFNvY2tldHMnXSB9LFxyXG4gICAgICAgICAgICB7IG46ICd0Y3BTZXJ2ZXInLCBwcm9wczogW1xyXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZScsJ3VwZGF0ZScsJ3NldFBhdXNlZCcsJ2xpc3RlbicsJ2Rpc2Nvbm5lY3QnLCdjbG9zZScsJ2dldEluZm8nLCdnZXRTb2NrZXRzJ10gfSwgXHJcbiAgICAgICAgICAgIHsgbjogJ3VkcCcsIHByb3BzOiBbXHJcbiAgICAgICAgICAgICAgICAnY3JlYXRlJywndXBkYXRlJywnc2V0UGF1c2VkJywnYmluZCcsJ3NlbmQnLCdjbG9zZScsJ2dldEluZm8nLFxyXG4gICAgICAgICAgICAgICAgJ2dldFNvY2tldHMnLCdqb2luR3JvdXAnLCdsZWF2ZUdyb3VwJywnc2V0TXVsdGljYXN0VGltZVRvTGl2ZScsXHJcbiAgICAgICAgICAgICAgICAnc2V0TXVsdGljYXN0TG9vcGJhY2tNb2RlJywnZ2V0Sm9pbmVkR3JvdXBzJywnc2V0QnJvYWRjYXN0J10gfV0sXHJcbiAgICAgICAgc3lzdGVtOiBbXHJcbiAgICAgICAgICAgIHsgbjogJ2NwdScsIHByb3BzOiBbJ2dldEluZm8nXSB9LFxyXG4gICAgICAgICAgICB7IG46ICdtZW1vcnknLCBwcm9wczogWydnZXRJbmZvJ10gfSxcclxuICAgICAgICAgICAgeyBuOiAnc3RvcmFnZScsIHByb3BzOiBbJ2dldEluZm8nLCAnZWplY3REZXZpY2UnLCAnZ2V0QXZhaWxhYmxlQ2FwYWNpdHknXSB9XSxcclxuICAgICAgICB0YWJDYXB0dXJlOiBbJ2NhcHR1cmUnLCAnZ2V0Q2FwdHVyZWRUYWJzJ10sXHJcbiAgICAgICAgdGFiczogW1xyXG4gICAgICAgICAgICAnZ2V0JywgJ2dldEN1cnJlbnQnLCAnc2VuZE1lc3NhZ2UnLCAnY3JlYXRlJywgJ2R1cGxpY2F0ZScsXHJcbiAgICAgICAgICAgICdxdWVyeScsICdoaWdobGlnaHQnLCAndXBkYXRlJywgJ21vdmUnLCAncmVsb2FkJywgJ3JlbW92ZScsXHJcbiAgICAgICAgICAgICdkZXRlY3RMYW5ndWFnZScsICdjYXB0dXJlVmlzaWJsZVRhYicsICdleGVjdXRlU2NyaXB0JyxcclxuICAgICAgICAgICAgJ2luc2VydENTUycsICdzZXRab29tJywgJ2dldFpvb20nLCAnc2V0Wm9vbVNldHRpbmdzJyxcclxuICAgICAgICAgICAgJ2dldFpvb21TZXR0aW5ncycsICdkaXNjYXJkJ10sXHJcbiAgICAgICAgdG9wU2l0ZXM6IFsnZ2V0J10sXHJcbiAgICAgICAgdHRzOiBbJ2lzU3BlYWtpbmcnLCAnZ2V0Vm9pY2VzJywgJ3NwZWFrJ10sXHJcbiAgICAgICAgdHlwZXM6IFsnc2V0JywgJ2dldCcsICdjbGVhciddLFxyXG4gICAgICAgIHZwblByb3ZpZGVyOiBbJ2NyZWF0ZUNvbmZpZycsICdkZXN0cm95Q29uZmlnJywgJ3NldFBhcmFtZXRlcnMnLCAnc2VuZFBhY2tldCcsICdub3RpZnlDb25uZWN0aW9uU3RhdGVDaGFuZ2VkJ10sXHJcbiAgICAgICAgd2FsbHBhcGVyOiBbJ3NldFdhbGxwYXBlciddLFxyXG4gICAgICAgIHdlYk5hdmlnYXRpb246IFsnZ2V0RnJhbWUnLCAnZ2V0QWxsRnJhbWVzJywgJ2hhbmRsZXJCZWhhdmlvckNoYW5nZWQnXSxcclxuICAgICAgICB3aW5kb3dzOiBbJ2dldCcsICdnZXRDdXJyZW50JywgJ2dldExhc3RGb2N1c2VkJywgJ2dldEFsbCcsICdjcmVhdGUnLCAndXBkYXRlJywgJ3JlbW92ZSddXHJcbiAgICB9KTtcclxufSkoKTtcclxuIiwiLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG52YXIgYnl0ZVRvSGV4ID0gW107XG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9VdWlkKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBidGggPSBieXRlVG9IZXg7XG4gIC8vIGpvaW4gdXNlZCB0byBmaXggbWVtb3J5IGlzc3VlIGNhdXNlZCBieSBjb25jYXRlbmF0aW9uOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMTc1I2M0XG4gIHJldHVybiAoW2J0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sIFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV1dKS5qb2luKCcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBieXRlc1RvVXVpZDtcbiIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBJbiB0aGVcbi8vIGJyb3dzZXIgdGhpcyBpcyBhIGxpdHRsZSBjb21wbGljYXRlZCBkdWUgdG8gdW5rbm93biBxdWFsaXR5IG9mIE1hdGgucmFuZG9tKClcbi8vIGFuZCBpbmNvbnNpc3RlbnQgc3VwcG9ydCBmb3IgdGhlIGBjcnlwdG9gIEFQSS4gIFdlIGRvIHRoZSBiZXN0IHdlIGNhbiB2aWFcbi8vIGZlYXR1cmUtZGV0ZWN0aW9uXG5cbi8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0b1xuLy8gaW1wbGVtZW50YXRpb24uIEFsc28sIGZpbmQgdGhlIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIG9mIGNyeXB0byBvbiBJRTExLlxudmFyIGdldFJhbmRvbVZhbHVlcyA9ICh0eXBlb2YoY3J5cHRvKSAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YobXNDcnlwdG8pICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cubXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09ICdmdW5jdGlvbicgJiYgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pKTtcblxuaWYgKGdldFJhbmRvbVZhbHVlcykge1xuICAvLyBXSEFUV0cgY3J5cHRvIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgdmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3aGF0d2dSTkcoKSB7XG4gICAgZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbiAgICByZXR1cm4gcm5kczg7XG4gIH07XG59IGVsc2Uge1xuICAvLyBNYXRoLnJhbmRvbSgpLWJhc2VkIChSTkcpXG4gIC8vXG4gIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgTWF0aC5yYW5kb20oKS4gIEl0J3MgZmFzdCwgYnV0IGlzIG9mIHVuc3BlY2lmaWVkXG4gIC8vIHF1YWxpdHkuXG4gIHZhciBybmRzID0gbmV3IEFycmF5KDE2KTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hdGhSTkcoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCAxNjsgaSsrKSB7XG4gICAgICBpZiAoKGkgJiAweDAzKSA9PT0gMCkgciA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcbiAgICAgIHJuZHNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJuZHM7XG4gIH07XG59XG4iLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PT0gJ2JpbmFyeScgPyBuZXcgQXJyYXkoMTYpIDogbnVsbDtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gIHJuZHNbOF0gPSAocm5kc1s4XSAmIDB4M2YpIHwgMHg4MDtcblxuICAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcbiAgaWYgKGJ1Zikge1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCAxNjsgKytpaSkge1xuICAgICAgYnVmW2kgKyBpaV0gPSBybmRzW2lpXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmIHx8IGJ5dGVzVG9VdWlkKHJuZHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHY0O1xuIl19
