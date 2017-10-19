module.exports = function(game,start = 0,UI) {
    if(start){
      board[Math.floor(Math.random()*3)][Math.floor(Math.random()*3)] = symbol.cpu;
      game.updateBoard();
      UI.toggleButtons();
      if(!gameStatus.onGame) gameStatus.onGame = 1;
    } else {
        var i, currentTree, majorValue, options = [];
        currentTree = game.generateGameTree(game.cloneState(board));
        for (i=0;i < currentTree.sons.length;i++)
         if (majorValue == undefined || currentTree.sons[i].utility > majorValue) majorValue = currentTree.sons[i].utility;

        for (i=0;i < currentTree.sons.length;i++)
          if (currentTree.sons[i].utility == majorValue) options.push(i);

        board = game.cloneState(currentTree.sons[options[Math.floor(Math.random()*options.length)]].state);
        game.updateBoard();

        if(game.isLastTurn(board)){ gameStatus.onGame = 0; gameStatus.holdBoard = 1; }
    }
};
