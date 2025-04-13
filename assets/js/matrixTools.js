/**
 * return a new polygon resulting from flipping a polygon over a line y = lineA x + lineB
 * 
 * @param {*} polygon 
 * @param {*} lineA slope of fold line
 * @param {*} lineB intercept of fold line
 */
function fold(polygon, m, b) {
    const polygonCopy = polygon.copy();
    for (const point of polygonCopy.points){
        point.Y -= b;
    }

    //reflection matrix about line y = mx
    // point reflection demo: https://www.desmos.com/calculator/zxh0lxfuyd
    for (const point of polygonCopy.points){
        const newX = ((1 - m**2) * point.X + (2*m) * point.Y) / (1 + m**2);
        const newY = ((2*m) * point.X + (m**2 - 1) * point.Y) / (1 + m**2);

        point.X = newX;
        point.Y = newY;
    }

    for (const point of polygonCopy.points){
        point.Y += b;
    }    

    return polygonCopy;
}


function generateLine (point1, point2) {
    const slope = (point2.Y - point1.Y) / (point2.X - point1.X);
    const intercept = point1.Y - point1.X * slope;

    return [slope, intercept];
}