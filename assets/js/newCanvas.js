// Select the canvas with ID instead of generic selector
const canvas = document.getElementById('folding-canvas') || document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Initialize all variables before using them
let leftPadding = 0;
let topPadding = 0;
let edgeLength = 0;
let interiorPadding = 0;
let squarePadding = 0;
let mouse = {X: 0, Y: 0};

// Function to handle canvas resizing
function resizeCanvas() {
    // Get container width to center based on parent
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // Calculate desired canvas size based on container
    // Use 90% of container width or 1000px, whichever is smaller
    const targetWidth = Math.min(containerWidth * 0.9, 1000);
    
    // Set canvas dimensions
    canvas.width = targetWidth;
    canvas.height = targetWidth * 0.4; // 2:1 aspect ratio
    
    // Update all dimensions for drawing
    setCanvasValues();
    
    // Redraw canvas
    animate();
}

function setCanvasValues() {
    // Store mouse position relative to drawing area before resizing
    let proportionalMouseX = 0.35; // Default position
    let proportionalMouseY = 0.25; // Default position
    
    // Only calculate proportions if we're not initializing
    if (edgeLength > 0) {
        proportionalMouseX = (mouse.X - leftPadding) / edgeLength;
        proportionalMouseY = (mouse.Y - topPadding) / edgeLength;
    }

    // Recalculate all dimensions
    leftPadding = canvas.width * 0.05;
    topPadding = canvas.width * 0.05;
    edgeLength = canvas.width * 0.3;
    interiorPadding = edgeLength * 0.005;
    squarePadding = canvas.width - leftPadding * 2 - edgeLength * 2;

    // Restore mouse to same relative position
    mouse = {
        X: leftPadding + edgeLength * proportionalMouseX, 
        Y: topPadding + edgeLength * proportionalMouseY
    };
}

/*
================================================================================
Canvas Animation
================================================================================
*/

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(leftPadding, topPadding, edgeLength, edgeLength);
    
    const mousePoint = new Point(mouse.X, mouse.Y);
    const topLeft = new Point(leftPadding, topPadding);
    const topRight = new Point(leftPadding + edgeLength, topPadding);
    const bottomLeft = new Point(leftPadding, topPadding + edgeLength);
    const bottomRight = new Point(leftPadding + edgeLength, topPadding + edgeLength);


    const line1 = new Line(mousePoint, topLeft);
    const line2 = new Line(mousePoint, topRight);
    const line3 = new Line(mousePoint, bottomLeft);
    const folds = [line1, line2, line3];

    //Begin flat folding computations
    const mouseCentered = new Point((mouse.X - leftPadding)*100/edgeLength, (mouse.Y - topPadding)*100/edgeLength);
    const flatFoldEnd = directionAngle(mouseCentered, leftPadding, topPadding, edgeLength);
    const flatFoldLine = new Line(mousePoint, flatFoldEnd);
    folds.push(flatFoldLine);

    let polygon1 = new Polygon([topLeft, topRight, mousePoint]);
    let polygon2 = new Polygon([topLeft, bottomLeft, mousePoint]);
    let polygon3;
    let polygon4;
    
    const foldedShape = [];

    let foldLine = generateLine(mousePoint, topLeft);
    let folded = fold(polygon1, foldLine[0], foldLine[1]);
    foldLine = generateLine(mousePoint, bottomLeft);
    foldedShape.push(fold(folded, foldLine[0], foldLine[1]));
    foldedShape.push(fold(polygon2, foldLine[0], foldLine[1]));

    if (flatFoldEnd.X === leftPadding + edgeLength && flatFoldEnd.Y === topPadding + edgeLength){
        polygon3 = new Polygon([topRight, mousePoint, flatFoldEnd]);
        polygon4 = new Polygon([bottomLeft, mousePoint, flatFoldEnd]);
    }
    else if (flatFoldEnd.X === leftPadding + edgeLength){
        polygon3 = new Polygon([topRight, mousePoint, flatFoldEnd]);
        polygon4 = new Polygon([bottomLeft, mousePoint, flatFoldEnd, bottomRight]);
    }
    else {
        polygon3 = new Polygon([topRight, mousePoint, flatFoldEnd, bottomRight]);
        polygon4 = new Polygon([bottomLeft, mousePoint, flatFoldEnd]);
    }

    foldLine = generateLine(mousePoint, flatFoldEnd);
    foldedShape.push(fold(polygon3, foldLine[0], foldLine[1]));
    foldedShape.push(polygon4);

    for (const fold of folds){
        fold.draw();
    }
    for (const polygon of foldedShape){
        polygon.shift(edgeLength + squarePadding);
        polygon.draw();
    }
}

/*
================================================================================
Mousedown tools
================================================================================
*/

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse position relative to canvas
    let tempX = event.clientX - rect.left;
    let tempY = event.clientY - rect.top;
    
    // Adjust for any scaling of the canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    tempX *= scaleX;
    tempY *= scaleY;
    
    // Check if within interactive area
    if (tempX < leftPadding + interiorPadding || 
        tempX > leftPadding + edgeLength - interiorPadding ||
        tempY < topPadding + interiorPadding ||
        tempY > topPadding + edgeLength - interiorPadding) {
        return;
    }
    
    mouse.X = tempX;
    mouse.Y = tempY;
}

let updating = true;

function update(e) { 
    getCursorPosition(canvas, e);
    animate();
}

canvas.addEventListener('mousemove', update);

canvas.addEventListener('mousedown', function(e) {
    if (updating) {
        canvas.removeEventListener("mousemove", update);
        updating = false;
    }
    else {
        canvas.addEventListener("mousemove", update);
        updating = true;
    }
    animate();
});

// Initialize and start animation
setCanvasValues();
resizeCanvas();

// Add window resize event after everything is initialized
window.addEventListener('resize', resizeCanvas);