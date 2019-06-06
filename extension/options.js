function saveOptions(e) {
  browser.storage.local.set({
    kiosk_url: document.querySelector("#mk_url").value,
    context_enable: document.querySelector("#context_menu_enabled").checked,
    context_disable: document.querySelector("#context_menu_disabled").checked
  });
  e.preventDefault();
}

function restoreOptions() {
  // var storageItem = browser.storage.local.get('kiosk_url');
  // storageItem.then((res) => {
  //   document.querySelector("#managed-colour").innerText = res.colour;
  // });

  var gettingItem = browser.storage.local.get();
  gettingItem.then((res) => {
    let getURL = document.querySelector("#mk_url");
    let getContextEnable  = document.querySelector("#context_menu_enabled");
    let getContextDisable = document.querySelector("#context_menu_disabled");
    getURL.value = res.kiosk_url;
    getContextEnable.checked  = res.context_enable;
    getContextDisable.checked = res.context_disable;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#save").addEventListener("click", saveOptions);
