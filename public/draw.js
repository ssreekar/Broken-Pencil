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
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0, canvas.width(), canvas.height());
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
    redraw();
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
        let modifiedX = e.pageX - getLeftOffset(oCanvas);
        let modifiedY = e.pageY - getTopOffset(oCanvas);
        if (0 <= modifiedX && canvas.width() >= modifiedX &&
            0 <= modifiedY && canvas.height() >= modifiedY) {
            brush.down = true;
            currentStroke = {
                color: brush.color,
                size: brush.size,
                points: [],
            };
    
            strokes.push(currentStroke);
            mouseEvent(e);
        } else {
            brush.down = false;
            mouseEvent(e);
            currentStroke = null;
        }

    }).mouseup(function (e) {
        if (brush.down){
            brush.down = false;
            mouseEvent(e);
        }
        currentStroke = null;
    }).mousemove(function (e) {
        if (brush.down){
            mouseEvent(e);
        }
    });
    $('#color-red').click(()=>{
        brush.color = '#FF0000';
    });
    $('#color-orange').click(()=>{
        brush.color = '#FFA500';
    });
    $('#color-yellow').click(()=>{
        brush.color = '#FFFF00';
    });
    $('#color-green').click(()=>{
        brush.color = '#008000'
    });
    $('#color-blue').click(()=>{
        brush.color = '#0000FF';
    });
    $('#color-purple').click(()=>{
        brush.color = '#800080';
    });
    $('#color-brown').click(()=>{
        brush.color = '#8B4513';
    });
    $('#color-white').click(()=>{
        brush.color = '#FFFFFF';
    });
    $('#color-black').click(()=>{
        brush.color = '#000000';
    });


    $('#undo-btn').click(function () {
        strokes.pop();
        redraw();
    });

    $('#clear-btn').click(function () {
        resized = false;
        strokes = [];
        redraw();
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
