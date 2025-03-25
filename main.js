
const ticTacToe = {

    X : "X",
    O : "O",
    Empty : " ",



    catchDom : {
        cellsDiv : document.querySelectorAll('.cell'),
        infoDiv : document.querySelector('.player-info'),
        pvpButton : document.getElementById("pvp-button"),
        pvaiButton : document.getElementById("pvai-button"),
        resetButton : document.getElementById("reset-button")
    },



    start : function(){
        let game = false
        const ttt = ticTacToe;
        const dom = ttt.catchDom;
        const board = ttt.boardReturn();
        const pvpButton = dom.pvpButton;
        const pvaiButton = dom.pvaiButton;
        const resetButton = dom.resetButton;

        // Player Vs Player
        pvpButton.addEventListener("click", function (){
            if (game === true){
                return 0
            }
            game = true
            ttt.resetBoard(board)
            ttt.render(board,dom.cellsDiv,dom.infoDiv);
            ttt.playerVsPlayer(board,dom.cellsDiv,resetButton);

        });

        // Player Vs Ai
        pvaiButton.addEventListener("click", function (){
            if (game === true){
                return 0
            }
            game = true
            ttt.resetBoard(board);
            ttt.render(board,dom.cellsDiv,dom.infoDiv);
            ttt.playerVsAi(board,dom.cellsDiv,resetButton);
        });


    },


    boardReturn: function(){
        let board = [
            [this.Empty,this.Empty,this.Empty],
            [this.Empty,this.Empty,this.Empty],
            [this.Empty,this.Empty,this.Empty]
        ]
        return board
    },

    resetBoard: function(board){
        const ttt = ticTacToe
        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++){
                board[i][j] = ttt.Empty
            }
        }

    },

    player: function(board){
        let xQuantity = 0
        let oQuantity = 0
        for(let row of board){
            xQuantity += row.filter(cell => cell === this.X).length;
            oQuantity += row.filter(cell => cell === this.O).length
        }

        return xQuantity === oQuantity ? this.X : this.O;
    },

    actions: function(board){

        let availableMoves = [];
        for (let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length; j++){
                if(board[i][j] === this.Empty){
                    availableMoves.push([i,j])

                };
            };

        };

        return availableMoves
    },

    result: function(board, action){
        let newBoard = board.map(row => row.slice());

        let [i,j] = action
        newBoard[i][j] = this.player(board)
        return newBoard
    },

    // Winner

    winner: function(board){
        const lines = [
            ...board,
            ...this.transpose(board),
            this.diagonal1(board),
            this.diagonal2(board)
        ];
        for (let line of lines) {
            if (line.filter(cell => cell === "X").length === 3) {
                return "X";
            } else if (line.filter(cell => cell === "O").length === 3) {
                return "O";
            }
        };

        return this.Empty;

    },

    transpose: function(board) {
        let transposed = [];
        for (let j = 0; j < board[0].length; j++) {
            transposed.push(board.map(row => row[j]));
        }
        return transposed;
    },

    diagonal1: function(board){
        return board.map((row, i) => row[i]);
    },

    diagonal2: function(board){
        return board.map((row, i) => row[2 - i]);
    },

    // Terminal

    terminal: function(board){
        if(this.winner(board) !== this.Empty){
            return true
        };

        for(let row of board){
            if (row.includes(this.Empty)){
                return false;
            }
        };
        return 0
    },

    // Utility

    utility: function(board){
        let winnerPlayer = this.winner(board)
        if (winnerPlayer === this.X){
            return 1
        }else if (winnerPlayer === this.O){
            return -1
        };
        return 0
    },


    // MiniMax

    minimax: function(board){
        const ttt = ticTacToe

        if (ttt.terminal(board) === true || ttt.terminal(board) === 0) {
            return null;
        }

        function maxValue(board, alpha, beta) {
            if (ttt.terminal(board) === true || ttt.terminal(board) === 0) {
                return ttt.utility(board);
            }
            let v = -Infinity;
            for (let action of ttt.actions(board)) {
                v = Math.max(v, minValue(ttt.result(board, action), alpha, beta));
                alpha = Math.max(alpha, v);
                if (beta <= alpha) {
                    break;
                }
            }
            return v;
        }

        function minValue(board, alpha, beta) {
            if (ttt.terminal(board) === true || ttt.terminal(board) === 0) {
                return ttt.utility(board);
            }
            let v = Infinity;
            for (let action of ttt.actions(board)) {
                v = Math.min(v, maxValue(ttt.result(board, action), alpha, beta));
                beta = Math.min(beta, v);
                if (beta <= alpha) {
                    break;
                }
            }
            return v;
        }

        let bestMove = null;
        let currentPlayer = this.player(board);
        let alpha = -Infinity;
        let beta = Infinity;

        if (currentPlayer === "X") {
            let bestValue = -Infinity;
            for (let action of this.actions(board)) {
                let value = minValue(this.result(board, action), alpha, beta);
                if (value > bestValue) {
                    bestValue = value;
                    bestMove = action;
                }
                alpha = Math.max(alpha, bestValue);
            }



        } else {
            let bestValue = Infinity;
            for (let action of this.actions(board)) {
                let value = maxValue(this.result(board, action), alpha, beta);
                if (value < bestValue) {
                    bestValue = value;
                    bestMove = action;
                }
                beta = Math.min(beta, bestValue);
            }

        }

        return bestMove;

    },



    playerVsPlayer : function(board,cells,resetButton){

        resetButton.addEventListener("click", function(){
            ticTacToe.resetBoard(board);
            ticTacToe.render(board,cells,ticTacToe.catchDom.infoDiv);
            return 0

        });


        cells.forEach(cell => {
            cell.addEventListener('click', function(){
                if(ticTacToe.terminal(board) === true || ticTacToe.terminal(board) === 0){
                    return 0
                }

                let row = this.getAttribute("data-row");
                let col = this.getAttribute("data-col");

                if (board[row][col] !== ticTacToe.Empty ){
                    ticTacToe.render(board,cells,ticTacToe.catchDom.infoDiv,availableCell=true);

                }else{

                    let player = ticTacToe.player(board)
                    board[row][col] = player;
                    console.log(board)
                    // render
                    ticTacToe.render(board,cells,ticTacToe.catchDom.infoDiv);


                };

            });
        });

    },

    // Player VS AI

    playerVsAi : function (board,cells,resetButton){

        resetButton.addEventListener("click", function(){
            ticTacToe.resetBoard(board);
            ticTacToe.render(board,cells,ticTacToe.catchDom.infoDiv);
            return 0

        });

        cells.forEach(cell =>{
            cell.addEventListener('click', function(){
                if(ticTacToe.terminal(board) === true || ticTacToe.terminal(board) === 0){
                    return 0
                };
                let row = this.getAttribute("data-row");
                let col = this.getAttribute("data-col");
                if (board[row][col] !== " " ){
                    ticTacToe.render(board,cells,ticTacToe.catchDom.infoDiv,availableCell= true);

                }else{
                    let player = ticTacToe.player(board);
                    board[row][col] = player;

                    // Render
                    ticTacToe.render(board,cells,ticTacToe.catchDom.infoDiv);

                    // Random Move

                    if(ticTacToe.terminal(board) === true || ticTacToe.terminal(board) === 0){
                        return 0
                    };

                    if (Math.random() < 0.05){
                        let moves = ticTacToe.actions(board);
                        let move = moves[Math.floor(Math.random()* moves.length)];
                        let [i,j] = move;
                        board[i][j] = ticTacToe.player(board);
                        ticTacToe.render(board,cells,ticTacToe.catchDom.infoDiv);

                    }else{

                        // MINIMAX
                        let aiMove = ticTacToe.minimax(board)
                        if (aiMove === null){
                            return 0

                        }

                        let [i,j] = aiMove;
                        board[i][j] = ticTacToe.player(board);

                        // Render
                        ticTacToe.render(board,cells,ticTacToe.catchDom.infoDiv);

                    };

                };

            });
        });

    },

    // Render

    render: function(board,cells,infoDiv,availableCell=false){

        const ttt = ticTacToe

        if(availableCell === true){
            infoDiv.innerHTML = `<h2>Esa casilla ya esta ocupada</h2>`
        }else{

            if(ttt.winner(board) === this.X){
                infoDiv.innerHTML = `<h2>${this.X} Es el Ganador!!</h2>`
            }else if(ttt.winner(board) === this.O){
                infoDiv.innerHTML = `<h2>${this.O} Es el Ganador!!</h2>`
            }else if(ttt.terminal(board) === 0){
                infoDiv.innerHTML =  `<h2>Empate</h2>`
            }else{
                let currentPlayer = ttt.player(board);
                infoDiv.innerHTML = `<h2>Es el turno de ${currentPlayer}</h2>`
            };

            for (let i = 0; i < board.length; i++){
                for (let j = 0; j < board[i].length; j++){
                    let index = i * 3 + j;
                    cells[index].innerHTML = `<p>${board[i][j]}</p>`
                };
            };
        };


    },

};



const ticTacToeGame = ticTacToe
ticTacToeGame.start()
