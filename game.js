window.onload = function() {
	const canvasBoard = document.getElementById('canvasBoard');
	const canvasWords = document.getElementById('canvasWords');
	const btnMarkWord = document.getElementById('btnMarkWord');
	const sopa = new Sopa(canvasBoard, canvasWords);
	
	registerEvents(sopa, btnMarkWord);

	sopa.run();
};

function registerEvents(sopa, btnMarkWord) {
	btnMarkWord.addEventListener('click', function() {
		const txtInicio = document.getElementById('txtInicio');
		const txtFinal = document.getElementById('txtFinal');

		sopa._findWord(txtInicio.value, txtFinal.value);
	});
};
