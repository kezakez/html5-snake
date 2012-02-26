$(function() {
	var board = new Board(20, 20);
	var snake = new Snake([0,0], 4, DirectionEnum.EAST, board);
	var animationLoopId;

	var field = $("canvas");
	var mapHeight = board.height;
	var mapWidth = board.width;

	var scale = 1.0;

	var cellSpacing = 1;

	var outerCellWidth = ((field.width()-(cellSpacing)) / mapWidth) * scale;
	var outerCellHeight = ((field.height()-(cellSpacing)) / mapHeight) * scale;
	var innerCellWidth = outerCellWidth - cellSpacing;
	var innerCellHeight = outerCellHeight - cellSpacing;

	function draw() {
		var x, y;
		field.clearCanvas();
		var positions = snake.getPositions();
		for (var i = 0; i < positions.length; i++) {
			x = positions[i][0];
			y = positions[i][1];
			field.drawRect({
				fillStyle: "green", x: cellSpacing + x * outerCellWidth, y: cellSpacing + y * outerCellHeight, width: innerCellWidth, height: innerCellHeight, fromCenter: false
			});
		}
	}

	function animate() {
		var result = snake.moveNext();
		if (!result) {
			clearInterval(animationLoopId);
		} else {
			draw();
		}
	}

	$(document).keydown(function(event) {
		if (event.keyCode === 38) {
			snake.setDirection(DirectionEnum.NORTH);
		} else if (event.keyCode === 39) {
			snake.setDirection(DirectionEnum.EAST);
		} else if (event.keyCode === 40) {
			snake.setDirection(DirectionEnum.SOUTH);
		} else if (event.keyCode === 37) {
			snake.setDirection(DirectionEnum.WEST);
		}
	});
	
	draw();
	animationLoopId = setInterval(animate, 500);
});