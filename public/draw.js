let oCanvas = document.getElementById('draw');
let oldHeight = oCanvas.height;
let oldWidth = oCanvas.width;
var cantDraw = false;
let tempImage = null;
let resized = false;
var canvas, ctx,
    brush = {
        x: 0,
        y: 0,
        color: '#000000',
        size: 5,
        down: false,
    },
    strokes = [],
    currentStroke = null;

function redraw () {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    if (resized){
        ctx.drawImage(tempImage, 0, 0, canvas.width(), canvas.height());
    }
    if (!cantDraw) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (var i = 0; i < strokes.length; i++) {
            var s = strokes[i];
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.size;
            ctx.beginPath();
            ctx.moveTo(s.points[0].x, s.points[0].y);
            for (var j = 0; j < s.points.length; j++) {
                var p = s.points[j];
                ctx.lineTo(p.x, p.y);
            } 
            ctx.stroke();
        }
    } else {
        // Don't worry this code looks sketch but its actually something js people do commonly
        (async ()=>{
            let thing = await compute_image();
            ctx.drawImage(thing, 0, 0, canvas.width(), canvas.height());
        })()
    }
}

async function get_the_image() {
    return storedImage;
}

async function compute_image() {
    let newImage = new Image();
    newImage.src = await get_the_image();
    return newImage;
}

function init () {
    canvas = $('#draw'); //same thing as getElementByID
    changeBound();
    ctx = canvas[0].getContext('2d');
    function mouseEvent (e) {
        brush.x = e.pageX - getLeftOffset(oCanvas);
        brush.y = e.pageY - getTopOffset(oCanvas);
        //console.log(getTopOffset(oCanvas))
        //console.log(getLeftOffset(oCanvas))

        currentStroke.points.push({
            x: brush.x,
            y: brush.y,
        });

        redraw();
    }

    canvas.mousedown(function (e) {
        brush.down = true;

        currentStroke = {
            color: brush.color,
            size: brush.size,
            points: [],
        };

        strokes.push(currentStroke);

        mouseEvent(e);
    }).mouseup(function (e) {
        brush.down = false;

        mouseEvent(e);

        currentStroke = null;
    }).mousemove(function (e) {
        if (brush.down)
            mouseEvent(e);
    });

    $('#save-btn').click(function () {
        var artwork = canvas[0].toDataURL();
        console.log(artwork);
        //this commented part below is code to be copied when redrawing saved image!
        //var art = document.createElement('img'); 
        //art.src = artwork
        //ctx.drawImage(art, 5, 5,);
        // Temp Soln since current storage for game has yet to be decided on

    });

    $('#undo-btn').click(function () {
        strokes.pop();
        redraw();
    });

    $('#clear-btn').click(function () {
        strokes = [];
        redraw();
    });

    $('#color-picker').on('input', function () {
        brush.color = this.value;
    });

    $('#brush-size').on('input', function () {
        brush.size = this.value;
    });
}

function changeBound(){
    let canWidth = drawingBoard.clientWidth * 0.95
    let canHeight = canWidth * 0.5
    oCanvas.height = canHeight
    oCanvas.width = canWidth
}

async function getTemp(currImage) {
    tempImage = new Image();
    tempImage.src = await currImage;
} 

$(window).resize(function() {
    (async ()=>{
        resized = true;
        strokes = [];
        let currImage = canvas[0].toDataURL();
        changeBound();
        await getTemp(currImage);
        redraw();
    })()
  });

$(init);

function getBaseImg() {
    return canvas[0].toDataURL();
}

function displayPicture(baseImage) {
    console.log("Display Picture");
    cantDraw = true;
    storedImage = baseImage;
    redraw();
}

function turnOffDisplay() {
    cantDraw = false;
    strokes = [];
    redraw();
}

function getLeftOffset(curObj){
    var offset = 0
    while(!(curObj === null)){
        offset += curObj.offsetLeft
        curObj = curObj.offsetParent
    }
    return offset
}

function getTopOffset(curObj){
    var offset = 0
    while(!(curObj === null)){
        offset += curObj.offsetTop
        curObj = curObj.offsetParent
    }
    return offset
}
