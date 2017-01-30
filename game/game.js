window.addEventListener("message", initGame, false);

gameState = {"board":[],
             "boardcheck":[],
                      "player1": 0,
                      "player2": 0,
                      "turn": true,
                      "gameEnd": false,
                      "boardSize":0}


/*
**************************************************
**********Game generation and DOM Manip***********
**************************************************
*/

function initGame(event) {
    welcome();
    var color = true;
    if(event.data) {
        gameState.boardSize = event.data;
    }
    else if(event.value) {
       preReset();
       gameState.boardSize = event.value;
    }
    else {
        return;
    }
    var invis = document.getElementById("invsiboard");
    var scale = createBoard(gameState.boardSize, document.getElementById('board'));
    var tbl = document.createElement('table');
    tbl.setAttribute('width',scale.toString() + "px;");
    tbl.setAttribute('height',scale.toString() + "px;");
    tbl.style.zIndex = "10"
    var tbdy = document.createElement('tbody'); 
    for (var i = 0; i < gameState.boardSize; i++) {
        var tr = document.createElement('tr');
        gameState.board.push([]);
        gameState.boardcheck.push([]);
        for (var j = 0; j < gameState.boardSize; j++) {
                var td = document.createElement('td');
                td.style.align = 'center';
                td.style.textAlign = 'center';
                td.style.width = "50px";
                td.style.height = "50px";
                var pdiv = document.createElement('div')
                pdiv.style.marginTop = "-22px";
                var div = document.createElement('div');
                div.style.position = "absolute";
                div.style.zIndex = "10";
                var button = document.createElement('button')
                button.setAttribute('onClick', 'turn('+ i.toString() +',' + j.toString()+ ')');
                button.setAttribute('class', 'invsibutton');
                div.appendChild(button);
                pdiv.appendChild(div);
                td.appendChild(pdiv);
                tr.appendChild(td);
                gameState.board[i].push(0);
                gameState.boardcheck[i].push(0);
            }
            tbdy.appendChild(tr);
        }
    tbl.appendChild(tbdy);
    invis.appendChild(tbl);
    modelgameState();
}

function createBoard(size, div) {
    var canvas = document.createElement('canvas');
    canvas.width = '800';
    canvas.height = '800';
    var ctx =  canvas.getContext('2d');
    ctx.globalCompositeOperation='destination-over';
    var origin = 50;
    var gridSize = 60;
    var scale = (size-1)* gridSize;
    var invsiboardScale = (size)* gridSize;
     ctx.strokeRect(origin, origin,scale , scale);
     ctx.beginPath();
      for (var i = 1; i < size -1; i++) {
        var x = gridSize*(i+.8);
        ctx.moveTo(x, origin);
        ctx.lineTo(x, scale + origin);
        ctx.moveTo(origin, x);
        ctx.lineTo(scale + origin, x);
      }
        ctx.stroke();
    div.appendChild(canvas);
    return invsiboardScale;
}

function insertGamePiece(player,i,j) {
    var tbl = document.getElementsByTagName("table");
    var row = tbl[0].children[0].children[i];
    var td = row.children[j];
    var div =  td.children[0];
    var svgDiv = document.createElement("div");
    svgDiv.setAttribute("id", "svgDiv" +i +j);
    svgDiv.style.position = "absolute";
    var img = document.createElement('img');
    img.setAttribute("width", "40px;");
    img.setAttribute("height", "40px;");
    if(player == 1) {
        img.src = "whiteP.svg"
    }
    else if(player == 2) {
        img.src = "blackP.png"
    }
    svgDiv.appendChild(img);
    div.appendChild(svgDiv);
}

function removeGamePiece(i,j) {
    var svgDiv = document.getElementById("svgDiv"+i+j);
    if(svgDiv !== null) svgDiv.innerHTML = '';
}

