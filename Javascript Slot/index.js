//APP OUTLINE (WHAT SHOULD IT DO): 
// 1. Deposit money
// 2. Determine number of lines to bet on
// 3. Collect a bet ammount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Play again

const prompt = require("prompt-sync")(); //requiring this model to get user input

//Defining some (global) variables that depict the size of the slot machine and how many symbols we can have in each row
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { //Here the symbol A is the most valuable symbol in our slot machine, so we are only making 2 of them etc.
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {  //the value of the symbols (if the user bets 2 and lands on the symbol A, it's going to be multiplied with 5.)
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

// 1. Deposit money
const deposit = () => { //creating a loop
   while (true) {
    const depositAmount = prompt("Enter your deposit amount: "); //getting deposit
    const numberDepositAmount = parseFloat(depositAmount); //converting deposit from string to number

    if(isNaN(numberDepositAmount) || numberDepositAmount <= 0) {   //if it's not a number (NaN) or it's less than/equal to 0 then try again
        console.log("Invalid deposit ammount, try again.");   
    } else {
        return numberDepositAmount;  //If it is a valid number it's going to return the numberDepositAmount
    }
   }
};

// 2. Determine number of lines to bet on
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines you want to bet on (1-3): "); //getting the number of lines
        const numberOfLines = parseFloat(lines); //converting lines from string to number
    
        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {   //if it's not a number (NaN) or it's less than/equal to 0 or greater than 3, then try again
            console.log("Invalid number of lines, try again.");   
        } else {
            return numberOfLines;  
        }
       }
};

// 3. Collect a bet ammount
const getBet = (balance, lines) => {  //The maximum bet has to be the balance divided by lines, that way the user doesn't get to bet more than they have. 
    while (true) {
        const bet = prompt("Enter the bet per line: "); 
        const numberBet = parseFloat(bet); 
    
        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {    //Maximum bet can only be balance divided by lines
            console.log("Invalid bet, try again.")   
        } else {
            return numberBet;  
        }
       }
};
//The first 3 functions is our input functions

// 4. Spin the slot machine
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) { //Generating array of all the available symbols we can get / using Object.entries to go through them
      for (let i = 0; i < count; i++) { //For every symbol, and for every count of those symbols, we're gonna have a "for loop" an we're gonna insert (push) that many symbols into the array
          symbols.push(symbol);
      }
   }

   const reels = [];     
   for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];    //"...symbols" is copying the symbols that we have available. Because we have to generate the avaible symbols and be able to remove from them and add the symbols into each reel. 
      for (let j = 0; j < ROWS; j++) {     
        const randomIndex = Math.floor(Math.random() * reelSymbols.length);   //we have to randomly select by randomly selecting an index in the array. "Math.floor" to round the number down to nearest number.
        const selectedSymbol = reelSymbols[randomIndex];  //selecting symbol
        reels[i].push(selectedSymbol);  //adding it into the array
        reelSymbols.splice(randomIndex, 1);  //removing it so we don't select it again when we continue the reel
    } 
   }

   return reels;
};

//Transposing the slot machine
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }

    return rows;
}

const printRows = (rows) => { //Going through every row in our rows, that's gonna give us an array of the elements in that row.
    for (const row of rows) {  
        let rowString = "";
        for (const [i, symbol] of row.entries()) {  //then looping through both the index and the element that exist in that row
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

// 5. Check if the user won
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
};


const game = () => {
    let balance = deposit(); //Creating "let balance" because the user is going to have a starting balance dependent of what the user deposited, so then we can adjust the balance based on what they're earning/losing

    while (true) {
       console.log("You have a balance of $" + balance);
       const numberOfLines = getNumberOfLines();
       const bet = getBet(balance, numberOfLines);
       balance -= bet * numberOfLines;
       const reels = spin();
       const rows = transpose(reels);
       printRows(rows);
       const winnings = getWinnings(rows, bet, numberOfLines); // 6. Give the user their winnings
       balance += winnings;
       console.log("You won, $" + winnings.toString());

       if (balance <= 0) {
        console.log("You ran out of money!");
        break;
       }

       const playAgain = prompt("Do you want to play again? (y/n)? ");

       if (playAgain != "y") break;
    }
};

game();



// 7. Play again
 
