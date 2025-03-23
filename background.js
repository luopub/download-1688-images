// Service worker for image download functionality
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Message handler for content script communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`[${new Date().toISOString()}] Message received`, {
    action: message.action,
    content: message,
    sender: sender
  });
  if (message.action === 'downloadImages') {
    downloadImages(message.imageUrls);
    sendResponse({status: 'success'});
  }
  return true; // Keep message channel open for async response
});

function downloadImages(imageUrls) {
  imageUrls.forEach((url, index) => {
    chrome.downloads.download({
      url: url,
      filename: `image_${index + 1}.jpg`
    });
  });
}
