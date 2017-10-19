import '../css/utils.css';
import '../css/styles.css';
import '../css/responsive.css';
import '../css/external/sweetalert.min.css';

import './external/sweetalert.min.js';

window.board = [ [],[],[] ];
window.symbol = {'human':'O','cpu':'X'}; //default
window.gameStatus = {'onGame': 0, 'holdBoard': 0};

import game from './modules/game.js';
import cpuPlay from './modules/cpuPlay.js';
import humanPlay from './modules/humanPlay.js';
import UI from './modules/UI.js';


/* Events */
window.addEventListener('load', UI.getSymbol);

document.querySelectorAll(".column").forEach(function(column){
  column.onclick = function(){ if(!gameStatus.holdBoard){ humanPlay(this.id,game,cpuPlay,UI); } }
});

document.querySelector(".cpu-start").onclick = function(){ cpuPlay(game,1,UI); };
document.querySelector(".play-again").onclick = function(){ if(!gameStatus.onGame){ UI.playAgain(game); } };
document.querySelector(".symbol-change").onclick = function(column){ if(!gameStatus.onGame){ UI.updateSymbol(); } };
