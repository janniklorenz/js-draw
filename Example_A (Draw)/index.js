/* ===================================
 * JavaScript Drawing
 * ===================================

   Doku:

 * redraw()
 * Reloads the Currend Drawing

 * clearRect()
 * clears Current Draw

 * saveCurrent()
 * saves current Pack

 * changeColor()
 * @value color hex (Bsp: 000000)
 * saves current Pack and changes color
 
 * changeWidth()
 * @value width int (Bsp: 5)
 * saves current Pack and changes Line Width
 
 * clearCurrentPack()
 * Delete All Draws of the Current Pack
 
 * changePack()
 * @value newID string (Bsp: 1)
 * saves current Pack and load new
 
 * getPack()
 * get The current data in JSON
 
 */


// Statics
var canvasName = 			"mainCanvas";			// canvas ID
var defaultStrokeStyle = 	"000000";				// default StrokeStyle
var defaultLineWidth = 		"3";					// default LineWidth
var defaultPackID = 		"0";					// default PackID


// Runtime
var canvas = document.getElementById(canvasName);	// canvas
var context = canvas.getContext('2d');				// canvas Contex
var clickX = new Array();							// x values
var clickY = new Array();							// y values
var clickDrag = new Array();						// drag values
var paint;											// paint bool

var currentStrokeStyle = defaultStrokeStyle; 		// Color
var currentLineWidth = defaultLineWidth;			// Width

var currentPack = new Array();						// Activ Draw Rec
var currentPackID = defaultPackID;					// Activ Draw Rec ID

var allPacks = new Array();							// All Draw Recs


// --- Load Data ---
if ( typeof ims == "object" ) {
    ims.localStorage.getItem(ims.currentActivePageID+'draw', function (json) {
        try {
            if (json.data.length > 2) {
                var j = json.data.replace(/'/g, '"')
                j = j.substring(1, j.length - 1);
                
                allPacks = JSON.parse(j);
                currentPack = allPacks[0];
                
                if (!allPacks) { allPacks = new Array(); currentPack = new Array(); }
                redraw();
            }
        }
        catch (error) { }
    });
}


// --- Autorezize ---
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	redraw();
}

// --- init ---
resizeCanvas();
document.getElementById("s"+currentLineWidth).style.opacity = 1.0;
document.getElementById("c"+currentStrokeStyle).style.opacity = 1.0;


jQuery('#'+canvasName).fadeIn();




// --- Draw ---
$(document).bind('touchmove',function(e) {
	e.preventDefault();
});

jQuery('#'+canvasName)
.bind('movestart', function(e) {
    var mouseX = e.pageX - this.offsetLeft; 
	var mouseY = e.pageY - this.offsetTop; 
	paint = true; 
	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop); 
	redraw(); 
})
.bind('move', function(e) {
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true); 
	redraw(); 

}).bind('moveend', function() {
	paint = false; 
});




// --- add Click ---
function addClick(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}



// --- redraw image ---
function redraw() {
	clearRect();
	
	for (var c=0; c <= currentPack.length; c++) {
		
		var cx, cy, cd, ss, lw;
		if (c < currentPack.length) {
			cx = currentPack[c][0];
			cy = currentPack[c][1];
			cd = currentPack[c][2];
			ss = currentPack[c][3];
			lw = currentPack[c][4]
		}
		else {	cx = clickX; cy = clickY; cd = clickDrag; ss = currentStrokeStyle; lw = currentLineWidth; }
		
		context.strokeStyle = "#"+ss;
		context.lineJoin = "round";
		context.lineWidth = lw;
		
		for (var i=0; i < cx.length; i++) {		
			context.beginPath();
			
			if (cd[i] && i)		context.moveTo(cx[i-1], cy[i-1]);
			else 				context.moveTo(cx[i]-1, cy[i]);
			
			context.lineTo(cx[i], cy[i]);
			context.closePath();
			context.stroke();
		}
	}
}


// --- Clear Draw ---
function clearRect() {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}


// --- Write Current Changes to the Pack ---
function saveCurrent() {
    if (clickX.length + clickY.length + clickDrag.length == 0) return;
	
    var x = JSON.stringify(clickX);
	var y = JSON.stringify(clickY);
	var d = JSON.stringify(clickDrag);
	
	var colorPack = new Array();
	colorPack.push(clickX);
	colorPack.push(clickY);
	colorPack.push(clickDrag);
	colorPack.push(currentStrokeStyle);
	colorPack.push(currentLineWidth);
	
	currentPack.push(colorPack);
}


// --- save and change color ---
function changeColor(color) {
	saveCurrent();
    
    document.getElementById("c"+currentStrokeStyle).style.opacity = .3;
    document.getElementById("c"+color).style.opacity = 1.0;
                         
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	currentStrokeStyle = color;
}


// --- save and change the Width ---
function changeWidth(width) {
	saveCurrent();
    
    document.getElementById("s"+currentLineWidth).style.opacity = .3;
    document.getElementById("s"+width).style.opacity = 1.0;
	
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	currentLineWidth = width;
}


// --- del current Pack ---
function clearCurrentPack() {
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	currentPack = new Array();
	
	changePack(currentPackID);
}


// --- save current pack and load new ---
function changePack(newID) {
	saveCurrent();
	allPacks[currentPackID] = currentPack;
	
	clearRect();
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	currentStrokeStyle = defaultStrokeStyle
	currentLineWidth = defaultLineWidth;
	
	currentPack = allPacks[newID];
	if (!currentPack) currentPack = new Array();
	currentPackID = newID;
	
	redraw();
}




// --- get The current data in JSON ---
function getPack() {
	changePack(currentPackID);
    return JSON.stringify(allPacks).replace(/"/g, "'");
}