module.exports = function(columnId,game,cpuPlay) {
  var x = parseInt(columnId.substr(1,1))-1;
  var y = parseInt(columnId.substr(2,1))-1;

  if(board[x][y] != undefined) {
    swal("Posição inválida!","Escolha outra posição.","warning");
    return false;
  }

  board[x][y] = symbol.human;	//salva a jogada do humano
  game.updateBoard();
  game.isLastTurn(board); //verifica se jogo acabou, se sim, trava novas jogadas
    //se não, CPU joga

  console.log(board);
};
