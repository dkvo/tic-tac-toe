/*
Name: Khoa Vo
Description: 2 players tic tac toe game that automatically reset at the end of the game when user click on any square.
*/

var UIController = (function(){

    return {
        inputMarker: function(target, marker) {
            target.innerHTML = marker;
        },
        toogleDisplay: function() {
            // toogle result display
            var result = document.querySelector('#result');
            result.classList.toggle('display');
        },
        displayResult: function(displayMessage) {
            result.innerHTML = displayMessage;
        },
        resetUI: function() {
            var td = document.querySelectorAll("tbody td")
            for(var i = 0; i < td.length; i++) {
                td[i].innerHTML = "";
            }
        }
    };
})();

var dataController = (function() {
    var playerX = {
        name: 'Player X',
        turn: true,
        marker: 'X',
        position: [],
        isWinner: false
    };
    var playerO = {
        name: 'Player O',
        turn: false,
        marker: 'O',
        position: [],
        isWinner: false
    };
    var winningPattern = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    return {
        checkTurn: function() {

            if(playerX.turn) {
                return playerX;
            }
            else {
                return playerO;
            }
        },
        checkWinner: function(index, player) {
            var check = false;
            player.position.push(index);
            console.log(player.position);

            // iterate through winning patterns, check if a pattern matches with player positions, return winner if a match is found
            winningPattern.map(function(pattern) {
                check = pattern.every(function(el) {
                    return player.position.indexOf(el) >= 0;
                });
                // asign winner if match is found
                if(check) {
                    player.isWinner = check;
                }
            });
            return player.isWinner;
        },
        switchTurn: function() {
            var temp;
            // swap turn 
            temp = playerX.turn;
            playerX.turn = playerO.turn;
            playerO.turn = temp;
        },
        resetTurn: function() {
            // reset players turn, winner check and position list
            playerX.turn = true;
            playerX.isWinner = false;
            playerX.position = [];
            playerO.turn = false;
            playerO.isWinner = false;
            playerO.position = [];
        }
    };
})();

var appController = (function(dataCtrl, UICtrl) {
    var winner = false;
    var tie = false;
    var setupEventListener = function() {
        document.querySelector('#tictac').addEventListener('click', processGame);
    };

    function processGame(event) {
        var target = event.target;
        var rowIndex = target.parentElement.rowIndex
        var columnIndex = target.cellIndex;
        var player;
        var index;
        var displayMessage;
        
        // check if winner already exist and reset data for the game to restart
        if(winner || tie) {
            dataCtrl.resetTurn();
            UICtrl.resetUI();
            UICtrl.toogleDisplay();
            winner = false;
            tie = false;
        }
        if(target.innerHTML === "" && !winner) {
            // 1. check which player's turn it is and return players's marker
            player = dataCtrl.checkTurn()
            // 2. input marker into the UI
            UICtrl.inputMarker(target, player.marker);
            // 3. get the index of the marker
            index =  rowIndex * 3 + columnIndex;
            // 4. check which player is the winner
            winner = dataCtrl.checkWinner(index, player);
            // 5. switch player turn
            dataCtrl.switchTurn();
            // check if the board is full or winner is found, display the result if it is a tie or a win
            if(winner || player.position.length === 5) {
                if(winner) {
                    displayMessage = 'The winner is: ' + player.name;
                }
                else {
                    displayMessage = "It's a tie"; 
                    tie = true;
                }
                //6. display result in the UI
                UICtrl.toogleDisplay();
                UICtrl.displayResult(displayMessage);
            }
        }
    }
    return {
        init: function() {
            setupEventListener();
        }
    }

})(dataController, UIController); 

appController.init();