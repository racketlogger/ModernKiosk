/**
 * listener.js
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
 * @file Content script injected in web pages to handle notifications, EKC and
 * submit password.
 * @requires passwordmodal
 * @requires notifications
 * @author Hector Castro
 */

/**
 * Listener/Handle requests for browser.notifications and
 * browser.tabs.sendMessage from the background script.
 *
 * @async
 * @function handleData
 * @param {Object} request - request.ask_kiosk_password (if true show password
 * modal), request.message and request.send_notification (if true show
 * notification).
 * @return {Promise<Object>} The data from the password modal.
 */
async function handleData(request) {
  try {
    if (request.ask_kiosk_password) {
      // Callback Submit - resolve or reject a Promise
      function Submit(resolve, reject) {
          let passResult = input.value;
          if (!passResult) {
            reject(new Error("Password empty error"));
          } else {
            resolve(passResult);
          }
      }
      //show/hide password modal and prevent user to click behind
      let modalLauncher = (value) => {
        if (value === "hide") {
          cover.style.visibility       = "hidden";
          passwordModal.style.visibility   = "hidden";
          document.body.style.overflow = "visible";
        } else if (value === "show") {
          cover.style.visibility       = "visible";
          passwordModal.style.visibility   = "visible";
          document.body.style.overflow = "hidden";
        } else {
          throw new Error(`Param ${ value } not supported`);
        }
      }

      let getSubmit = new Promise((resolve, reject) => {
        // Hide password modal when user submit password and resolve o reject
        // a Promise
        buttonSubmit.addEventListener("click", (e) => {
          modalLauncher("hide");
          Submit(resolve, reject);
          e.preventDefault();
        }, {once: true});

        // Show password modal when user strike "Enter" or "NumpadEnter" or;
        // hide password modal when user strike "Escape" and reject Promise
        input.addEventListener("keyup", (e) => {
          if (e.defaultPrevented) {
            return;
          }
          switch (e.code) {
           case "NumpadEnter":
             modalLauncher("hide");
             Submit(resolve, reject);
             break;
           case "Escape":
             modalLauncher("hide");
             reject(new Error("User striked Escape"));
             break;
          }
          e.preventDefault();
        }, true);
        // Hide password modal when user click close button and reject Promise
        closeButton.addEventListener("click", (e) => {
          modalLauncher("hide");
          reject(new Error("User closed modal dialog"));
          e.preventDefault();
        }, false);
      });

      console.log("Message from the background script:");
      console.log("Ask for password");

      // Show password modal
      modalLauncher("show");

      // await for the user enter password, return input.value
      let password = await getSubmit.then(value => {
        return value;
      }).catch(error => { console.log(error.message); });

      if (password) {
        input.value = "";
        if (!checkbox.checked) {
          return Promise.resolve({response: password, preferences: false});
        } else {
          return Promise.resolve({response: password, preferences: true});
        }
      } else {
        input.value = "";
        return Promise.resolve({response: false});
      }
    } else if (request.send_notification) {
      containerNotify.style.visibility = "visible";
      notify.textContent = request.message;
    } else {
      throw new Error("Request failed...");
    }
  } catch (error) {
    console.log("Message from the background script failed:", error);
  }
}

browser.runtime.onMessage.addListener(handleData);

