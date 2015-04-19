var Ball = function(point, vector) {
	if (!vector || vector.isZero()) {
		this.vector = Point.random() * 5;
	} else {
		this.vector = vector * 2;
	}
	this.point = point;
	this.dampen = 0.4;
	this.gravity = 3;
	this.bounce = -0.6;

	var color = {
		hue: Math.random() * 360,
		saturation: 1,
		brightness: 1
	};
	var gradient = new Gradient([color, 'black'], true);

	var radius = this.radius = 50 * Math.random() + 30;
	// Wrap CompoundPath in a Group, since CompoundPaths directly 
	// applies the transformations to the content, just like Path.
	var ball = new CompoundPath({
		children: [
			new Path.Circle({
				radius: radius
			}),
			new Path.Circle({
				center: radius / 8,
				radius: radius / 3
			})
		],
		fillColor: new Color(gradient, 0, radius, radius / 8),
	});

	this.item = new Group({
		children: [ball],
		transformContent: false,
		position: this.point
	});
}

Ball.prototype.iterate = function() {
	var size = view.size;
	this.vector.y += this.gravity;
	this.vector.x *= 0.99;
	var pre = this.point + this.vector;
	if (pre.x < this.radius || pre.x > size.width - this.radius)
		this.vector.x *= -this.dampen;
	if (pre.y < this.radius || pre.y > size.height - this.radius) {
		if (Math.abs(this.vector.x) < 3)
			this.vector = Point.random() * [150, 100] + [-75, 20];
		this.vector.y *= this.bounce;
	}

	var max = Point.max(this.radius, this.point + this.vector);
	this.item.position = this.point = Point.min(max, size - this.radius);
	this.item.rotate(this.vector.x);
};


var balls = [];
for (var i = 0; i < 10; i++) {
	var position = Point.random() * view.size,
		vector = (Point.random() - [0.5, 0]) * [50, 100],
		ball = new Ball(position, vector);
	balls.push(ball);
}

var textItem = new PointText({
	point: [20, 30],
	fillColor: 'black',
	content: 'Click, drag and release to add balls.'
});

var lastDelta;
function onMouseDrag(event) {
	lastDelta = event.delta;
}

function onMouseUp(event) {
	var x1 = 32;
	var x2 = 42;
	var x3 = 65;
	var y1 = 23;
	var y2 = 6;
	var y3 = 65;
	var ball = new Ball((x1,y2), lastDelta);
	var ball2 = new Ball((x2,y1), lastDelta);
	var ball3 = new Ball((x3,y3), lastDelta);
	var ball4 = new Ball(event.point, lastDelta)
	balls.push(ball);
	balls.push(ball2);
	balls.push(ball3);
	balls.push(ball4)
	lastDelta = null;
}


function onFrame() {
	for (var i = 0, l = balls.length; i < l; i++)
		balls[i].iterate();
}
