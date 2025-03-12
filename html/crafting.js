
const pForm = document.querySelector('.patternForm');
const radioSelect = document.querySelector("fieldset");

// elements of interest (what kind of project? required fields?)
const knitting = document.getElementById('knitting');
const crochet = document.getElementById('crochet');
const other = document.getElementById('other-proj-type');
const patternName = document.getElementById('name');
const materialType = document.getElementById('material-type');
const materialQty = document.getElementById('material-qty');
const patternLink = document.getElementById('pattern');
const formMessage = document.getElementById('form-message');


//nav buttons
const patternDetailNav = document.getElementById('nav-pattern-detail');
const patternUploadNav = document.getElementById('nav-pattern-upload');
const logo = document.getElementById('logo');
const dashNav = document.getElementById('nav-dashboard');
const patternFilterNav = document.getElementById('nav-pattern-filter');

//new AJAX buttons
const postButton = document.getElementById('pattern-post');
const putButton = document.getElementById('update-it');

const getEditDataButton = document.getElementById('get-item');
const deleteButton = document.getElementById('delete-it');
const apiList = document.getElementById('api-obj-select');





const formValid = function() {
	let valid = true;
	
	if(patternName.value === "") {
		valid = false;
	}
	if(!knitting.checked && !crochet.checked && !other.checked) {
		valid = false;
	}
	
	return valid;
}

const successOutput = function() {
	formMessage.innerText = 'Form submitted!';
}

const projectInfo = function() {
	
	const existingInput = document.querySelector('.additional-input');
    if (existingInput) {
		existingInput.remove();
	}
	
    if(knitting.checked) {
        const div = document.createElement("div");
        div.className = 'additional-input';
        
        const needlesInput = document.createElement("input");
        needlesInput.type = 'text';
        needlesInput.id = 'needlesInput';
        
        const needlesLabel = document.createElement("label");
        needlesLabel.htmlFor = 'needlesInput';
        needlesLabel.innerText = "Needle size (mm): ";
        
        div.appendChild(needlesLabel);
        div.appendChild(needlesInput);
        patternLink.appendChild(div);
    }
    else if(crochet.checked) {
        const div = document.createElement("div");
        div.className = 'additional-input';
        
        const hookInput = document.createElement("input");
        hookInput.type = 'text';
        hookInput.id = 'hookInput';
        
        const hookLabel = document.createElement("label");
        hookLabel.htmlFor = 'hookInput';
        hookLabel.innerText = "Crochet hook size (mm): ";
        
        div.appendChild(hookLabel);
        div.appendChild(hookInput);
        patternLink.appendChild(div);
    }
} 

radioSelect.addEventListener('change', projectInfo);
	

function getSelectedProjectType() {
    if (knitting.checked) {
        return knitting.value;
    } else if (crochet.checked) {
        return crochet.value;
    } else if (other.checked) {
        return other.value;
    }
    return null;
}

function collectFormData() {
    return {
        projectType: getSelectedProjectType(),
        name: patternName.value,
        materialType: materialType.value,
        materialQty: materialQty.value,
        pattern: patternLink.value
    };
}

patternDetailNav.onclick = function () {
        window.location.href = "pattern-detail.html";
        };
		
patternUploadNav.onclick = function () {
        window.location.href = "upload-pattern.html";
        };
		
logo.onclick = function () {
		window.location.href = "index.html";
		};
		
dashNav.onclick = function () {
		window.location.href = "index.html";
		};
		
patternFilterNav.onclick = function () {
		window.location.href= "filter-patterns.html"
		};
		

//POST
const postPattern = async function (pattern) {
	
	fetch('/api', {
		method: 'POST',
		body: JSON.stringify(pattern)
	})
	.then(refreshApiList)
};	
		
//PUT
// Function to populate form with existing item data
const populateFormForEdit = async function(uid) {
    try {
        // Fetch the specific item data using its UID
		console.log(`uid: ${uid}`)
        const response = await fetch(`/api?uid=${uid}`, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch item details');
        
        const itemData = await response.json();
        
        // Populate form fields with current values
        patternName.value = itemData.name;
        materialType.value = itemData.materialType;
        materialQty.value = itemData.materialQty;
        patternLink.value = itemData.pattern;
        
        // load project type
        projectType = getSelectedProjectType();
        if (itemData.projectType === knitting.value) {
            knitting.checked = true;
        } else if (itemData.projectType === crochet.value) {
            crochet.checked = true;
        } else if (itemData.projectType === other.value) {
            other.checked = true;
        }
	} catch (error) {
        console.error('Error loading item for edit:', error);
    }
};

const loadItemToEdit = async function() {
	
	// get stuff out of the update fields
	const selectedOption = apiList.options[apiList.selectedIndex];

    
    if (!selectedOption || selectedOption.disabled) {
        console.error("No item selected");
        return;
    }

    const itemUid = selectedOption.dataset.uid;
    
    // save the uid somewhere more permanent and less editable
    putButton.dataset.editingUid = itemUid;
    
    await populateFormForEdit(itemUid);
};

const editItem = async function(updatedPattern) {
	//grab that uid we saved
	const itemUid = putButton.dataset.editingUid;

    if (!itemUid) {
        console.error("No item UID found for update");
        return;
    }
	
	try {
		await fetch(`/api?uid=${itemUid}`, {
			method: 'PUT',
			body: JSON.stringify(updatedPattern)
		})
		// if we did it, clear that button
		putButton.dataset.editingUid = '';
		await refreshApiList()
	} catch (err) {
			console.error('Error updating item:', err);
	}
	
}

		
// DELETE
const deleteItem = async function() {
    // Get the currently selected option
    const selectedOption = apiList.options[apiList.selectedIndex];
    
    if (!selectedOption || selectedOption.disabled) {
        console.error("No item selected");
        return;
    }
    
    // grab what we need
    const itemToDelete = selectedOption.dataset.uid;
    
    try {
        await fetch(`/api?uid=${itemToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
			// no body needed - the uid is in the url
        });
        // refresh afterwards
        await refreshApiList();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
};
		
		
//GET
const refreshApiList = async function() {
  try {
    const response = await fetch('/api', { method: 'GET' });
    const dancers = await response.json();
    
    if (dancers && Object.keys(dancers).length > 0) {
      // Clear the list including the default option
      apiList.innerHTML = ''; 
      
      // Add all the patterns
      Object.entries(dancers).forEach((d) => {
        const item = document.createElement('option');
        item.dataset.uid = d[0];
        item.value = d[1].name; 
        item.innerText = d[1].name;
        apiList.appendChild(item); 
      });
    } else {
      // If there are no patterns, reset to just the default option
      apiList.innerHTML = '';
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.innerText = 'No patterns found';
      emptyOption.disabled = true;
      emptyOption.selected = true;
      apiList.appendChild(emptyOption);
    }
  } catch (error) {
    console.error('Error refreshing API list:', error);
  }
};

deleteButton.addEventListener('click', deleteItem);

postButton.addEventListener('click', function() {
	if(!formValid()) {
		formMessage.innerText = 'Error: Please fill out all required fields (*)';
		return;
	}
	const pattern = collectFormData();
	postPattern(pattern);
	successOutput();
});

putButton.addEventListener('click', function() {
	if(!formValid()) {
		formMessage.innerText = 'Error: Please fill out all required fields (*)';
		return;
	}
	const updatedPattern = collectFormData();
	editItem(updatedPattern);
	successOutput();
})

getEditDataButton.addEventListener('click', function() {
	loadItemToEdit();
})

refreshApiList();