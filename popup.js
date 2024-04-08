// document.addEventListener('DOMContentLoaded', function() {
//   var changeColor = document.getElementById('changeColor');

//   changeColor.addEventListener('click', function() {
//     chrome.tabs.executeScript({
//       code: 'document.body.style.backgroundColor = "#ff0000";'
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', function() {
  var changeColor = document.getElementById('changeColor');

  changeColor.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.executeScript(tabs[0].id, {
          code: 'document.body.style.backgroundColor = "#ff0000";'
        });
      }
    });
  });
});
