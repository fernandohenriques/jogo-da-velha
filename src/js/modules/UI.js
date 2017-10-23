module.exports = {
  getSymbol: function(){
    document.getElementById('humanSymbol').innerHTML = '('+symbol.human+')';
    document.getElementById('cpuSymbol').innerHTML = '('+symbol.cpu+')';
  },
  updateSymbol: function(){
    swal({
      title: "Vamos mudar um pouco?!",
      text: "Escolha o símbolo que lhe traz mais sorte:",
      type: "input",
      confirmButtonClass: "btn-success",
      confirmButtonText: "Salvar",
      showCancelButton: true,
      cancelButtonText: "Cancelar!",
      closeOnConfirm: false,
      inputPlaceholder: "O ou X"
    }, function (inputValue) {
      if (inputValue === false) return false;
      inputValue = inputValue.toUpperCase();
      if (inputValue === "") {
          swal.showInputError("Digite um dos dois!");
          return false;
      } else if(inputValue.length > 1){
          swal.showInputError("Você só precisa de um caracter!");
          return false;
      } else if(inputValue != 'O' && inputValue != 'X'){
          swal.showInputError("Caracter não permitido!");
          return false;
      }
      symbol.human = inputValue;
      symbol.cpu = symbol.human=='O'?'X':'O';
      document.getElementById('humanSymbol').innerHTML = '('+symbol.human+')';
      document.getElementById('cpuSymbol').innerHTML = '('+symbol.cpu+')';
      swal("Ok!", "Agora você joga com: " + inputValue, "success");
    });
  },
  toggleButtons: function(){
    document.querySelector(".cpu-start").classList.toggle('hide');
    document.querySelector(".play-again").classList.toggle('hide');
  },
  playAgain: function(game){
    game.cleanBoard();
    this.toggleButtons();
  }
};
