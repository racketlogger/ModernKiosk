
var kiosk_window;

function closeAllWindows(wil) {
  for (let wi of wil) {
    if (wi !== kiosk_window) {
      // console.log(`Closing window: ${wi.id}`);
      // console.log(wi.tabs.map((tab) => {return tab.url}));
      // uncomment before release
      // browser.windows.remove(wi);
    }
  }
}

function startKiosk(url) {
  console.log("Starting ModernKiosk with URL: " + url);
  browser.windows.create({
    url: url,
    state: "fullscreen",
    type: "panel"
  }).then((winfo) => {
    kiosk_window = winfo.id;
    // close all other windows
    browser.windows.getAll({ populate: true }).then(closeAllWindows);
  });
}

function browseKiosk(url) {
  console.log("Browsing ModernKiosk with URL: " + url);
  browser.windows.create({ url: url }).then();
}


function modernKioskURL() {
  return browser.storage.local.get("kiosk_url").then(function(item) {
    console.log('Items: ' + JSON.stringify(item));
    return item.kiosk_url;
  });
}

// context menu to manage ModernKiosk
browser.menus.create({
  id: 'mk-preferences',
  title: "ModernKiosk preferences"
});
browser.menus.create({
  id: 'mk-url',
  title: "Set current URL as kiosk URL"
});
browser.menus.create({
  id: 'mk-start',
  title: "Enter kiosk mode"
});

function modernKioskMenuSelect(info, tab) {
  console.log(info);

  if (info.menuItemId == 'mk-start') {
    modernKioskURL().then(url => startKiosk(url));
  } else if (info.menuItemId == 'mk-preferences') {
    browser.runtime.openOptionsPage().then();
  } else if (info.menuItemId == 'mk-current-url') {
    // Deprecated -- left here for debugging
    modernKioskURL().then(url => browseKiosk(url));
  } else if (info.menuItemId == 'mk-url' && /^http/.test(info.pageUrl)) {
    browser.storage.local.set({ kiosk_url: info.pageUrl });
    console.log(info.pageUrl);
  }
}

browser.menus.onClicked.addListener(modernKioskMenuSelect);

browser.windows.onRemoved.addListener((wid) => {
  if (wid === kiosk_window) {
    console.log("Closed window: " + wid);
    modernKioskURL().then(url => startKiosk(url));
  }
});

browser.windows.onFocusChanged.addListener((wid) => {
  console.log("Focus changed on window: " + wid);
  console.log("MK window: " + kiosk_window);
  if (kiosk_window && (wid === kiosk_window || wid === browser.windows.WINDOW_ID_NONE)) {
    browser.windows.update(
      kiosk_window, {
        focused: true,
        state: "fullscreen"
      }
    );
  }
});

/**
 * Set in storage.local the default config values when the add-on is installed
 * Called when user install the add-on
 * @function setDefaultConfig()
 */
function setDefaultConfig() {
  browser.storage.local.set({
    kiosk_url: "http://example.org/",
    context_enable: true,
    context_disable: false
  });
}

/**
 * Event fired when user install the add-on
 */
browser.runtime.onInstalled.addListener(setDefaultConfig);

