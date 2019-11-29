/**
 * nocontextmenu.js
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
 * @file Content script injected in web pages to disable the context menu of
 * the browser.
 * @author Hector Castro
 */

/**
 * @function StorageArea.get()
 * @param {string|Object} context_menu - retrive context_menu item from local
 * storage area.
 * @returns {Promise} Promise containing object keys context_enable
 */

let getContextMenu = browser.storage.local.get("context_enable");

/**
 * @callback Success callback arrow function
 * @param {boolean} item.context_enable - If false context menu is disable
 * @event window#contextmenu
 */
getContextMenu.then((item) => {
  if (item.context_enable === false) {
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    }, false);
    console.log("Context menu disabled");
  }
});

