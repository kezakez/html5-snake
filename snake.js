DirectionEnum = {
	NORTH : "North",
	EAST : "East",
	SOUTH : "South",
	WEST : "West"
};

function hitTest(testArray, testPosition) {
	for (var i = 0; i < testArray.length; i++) {
		if (testArray[i][0] === testPosition[0] && testArray[i][1] === testPosition[1]) {
			return i;
		}
	}
	return -1;
}

function Board(boardWidth, boardHeight) {
	this.width = boardWidth;
	this.height = boardHeight;
	this.foodPositions = [];

	function getRandomInt(max)  
	{  
		return Math.floor(Math.random() * (max - 1));  
	}
	
	this.addFood = function (snake, position) {
		if (!snake) {
			throw "snake must be provided.";
		}
		if (!position) {
			position = [getRandomInt(this.width), getRandomInt(this.height)];
			if (hitTest(snake.getPositions(), position) !== -1) {
				var available = [];
				for (var x = 0; x < this.width; x++) {
					for (var y = 0; y < this.height; y++) {
						position = [x, y];
						if (hitTest(snake.getPositions(), position) === -1) {
							available.push(position);
						}
					}
				}
				position = available[getRandomInt(available.length)];
			}
		}
		
		this.foodPositions.push(position);
	}

	this.foodFound = function (position) {
		var result = hitTest(this.foodPositions, position);
		this.foodPositions = this.foodPositions.splice(result, 1);
		return result !== -1;
	}
	
	this.checkInBoard = function (position) {
		if (position[0] < 0) return false;
		if (position[1] < 0) return false;
		if (position[0] >= this.width) return false;
		if (position[1] >= this.height) return false;
		return true;
	}
}

function Snake(tailPos, snakeLen, dir, brd) {
	var tailPosition = tailPos || [1,1];
	var snakeLength = snakeLen || 5;
	var direction = dir || DirectionEnum.EAST;
	var positions = [];
	var board = brd || new Board(10, 10);
	
	var position = tailPosition;
	for (var i = 0; i < snakeLength; i++) {
		positions[i] = position;
		position = getNext(position, direction);
	};

	function getNext(position, nextDirection) {
		//clone a copy of a position array and adjust it based on a direction
		var result = position.slice();
		if (nextDirection == DirectionEnum.NORTH) {
			result[1] -= 1;
		} else if (nextDirection == DirectionEnum.EAST) {
			result[0] += 1;
		} else if (nextDirection == DirectionEnum.SOUTH) {
			result[1] += 1;
		} else if (nextDirection == DirectionEnum.WEST) {
			result[0] -= 1;
		}
		return result;
	};

	this.setDirection = function (newDir) {
		if ((direction === DirectionEnum.NORTH && newDir !== DirectionEnum.SOUTH) ||
			(direction === DirectionEnum.EAST && newDir !== DirectionEnum.WEST) ||
			(direction === DirectionEnum.SOUTH && newDir !== DirectionEnum.NORTH) ||
			(direction === DirectionEnum.WEST && newDir !== DirectionEnum.EAST)
		) {
			direction = newDir;
		}
	};

	this.moveNext = function () {
		// find the new head
		var head = positions.pop();
		var newHead = getNext(head, direction);
		positions.push(head);
		
		// check if we ate food
		var ateFood = board.foodFound(newHead);
		if (!ateFood) {
			// shorten the tail
			positions.shift();
		} else {
			board.addFood(this);
		}

		// check for collisions with myself
		var result = (hitTest(positions, newHead) === -1);

		// or the board
		if (!board.checkInBoard(newHead)) {
			result = false;
		}
		// add the new head
		positions.push(newHead);
		return result;
	};
	
	this.getPositions = function () {
		return positions;
	};
}
