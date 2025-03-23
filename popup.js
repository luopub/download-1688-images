document.addEventListener('DOMContentLoaded', () => {
  const downloadImages = document.getElementById('downloadImages');
  const statusMessage = document.getElementById('statusMessage');

  downloadImages.addEventListener('click', async () => {
    statusMessage.textContent = 'Fetching image URLs...';
    statusMessage.style.color = 'black';
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      console.log(`[${new Date().toISOString()}] Sending message`, {
        action: 'getImageUrls',
        tabId: tab.id,
        tabUrl: tab.url
      });
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'getImageUrls'
      });

      if (response.status === 'success') {
        statusMessage.textContent = `Downloading ${response.imageUrls.length} images...`;
        statusMessage.style.color = 'green';
        
        // Send download request to background service worker
        console.log(`[${new Date().toISOString()}] Sending message`, {
          action: 'downloadImages',
          imageUrlsCount: response.imageUrls.length,
          tabId: tab.id,
          tabUrl: tab.url
        });
        chrome.runtime.sendMessage({
          action: 'downloadImages',
          imageUrls: response.imageUrls
        });
      } else {
        throw new Error(response.message || 'Failed to get image URLs');
      }
    } catch (error) {
      statusMessage.textContent = `Error: ${error.message}`;
      statusMessage.style.color = 'red';
      console.error('Download error:', error);
    }
  });
});
