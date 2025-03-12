const recentsList = document.getElementById('recents');

const populateRecents = async function() {
//GET (only some of the stuff?)
  try {
    const response = await fetch('/api', { method: 'GET' });
    const dancers = await response.json();
    
    if (dancers && Object.keys(dancers).length > 0) {
      // Clear the list including the default option
      recents.innerHTML = ''; 
      
      // Add all the patterns
      Object.entries(dancers).forEach((d) => {
        const item = document.createElement('li');
        item.dataset.uid = d[0];
        item.innerText = d[1].name;
        recents.appendChild(item); 
      });
    } else {
      // If there are no patterns, reset to just the default option
      recents.innerHTML = '';
      const emptyOption = document.createElement('li');
      emptyOption.innerText = 'No patterns found';
      recents.appendChild(emptyOption);
    }
  } catch (error) {
    console.error('Error refreshing recents list:', error);
  }
};


populateRecents();