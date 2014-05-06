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
var defaultStrokeStyle = 	"ff0000";				// default StrokeStyle
var defaultLineWidth = 		"15";					// default LineWidth
var defaultYOffset = 		"30";					// default y offset


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
	clearRect();
});




// --- add Click ---
function addClick(x, y, dragging) {
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	
	clickX.push(x);
	clickY.push(y-defaultYOffset);
	clickDrag.push(dragging);
}



// --- redraw image ---
function redraw() {
	clearRect();
	cx = clickX; cy = clickY; cd = clickDrag; ss = currentStrokeStyle; lw = currentLineWidth;
	context.strokeStyle = "#"+ss;
	context.lineJoin = "round";
	context.lineWidth = lw;	
	for (var i=0; i < cx.length; i++) {		
		context.beginPath();	
		context.moveTo(cx[i]-1, cy[i]);	
		context.lineTo(cx[i], cy[i]);
		context.closePath();
		context.stroke();
	}
}


// --- Clear Draw ---
function clearRect() {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}