module.exports = function(columnId) {
	console.log('cliquei');
  console.log(columnId);

  var x = parseInt(columnId.substr(1,1));
  var y = parseInt(columnId.substr(2,1));

  if(board[x][y] != undefined) {
    alert("Posição inválida");
    return false;
  }

  board[x][y] = "O";		// coloca a jogada do humano
  //atualiza tabuleiro na tela

  console.log(board);
};
