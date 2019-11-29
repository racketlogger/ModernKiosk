/**
 * mk_bg.js
 * @license
 * This file is part of Modern Kiosk
 *
 * Copyright (C) 2018-2019 - RacketLogger
 * Copyright (C) 2019 - Universidad de El Salvador
 *
 * Modern Kiosk is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Modern Kiosk is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Modern Kiosk. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @file Background script for the web-extension performing the long-term
 * operations.
 * @requires mk_utils
 * @author Carlos Puchol
 * @author Hector Castro
 */

/**
 * @global
 * @description Variables declared as global.
 * kiosk_window variable store the ID of the window open when app start
 * the kiosk mode.
 * kiosk_window_tabs store an array with tabs id for panel fullscreen window
 * kiosk_mode variable store a boolean value to identificate if app stay in
 * kiosk mode or not.
 */
let kiosk_window, kiosk_window_tabs, kiosk_mode;

/**
 * Start the Kiosk Mode
 * @function startKiosk
 * @param {string} url Uniform Resource Locator to display in Kiosk Mode.
 * @description Assign data to global variables kiosk_window and kiosk_mode.
 */
function startKiosk(url) {
  console.log("Starting ModernKiosk with URL: " + url);
  browser.windows.create({
    url: url,
    state: "fullscreen",
    type: "panel"
  }).then((winfo) => {
    // Test if something went wrong when user saved the password
    const getPassword = browser.storage.local.get();
    getPassword.then(async (item) => {
      let message;
      if (!item.password_stored && item.password_enable) {
        browser.windows.onFocusChanged.removeListener(listenerFocusChanged);
        browser.windows.onRemoved.removeListener(listenerOnRemoved);
        message = "The preference 'enable optional password' is set to ";
        message += "enabled, but password box is empty.\n"
        message += "Please go back to Modern Kiosk preferences and save one.";
        message += "Or disable the preference to start in Kiosk Mode.";
        mkNotifications("no-password", message);
        await browser.windows.remove(winfo.id);
        throw new Error("No password stored. Kiosk mode cannot start");
      } else {
        // asign the id of the window and id of the tab opened as kiosk
        kiosk_window = winfo.id;
        kiosk_window_tabs = winfo.tabs.map((tab) => {return tab.id});
        message = `Window created: ${winfo.id}. Tab: ${kiosk_window_tabs[0]}`;
        console.log(message);
        // asign boolean to test kiosk mode and non kiosk mode
        kiosk_mode = true;
      }
    }).catch((error) => {
      console.error(error.message);
      browser.windows.onRemoved.addListener(listenerOnRemoved);
      browser.windows.onFocusChanged.addListener(listenerFocusChanged);
    });
  });
}

/**
 * @deprecated Left here for debugging
 * @function browseKiosk
 * @param {string} url Uniform Resource Locator.
 */
function browseKiosk(url) {
  console.log("Browsing ModernKiosk with URL: " + url);
  browser.windows.create({ url: url }).then();
}

/**
 * Get url form StorageArea and return a Promise
 * @function modernKioskURL
 * @returns {Promise}
 */
function modernKioskURL() {
  return browser.storage.local.get("kiosk_url").then((item) => {
    console.log('Items: ' + JSON.stringify(item));
    return item.kiosk_url;
  });
}

/** Context menu to manage ModernKiosk */
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

/**
 * Display a menu in toolbar and context menu
 * @callback modernKioskMenuSelect
 * @param info Information about the item clicked and the context where the
 * click happened.
 * @param tab The details of the tab where the click took place.
 */
function modernKioskMenuSelect(info, tab) {
  let message;
  let getCurrentWin = browser.windows.getCurrent({populate: true});

  if (info.menuItemId == 'mk-start') {
    getCurrentWin.then(windowInfo => {
      if (kiosk_mode) {
        message = "Modern Kiosk is already in Kiosk Mode";
        mkToContentNotify(kiosk_window_tabs[0], message);
        return;
      } else if (windowInfo.state === "fullscreen") {
        message = "You cannot start Kiosk Mode in full screen";
        mkToContentNotify(tab.id, message);
        return;
      } else {
        modernKioskURL().then(url => startKiosk(url));
      }
    });
  } else if (info.menuItemId == 'mk-preferences') {
    if (kiosk_mode) {
      message = "Work in progress, for the time being this option is disabled";
      message += "from the Kiosk Mode.";
      mkToContentNotify(kiosk_window_tabs[0], message);
      return;
    } else {
      browser.runtime.openOptionsPage().then();
    }
  } else if (info.menuItemId == 'mk-current-url') {
    /** @deprecated left here for debugging */
    modernKioskURL().then(url => browseKiosk(url));
  } else if (info.menuItemId == 'mk-url') {
    modernKioskURL().then(url => {
      getCurrentWin.then(windowInfo => {
        if (kiosk_mode) {
          message = "Option not available in Kiosk Mode";
          mkToContentNotify(kiosk_window_tabs[0], message);
          return;
        } else {
          if (url === info.pageUrl) {
            message = "This URL is already set as your current URL";
            (windowInfo.state === "fullscreen")
            ? mkToContentNotify(tab.id, message)
            : mkNotifications("url-notification", message);
            return;
          } else if (/^about:/i.test(info.pageUrl)) {
            message = "You cannot set 'about:*' URL protocol. "
            message += "Please use http or https schema.\n"
            message += "This could also happen if you have set the Mozilla"
            message += " Firefox Start Page as your Home Page Preference.";
            (windowInfo.state === "fullscreen")
            ? mkToContentNotify(tab.id, message)
            : mkNotifications("about-notification", message);
            return;
          } else if (/^http/.test(info.pageUrl)) {
            message = `URL stored as kiosk URL: ${ info.pageUrl }`;
            browser.storage.local.set({ kiosk_url: info.pageUrl });
            (windowInfo.state === "fullscreen")
            ? mkToContentNotify(tab.id, message)
            : mkNotifications("storage-notification", message);
          }
        }
      });
    });
  }
}

