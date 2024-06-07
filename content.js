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

function getProductId1688() {
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

  const productId = getProductId1688()

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


function getAsinAmazon() {
  // Get the current URL
  const currentUrl = window.location.href;

  // Parse the URL and get the path
  const parsedUrl = new URL(currentUrl);
  const path = parsedUrl.pathname;

    // Regular expression to extract the file base name
  const fileNameRegex = /^.*\/dp\/([0-9A-Z]{10})\/.*/;

  // Extract the file base name
  const match = path.match(fileNameRegex);
  const filename = match ? match[1] : 'Unkown Product';

  console.log('File base name:', filename);

  return filename
}


function getImageUrlsAmazon() {
  // const xpath = '//*[@id="main-image-container"]/ul/li[contains(@class, "image")][contains(@class, "item")]/span/span/div/img';
  const xpath = '//*[@id="altImages"]/ul/li[contains(@class, "imageThumbnail")]//span[@class="a-button-text"]/img'
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
    // 检查data-old-hires属性是否存在
    // if (thisNode.hasAttribute('data-old-hires')) {
    //   console.log('data-old-hires', thisNode.getAttribute('data-old-hires'));
    //   // 如果存在，将data-old-hires属性的值添加到imageUrls数组
    //   imageUrls.push(thisNode.getAttribute('data-old-hires'));
    // } else {
    // "https://m.media-amazon.com/images/I/51zOE3g2OqL._AC_US100_.jpg" => "https://m.media-amazon.com/images/I/51zOE3g2OqL.jpg"
    const match = thisNode.src.match('^(.*)+\\.([^\\.]+)\\.([^\\.]+)$')
    let src;
    if (match && match.length == 4) {
      src = match[1] + '.' + match[3]
    } else {
      src = thisNode.src
    }
    console.log('src', thisNode.src, src);
    // 如果不存在，将src属性的值添加到imageUrls数组
    imageUrls.push(src);
  }

  const asin = getAsinAmazon()

  return imageUrls.map((url, i) => {
    const parsedUrl = new URL(url);
    const match = parsedUrl.pathname.match(/\.([^.]+)$/)
    const ext = match ? match[1] : 'jpg'
    return {
      filename: asin + '-main-' + i + '.' + ext,
      url: url
    }
  });
}

function getTemuGoodsId() {
  // Get the current URL
  const currentUrl = window.location.href;

  // Parse the URL and get the path
  const parsedUrl = new URL(currentUrl);
  const path = parsedUrl.pathname;

  // Extract the file base name
  const match = path.match(/^.*\-([0-9]+)\.html$/);
  const goodsId = match ? match[1] : 'Unkown Product';

  console.log('goodsId:', goodsId);

  return goodsId
}

function getImageUrlsTemu() {
  const xpath = '//div[@class="baseContent"]//div[@tabindex="0"]//div[@data-index]/img'
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
    const match = thisNode.src.match(/^([^\\?]+)\\?.*$/)
    let src;
    if (match && match.length == 2) {
      src = match[1]
    } else {
      src = thisNode.src
    }
    console.log('src', thisNode.src, src);
    // 如果不存在，将src属性的值添加到imageUrls数组
    imageUrls.push(src);
  }

  const goodsId = getTemuGoodsId()

  return imageUrls.map((url, i) => {
    const parsedUrl = new URL(url);
    const match = parsedUrl.pathname.match(/\.([^.]+)$/)
    const ext = match ? match[1] : 'jpg'
    return {
      filename: goodsId + '-main-' + i + '.' + ext,
      url: url
    }
  });
}

function getImageUrls() {
  const urls1688 = getImageUrls1688()
  if (urls1688.length > 0) {
    return urls1688
  }

  const urlsAmazon = getImageUrlsAmazon()
  if (urlsAmazon.length > 0) {
    return urlsAmazon
  }

  const urlsTemu = getImageUrlsTemu()
  if (urlsTemu.length > 0) {
    return urlsTemu
  }

  return []
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('chrome.runtime.onMessage', request);
  if (request.action === 'getImageUrls') {
    const imageUrls = getImageUrls();
    console.log('Got imageUrls', imageUrls)
    sendResponse({ imageUrls: imageUrls });
  }
});