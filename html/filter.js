const filterPatternType = document.getElementById('filter-pattern-type');
const getFilteredResults = document.getElementById('filter-query');
const resultsSection = document.getElementById('filter-results');


//GET (filtered)
const filterResults = async function () {
	try {
		const response = await fetch('/api', { method: 'GET' });
		const dancers = await response.json();
		let filteredResults = []
		const selectedPatternType = filterPatternType.options[filterPatternType.selectedIndex]
		
		if (dancers && Object.keys(dancers).length > 0) {

		  // Add all the patterns that match {project type}
		  Object.entries(dancers).forEach((d) => {
			if(selectedPatternType && selectedPatternType.value == d[1].projectType) { 
				filteredResults.push(d)
			} else if(selectedPatternType.value == '') {
				filteredResults.push(d)
			}
		  });
		  console.log(`Filtered Results: ${filteredResults}`);
		  return filteredResults;
		} else {
		  // If there are no patterns, return the empty array
			console.log("no results");
			return filteredResults;
		}
	  } catch (error) {
		console.error('Error querying filter list:', error);
	  }
}


//Append results div w/ results from filter
const returnFilteredResults = async function () {
	const existingResults = document.querySelector('.results-div');
    if (existingResults) {
		existingResults.remove();
	}
	const resultsDiv = document.createElement('div');
	resultsDiv.className = 'results-div';
	//resultsDiv.className = 'quilt-div';
	resultsSection.appendChild(resultsDiv);
	
	const resultsTitle = document.createElement('h2');
	resultsTitle.innerText = 'Results';
	resultsDiv.appendChild(resultsTitle);
	// filter those results
	const fResults = await filterResults();
	if(fResults.length > 0) {
		const resultsList = document.createElement('ul');
		resultsDiv.appendChild(resultsList);
		
		fResults.forEach((p) => {
			const item = document.createElement('li');
			item.dataset.uid = p[0];
			item.innerText = p[1].name;
			resultsList.appendChild(item); 
		});
	} else { //no filtered results
		const noResults = document.createElement('p');
		noResults.innerText = 'No pattern matches found!';
		resultsDiv.appendChild(noResults);
	}
	
}


getFilteredResults.addEventListener('click', function() {returnFilteredResults()});