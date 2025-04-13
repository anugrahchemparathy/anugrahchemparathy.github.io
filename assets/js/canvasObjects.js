class Point {
    constructor(X,Y){
        this.X = X;
        this.Y = Y;
    }
    copy(){
        return new Point(this.X,this.Y);
    }
    toString(){
        return "Point(" + this.X + "," + this.Y + ")";
    }
}

class mouseLine {
    constructor(startX, startY, color = 'black') {
        this.startX = startX;
        this.startY = startY;
        this.color = color;
    }
    draw () {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(mouse.X, mouse.Y);
        ctx.stroke();
    }
}

class Line {
    constructor(start, stop, color = 'white') {
        this.start = start;
        this.stop = stop;
        this.color = color;
    }
    draw () {
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.start.X, this.start.Y);
        ctx.lineTo(this.stop.X, this.stop.Y);
        ctx.stroke();
    }
    toString(){
        return this.start + " to " + this.stop;
    }
}


class Polygon {
    constructor (points,color = "rgba(255, 255, 255, 0.5)"){
        this.points = points;
        this.numVertices = points.length; 
        this.color = color;
    }
    copy() {
        const copiedPoints = this.points.map(point => point.copy());
        return new Polygon(copiedPoints, this.color);
    }
    shift(dX) {
        for (const point of this.points){
            point.X += dX;
        }
    }
    draw() {
        ctx.fillStyle = this.color; 
        ctx.beginPath();
        ctx.moveTo(this.points[this.numVertices-1].X,this.points[this.numVertices-1].Y);
        for (const point of this.points){
            ctx.lineTo(point.X,point.Y);
        }
        ctx.fill();
    }
}

