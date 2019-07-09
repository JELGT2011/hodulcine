'use strict';

import chrome from 'chrome-extension-async';

chrome.runtime.onInstalled.addListener(details => {
  console.log(`Installed new version. previousVersion = ${details.previousVersion}`);
});
