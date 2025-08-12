document.addEventListener('DOMContentLoaded', () => {
  const buttonDownloadImages = document.getElementById('downloadImages');
  const buttonGet1688LinkId = document.getElementById('get1688LinkId');
  const statusMessage = document.getElementById('statusMessage');

  buttonDownloadImages.addEventListener('click', async () => {
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

  buttonGet1688LinkId.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      console.log(`[${new Date().toISOString()}] Sending message`, {
        action: 'get1688LinkId',
        tabId: tab.id,
        tabUrl: tab.url
      });
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'get1688LinkId'
      });

      if (response.status === 'success') {
        statusMessage.textContent = response.linkId;
        statusMessage.style.color = 'green';
        navigator.clipboard.writeText(response.linkId);
      } else {
        throw new Error(response.message || 'Failed to Get 1688 Link Id');
      }
    } catch (error) {
      statusMessage.textContent = `Error: ${error.message}`;
      statusMessage.style.color = 'red';
      console.error('Get 1688 Link Id error:', error);
    }
  });

  const buttonGetTmallLinkId = document.getElementById('getTmallLinkId');
  buttonGetTmallLinkId.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      console.log(`[${new Date().toISOString()}] Sending message`, {
        action: 'getTmallLinkId',
        tabId: tab.id,
        tabUrl: tab.url
      });
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'getTmallLinkId'
      });

      if (response.status === 'success') {
        statusMessage.textContent = response.linkId;
        statusMessage.style.color = 'green';
        navigator.clipboard.writeText(response.linkId);
      } else {
        throw new Error(response.message || 'Failed to Get Tmall Link Id');
      }
    } catch (error) {
      statusMessage.textContent = `Error: ${error.message}`;
      statusMessage.style.color = 'red';
      console.error('Get Tmall Link Id error:', error);
    }
  });
});

