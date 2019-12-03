/**
 * mk_utils.js
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
 * @file Background script for the web-extension to display notifications
 * @author Carlos Puchol
 * @author Hector Castro
 */

/**
 * Notifications to users
 * @function mkNotifications
 * @param {string} id To refer this notification.
 * @param {string} message Message to display.
 */
function mkNotifications(id, message) {
  browser.notifications.create(id, {
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/mk.svg"),
    "title": "Modern Kiosk Notifications",
    "message": message
  });
}


/**
 * Notifications to users when browser status is in full screen
 * useful when some OS does not show notifications in full screen
 * @function mkToContentNotify
 * @param {string} tabid Tab where notification will display
 * @param {string} message Message to display.
 */
function mkToContentNotify(tabid, msg_content) {
  browser.tabs.sendMessage(
    tabid,
    {send_notification: true, message: msg_content}
  );
}

