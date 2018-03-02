function showSearch(btn) {
	btn.childNodes[0].style.opacity = 1;
	btn.parentNode.previousElementSibling.classList.remove('hidden');
	btn.parentNode.previousElementSibling.focus();
	btn.parentNode.parentNode.style.borderBottom = '1px solid #bcbcbc';
}
function hideSearch(input) {
	input.classList.add('hidden');
	input.value = '';
	input.parentNode.style.borderBottom = 'none';
	input.nextElementSibling.childNodes[1].childNodes[0].style.opacity = 0.5;
}

var slides = document.querySelectorAll('input[type="radio"]');
var time = setInterval(nextSlide, 7500);

function nextSlide() {
	var currentSlide = document.querySelector('input[type="radio"]:checked');
	if (currentSlide.nextElementSibling.tagName == 'INPUT') {
		currentSlide.nextElementSibling.checked = 'true';
	} else {
		document.querySelector('#image1').checked = 'true';
	}
	clearInterval(time);
	time = setInterval(nextSlide, 7500);
}

function previousSlide() {
	var currentSlide = document.querySelector('input[type="radio"]:checked');
	if (currentSlide.previousElementSibling) {
		currentSlide.previousElementSibling.checked = 'true';
	} else {
		document.querySelector('#image4').checked = 'true';
	}
	clearInterval(time);
	time = setInterval(nextSlide, 7500);
}

function resetTime() {
	clearInterval(time);
	time = setInterval(nextSlide, 7500);
}



