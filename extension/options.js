function saveOptions(e) {
  browser.storage.local.set({
    kiosk_url: document.querySelector("#mk_url").value
  });
  e.preventDefault();
}

function restoreOptions() {
  // var storageItem = browser.storage.local.get('kiosk_url');
  // storageItem.then((res) => {
  //   document.querySelector("#managed-colour").innerText = res.colour;
  // });

  var gettingItem = browser.storage.local.get('kiosk_url');
  gettingItem.then((res) => {
    document.querySelector("#mk_url").value = res.kiosk_url || 'https://www.google.com';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#save").addEventListener("click", saveOptions);
