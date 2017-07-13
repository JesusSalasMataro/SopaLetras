const up = 1;
const down = 2;
const left = 3;
const right = 4;
const up_left = 5;
const up_right = 6;
const down_left = 7;
const down_right = 8;

const lettersSpacing = 30;
const firstAlphabetLetterAsciiCode = 97;
const lastAlphabetLetterAsciiCode = 122;

class Sopa {

	static get upDirection() { return up; }
	static get downDirection() { return down; }
	static get leftDirection() { return left; }
	static get rightDirection() { return right; }
	static get upLeftDirection() { return up_left; }
	static get upRightDirection() { return up_right; }
	static get downLeftDirection() { return down_left; }
	static get downRightDirection() { return down_right; }

	constructor(canvasBoard, canvasWords) {
		
		this.canvasBoard = canvasBoard;
		this.canvasWords = canvasWords;
		this.words = ['arbol', 'camisa', 'coche', 'peral', 'avion'];
		this.foundWords = [];
		this.directions = 8;
		this.boardSize = 16;
		this.board = new Array(this.boardSize);

		for (let i = 0; i < this.boardSize; i++) {
			this.board[i]  = new Array(this.boardSize);

			for (let j = 0; j < this.boardSize; j++) {	
				this.board[i][j] = ' ';
			}		
		}
	}

	run() {
		this._placeWords();
		this._fillBoard();
		this._drawBoard();
		this._drawWords();
	}

	_drawBoard() {
		const context = this.canvasBoard.getContext("2d");
		context.font = '24px Courier';

		context.clearRect(0, 0, this.canvasBoard.width, this.canvasBoard.height);
		this._drawRowColumnNumbers(context);
		this._drawBoardContent(context);
	}

	_drawRowColumnNumbers(context) {
		context.font = '24px Courier bold';

		for (let row = 1; row <= this.boardSize; row++) {	
			context.fillText(row, 10, (row-1)*lettersSpacing + 60);		
		}

		for (let column = 1; column <= this.boardSize; column++) {	
			context.fillText(String.fromCharCode(firstAlphabetLetterAsciiCode + column - 1), 
				(column-1)*lettersSpacing + 60, 25);		
		}		
	}

	_drawBoardContent(context) {		
		for (let row = 0; row < this.boardSize; row++) {
			for (let column = 0; column < this.boardSize; column++) {
				if (this._characterIsUpperCase(this.board[row][column])) {
					context.fillStyle = "#0000ff";
					context.font = '24px Courier bold';
				}
				else {
					context.fillStyle = "#000000";
					context.font = '24px Courier';
				}

				context.fillText(this.board[row][column], column*lettersSpacing + 60, row*lettersSpacing + 60);
			}		
		}			
	}

	_characterIsUpperCase(character) {
		return character.charCodeAt(0) <= 90;
	}

	_drawWords() {
		const context = this.canvasWords.getContext("2d");
		context.font = '24px Courier';
		const wordsSize = this.words.length;

		for (let i = 0; i < wordsSize; i++) {	
			context.fillText(this.words[i], i + 35, i*lettersSpacing + 35);	
		}			
	}

	_placeWords() {
		let placedWords = 0;

		while (placedWords < this.words.length) {
			const row = Math.floor((Math.random() * this.boardSize));
			const column = Math.floor((Math.random() * this.boardSize));
			const direction = Math.floor((Math.random() * this.directions) + 1);

			if (this._wordFits(this.words[placedWords], row, column, direction) &&
				this._isPossibleToPlaceWord(this.words[placedWords], row, column, direction)) {

				this._placeWord(this.words[placedWords], row, column, direction);
				placedWords++;
			}
		}
	}

	_fillBoard() {
		const alphabetLength = 26;
		let randomAsciiChar;

		for (let i = 0; i < this.boardSize; i++) {
			for (let j = 0; j < this.boardSize; j++) {	
				if (this.board[i][j] === ' ') {
					randomAsciiChar = Math.floor((Math.random() * alphabetLength) + firstAlphabetLetterAsciiCode);
					this.board[i][j] = String.fromCharCode(randomAsciiChar);
				}
			}		
		}		
	}

