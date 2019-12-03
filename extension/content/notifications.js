/**
 * notifications.js
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
 * @file Content script injected in web pages to create modals for notifications
 * @author Hector Castro
 */

"use strict";

// Create div for modal container
const containerNotify = document.createElement("div");
containerNotify.id = "messageModal";
containerNotify.className = "message_container_mk";
containerNotify.style.position = "fixed";
containerNotify.style.left = "75%";
containerNotify.style.top = "85%";
containerNotify.style.marginLeft = "-100px";
containerNotify.style.marginTop = "-100px";
containerNotify.style.padding = "15px";
containerNotify.style.width = "300px";
containerNotify.style.border = "3px solid silver";
containerNotify.style.borderRadius = "0.5em";
containerNotify.style.visibility = "hidden";
containerNotify.style.backgroundColor = "gray";

// Create div notify
const notify = document.createElement("div");
notify.className = "notification_mk";
notify.style.width = "100%";
notify.style.padding = "0px";
notify.style.marginTop = "15px";
notify.style.border = "0px";
notify.style.borderRadius = "0px";
notify.style.backgroundColor = "gray";
notify.style.font = "normal bold 12px Helvetica,Arial,sans-serif";
notify.style.color = "black";

// Create div title
const titleNotify = document.createElement("div");
titleNotify.className = "title_container_mk";
titleNotify.style.display = "inherit";
titleNotify.style.position = "absolute";
titleNotify.style.height = "27px";
titleNotify.style.width = "100%";
titleNotify.style.padding = "0px";
titleNotify.style.marginLeft = "-15px";
titleNotify.style.marginTop = "-15px";
titleNotify.style.border = "0px";
titleNotify.style.borderRadius = "0px";
titleNotify.style.backgroundColor = "silver";

// Create close button
const closeBtn = document.createElement("a");
closeBtn.textContent = "[\u00D7]";
closeBtn.style.cursor = "pointer";
closeBtn.style.font = "normal bold 12px Helvetica,Arial,sans-serif";
closeBtn.style.color = "black";
closeBtn.style.textAlign = "right";
closeBtn.style.cssFloat = "right";
closeBtn.style.backgroundColor = "silver";
closeBtn.setAttribute("aria-label", "Close");

// Append elements to body
titleNotify.appendChild(closeBtn);
containerNotify.appendChild(titleNotify);
containerNotify.appendChild(notify);
document.body.appendChild(containerNotify);

// Hide container when user click in close button
closeBtn.addEventListener("click", (e) => {
  containerNotify.style.visibility = "hidden";
  e.preventDefault();
}, false);

