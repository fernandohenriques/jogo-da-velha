import '../css/utils.css';
import '../css/styles.css';
import '../css/external/sweetalert.min.css';

import './external/sweetalert.min.js';

window.board = [ [],[],[] ];
window.symbol = {'human':'O','cpu':'X'}; //default

import game from './modules/game.js';
import cpuPlay from './modules/cpuPlay.js';
import humanPlay from './modules/humanPlay.js';


/* Events */
document.querySelectorAll(".column").forEach(function(column){
  column.onclick = function(){ humanPlay(this.id,game,cpuPlay); }
});