/**
 * Event fired when user do a right click in rounded-square icon in toolbar, or,
 * when click on context menu
 * @event browser#onClicked
 */
browser.menus.onClicked.addListener(modernKioskMenuSelect);

/**
 * Called when user try to close a window.
 * @callback listenerOnRemoved
 * @param {number} wid ID of the window that was closed.
 */
function listenerOnRemoved(wid) {
    console.log(`Closed window: ${ wid }. Permission denied.`);
    modernKioskURL().then(url => startKiosk(url));
    console.log("Window reopened.");
}

/**
 * Event fired when user try to close a window.
 * @event browser#onRemoved
 */
browser.windows.onRemoved.addListener(listenerOnRemoved);

/**
 * Called when user try to change focus to window left behind.
 * @callback listenerFocusChanged
 * @param {number} wid ID of the newly focused window.
 */
function listenerFocusChanged(wid) {
  console.log(`Focus changed on window: ${ wid }`);
  console.log(`MK window: ${ kiosk_window }`);
  if (kiosk_window &&
      (wid === kiosk_window || wid === browser.windows.WINDOW_ID_NONE)
  ) {
    browser.windows.update(
      kiosk_window, {
        focused: true,
        state: "fullscreen"
      }
    );
  }
}

/**
 * Event fired when user try to change focus on window left behind.
 * @event browser#onFocusChanged
 */
browser.windows.onFocusChanged.addListener(listenerFocusChanged);

/**
 * Set in storage.local the default config values when the add-on is installed
 * called when user install the add-on.
 * @callback setDefaultConfig
 */
function setDefaultConfig() {
let mkStorageArea = {
    kiosk_url: "http://example.org/",
    context_enable: true,
    fullscreen_enable: false,
    password_enable: false,
    password_stored: false,
    password: undefined
  }
  browser.storage.local.set(mkStorageArea);
}

/**
 * Enter in kiosk mode on startup if preference "fullscreen_enable"
 * is set to true. Reference to object storage.local.get.
 * @callback arrow function
 * @param {string|Object} item - retrive fullscreen_enable.
 * @returns {Promise} Promise containing object key fullscreen_enable.
 */
const getStorageFullScreen = browser.storage.local.get();
getStorageFullScreen.then((item) => {
  if (item.fullscreen_enable) {
    modernKioskURL().then(url => startKiosk(url));
    console.log("Full Screen mode on startup enabled");
  }
});

/**
 * Event fired when user install the add-on
 * @event browser#onInstalled
 */
browser.runtime.onInstalled.addListener(setDefaultConfig);

/**
 * Event fired when user strike EKC combination to exit Modern Kiosk.
 * @event browser#onCommand
 */
browser.commands.onCommand.addListener(async (command) => {
  try {
    if (command === "exit-kiosk-mode") {
      console.log("Exit Modern Kiosk Mode [Work in progress...]");
      // remove Listeners for onFocusChanged and onRemoved
      browser.windows.onFocusChanged.removeListener(listenerFocusChanged);
      browser.windows.onRemoved.removeListener(listenerOnRemoved);
      // asynchronous function awaiting all process to close windows
      // needed for re-add the Listeners to onFocusChanged and onRemoved events
      const getStorage = browser.storage.local.get();
      await getStorage.then(async (item) => {
        if (item.fullscreen_enable === false &&
            item.password_enable === false
        ) {
          await browser.windows.remove(kiosk_window);
          kiosk_mode = false;
        } else if (item.fullscreen_enable === true &&
            item.password_enable === false
        ) {
          await browser.windows.remove(kiosk_window);
          kiosk_mode = false;
        } else if (item.fullscreen_enable === true &&
            item.password_enable === true
        ) {
          await browser.tabs.sendMessage(
            kiosk_window_tabs[0],
            {ask_kiosk_password: true}
          ).then(async (response) => {
            console.log("Message from the content script:");
            let message;
            if (!response.response) {
              message = "You did not enter any password.\n";
              message += "Or you're closed the password dialog.";
              mkToContentNotify(kiosk_window_tabs[0], message);
              throw new Error("User didn't enter password or canceled dialog");
            } else if (response.response !== item.password) {
              message = "Icorrect password!";
              mkToContentNotify(kiosk_window_tabs[0], message);
              throw new Error(`User populate: ${ message }`);
            } else if (response.response === item.password) {
              console.log("Password OK");
              console.log("Exit Modern Kiosk Mode [Complete...]");
              if (!response.preferences) {
                let allWindows = browser.windows.getAll({ populate: true });
                // close all windows if Firefox start in Kiosk Mode and
                // password is enabled
                await allWindows.then(async (wil) => {
                  for (let wi of wil) {
                    console.log(`Closing window: ${ wi.id }`);
                    console.log(wi.tabs.map((tab) => {return tab.id}));
                    await browser.windows.remove(wi.id);
                  }
                });
              } else {
                // close only Kiosk Window
                await browser.windows.remove(kiosk_window);
              }
              kiosk_mode = false;
            }
          }).catch((error) => {
            console.error(error.message);
            // If user close window, disconnect message, here catch error and
            // reopen the window
            if (/^Error: Message manager disconnected/.test(error)) {
              modernKioskURL().then(url => startKiosk(url));
            }
          });
        }
      });
      // re-adding Listeners removed above
      browser.windows.onRemoved.addListener(listenerOnRemoved);
      browser.windows.onFocusChanged.addListener(listenerFocusChanged);
    }
  } catch (error) { console.error(`Closing failed: ${ error.message }`); }
});