function inputPlayers() {
    var scoreB = document.getElementById("scoreBoard");
    var doc = document.getElementById("players");
    var p1 =  document.getElementById("p1").value;
    var p2 =  document.getElementById("p2").value;
    doc.style.display = "none";
    var p1html = document.createElement("h3");
    var p2html = document.createElement("h3");
    p1html.innerHTML = p1;
    p2html.innerHTML = p2;
    var scoreTb = document.createElement("table");
    var r1 = document.createElement("tr");
    var r2 = document.createElement("tr");
    var d1 = document.createElement("td");
    d1.align = "center";
    var d2 = document.createElement("td");
    d2.align = "center";
    var d3 = document.createElement("td");
    d3.align = "center";
    var d4 = document.createElement("td");
    d4.align = "center";
    d3.setAttribute("id","p1score");
    d4.setAttribute("id","p2score");
    d3.innerHTML = gameState.player1;
    d4.innerHTML = gameState.player2;
    d1.appendChild(p1html);
    d2.appendChild(p2html);
    r1.appendChild(d1);
    r1.appendChild(d2);
    r2.appendChild(d3);
    r2.appendChild(d4);
    scoreTb.appendChild(r1);
    scoreTb.appendChild(r2);
    scoreB.appendChild(scoreTb);
}


/*
**************************************************
***************Tangental Features*****************
**************************************************
*/



function preReset() {
       var oldB = document.getElementById("board");
        while (oldB.firstChild) {
            oldB.removeChild(oldB.firstChild);
        }
        var oldInvis = document.getElementById("invsiboard");
        while (oldInvis.firstChild) {
            oldInvis.removeChild(oldInvis.firstChild);
        }
        gameState.board = [];
        gameState.boardcheck = [];
        gameState.player1 = 0;
        gameState.player2 = 0;
        gameState.turn = true;
        gameState.gameEnd = false;
}

function reset() {
        preReset();
        initGame(event);
}

function welcome() {
    var doc = document.getElementById("name");
    var localString =  localStorage.getItem('cs2550timestamp');
    doc.innerHTML += "Welcome, " + localString;
}



function importSavedGame() {
    var xmlhttp = new XMLHttpRequest();
    var url = "saved.json";
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        gameState = myArr;
        var options = {
            body:JSON.stringify(myArr)
        }
        var n = new Notification("imported game state", options);
        modelgameState();
        }
    };
xmlhttp.open("GET", url, true);
xmlhttp.send();
}

/*
**************************************************
***************Critical Game Logic****************
**************************************************
*/

function modelgameState() {
    for(var i = 0; i< gameState.board.length; i++) {   
        for(var j = 0; j < gameState.board[i].length; j++) {
              if(gameState.board[i][j] !== 0) { 
                  var svgDiv = document.getElementById("svgDiv"+i+j);
                  if(svgDiv == null) {
                    insertGamePiece(gameState.board[i][j],i,j);
                  }   
              }
              else {
                   removeGamePiece(i,j);
              }
        }
    }
    console.log(gameState);
}  

function turn(x,y) {
    var player; 
    if(gameState.turn) {
        player = 1;
    }
    else  {
        player = 2;
    }
    if(gameState.board[x][y] == 0 && validMove(x, y, (3-player))) {
        var coord = document.getElementById("coord");
        coord.innerHTML = '(' + x + ',' + y + ') ,';
        gameState.board[x][y] = player; 
        coord.innerHTML += "Player " + player;
        boardCheckManager(x, y, player);
        modelgameState(); 
    gameState.turn = !gameState.turn;
    }
    else if (gameState.board[x][y] == 0 && !validMove(x, y, 3-player)) {
       var gameStateTemp =  gameState;
       gameState.board[x][y] = player;
       boardCheckManager(x, y, player);
       if(!validMove(x,y,3-player)) {
           gameState = gameStateTemp;
       }
       else {
         modelgameState(); 
         gameState.turn = !gameState.turn;
       }
    }
}


