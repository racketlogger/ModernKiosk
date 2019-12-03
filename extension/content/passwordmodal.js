/**
 * passwordmodal.js
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
 * @file Content script injected in web pages. Shows a modal when the browser is
 * in Kiosk Mode and is set it up to accept password in conjunction with startup
 * in fullscreen mode. Called when user strike EKC combination (Ctr + Shift + U)
 * @author Hector Castro
 */

"use strict";

// Create curtain or cover to prevent user interact with elements behind
const cover = document.createElement("div");
cover.id = "curtainModal";
cover.className = "curtain_mk";
cover.style.position = "fixed";
cover.style.top = "0px";
cover.style.left = "0px";
cover.style.height = "100%";
cover.style.width = "100%";
cover.style.visibility = "hidden";
cover.style.backgroundColor = "gray";
cover.style.opacity = ".7";
cover.style.zIndex = "1000";

// Create div for password modal container
const passwordModal = document.createElement("div");
passwordModal.id = "passwordModal";
passwordModal.className = "password_container_mk";
passwordModal.style.position = "fixed";
passwordModal.style.left = "50%";
passwordModal.style.top = "50%";
passwordModal.style.marginLeft = "-100px";
passwordModal.style.marginTop = "-100px";
passwordModal.style.padding = "15px";
passwordModal.style.width = "360px";
passwordModal.style.border = "3px solid palevioletred";
passwordModal.style.borderRadius = "0.5em";
passwordModal.style.visibility = "hidden";
passwordModal.style.backgroundColor = "white";
passwordModal.style.zIndex = "1001";

// Create div title
const title = document.createElement("div");
title.className = "title_container_mk";
title.style.display = "inherit";
title.style.position = "absolute";
title.style.height = "27px";
title.style.width = "100%";
title.style.padding = "0px";
title.style.marginLeft = "-15px";
title.style.marginTop = "-15px";
title.style.border = "0px";
title.style.borderRadius = "0px";
title.style.backgroundColor = "palevioletred";

// Create close button
const closeButton = document.createElement("a");
closeButton.textContent = "[\u00D7]";
closeButton.className = "close_button_mk";
closeButton.style.cursor = "pointer";
closeButton.style.font = "normal bold 12px Helvetica,Arial,sans-serif";
closeButton.style.color = "white";
closeButton.style.textAlign = "right";
closeButton.style.cssFloat = "right";
closeButton.style.backgroundColor = "palevioletred";
closeButton.setAttribute("aria-label", "Close");

// Create label for inpunt type password
const labelForInput = document.createElement("label");
labelForInput.textContent = "\ud83d\udddd Please enter kiosk password:";
labelForInput.htmlFor = "password_input";
labelForInput.className = "label_input_mk";
labelForInput.style.display = "block";
labelForInput.style.marginTop = "15px";
labelForInput.style.marginBottom = "5px";
labelForInput.style.font = "normal bold 12px Helvetica,Arial,sans-serif";
labelForInput.style.color = "black";

// Create input type password
const input = document.createElement("input");
input.className = "password_class_mk";
input.id = "password_input";
input.type = "password";
input.style.display = "inline-block";
input.style.position = "relative";
input.style.boxSizing = "border-box";
input.style.marginBottom = "12px";
input.style.width = "100%";
input.style.boxShadow = "0px 0px 6px gray";
input.style.borderRadius = "3px";
input.style.backgroundColor = "gold";

// Create button submit
const buttonSubmit = document.createElement("button");
buttonSubmit.className = "button_submit_mk";
buttonSubmit.textContent = "Submit";
buttonSubmit.style.border = "1px solid darknarange";
buttonSubmit.style.cssFloat = "right";
buttonSubmit.style.backgroundColor = "gold";

// Create checkbox preferences
const checkbox = document.createElement("input");
checkbox.id = "check_preferences";
checkbox.type = "checkbox";
checkbox.className = "checkbox_preferences_mk";
checkbox.style.display = "inline-block";
checkbox.style.marginBottom = "1px";
checkbox.style.verticalAlign = "middle";

// Create label for checkbox preferences
const labelForCheckbox = document.createElement("label");
labelForCheckbox.className = "label_checkbox_mk";
labelForCheckbox.textContent = "Close and show preferences";
labelForCheckbox.htmlFor = "check_preferences";
labelForCheckbox.style.display = "inline-block";
labelForCheckbox.style.font = "normal bold 12px Helvetica,Arial,sans-serif";
labelForCheckbox.style.color = "black";
labelForCheckbox.style.wordWrap = "break-word";

// Append elements to body
passwordModal.appendChild(title);
title.appendChild(closeButton);
passwordModal.appendChild(labelForInput);
passwordModal.appendChild(input);
passwordModal.appendChild(buttonSubmit);
passwordModal.appendChild(checkbox);
passwordModal.appendChild(labelForCheckbox);
document.body.appendChild(cover);
document.body.appendChild(passwordModal);

// See for input transition
input.addEventListener("focusin", (e) => {
  e.target.style.border = "1px solid #79589F";
}, false);

input.addEventListener("focusout", (e) => {
  e.target.style.border = "1px none white";
}, false);

