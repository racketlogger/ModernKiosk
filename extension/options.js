/**
 * options.js
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
 * @file Option page script. This script manage and save the settings of the
 * web-extension.
 * @author Carlos Puchol
 * @author Hector Castro
 */

let getURL = document.querySelector("#mk_url");
let buttonSaveOptions    = document.querySelector("#save");
let getContextEnable     = document.querySelector("#context_menu_enabled");
let getContextDisable    = document.querySelector("#context_menu_disabled");
let getFullscreenEnable  = document.querySelector("#fullscreen_enabled");
let getFullscreenDisable = document.querySelector("#fullscreen_disabled");
let getPassWordEnable    = document.querySelector("#password_enabled");
let getPassWordDisable   = document.querySelector("#password_disabled");
let getPassAlertExist    = document.querySelector("#password_exist");
let getPassAlertNotExist = document.querySelector("#password_not_exist");
let getPassword          = document.querySelector("#mk_password");
let getPasswordConfirm   = document.querySelector("#confirm_password");
let dialog = document.querySelector(".hide-password");

/**
 * Called when user save general preferences settings.
 * @callback saveOptions
 * @param {Object} e Object event fired.
 */
function saveOptions(e) {
  let urlIsEmpty = getURL.value;
  if (!urlIsEmpty) {
    console.log("URL is empty. Please enter an http or https URL.");
    e.preventDefault();
    return;
  }
  let mkStorageArea = {
    kiosk_url: getURL.value,
    context_enable: getContextEnable.checked,
    fullscreen_enable: getFullscreenEnable.checked,
    password_enable: getPassWordEnable.checked
  }
  browser.storage.local.set(mkStorageArea);
  if (!getPassWordEnable.checked) {
    mkStorageArea = {
      password_stored: false,
      password: undefined
    }
    browser.storage.local.set(mkStorageArea);
  }
  let message = "General preferences saved successfully.";
  mkNotifications("preferences-notification", message);
  if (e) { e.preventDefault(); }
}

/**
 * Called when user save password.
 * @callback savePassword
 * @param {Object} e Object event fired.
 */
function savePassword(e) {
  let message;
  const getStorage = browser.storage.local.get();
  getStorage.then((item) => {
    if (!getPassword.value){
      message = "Password box is empty. Please enter a password.";
      mkNotifications("password-notification", message);
    } else if (!getPasswordConfirm.value) {
      message = "Confirm password box is empty. Please confirm password.";
      mkNotifications("confirm-notification", message);
    } else if (getPassword.value !== getPasswordConfirm.value) {
      message = "Password box must match with Password confirmation box.";
      mkNotifications("match-notification", message);
    } else {
      if (!item.password_enable) {
        saveOptions();
      } else {
        message = "Password saved successfully.";
        mkNotifications("save-notification", message);
      }
      let mkStorageArea = {
        password_stored: true,
        password: getPassword.value
      }
      browser.storage.local.set(mkStorageArea);

      // Hide alert about password
      getPassAlertNotExist.style.display = "none";
      getPassAlertExist.style.display    = "none";
    }
  });
  e.preventDefault();
}

/**
 * Called when browser reload the options page.
 * @callback restoreOptions
 */
function restoreOptions() {
  const getStorage = browser.storage.local.get();
  getStorage.then((res) => {
    console.log(`Restoring configuration: ${ res }`);
    getURL.value = res.kiosk_url;
    getContextEnable.checked     = res.context_enable;
    getContextDisable.checked    = !res.context_enable;
    getFullscreenEnable.checked  = res.fullscreen_enable;
    getFullscreenDisable.checked = !res.fullscreen_enable;
    getPassWordEnable.checked    = res.password_enable;
    getPassWordDisable.checked   = !res.password_enable;
    // Show if optional password is visible or hidden
    if (res.password_enable) {
      dialog.style.display = "block";
      buttonSaveOptions.disabled = true;
    } else {
      dialog.style.display = "none";
    }
    // Show alerts about password
    if (res.password_stored) {
      getPassAlertExist.style.display    = "block";
      getPassAlertNotExist.style.display = "none";
    } else {
      getPassAlertExist.style.display    = "none";
      getPassAlertNotExist.style.display = "block";
    }
    // Populate password form
    (!res.password)
    ? getPassword.value = ""
    : getPassword.value = res.password;
  });
}