/*
**************************************************
***************recursion functions****************
**************************************************
*/

function validMove(x,y,opp) {
      if(inBounds(x+1,y) && gameState.board[x+1][y] != opp )  {
          return true;
      } 
      if(inBounds(x-1,y) && gameState.board[x-1][y] != opp)  {
           return true;
      } 
      if(inBounds(x,y+1) && gameState.board[x][y+1] != opp )  {
           return true;
      } 
      if(inBounds(x,y-1) && gameState.board[x][y-1] != opp)  {
           return true;
      }
      return false; 
}



function checkLiberties(x,y,player) {
   gameState.boardcheck[x][y] = 1;
    if(gameState.board[x][y] == 0) {
        return true;
    } 
      else if (gameState.board[x][y] == player) {
          return false;
      }
    else {
     gameState.boardcheck[x][y] = 2;
      var liberty = false;
      if(inBounds(x+1,y) && gameState.boardcheck[x+1][y] == 0)  {
          liberty |= checkLiberties(x+1, y, player);
      } 
      if(inBounds(x-1,y) && gameState.boardcheck[x-1][y] == 0)  {
          liberty |= checkLiberties(x-1, y, player);
      } 
      if(inBounds(x,y+1) && gameState.boardcheck[x][y+1] == 0)  {
          liberty |= checkLiberties(x, y+1, player);
      } 
      if(inBounds(x,y-1) && gameState.boardcheck[x][y-1] == 0)  {
          liberty |= checkLiberties(x, y-1, player);
      } 
      return liberty;
   }
}

function removeChain(x,y,player) {
    gameState.boardcheck[x][y] = 1;
    gameState.board[x][y] = 0;
    player == 1 ? gameState.player1++ : gameState.player2++;
    if(inBounds(x+1,y) && gameState.boardcheck[x+1][y] == 2)  {
          removeChain(x+1, y, player);
      } 
      if(inBounds(x-1,y) && gameState.boardcheck[x-1][y] == 2)  {
          removeChain(x-1, y, player);
      } 
      if(inBounds(x,y+1) && gameState.boardcheck[x][y+1] == 2)  {
          removeChain(x, y+1, player);
      } 
      if(inBounds(x,y-1) && gameState.boardcheck[x][y-1] == 2)  {
          removeChain(x, y-1, player);
      } 
}

function inBounds(x,y) {
    return ((x >= 0 && x <= gameState.boardSize-1) && (y >= 0 && y <= gameState.boardSize -1));
}

function resetBoardCheck() {
    gameState.boardcheck = [];
    for(var i = 0; i < gameState.boardSize; i++) {
        gameState.boardcheck.push([]);
        for(var j = 0; j < gameState.boardSize ; j++) {
            gameState.boardcheck[i][j] = 0;
        }
    }
    console.log(gameState.boardcheck)
}

function boardCheckManager(x,y,player) {
    var liberty;
    if(inBounds(x+1,y))  {
        if(gameState.board[x+1][y] == 3- player) {
            resetBoardCheck();
            liberty = checkLiberties(x+1,y,player);
            if(!liberty) removeChain(x+1,y,player);
        }
      } 
    if(inBounds(x-1,y))  {
         if(gameState.board[x-1][y] == 3- player) {
            resetBoardCheck();
            liberty = checkLiberties(x-1,y,player);
            if(!liberty) removeChain(x-1,y,player);
        }
    } 
    if(inBounds(x,y+1))  {
         if(gameState.board[x][y+1] == 3- player) {
            resetBoardCheck();
            liberty = checkLiberties(x,y+1,player);
            if(!liberty) removeChain(x,y+1,player);
        }
    } 
    if(inBounds(x,y-1))  {
         if(gameState.board[x][y-1] == 3- player) {
            resetBoardCheck();
            liberty = checkLiberties(x,y-1,player);
            if(!liberty) removeChain(x,y-1,player);
        }
    } 
}