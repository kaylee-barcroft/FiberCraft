
const pForm = document.querySelector('.patternForm');
const radioSelect = document.querySelector("fieldset");

// elements of interest (what kind of project? required fields?)
var knitting = document.getElementById('knitting');
var crochet = document.getElementById('crochet');
var other = document.getElementById('other-proj-type');
var patternName = document.getElementById('name');
var formMessage = document.getElementById('form-message');
const patternLink = document.getElementById('pattern-link');
const patternDetailBtn = document.getElementById('to-pattern-detail');
const patternDetailNav = document.getElementById('nav-pattern-detail');
const patternUploadNav = document.getElementById('nav-pattern-upload');
const logo = document.getElementById('logo');
const dashNav = document.getElementById('nav-dashboard');


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
	setTimeout(() => {pForm.submit()}, 1500);
	
}

const projectInfo = function() {
	
	const existingInput = pForm.querySelector('.additional-input');
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
	
pForm.addEventListener('submit', function(e) {
	e.preventDefault(); // if required elements are not filled out, the form should not submit
	
	if(!formValid()) {
		formMessage.innerText = 'Error: Please fill out all required fields (*)';
	} //TODO: ask about this validator not working
	
	successOutput(); 
})

patternDetailBtn.onclick = function () {
        window.location.href = "pattern-detail.html";
        };

patternDetailNav.onclick = function () {
        window.location.href = "pattern-detail.html";
        };
		
patternUploadNav.onclick = function () {
        window.location.href = "upload-pattern.html";
        };
		
logo.onclick = function () {
		window.location.href = "index.html";
		};