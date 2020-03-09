let grid = d3.select("#grid")
            .append("svg")
            .attr("width","600px")
            .attr("height","190px");

let keyData = new Array(256).fill().map(u => ({value:false}));
let mouseDown = false;
let xtracker = 1;
let ytracker = 0;
let rowtracker = 0;
let coltracker = 0;
let cellSize = 18;

document.documentElement.addEventListener('mouseup', function(e){
    mouseDown = false;
});

let row = grid.selectAll(".row")
    .data(keyData)
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) {
        if (coltracker%32 === 0) {xtracker = 1;}
        else { xtracker += cellSize; }
        coltracker++;
        return xtracker; 
    })
    .attr("y", function(d) {
        if (rowtracker%32 === 0) {ytracker += cellSize;} 
        rowtracker++; 
        return ytracker;
    })
    .attr("width", function(d) { return cellSize; })
    .attr("height", function(d) { return cellSize; })
    .style("fill", "#fff")
    .style("stroke", "#222")
    .on("mouseover", function(d) {
        if(mouseDown) {
            d.value = !d.value;
            if ( d.value ) { d3.select(this).style("fill","black"); }
            else { d3.select(this).style("fill","#fff"); }
            updateKey();
        }
    })
    .on("mousedown", function(d) {
        mouseDown = true;
        d.value = !d.value;
        if ( d.value ) { d3.select(this).style("fill","black"); }
        else { d3.select(this).style("fill","#fff"); }
        updateKey();
    });

function updateKey() {
    let binaryString = "";
    keyData.forEach(square => { if (square.value) {binaryString += "1"} else {binaryString += "0"}});
    let hexString = "";
    for (i = 0; i < binaryString.length; i+=8) {
        hexString += parseInt(binaryString.substring(i, i+8), 2).toString(16).padStart(2, '0');
    }
    document.getElementById("hexKey").innerText = hexString;
    document.getElementById("binKey").innerText = binaryString;
}