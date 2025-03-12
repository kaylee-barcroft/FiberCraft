const patternDetailNav = document.getElementById('nav-pattern-detail');
const patternUploadNav = document.getElementById('nav-pattern-upload');
const dashNav = document.getElementById('nav-dashboard');
const logo = document.getElementById('logo');
const patternFilterNav = document.getElementById('nav-pattern-filter');

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