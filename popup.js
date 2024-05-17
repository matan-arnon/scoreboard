var mlb_api_url = "http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1"

window.onload = function() {
    console.log("Curling mlb stats")
    httpGet(mlb_api_url)

    document.querySelector('#go-to-options').addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
    });
}



function httpGet(theUrl)
{
    fetch(theUrl, {
        method: 'GET',
        mode: 'cors'
      }).then(r => r.text()).then(result => {
        // Result now contains the response text, do what you want...
        console.log(result)
    })
}