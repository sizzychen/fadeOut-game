const game = () => {
  let pScore = 0;
  let cScore = 0;

  //Start the Game
  const startGame = () => {
    const playBtn = document.querySelector(".intro button");
    const introScreen = document.querySelector(".intro");
    const match = document.querySelector(".match");

    playBtn.addEventListener("click", () => {
      introScreen.classList.add("fadeOut");
      match.classList.add("fadeIn");
    });
  };
  //Play Match
const playMatch = () => {
    const options = document.querySelectorAll(".options button");
    const playerHand = document.querySelector(".player-hand");
    const computerHand = document.querySelector(".computer-hand");
    const hands = document.querySelectorAll(".hands img");

    hands.forEach(hand => {
      hand.addEventListener("animationend", function() {
        this.style.animation = "";
      });
    });
    //Computer Options
    const computerOptions = ["Rock", "Paper", "Scissors"];

    
  let history = []; // Initialize history array.

const recordHistory = (playerChoice, computerChoice, result) => {
      history.push({ playerChoice, computerChoice, result });
      updateHistoryDisplay();
    };

    const updateHands = (playerChoice, computerChoice) => {
      playerHand.src = `./assets/${playerChoice}.png`;
      computerHand.src = `./assets/${computerChoice}.png`;
    };

    options.forEach(option => {
      option.addEventListener("click", function() {
        //Computer Choice
        const computerNumber = Math.floor(Math.random() * 3);
        const computerChoice = computerOptions[computerNumber];

        setTimeout(() => {
          //Here is where we call compare hands
          compareHands(this.textContent, computerChoice);
          //Update Images
          updateHands(this.textContent, computerChoice);
        }, 2000);
        //Animation
        playerHand.style.animation = "shakePlayer 2s ease";
        computerHand.style.animation = "shakeComputer 2s ease";
      });
    });
  };

  const updateScore = () => {
    const playerScore = document.querySelector(".player-score p");
    const computerScore = document.querySelector(".computer-score p");
    playerScore.textContent = pScore;
    computerScore.textContent = cScore;
  };

  const compareHands = (playerChoice, computerChoice) => {
    //Update Text
    const winner = document.querySelector(".winner");
    //Checking for a tie
    if (playerChoice === computerChoice) {
      winner.textContent = "Draw";
      return;
    }
    //Check for Rock
    if (playerChoice === "Rock") {
      if (computerChoice === "Scissors") {
        winner.textContent = "Player wins";
        pScore++;
        updateScore();
        return;
      } else {
        winner.textContent = "Computer wins";
        cScore++;
        updateScore();
        return;
      }
    }
    //Check for Paper
    if (playerChoice === "Paper") {
      if (computerChoice === "Scissors") {
        winner.textContent = "Computer wins";
        cScore++;
        updateScore();
        return;
      } else {
        winner.textContent = "Player wins";
        pScore++;
        updateScore();
        return;
      }
    }
    //Check for Scissors
    if (playerChoice === "Scissors") {
      if (computerChoice === "Rock") {
        winner.textContent = "Computer wins";
        cScore++;
        updateScore();
        return;
      } else {
        winner.textContent = "Player wins";
        pScore++;
        updateScore();
        return;
      }
    }
  };

  //Is call all the inner function
  startGame();
  playMatch();
};
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear previous history
    history.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `Player: ${entry.player}, Computer: ${entry.computer}, Result: ${entry.result}`;
        historyList.appendChild(listItem);
    });
}

// Call this function after recording each gesture
//start the game function
game();
