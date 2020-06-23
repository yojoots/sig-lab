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
                readFromGrid();
            }
        })
        .on("mousedown", function(d) {
            mouseDown = true;
            d.value = !d.value;
            if ( d.value ) { d3.select(this).style("fill","black"); }
            else { d3.select(this).style("fill","#fff"); }
            readFromGrid();
        });
}

function hexToBytes(hexString) {
    for (var bytes = [], c = 0; c < hexString.length; c += 2)
    bytes.push(parseInt(hexString.substr(c, 2), 16));
    return bytes;
}

function hexToBase58(hexString) {
    const bytes = hexToBytes(hexString, 'hex')
    return bs58.encode(bytes)
}

function base58ToHex(base58String) {
    return Array.from(bs58.decode(base58String), function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('')
}

function hexToBase58Check(hexString) {
    const bytes = hexToBytes(hexString, 'hex')
    return b58c.getName(bytes)
}

function base58CheckToHex(base58String) {
    return Array.from(bs58.decode(base58String), function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('')
}

function hexToBase64(hexString) {
    return btoa(hexString.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function base64ToHex(base64String) {
    const raw = atob(base64String);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result.toUpperCase();
}

function hexToBinary(hexString){
    let fullBinaryString = "";
    for (var i = 0; i < hexString.length; i=i+2) {
        miniHexString = hexString[i] + hexString[i+1]
        fullBinaryString += ("00000000" + (parseInt(miniHexString, 16)).toString(2)).substr(-8);
    }
    return fullBinaryString;
  }

function binaryToHex(binaryString) {
    let hexString = "";
    for (i = 0; i < binaryString.length; i+=8) {
        hexString += parseInt(binaryString.substring(i, i+8), 2).toString(16).padStart(2, '0');
    }
    return hexString;
}

function updateBinaryFields(binaryString) {
    document.getElementById("binKey").innerText = binaryString;
    document.getElementById("binInput").value = binaryString;
}

function updateHexFields(hexString) {
    document.getElementById("hexKey").innerText = hexString;
    document.getElementById("hexInput").value = hexString;
}

function updateBase64Fields(hexString) {
    let base64string = hexToBase64(hexString);
    document.getElementById("base64Key").innerText = base64string;
    document.getElementById("base64Input").value = base64string;
}

function updateBase58Fields(hexString) {
    let base58string = hexToBase58(hexString);
    document.getElementById("base58Key").innerText = base58string;
    document.getElementById("base58Input").value = base58string;
}

function updateBase58CheckFields(hexString) {
    let base58checkstring = hexToBase58Check(hexString);
    document.getElementById("base58CheckKey").innerText = base58checkstring;
    document.getElementById("base58CheckInput").value = base58checkstring;
}

function readFromGrid(binaryString = "", fieldToIgnore = "none") {
    if(binaryString == "") {
        keyData.forEach(square => { if (square.value) {binaryString += "1"} else {binaryString += "0"}});
    }
    
    if (fieldToIgnore !== "binary") updateBinaryFields(binaryString);

    let hexString = binaryToHex(binaryString);
    if (fieldToIgnore !== "hex") updateHexFields(hexString);
    if (fieldToIgnore !== "base64") updateBase64Fields(hexString);
    if (fieldToIgnore !== "base58") updateBase58Fields(hexString);
    if (fieldToIgnore !== "base58check") updateBase58CheckFields(hexString);
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

      readFromGrid();
    } else { throw new Error("Your browser can't generate secure random numbers"); }
}

function binaryToGrid() {
    let binarystring = document.getElementById("binKey").innerText;
    console.log("B2G:", binarystring)
    for (var i = 0; i < binarystring.length && i < 256; i++) {
        keyData[i].value = (binarystring.charAt(i) == "1")
    }
    d3.selectAll("rect").data(keyData).transition()
    .style("fill", function(d) {
        if (d.value) { return "black" }
        else { return "#fff" };
    });
}


window.onload = function() {
    populateGrid();
};