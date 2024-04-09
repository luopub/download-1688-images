document.addEventListener('DOMContentLoaded', function() {
  var downloadImages = document.getElementById('downloadImages');

  downloadImages.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        console.log('sendMessage to ', tabs[0])
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getImageUrls' }, function(response) {
          console.log('Response', response)
          if (response && response.imageUrls) {
            // downloadImages(response.imageUrls);
            (function (imageUrls) {
              console.log('downloadImages', imageUrls)
              imageUrls.forEach(function(url) {
                let filename
                let theUrl

                if (typeof url === 'string') {
                  filename = url.substring(url.lastIndexOf('/') + 1);
                  theUrl = url
                } else {
                  filename = url.filename
                  theUrl = url.url
                }
                chrome.downloads.download({ url: theUrl, filename: filename });
              })
            })(response.imageUrls);
          }
        });
      }
    });
  });
});