	_wordFits(word, row, column, direction) {
		if (direction === Sopa.upDirection) {
			return row >= word.length;
		}
		else if (direction === Sopa.downDirection) {
			return row <= this.boardSize - word.length;
		}
		else if (direction === Sopa.leftDirection) {
			return column >= this.boardSize - word.length;
		}
		else if (direction === Sopa.rightDirection) {
			return column <= this.boardSize - word.length;
		}
		else if (direction === Sopa.upLeftDirection) {
			return row >= word.length && column >= this.boardSize - word.length;
		}
		else if (direction === Sopa.upRightDirection) {
			return row >= word.length && column <= this.boardSize - word.length;
		}	
		else if (direction === Sopa.downLeftDirection) {
			return row <= this.boardSize - word.length && column >= this.boardSize - word.length;
		}	
		else if (direction === Sopa.downRightDirection) {
			return row <= this.boardSize - word.length && column <= this.boardSize - word.length;
		}									
	}

	_isPossibleToPlaceWord(word, row, column, direction) {
		const wordLength = word.length;
		const incrementRow = this._getRowIncrement(direction);
		const incrementColumn = this._getColumnIncrement(direction);
		let isPossiblePlaceWord = true;	
		let i = 0;

		while (i < wordLength && isPossiblePlaceWord) {
			if (this.board[row][column] !== ' ' && this.board[row][column] !== word.charAt(i)) {
				isPossiblePlaceWord = false;
			}				

			row += incrementRow;
			column += incrementColumn;
			i++;
		}

		return isPossiblePlaceWord;
	}

	_placeWord(word, row, column, direction) {
		const wordLength = word.length;
		const incrementRow = this._getRowIncrement(direction);
		const incrementColumn = this._getColumnIncrement(direction);		
		
		for (let i = 0; i < wordLength; i++) {
			if (i > 0) {
				row += incrementRow;
				column += incrementColumn;
			}

			this.board[row][column] = word.charAt(i);				
		}
	}

	_getRowIncrement(direction) {
		let incrementRow = 0;

		if (direction === Sopa.upDirection) {
			incrementRow = -1;
		}
		else if (direction === Sopa.downDirection) {
			incrementRow = 1;
		}
		else if (direction === Sopa.upLeftDirection) {
			incrementRow = -1;
		}
		else if (direction === Sopa.upRightDirection) {
			incrementRow = -1;
		}	
		else if (direction === Sopa.downLeftDirection) {
			incrementRow = 1;
		}	
		else if (direction === Sopa.downRightDirection) {
			incrementRow = 1;
		}

		return incrementRow;
	}

	_getColumnIncrement(direction) {
		let incrementColumn = 0;

		if (direction === Sopa.leftDirection) {
			incrementColumn = -1;
		}
		else if (direction === Sopa.rightDirection) {
			incrementColumn = 1;
		}
		else if (direction === Sopa.upLeftDirection) {
			incrementColumn = -1;
		}
		else if (direction === Sopa.upRightDirection) {
			incrementColumn = 1;
		}	
		else if (direction === Sopa.downLeftDirection) {
			incrementColumn = -1;
		}	
		else if (direction === Sopa.downRightDirection) {
			incrementColumn = 1;
		}

		return incrementColumn;
	}

	_findWord(initialBox, finalBox) {
		let incrementRow, incrementColumn;		
		let selectedBoxes = this._validateBoxFormat(initialBox, finalBox);
		let wordsLength = this.words.length;		
		let wordWasFound = false;
		let wordFound = '';
		let i = 0;

		if (selectedBoxes !== undefined) {
			let direction = this._getDirection(selectedBoxes);
			incrementRow = this._getRowIncrement(direction);
			incrementColumn = this._getColumnIncrement(direction);

			while (!wordWasFound && i < wordsLength) {
				wordWasFound = this._searchWord(this.words[i], selectedBoxes, incrementRow, incrementColumn);
				
				if (wordWasFound) {
					wordFound = this.words[i];
				}

				i++;			
			}			
		}
		else {
			alert('Formato de casillas no válido');
		}

		if (wordFound !== '') {
			this._markWordAsFound(wordFound, selectedBoxes, incrementRow, incrementColumn);
			this._drawBoard();
		}
		else {
			alert('Palabra no encontrada en esas posiciones');
		}
	}

	_searchWord(word, selectedBoxes, incrementRow, incrementColumn) {
		let wordWasFound = false;
		let markedWordLength;
		let row = selectedBoxes.initialBoxRow;
		let column = selectedBoxes.initialBoxColumn;

		if (selectedBoxes.initialBoxRow !== selectedBoxes.finalBoxRow) {
			markedWordLength = Math.abs(selectedBoxes.initialBoxRow - selectedBoxes.finalBoxRow) + 1;
		}
		else {
			markedWordLength = Math.abs(selectedBoxes.initialBoxColumn - selectedBoxes.finalBoxColumn)+ 1;
		}

		if (word.length === markedWordLength) {
			wordWasFound = true;
			let i = 0;

			while (wordWasFound && i < markedWordLength) {
				if (this.board[row][column] !== word.charAt(i)) {
					wordWasFound = false;
				}

				row += incrementRow;
				column += incrementColumn;
				i++;
			}
		}

		return wordWasFound;
	}

