// this is a default URL
var kiosk_url = "https://www.google.com/";

var kiosk_window = undefined;

function closeAllWindows(wil) {
  for (wi of wil) {
    if (wi !== kiosk_window) {
      // console.log(`Closing window: ${wi.id}`);
      // console.log(wi.tabs.map((tab) => {return tab.url}));
      // uncomment before release
      // browser.windows.remove(wi);
    }
  }
}

function startKiosk(url) {
  browser.windows.create({
    url: url || kiosk_url,
    state: "fullscreen",
    type: "panel"
  }).then((winfo) => {
    kiosk_window = winfo.id;
    // close all other windows
    browser.windows.getAll({ populate: true }).then(closeAllWindows);
  });
}

// context menu to enter Kiosk
browser.menus.create({
  id: 'mk',
  title: "Enter kiosk mode"
});
browser.menus.create({
  id: 'mk-url',
  title: "Set the kiosk URL"
});

function modernKioskMenuSelect(info, tab) {
  console.log(info);

  if (info.menuItemId == 'mk') {
    startKiosk(kiosk_url);
  } else if (info.menuItemId == 'mk-url' && /^http/.test(info.pageUrl)) {
    kiosk_url = info.pageUrl;
    console.log(info.pageUrl);
  }
}

browser.menus.onClicked.addListener(modernKioskMenuSelect);

browser.windows.onRemoved.addListener((wid) => {
  if (wid === kiosk_window) {
    console.log("Closed window: " + wid);
    startKiosk(kiosk_url);
  }
});

browser.windows.onFocusChanged.addListener((wid) => {
  console.log("Focus changed on window: " + wid);
  console.log("MK window: " + kiosk_window);
  if (kiosk_window && (wid === kiosk_window || wid === browser.windows.WINDOW_ID_NONE)) {
    //startKiosk(kiosk_url);
    browser.windows.update(
      kiosk_window, {
        focused: true,
        state: "fullscreen"
      }
    );
  }
});
