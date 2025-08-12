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

function getImageUrlsByXpath2(xpath) {
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
    imageUrls.push(thisNode.getAttribute('data-src'));
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
  const filename = match ? match[1] : '';

  console.log('File base name:', filename);

  return filename
}

function getImageUrls1688_old() {
  if (window.location.href.indexOf('1688.com') < 0) {
    return []
  }
  const imagesMain = getImageUrlsByXpath('//img[contains(@class,"detail-gallery-img")]')
  const imagesDetail = getImageUrlsByXpath('//div[contains(@class,"content-detail")]//img')

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

// 获取页面中所有的 shadow root
function getAllShadowRoots(node = document.body) {
  let shadowRoots = [];
  if (node.shadowRoot) {
      shadowRoots.push(node.shadowRoot);
  }
  for (let child of node.children) {
      shadowRoots = shadowRoots.concat(getAllShadowRoots(child));
  }
  return shadowRoots;
}

// 在指定的 shadow root 中查找符合 CSS 选择器的 img 元素
function findImagesInShadowRoot(shadowRoot, selector) {
  return Array.from(shadowRoot.querySelectorAll(selector));
}

// 获取所有 shadow root 中的 img 元素的 src 属性
function getAllImageSrcsInShadowRoots(selector) {
  let allSrcs = [];
  let shadowRoots = getAllShadowRoots();
  for (let shadowRoot of shadowRoots) {
      let images = findImagesInShadowRoot(shadowRoot, selector);
      for (let img of images) {
          if (img.src) {
              allSrcs.push(img.src);
          }
      }
  }
  return allSrcs;
}

// 使用示例
// let selector = 'div#detail img'; // 将 XPath 转换为 CSS 选择器
// let imageSrcs = getAllImageSrcsInShadowRoots(selector);
// console.log(imageSrcs);

function getImageUrls1688() {
  // 1688前端更新了-20250323
  if (window.location.href.indexOf('1688.com') < 0) {
    return []
  }
  const imagesMain_raw = getImageUrlsByXpath('//div[contains(@class, "od-gallery-turn-item-wrapper")]/img[@class="od-gallery-img"]')
  const imagesMain = imagesMain_raw.map(v => v.replace('jpg_b.jpg', 'jpg'))
  const imagesDetail = getAllImageSrcsInShadowRoots('div#detail img')

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


function getImageUrlsTmall() {
  if (window.location.href.indexOf('detail.tmall.com') < 0) {
    return [];
  }

  // 获取商品 ID
  const parsedUrl = new URL(window.location.href);
  const productId = parsedUrl.searchParams.get('id') || 'unknown';

  // 获取轮播图列表
  const mainImagesXpath = '//div[@id="left-content-area"]//div[starts-with(@class,"picGallery--")]//div[starts-with(@class,"thumbnailItem--")]/img';
  const mainImagesRaw = getImageUrlsByXpath(mainImagesXpath);
  const mainImages = mainImagesRaw.map(url => url.replace(/_q50\.jpg_\.webp$/, ''));

  // 获取 SKU 图列表
  const skuImagesXpath = '//div[starts-with(@class,"skuValueWrap--")]//div[starts-with(@class,"valueItemImgWrap--")]/img';
  const skuImagesRaw = getImageUrlsByXpath(skuImagesXpath);
  const skuImages = skuImagesRaw.map(url => url.replace(/_90x90q30\.jpg_\.webp$/, ''));

  // 获取详情图列表
  const detailImagesXpath1 = '//div[@class="descV8-richtext"]//img';
  const detailImagesRaw1 = getImageUrlsByXpath(detailImagesXpath1); // 使用 getImageUrlsByXpath 获取 src 属性
  const detailImages1 = detailImagesRaw1.filter(url => url.includes('.jpg'));
  const detailImagesXpath2 = '//div[@class="descV8-richtext"]//img';
  const detailImagesRaw2 = getImageUrlsByXpath2(detailImagesXpath2);  // 使用 getImageUrlsByXpath2 获取 data-src 属性
  const detailImages2 = detailImagesRaw2.filter(url => url.includes('.jpg'));
  const detailImages = [...detailImages1, ...detailImages2];

  // 合并结果
  const imageUrls = [];

  mainImages.forEach((url, i) => {
    imageUrls.push({
      filename: `${productId}-main-${i}.jpg`,
      url: url
    });
  });

  skuImages.forEach((url, i) => {
    imageUrls.push({
      filename: `${productId}-sku-${i}.jpg`,
      url: url
    });
  });

  detailImages.forEach((url, i) => {
    imageUrls.push({
      filename: `${productId}-detail-${i}.jpg`,
      url: url
    });
  });

  return imageUrls;
}

function getImageUrlsAmazon_old() {
  if (window.location.href.indexOf('amazon.com') < 0) {
    return []
  }
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

function extractJsonSubstring(str) {
  const startIndex = str.indexOf('\'{"');
  const endIndex = str.indexOf('"}\'', startIndex);

  if (startIndex !== -1 && endIndex !== -1) {
      return str.slice(startIndex + 1, endIndex + 2); // +2 to include the "}"
  }

  return null;
}

function getScriptContentByXPath(xpath) {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    console.error('This function is meant to be run in a browser environment.');
    return null;
  }

  // Create an XPath evaluator
  const evaluator = new XPathEvaluator();

  // Create an XPath expression
  const expression = evaluator.createExpression(xpath);

  // Evaluate the XPath expression
  const result = expression.evaluate(
    document,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  // Check if a node was found
  if (result.singleNodeValue) {
    // Return the text content of the script tag
    return result.singleNodeValue.textContent;
  } else {
    console.log('No matching script tag found.');
    return null;
  }
}

function getImageUrlsAmazon() {
  if (window.location.href.indexOf('amazon.com') < 0) {
    return []
  }
  // Valid for those who have multiple color SKUs
  let scriptContent = getScriptContentByXPath('//script[contains(text(), "jQuery.parseJSON")]')
  console.log('scriptContent1 length', scriptContent.length);

  let jsonContent = extractJsonSubstring(scriptContent)
  console.log('jsonContent1 length', jsonContent.length);
  console.log('jsonContent1', JSON.parse(jsonContent));

  let jsonObject = JSON.parse(jsonContent)

  let images = new Set()

  if (Object.keys(jsonObject.colorImages).length > 0) {
    for (let color in jsonObject.colorImages) {
      console.log('color', color);
      console.log('colorImages', jsonObject.colorImages[color]);
      for (let i in jsonObject.colorImages[color]) {
        images.add(jsonObject.colorImages[color][i].hiRes)
      }
    }
  } else {
    // Otherwise, the link should have single SKU
    scriptContent = getScriptContentByXPath('//script[contains(text(), "ImageBlockATF")]')
    console.log('scriptContent2 length', scriptContent.length);

    // Find colorImages
    let regex = /'colorImages': *.*?\}\]\}/g;

    let matches = scriptContent.match(regex);

    if (matches.length > 0) {
      let func = new Function('{' + matches[0].replace("'colorImages':", 'return') + '}');
      let colorImages = func()
      colorImages.initial.forEach(v => {
        images.add(v.hiRes)
      })
    }
  }
  console.log('images count', images.size);

  const asin = getAsinAmazon()

  // Remove invalid elements, then map to object required by downloader.
  return [...images].filter(v=>!!v).map((v,i) => {
    const parsedUrl = new URL(v);
    const match = parsedUrl.pathname.match(/\.([^.]+)$/)
    const ext = match ? match[1] : 'jpg'
    return {
      filename: asin + '-main-' + i + '.' + ext,
      url: v
    }
  })
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
  if (window.location.href.indexOf('temu.com') < 0) {
    return []
  }
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
    let src;
    if (thisNode.hasAttribute('src')) {
      src = thisNode.getAttribute('src');
    } else if (thisNode.hasAttribute('data-src')) {
      // 如果还未显示过的主图，就没有src属性
      src = thisNode.getAttribute('data-src');
    } else {
      continue;
    }
    const match = src.match(/^([^\\?]+)\\?.*$/)
    if (match && match.length == 2) {
      src = match[1]
    } else {
      src = thisNode.src
    }
    console.log('src', thisNode.src, src);
    if (src && src.startsWith('http')) {
      imageUrls.push(src);
    }
  }

  const goodsId = getTemuGoodsId()

  return imageUrls.map((url, i) => {
    const parsedUrl = new URL(url);
    const match = parsedUrl.pathname.match(/\.([^.]+)$/)
    const ext = match ? match[1] : 'jpg'
    return {
      filename: 'T' + goodsId + '-main-' + i + '.' + ext,
      url: url
    }
  });
}

function getWalmartProductIdFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(part => part.length > 0); // Split by '/' and remove empty strings

    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      // Check if the last part is a number using a regular expression
      if (/^\d+$/.test(lastPart)) {
        return lastPart;
      }
    }
    return null; // Return null if no numeric ID is found at the end
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

function getImageUrlsWalmart() {
  if (window.location.href.indexOf('walmart.com') < 0) {
    return []
  }
  // 1. Get text content of element with id="__NEXT_DATA__" as json format
  const dataElement = document.getElementById("__NEXT_DATA__");
  let jsonData = {};
  if (dataElement) {
    try {
      jsonData = JSON.parse(dataElement.textContent);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return []; // Return empty list if parsing fails
    }
  } else {
    return []; // Return empty list if element not found
  }

  // 2. Get json object props.pageProps.initialData.data.product.imageMap
  const imageMap = jsonData?.props?.pageProps?.initialData?.data?.product?.imageMap;

  // 3. Get url values from imageMap (assuming it's a dictionary)
  const imageUrls = imageMap ? Object.values(imageMap).map(item => item.url) : [];

  const productId = getWalmartProductIdFromUrl(window.location.href)

  return imageUrls.map((url, i) => {
    const parsedUrl = new URL(url);
    const match = parsedUrl.pathname.match(/\.([^.]+)$/)
    const ext = match ? match[1] : 'jpg'
    return {
      filename: 'W' + productId + '-main-' + i + '.' + ext,
      url: url
    }
  });
}

