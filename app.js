const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  var lives;
  var timer;
  var timeRemaining;
  var selectedNum;
  var selectedTile;
  var disableSelect;

  function id (id){
    return document.getElementById(id);
  }

  window.onload = function() {
    id('start-btn').addEventListener("click",startGame);

    for(let i = 0; i < id("number-container").children.length; i++ ){
      id("number-container").children[i].addEventListener('click', function(){
        if(!disableSelect) {
            if(this.classList.contains('selected')){
              this.classList.remove('selected');//this is refering to children of num container 
              selectedNum = null;
            }
            else{
              //deselect
              for(let i = 0; i < 9; i++ ){
                id("number-container").children[i].classList.remove('selected');
              }
              this.classList.add('selected')
              selectedNum = this;
              updateMove();
            }
        }
      })
    }
  }
  
function startGame(){
  let board;
  if(id("diff-1").checked) {
    board = easy[0]
  }
  else if(id("diff-2").checked){
    board = medium[0]
  }
  else {
    board = hard[0]
  }

  lives = 10;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: "+lives;
   generateBoard(board);

   startTimer();
   if(id("theme-1").checked){
    document.querySelector('body').classList.remove('dark');
   }
   else{
    document.querySelector('body').classList.add('dark')
   }

   id('number-container').classList.remove('hidden');
} 

function  clearPrevious(){
let tiles = document.querySelectorAll(".tile");
for(let i = 0 ; i <  tiles.length ; i++){
   tiles[i].remove();
}

if(timer){
  clearTimeout(timer);
}
//deselect any number
for(let i = 0; i < id("number-container").children.length ; i++){
id("number-container").children[i].classList.remove("selected");
}
selectedNum = null
selectedTile = null
}
//mm:ss
function timeConverstion(time){
let minutes = Math.floor(time/60);
if(minutes < 10){
  minutes = "0" + minutes;
}
let seconds = time % 60
if(seconds < 10){
  seconds = "0" + seconds;
}
return minutes + ":" + seconds;
}

function startTimer(){
  if(id('time-1').checked){
    timeRemaining = 300;
  }
  else if(id('time-2').checked){
    timeRemaining = 600;
  }
  else{
    timeRemaining = 900;
  }
  id("timer").textContent = timeConverstion(timeRemaining);

  timer = setInterval(function(){
     timeRemaining --;
     if(timeRemaining === 0){
      endGame();
     }
      id('timer').textContent = timeConverstion(timeRemaining);
     
  },1000)
}

function generateBoard(board){
  clearPrevious();
  let idCount = 0;
  //tiles 9*9
  for(let i = 0; i < 81; i++){
    let tile = document.createElement('p');

    if(board.charAt(i) != "-"){
      tile.textContent = board.charAt(i)
    }
    else{
     //add event
     tile.addEventListener('click', function(){
      if(!disableSelect){
        if(tile.classList.contains('selected')){
          tile.classList.remove('selected')
          selectedTile = null;
        }
        else{
        //deselect
        for(let i = 0; i < 81; i++){
          document.querySelectorAll(".tile")[i].classList.remove('selected')
        }
        tile.classList.add('selected');
        selectedTile = tile;
        updateMove();
        }
      }
      
     })
    }
    tile.id = idCount;
    idCount ++;

    tile.classList.add("tile");
    if((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)){
      tile.classList.add("bottomBorder");
    }
    if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
      tile.classList.add("rightBorder");
    }
    
    id('board').appendChild(tile);
  }
}

function updateMove(){
  if(selectedTile && selectedNum){
    selectedTile.textContent = selectedNum.textContent;
    if(checkCorrect(selectedTile)){
      selectedTile.classList.remove('selected')
      selectedNum.classList.remove('selected')
      selectedNum = null;
      selectedTile = null;

      if(checkDone()){
       endGame(); 
      }
    }
    else{
      disableSelect = true;
      selectedTile.classList.add("incorrect")
      setTimeout(function(){
      lives --;
      if(lives === 0){
        endGame();  
      }
      else{
        id("lives").textContent = "Lives Remaining: " + lives;
        disableSelect = false;
      }
         //restore tile color
         selectedTile.classList.remove("incorrect")
         selectedTile.classList.remove("selected")
         selectedNum.classList.remove("selected")

         selectedTile.textContent = "";
         selectedNum = null;
         selectedTile = null;
      },1000)
    }
  }
}

function checkCorrect(tile){
  let solution;
  if(id("diff-1").checked) {
    solution = easy[1];
  }
  else if(id("diff-2").checked){
    solution = medium[1];
  }
  else {
    solution = hard[1];
  }

  if(solution.charAt(tile.id) === tile.textContent){
    return true;
  }
  else{
    return false;
  }
}

function endGame(){
  clearTimeout(timer);

  if(lives === 0 || timeRemaining === 0){
    id("lives").textContent = "You Lost!"
  }
  else{
    id("lives").textContent = "You Won!"
  }
}

function checkDone(){
  let tiles = document.querySelectorAll(".tile");
  for(let i = 0; i< tiles.length; i++){
    if(tile.textContent === ""){
      return false;
    }
  }
  return false;
}
