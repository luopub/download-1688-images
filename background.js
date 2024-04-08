chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getImageUrls' }, function(response) {
        if (response && response.imageUrls) {
          downloadImages(response.imageUrls);
        }
      });
    }
  });
});
