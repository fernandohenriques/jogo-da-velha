import '../css/utils.css';
import '../css/styles.css';

board = '';

import humanPlay from './modules/humanPlay.js';


/* Events */
var columns = document.querySelectorAll(".column");
columns.forEach(function(column){ column.onclick = function(){ humanPlay(this.id); } });
