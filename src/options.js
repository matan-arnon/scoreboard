const myParent = document.body;

//Create and append mlb select list
let mlbSelectList = document.createElement("select");
mlbSelectList.id = "mlb-team";
myParent.appendChild(mlbSelectList);
mlbTeams = getMlbTeams()
//Create and append the options
for (let i = 0; i < mlbTeams.length; i++) {
    let mlbOption = document.createElement("option");
    mlbOption.value = mlbTeams[i];
    mlbOption.text = mlbTeams[i];
    mlbSelectList.appendChild(mlbOption);
}

//Create and append nba select list
let nbaSelectList = document.createElement("select");
nbaSelectList.id = "nba-team";
myParent.appendChild(nbaSelectList);
nbaTeams = getNbaTeams()
//Create and append the options
for (let i = 0; i < nbaTeams.length; i++) {
    let nbaOption = document.createElement("option");
    nbaOption.value = nbaTeams[i];
    nbaOption.text = nbaTeams[i];
    nbaSelectList.appendChild(nbaOption);
}

//Create and append nba select list
let nflSelectList = document.createElement("select");
nflSelectList.id = "nfl-team";
myParent.appendChild(nflSelectList);
nflTeams = getNflTeams()
//Create and append the options
for (let i = 0; i < nflTeams.length; i++) {
    let nflOption = document.createElement("option");
    nflOption.value = nflTeams[i];
    nflOption.text = nflTeams[i];
    nflSelectList.appendChild(nflOption);
}

// Saves options to chrome.storage
const saveOptions = () => {
    const mlbTeam = document.getElementById('mlb-team').value;
    const nbaTeam = document.getElementById('nba-team').value;
    const nflTeam = document.getElementById('nfl-team').value;
    chrome.storage.sync.set(
      { favoriteMlbTeam: mlbTeam, favoriteNbaTeam: nbaTeam, favoriteNflTeam: nflTeam },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { favoriteMlbTeam: 'Phillies', favoriteNbaTeam: 'Sixers', favoriteNflTeam: 'Eagles' },
      (items) => {
        document.getElementById('mlb-team').value = items.favoriteMlbTeam;
        document.getElementById('nba-team').value = items.favoriteNbaTeam;
        document.getElementById('nfl-team').value = items.favoriteNflTeam;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);