	_markWordAsFound(wordFound, selectedBoxes, incrementRow, incrementColumn) {
		this.foundWords.push(wordFound);

		let wordLength = wordFound.length;
		let i = 0;
		let row = selectedBoxes.initialBoxRow;
		let column = selectedBoxes.initialBoxColumn;

		while (i < wordLength) {
			this.board[row][column] = this.board[row][column].toUpperCase();
			row += incrementRow;
			column += incrementColumn;
			i++;
		}
	}

	_getDirection(selectedBoxes) {
		let direction;

		if (selectedBoxes.initialBoxRow > selectedBoxes.finalBoxRow &&
			selectedBoxes.initialBoxColumn === selectedBoxes.finalBoxColumn) {
			direction = Sopa.upDirection;
		}
		else if (selectedBoxes.initialBoxRow < selectedBoxes.finalBoxRow &&
			selectedBoxes.initialBoxColumn === selectedBoxes.finalBoxColumn) {
			direction = Sopa.downDirection;
		}
		else if (selectedBoxes.initialBoxRow === selectedBoxes.finalBoxRow &&
			selectedBoxes.initialBoxColumn > selectedBoxes.finalBoxColumn) {
			direction = Sopa.leftDirection;
		}
		else if (selectedBoxes.initialBoxRow === selectedBoxes.finalBoxRow &&
			selectedBoxes.initialBoxColumn < selectedBoxes.finalBoxColumn) {
			direction = Sopa.rightDirection;
		}
		else if (selectedBoxes.initialBoxRow > selectedBoxes.finalBoxRow &&
			selectedBoxes.initialBoxColumn > selectedBoxes.finalBoxColumn) {
			direction = Sopa.upLeftDirection;
		}
		else if (selectedBoxes.initialBoxRow < selectedBoxes.finalBoxRow &&
			selectedBoxes.initialBoxColumn < selectedBoxes.finalBoxColumn) {
			direction = Sopa.downRightDirection;
		}		
		else if (selectedBoxes.initialBoxRow > selectedBoxes.finalBoxRow &&
			selectedBoxes.initialBoxColumn < selectedBoxes.finalBoxColumn) {
			direction = Sopa.upRightDirection;
		}										
		else if (selectedBoxes.initialBoxRow < selectedBoxes.finalBoxRow &&
			selectedBoxes.initialBoxColumn > selectedBoxes.finalBoxColumn) {
			direction = Sopa.downLeftDirection;
		}

		return direction;
	}

	_validateBoxFormat(initialBox, finalBox) {
		let boxFormatOk = true;
		let selectedBoxes;	
		let itemsInitialBox = initialBox.split(' ');
		let itemsFinalBox = finalBox.split(' ');
		let initialBoxRow, finalBoxRow, initialBoxColumn, finalBoxColumn;

		try {
			if (itemsInitialBox.length != 2 || itemsFinalBox.length != 2) {
				boxFormatOk = false;
			}			
		}
		catch(error) {
			boxFormatOk = false;
		}

		if (boxFormatOk) {
			initialBoxRow = parseInt(itemsInitialBox[0]);
			finalBoxRow = parseInt(itemsFinalBox[0]);

			if (initialBoxRow < 1 || initialBoxRow > 16 ||
				finalBoxRow < 1 || finalBoxRow > 16) {
				boxFormatOk = false;
			}
		}

		if (boxFormatOk) {
			initialBoxColumn = itemsInitialBox[1].charCodeAt(0) - firstAlphabetLetterAsciiCode + 1;
			finalBoxColumn = itemsFinalBox[1].charCodeAt(0) - firstAlphabetLetterAsciiCode + 1;

			if (initialBoxColumn < 1 || initialBoxColumn > 16 ||
				finalBoxColumn < 1 || finalBoxColumn > 16) {
				boxFormatOk = false;
			}			
		}

		if (boxFormatOk) {
			if (initialBoxRow === finalBoxRow && initialBoxColumn === finalBoxColumn) {
				boxFormatOk = false;
			}
		}

		if (boxFormatOk) {
			selectedBoxes = {initialBoxRow: initialBoxRow - 1, initialBoxColumn: initialBoxColumn - 1,
							 finalBoxRow: finalBoxRow - 1, finalBoxColumn: finalBoxColumn - 1};
		}

		return selectedBoxes;
	}

}