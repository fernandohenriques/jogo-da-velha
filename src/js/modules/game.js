module.exports = {
  updateBoard: function (){
    for (let x=0; x<3; x++)
      for (let y=0; y<3; y++)
        if (board[x][y] != undefined) document.getElementById("p"+(x+1)+(y+1)).innerHTML = board[x][y]=='O'?this.printCircle():'O';
  },
  isLastTurn: function(board,teste = 0){
      var winner = null;
      for (y=0; y<3; y++) //linhe preenchida
        if (board[y][0] != undefined && board[y][0] == board[y][1] && board[y][1] == board[y][2]) {
          winner = board[y][0];
          break;
        }
      if (!winner) //coluna preenchida
        for (x=0; x<3; x++)
          if (board[0][x] != undefined && board[0][x] == board[1][x] && board[1][x] == board[2][x]) {
            winner = board[0][x] == "X";
            break;
          }
      if (!winner) //diagonal preenchida
        if (board[1][1] != undefined && ((board[0][0] == board[1][1] && board[0][0] == board[2][2]) ||
           (board[0][2] == board[1][1] && board[0][2] == board[2][0]))) winner = board[1][1];

      if(winner) {
        if(winner == symbol.human) swal("Parabéns!","Você venceu o robô!","success");
      }
  },
  calcMiniMax: function (){ },
  printCircle: function(){
    var canvas = document.createElement('canvas');
    if (canvas.getContext){
      var context = canvas.getContext('2d');
      context.strokeStyle = "#333";
      context.beginPath();
      var x = 64;   // = 128/2 - centraliza o circulo}
      var y = 64;
      var radius = 64;  //raio do circulo = diametro/2
      var anticlockwise = true;
      var startAngle = 0;     //inicia o arco na posição 0 graus (direita)
      var endAngle = Math.PI*2; //termina o arco na posição 360 graus (volta completa)
      context.arc(64,64,64,0,(Math.PI*2),true);
      context.closePath();
      context.lineWidth = 5; 
      context.stroke(); //desenha a borda
      return '<img src="'+canvas.toDataURL()+'" />';
    } else return 'O';
  }
};
