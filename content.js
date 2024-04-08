function getImageUrls() {
  const iterator = document.evaluate(
    '//img[@class="detail-gallery-img"]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  const imageUrls = [];
  let thisNode = null;
  let i = 0;
  while ((thisNode = iterator.snapshotItem(i++))) {
    imageUrls.push(thisNode.src);
  }

  return imageUrls;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('chrome.runtime.onMessage', request);
  if (request.action === 'getImageUrls') {
    const imageUrls = getImageUrls();
    console.log('Got imageUrls', imageUrls)
    sendResponse({ imageUrls: imageUrls });
  }
});