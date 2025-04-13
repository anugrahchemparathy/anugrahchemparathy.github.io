// Wait for document to fully load
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return; // Safety check
    
    const ctx = canvas.getContext('2d');
    const navMenu = document.getElementById("nav_menu");
    let navWidth = navMenu ? navMenu.offsetWidth : 0;

    // Initial canvas sizing
    canvas.width = 0.9 * Math.min(window.innerWidth, 1500);
    canvas.height = 0.45 * canvas.width;

    // Canvas values
    let proportionalMouseX, proportionalMouseY;
    let leftPadding = canvas.width * 0.05;
    let topPadding = canvas.width * 0.05;
    let edgeLength = canvas.width * 0.325;
    let interiorPadding = edgeLength * 0.01;
    let squarePadding = canvas.width - leftPadding * 2 - edgeLength * 2;

    let mouse = {X: leftPadding + edgeLength * 0.35, Y: topPadding + edgeLength * 0.25};

    // Handle window resizing
    window.addEventListener('resize', function () {
        canvas.width = 0.9 * Math.min(window.innerWidth, 1500);
        canvas.height = 0.45 * canvas.width;
        
        setCanvasValues();
        animate();
    });

    function setCanvasValues(){
        proportionalMouseX = (mouse.X - leftPadding) / edgeLength;
        proportionalMouseY = (mouse.Y - topPadding) / edgeLength;

        leftPadding = canvas.width * 0.05;
        topPadding = canvas.width * 0.05;
        edgeLength = canvas.width * 0.3;
        interiorPadding = edgeLength * 0.005;
        squarePadding = canvas.width - leftPadding * 2 - edgeLength * 2;

        mouse = {X: leftPadding + edgeLength * proportionalMouseX, Y: topPadding + edgeLength * proportionalMouseY};
    }

    /*
    ================================================================================
    Canvas Animation
    ================================================================================
    */

    function animate() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

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
        const folds = [line1,line2,line3];

        //Begin flat folding computations
        const mouseCentered = new Point((mouse.X - leftPadding)*100/edgeLength, (mouse.Y - topPadding)*100/edgeLength);
        const flatFoldEnd = directionAngle(mouseCentered, leftPadding, topPadding, edgeLength);
        const flatFoldLine = new Line(mousePoint, flatFoldEnd);
        folds.push(flatFoldLine);

        let polygon1 = new Polygon([topLeft,topRight, mousePoint]);
        let polygon2 = new Polygon([topLeft, bottomLeft, mousePoint]);
        let polygon3;
        let polygon4;
        
        const foldedShape = [];

        foldLine = generateLine(mousePoint, topLeft);
        let folded = fold(polygon1,foldLine[0],foldLine[1]);
        foldLine = generateLine(mousePoint, bottomLeft);
        foldedShape.push(fold(folded,foldLine[0],foldLine[1]));
        foldedShape.push(fold(polygon2,foldLine[0],foldLine[1]));

        if (flatFoldEnd.X === leftPadding + edgeLength && flatFoldEnd.Y === topPadding + edgeLength){
            polygon3 = new Polygon([topRight, mousePoint, flatFoldEnd]);
            polygon4 = new Polygon([bottomLeft, mousePoint, flatFoldEnd])
        }
        else if (flatFoldEnd.X === leftPadding + edgeLength){
            polygon3 = new Polygon([topRight, mousePoint, flatFoldEnd]);
            polygon4 = new Polygon([bottomLeft, mousePoint, flatFoldEnd, bottomRight])
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
            polygon.shift(edgeLength + squarePadding)
            polygon.draw();
        }
    }

    /*
    ================================================================================
    Mousedown tools
    ================================================================================
    */

    function getCursorPosition (canvas, event) {
        const cRect = canvas.getBoundingClientRect();

        let tempX = Math.round(event.clientX - cRect.left);
        let tempY = Math.round(event.clientY - cRect.top);
        
        if (tempX < leftPadding+interiorPadding) return;
        else if (tempX > leftPadding+edgeLength-interiorPadding) return;

        if (tempY < topPadding+interiorPadding) return;
        else if (tempY > topPadding+edgeLength-interiorPadding) return;

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

    // Initial animation
    setCanvasValues();
    animate();
});