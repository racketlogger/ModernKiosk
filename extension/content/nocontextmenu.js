/**
 * Reference to object storage.local.get
 * @function StorageArea.get()  
 * @param {Object} context_menu - retrive context_menu item from local storage
 * area
 * @returns {Promise} Promise containing object keys context_menu.disable and
 * context_menu.enable
 */
let getContextMenu = browser.storage.local.get("context_disable");

/**
 * @callback Success callback arrow function
 * @param {boolean} context_menu.disable - If true context menu is disable 
 */
getContextMenu.then((item) => {
  if (item.context_disable) {
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    }, false);
    console.log("Context menu disabled");
  }
});

