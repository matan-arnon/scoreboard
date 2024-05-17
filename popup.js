
window.onload = function() {
    document.querySelector('#go-to-options').addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
    });

    chrome.storage.sync.get({favoriteTeam:"nope"}, (items) =>{
        if (items.favoriteTeam != "nope") {
            var mlb_team = document.getElementById("fav-mlb-team");
            mlb_team.textContent = items.favoriteTeam;
            console.log("fav team", items.favoriteTeam);
            var team_record = document.getElementById("fav-team-record");
            team_record.textContent = get_team_record(items.favoriteTeam);
        }
    })
}