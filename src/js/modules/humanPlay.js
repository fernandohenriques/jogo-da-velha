module.exports = function(columnId,game,cpuPlay,UI) {
  var x = parseInt(columnId.substr(1,1))-1;
  var y = parseInt(columnId.substr(2,1))-1;

  if(board[x][y] != undefined) {
    swal("Posição inválida!","Escolha outra posição.","warning");
    return false;
  }

  board[x][y] = symbol.human;
  game.updateBoard();
  if(game.isLastTurn(board)) { gameStatus.onGame = 0; gameStatus.holdBoard = 1; }
  else {
    if(!gameStatus.onGame) {
      UI.toggleButtons();
      gameStatus.onGame = 1;
    }
    cpuPlay(game,0,UI);
  }
};