function getImageUrls() {
  const urls1688 = getImageUrls1688()
  if (urls1688.length > 0) {
    return urls1688
  } else {
    const urls1688_old = getImageUrls1688_old()
    if (urls1688_old.length > 0) {
      return urls1688_old
    }
  }

  const urlsAmazon = getImageUrlsAmazon()
  if (urlsAmazon.length > 0) {
    return urlsAmazon
  }

  const urlsTemu = getImageUrlsTemu()
  if (urlsTemu.length > 0) {
    return urlsTemu
  }

  const urlsWalmart = getImageUrlsWalmart()
  if (urlsWalmart.length > 0) {
    return urlsWalmart
  }

  const urlsTmall = getImageUrlsTmall()
  if (urlsTmall.length > 0) {
    return urlsTmall
  }

  return []
}

function get1688LinkId() {
  // 1688产品的linkId是由产品ID和公司名称拼接而成的：<productId>-<companyName>
  // productId从URL中获取，通过函数getProductId1688()得到
  // companyName从页面中通过xpath获取：//a[contains(@class,"shop-company-name")]/h1/text()
  if (window.location.href.indexOf('1688.com/offer/') < 0) {
    return ''
  }
  const xpath1 = "//a[contains(@class,'shop-company-name')]/h1/text()"
  const iterator1 = document.evaluate(
    xpath1,
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  
  const it = iterator1.snapshotItem(0);
  return getProductId1688() + '-' + it.textContent
}

function getTmallTaobaoLinkId() {
  // Tmall产品的linkId是由产品ID和店铺名称拼接而成的：tmall<id>-<shopname>
  // id从URL中获取查询参数id
  // shopname从页面中通过xpath获取：//span[starts-with(@class, "shopName--")]/text()
  if (window.location.href.indexOf('tmall.com') >= 0) {
    prefix = 'tmall'
  } else if (window.location.href.indexOf('item.taobao.com') >= 0) {
    prefix = 'taobao'
  } else {
    return ''
  }
  
  // 从URL中获取id参数
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) {
    return '';
  }

  // 通过XPath获取店铺名称
  const xpath = "//span[starts-with(@class, 'shopName--')]";
  const iterator = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  
  const shopNameNode = iterator.snapshotItem(0);
  if (!shopNameNode) {
    return '';
  }

  const shopName = shopNameNode.textContent.trim();
  return `${prefix}${id}-${shopName}`;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`[${new Date().toISOString()}] Message received`, {
    action: request.action,
    content: request,
    sender: sender
  });
  if (request.action === 'getImageUrls') {
    try {
      const imageUrls = getImageUrls();
      console.log('Got imageUrls', imageUrls);
      sendResponse({ 
        status: 'success',
        imageUrls: imageUrls
      });
    } catch (error) {
      console.error('Error getting image URLs:', error);
      sendResponse({ 
        status: 'error',
        message: error.message 
      });
    }
    return true; // Keep message channel open for async response
  }
  else if (request.action === 'get1688LinkId') {
    const linkId = get1688LinkId();
    if (!linkId) {
      sendResponse({ 
        status: 'error',
        message: 'Failed to get 1688 link ID' 
      });
      return true; // Keep message channel open for async response
    }
    console.log('Got 1688 linkId', linkId);
    sendResponse({ 
      status: 'success',
      linkId: linkId
    });
    return true; // Keep message channel open for async response
  }
  else if (request.action === 'getTmallTaobaoLinkId') {
    const linkId = getTmallTaobaoLinkId();
    if (!linkId) {
      sendResponse({ 
        status: 'error',
        message: 'Failed to get Tmall link ID' 
      });
      return true; // Keep message channel open for async response
    }
    console.log('Got Tmall linkId', linkId);
    sendResponse({ 
      status: 'success',
      linkId: linkId
    });
    return true; // Keep message channel open for async response
  }
});