/**
 * Called when user click on icons (Show, Hide and Cancel) on inputs.
 * @callback changeIcons
 * @param {Object} e Object event fired.
 */
function changeIcons(e) {
  let x = e.offsetX;
  let rectWidth, iconWidth;
  if (e.target.id === "mk_url") {
    rectWidth = getURL.getBoundingClientRect().width;
    iconWidth = rectWidth - 24;
    if (e.type === "mousedown") {
      let style = getComputedStyle(getURL);
      let image = style.backgroundImage;
      if (
          (x >= iconWidth && x <= rectWidth) &&
          (/Cancel.svg"\)$/.test(image))
      ) {
        e.target.value="";
      }
    }
  } else if (
      e.target.id === "mk_password" ||
      e.target.id === "confirm_password"
    ) {
    if (e.target.id === "mk_password" ) {
      rectWidth = getPassword.getBoundingClientRect().width;
    } else if (e.target.id === "confirm_password") {
      rectWidth = getPasswordConfirm.getBoundingClientRect().width;
    }
    iconWidth = rectWidth - 24;
    if (e.type === "click") {
      let style;
      if (e.target.id === "mk_password" ) {
        style = window.getComputedStyle(getPassword);
      } else if (e.target.id === "confirm_password") {
        style = window.getComputedStyle(getPasswordConfirm);
      }
      let image = style.backgroundImage;
      if (
        (x >= iconWidth && x <= rectWidth) &&
        (/Show.svg"\)$/.test(image))
      ) {
        e.target.type = "password";
        e.target.style.backgroundImage = "url('icons/Hide.svg')";
      } else if (
          (x >= iconWidth && x <= rectWidth) &&
          (/Hide.svg"\)$/.test(image))
      ) {
        e.target.type = "text";
        e.target.style.backgroundImage = "url('icons/Show.svg')";
      }
    }
  }
  // Control cursor on inputs [text/url/password]
  if (e.type === "mousemove") {
    if (x >= iconWidth && x <= rectWidth) {
      e.target.style.cursor = "pointer";
    } else {
      e.target.style.cursor = "auto";
    }
  }
}

/**
 * Called when user click on "enable optional password" pref.
 * Show/Hide alert messages: "password_not_exist" and "password_exist"
 * @callback passVisibilityStatus
 * @param {Object} e Object event fired.
 */
function passVisibilityStatus(e) {
  if (e.target.id === "password_enabled") {
    if (!getFullscreenEnable.checked) {
      getPassWordDisable.checked = true;
      let message = "Please enable Start Firefox in Kiosk Mode first.\n";
      message += "The preference was not applied.";
      mkNotifications("save-notification", message);
    } else {
      dialog.style.display = "block";
      buttonSaveOptions.disabled = true;
    }
  } else if (e.target.id === "password_disabled") {
    dialog.style.display = "none";
    buttonSaveOptions.disabled = false;
  } else if (e.target.id === "fullscreen_disabled") {
    //Preference "password_enable" disabled if the user has enabled it
    console.log("Preference 'password_enable' disabled");
    getPassWordDisable.checked = true;
    dialog.style.display = "none";
    buttonSaveOptions.disabled = false;
  }
}

/**
 * Event fired when browser reload the options page.
 * @event document#DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", restoreOptions);

/**
 * Event fired when user save the settings in the option page.
 * @event document#click
 */
buttonSaveOptions.addEventListener("click", saveOptions);

/**
 * Event fired when user save the optional password
 * @event document#click
 */
document.querySelector("#save_password")
  .addEventListener("click", savePassword);

/**
 * Events fired when user click on input icons: url and passwords
 * @event document#click
 * @event document#mousedown
 * @event document#mousemove
 */
//input=>url
getURL.addEventListener("mousedown", changeIcons);
getURL.addEventListener("mousemove", changeIcons);

//input=>password
getPassword.addEventListener("click", changeIcons);
getPassword.addEventListener("mousemove", changeIcons);

//input=>confirm password
getPasswordConfirm.addEventListener("click", changeIcons);
getPasswordConfirm.addEventListener("mousemove", changeIcons);

/**
 * Events fired when user click on "enable/disable optional password" pref.
 * @event document#click
 * @event document#mousedown
 * @event document#mousemove
 */
getPassWordEnable.addEventListener("click", passVisibilityStatus);
getPassWordDisable.addEventListener("click", passVisibilityStatus);
getFullscreenDisable.addEventListener("click", passVisibilityStatus);

