function getImageUrlsByXpath(xpath) {
  const iterator = document.evaluate(
    xpath,
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

function getProductId() {
  // Get the current URL
  const currentUrl = window.location.href;

  // Parse the URL and get the path
  const parsedUrl = new URL(currentUrl);
  const path = parsedUrl.pathname;

    // Regular expression to extract the file base name
  const fileNameRegex = /([^/]+)\.html$/;

  // Extract the file base name
  const match = path.match(fileNameRegex);
  const filename = match ? match[1] : 'Unkown Product';

  console.log('File base name:', filename);

  return filename
}

function getImageUrls1688() {
  const imagesMain = getImageUrlsByXpath('//img[@class="detail-gallery-img"]')
  const imagesDetail = getImageUrlsByXpath('//div[@class="content-detail"]//img')

  if (imagesDetail.filter(v=>v.indexOf('lazyload.png')>=0).length > 0) {
    alert('请将网页拉到底后再下载！')
    return []
  }
  
  const imageUrls = []

  const productId = getProductId()

  imagesMain.forEach((url, i) => {
    const parsedUrl = new URL(url);
    const match = parsedUrl.pathname.match(/\.([^.]+)$/)
    const ext = match ? match[1] : 'jpg'
    imageUrls.push({
      filename: productId + '-main-' + i + '.' + ext,
      url: url
    })
  })

  imagesDetail.forEach((url, i) => {
    const parsedUrl = new URL(url);
    const match = parsedUrl.pathname.match(/\.([^.]+)$/)
    const ext = match ? match[1] : 'jpg'
    imageUrls.push({
      filename: productId + '-detail-' + i + '.' + ext,
      url: url
    })
  })

  return imageUrls
}

function getImageUrls() {
  const urls1688 = getImageUrls1688()
  if (urls1688.length > 0) {
    return urls1688
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('chrome.runtime.onMessage', request);
  if (request.action === 'getImageUrls') {
    const imageUrls = getImageUrls();
    console.log('Got imageUrls', imageUrls)
    sendResponse({ imageUrls: imageUrls });
  }
});