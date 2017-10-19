module.exports = {
  updateBoard: function (){
    for (let x=0; x<3; x++)
      for (let y=0; y<3; y++)
        if (board[x][y] != undefined) document.getElementById("p"+(x+1)+(y+1)).innerHTML = board[x][y]=='O'?this.printCircle():board[x][y];
  },
  isLastTurn: function(board,test = 0){
      var winner = null, blanks = 0;
      for (x=0; x<3; x++) //linha preenchida
        if (board[x][0] != undefined && board[x][0] == board[x][1] && board[x][1] == board[x][2]) {
          winner = board[x][0];
          break;
        }
      if (!winner) //coluna preenchida
        for (y=0; y<3; y++)
          if (board[0][y] != undefined && board[0][y] == board[1][y] && board[1][y] == board[2][y]) {
            winner = board[0][y];
            break;
          }
      if (!winner) //diagonal preenchida
        if (board[1][1] != undefined && ((board[0][0] == board[1][1] && board[0][0] == board[2][2]) ||
           (board[0][2] == board[1][1] && board[0][2] == board[2][0]))) winner = board[1][1];

      for(x=0; x<3; x++)
        for(y=0; y<3; y++)
          if(board[x][y] == undefined) blanks++;

      if(winner) {
        if(!test) {
          if(winner == symbol.human) swal("Parabéns!","Você venceu o robô!","success");
          else swal("CPU venceu!","Você precisa treinar mais!","info");
          return true;
        } else return ((winner==symbol.cpu?1:-1)*(blanks+1)); //if test, return utility
      } else if(!blanks) {
          if(!test) {
            swal("Velha!","Você empatou com a CPU!","info");
            return true;
          } else return 0; //if draw, utility = 0
      } else {
          if(test) return null; else return false;
      }
  },
  generateGameTree: function(initialState){
    var stack = [], gameTree = {}, node, x, y, move, minimax;
    gameTree = {state: initialState, sons: [], turn:symbol.human, utility: null}; //Initial State
    stack.push(gameTree);

    while (stack.length) {
      parentNode = stack.pop();
      move = (parentNode.turn==symbol.cpu)?symbol.human:symbol.cpu;
      for (x=0; x<3; x++)
        for (y=0; y<3; y++)
          if(parentNode.state[x][y] == undefined){
            let auxState = this.cloneState(parentNode.state);
            auxState[x][y] = move; // add moviment
            let childNode = {state: auxState, sons: [], turn: move, utility: null};
            childNode.utility = this.isLastTurn(childNode.state,1);
            parentNode.sons.push(childNode);

            if (!childNode.utility) stack.push(childNode);
          }
    }
    this.calcMiniMax(gameTree);
    return gameTree;
  },
  calcMiniMax: function (gameTree){
    var minValue, maxValue;
    for (let i=0; i < gameTree.sons.length; i++) {
      if (gameTree.sons[i].utility == null) this.calcMiniMax(gameTree.sons[i]);
      if (gameTree.turn == symbol.human){
        if (maxValue == undefined || gameTree.sons[i].utility > maxValue) maxValue = gameTree.sons[i].utility;
        gameTree.utility = maxValue;
      } else {
        if (minValue == undefined || gameTree.sons[i].utility < minValue)	minValue = gameTree.sons[i].utility;
        gameTree.utility = minValue;
      }
    }
  },
  printCircle: function(){
    var canvas = document.createElement('canvas');
    if (canvas.getContext){
      canvas.width = 110;
      canvas.height = 110;
      var context = canvas.getContext('2d');
      context.strokeStyle = "#333";
      context.beginPath();
      context.arc(55,55,50,0,(Math.PI*2),true);
      context.closePath();
      context.lineWidth = 4;
      context.stroke();
      return '<img src="'+canvas.toDataURL()+'" />';
    } else return 'O';
  },
  cloneState: function(state) {
  	var newState = [];
  	for(let i = 0; i < state.length; i++)	newState[i] = state[i].slice();
  	return newState;
  },
  cleanBoard: function() {
    for(let x=0; x<3; x++) for(let y=0; y<3; y++) {
      board[x][y] = undefined;
      document.getElementById("p"+(x+1)+(y+1)).innerHTML = '';
    }
    gameStatus.onGame = 0;
    gameStatus.holdBoard = 0;
  }
};
