let grid = d3.select("#grid")
            .append("svg")
            .attr("width","600px")
            .attr("height","190px");

let keyData = new Array(256).fill().map(u => ({value:false}));
let mouseDown = false;
let row;

document.documentElement.addEventListener('mouseup', function(e){
    mouseDown = false;
});

function populateGrid() {
    if (typeof row !== 'undefined' && row !== null) {
        row.remove();
    }

    let xtracker = 1;
    let ytracker = 0;
    let rowtracker = 0;
    let coltracker = 0;
    let cellSize = 18;
    row = grid.selectAll(".row")
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
        .style("fill", function(d) {
            if (d.value) { return "black" }
            else { return "#fff" };
        })
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
}


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

function randomize() {
    if (window.crypto || window.msCrypto) {
      var random32BitUints = new Uint32Array(8);
      window.crypto.getRandomValues(random32BitUints);

      for(var i = 0; i < random32BitUints.length; i++) {
        let randomRawInt = (random32BitUints[i]).toString(2).padStart(32, '0');
          for(var j = 0; j < randomRawInt.length; j++) {
            keyData[(i*32 + j)].value = (randomRawInt[j] === '1');
          }
      }

      d3.selectAll("rect").data(keyData).transition()
        .style("fill", function(d) {
            if (d.value) { return "black" }
            else { return "#fff" };
        });

      updateKey();

    } else { throw new Error("Your browser can't generate secure random numbers"); }
}


window.onload = function() {
    populateGrid();
};