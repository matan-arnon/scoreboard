// Saves options to chrome.storage
const saveOptions = () => {
    const team = document.getElementById('mlb-team').value;
  
    chrome.storage.sync.set(
      { favoriteTeam: team },
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
      { favoriteTeam: 'Phillies' },
      (items) => {
        document.getElementById('mlb-team').value = items.favoriteTeam;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);