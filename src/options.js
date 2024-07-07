const myParent = document.body;

//Create and append mlb select list
let mlbSelectList = document.createElement("select");
mlbSelectList.id = "mlb-team";
myParent.appendChild(mlbSelectList);
mlb_teams = get_mlb_teams()
//Create and append the options
for (let i = 0; i < mlb_teams.length; i++) {
    let mlb_option = document.createElement("option");
    mlb_option.value = mlb_teams[i];
    mlb_option.text = mlb_teams[i];
    mlbSelectList.appendChild(mlb_option);
}

//Create and append mlb select list
let nbaSelectList = document.createElement("select");
nbaSelectList.id = "nba-team";
myParent.appendChild(nbaSelectList);
nba_teams = get_nba_teams()
//Create and append the options
for (let i = 0; i < nba_teams.length; i++) {
    let nba_option = document.createElement("option");
    nba_option.value = nba_teams[i];
    nba_option.text = nba_teams[i];
    nbaSelectList.appendChild(nba_option);
}

// Saves options to chrome.storage
const saveOptions = () => {
    const mlbTeam = document.getElementById('mlb-team').value;
    const nbaTeam = document.getElementById('nba-team').value;
    chrome.storage.sync.set(
      { favoriteMlbTeam: mlbTeam, favoriteNbaTeam: nbaTeam },
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
      { favoriteMlbTeam: 'Phillies', favoriteNbaTeam: 'Sixers' },
      (items) => {
        document.getElementById('mlb-team').value = items.favoriteMlbTeam;
        document.getElementById('nba-team').value = items.favoriteNbaTeam;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);