const patternDetailNav = document.getElementById('nav-pattern-detail');
const patternUploadNav = document.getElementById('nav-pattern-upload');
const dashNav = document.getElementById('nav-dashboard');
const logo = document.getElementById('logo');

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