DirectionEnum = {
	NORTH : "North",
	EAST : "East",
	SOUTH : "South",
	WEST : "West"
};

function Board(boardWidth, boardHeight) {
	this.width = boardWidth;
	this.height = boardHeight;
	
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
		// shorten the tail
		positions.shift();
		// find the new head
		var head = positions.pop();
		var newHead = getNext(head, direction);
		positions.push(head);
		var result = true;
		// check for collisions with myself
		for (var i = 0; i < positions.length; i++) {
			if (positions[i][0] === newHead[0] && positions[i][1] === newHead[1]) {
				result = false;
			}
		}
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
