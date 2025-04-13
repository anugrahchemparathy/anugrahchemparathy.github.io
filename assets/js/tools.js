function LOC(a,b,c){
    /*
    Computes the interior angle of a triangle between sides a,b and opposing side c
    */
    return Math.acos((a**2 + b**2 - c**2)/(2 * a * b));
}
function euclideanDistance(point1,point2){
    /*
    Computes the euclidean distance between two points represented as length 2 arrays
    */
    dx = point1.X - point2.X;
    dy = point1.Y - point2.Y;
    return (dx**2 + dy**2)**0.5;
}
function directionAngle(centerPoint, leftPadding, topPadding, edgeLength){
    /*
    Given a center point in [[0,100],[0,100]], find the slope of the flat folding line generated from that point
    The square is scaled from [0,100] in the +x direction and [0,100] in the -y direction
    */
    
    const topEdge = euclideanDistance(new Point(0,0),centerPoint);
    const bottomEdge = euclideanDistance(new Point(0,100),centerPoint);
    const leftAngle = LOC(topEdge,bottomEdge,100);
    
    let opposingAngle = Math.PI - leftAngle;
    let topAngle = Math.atan((100-centerPoint.X)/centerPoint.Y);
    // console.log("opposing angle =", opposingAngle * 180 / Math.PI);
    // console.log("top angle =", topAngle * 180 / Math.PI);
    // console.log("left angle =", leftAngle * 180 / Math.PI);
    // console.log("cumulative new angle =", (topAngle + opposingAngle) * 180/Math.PI)
    let slope = -1/Math.tan(topAngle+opposingAngle);

    dX = 1;
    if (topAngle + opposingAngle > Math.PI) {
        dX = -1;
    }

    if (dX === -1  || centerPoint.Y + slope * (100 - centerPoint.X) >= 100) {
        return new Point(
            leftPadding + (centerPoint.X + 1/slope * (100 - centerPoint.Y)) * edgeLength/100, 
            topPadding + (centerPoint.Y + (100 - centerPoint.Y)) * edgeLength/100
            );
    }
    else {
        return new Point(
            leftPadding + (centerPoint.X + (100 - centerPoint.X) * dX) * edgeLength/100, 
            topPadding + (centerPoint.Y + slope * (100 - centerPoint.X) * dX) * edgeLength/100
            );
    }

}

