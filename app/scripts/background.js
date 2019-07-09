'use strict';

var _chromeExtensionAsync = _interopRequireDefault(require("chrome-extension-async"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_chromeExtensionAsync["default"].runtime.onInstalled.addListener(function (details) {
  console.log("Installed new version. previousVersion = ".concat(details.previousVersion));
});