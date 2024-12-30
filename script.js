const game = () => {
  let pScore = 0;
  let cScore = 0;

  const startGame = () => {
    const playBtn = document.querySelector(".intro button");
    const introScreen = document.querySelector(".intro");
    const match = document.querySelector(".match");

    playBtn.addEventListener("click", () => {
      introScreen.classList.add("fadeOut");
      setTimeout(() => {
        introScreen.style.display = "none";
        match.classList.add("fadeIn");
        match.style.display = "block";
      }, 500);
    });
  };

  const playMatch = () => {
    const options = document.querySelectorAll(".options button");
    const playerHand = document.querySelector(".player-hand");
    const computerHand = document.querySelector(".computer-hand");
    const hands = document.querySelectorAll(".hands img");

    hands.forEach(hand => {
      hand.addEventListener("animationend", function () {
        this.style.animation = "";
      });
    });

    const computerOptions = ["Rock", "Paper", "Scissors"];

    const updateHands = (playerChoice, computerChoice) => {
      playerHand.src = `./assets/${playerChoice}.png`;
      computerHand.src = `./assets/${computerChoice}.png`;
    };

    options.forEach(option => {
      option.addEventListener("click", function () {
        const computerChoice = computerOptions[Math.floor(Math.random() * 3)];

        playerHand.style.animation = "shakePlayer 2s ease";
        computerHand.style.animation = "shakeComputer 2s ease";

        setTimeout(() => {
          //Here is where we call compare hands
          updateHands(this.textContent, computerChoice);
          compareHands(this.textContent, computerChoice);
        }, 2000);
      });
    });
  };

  const updateScore = () => {
    const playerScore = document.querySelector(".player-score p");
    const computerScore = document.querySelector(".computer-score p");
    playerScore.textContent = pScore;
    computerScore.textContent = cScore;
  };

  const recordHistory = (playerChoice, computerChoice, result) => {
    const historyTableBody = document.querySelector("#historyTable tbody");
    const timestamp = new Date().toLocaleString();

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${playerChoice}</td>
      <td>${computerChoice}</td>
      <td>${result}</td>
      <td>${timestamp}</td>
    `;
    historyTableBody.appendChild(newRow);
  };

  const determineWinner = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) return "Draw";
    if (
      (playerChoice === "Rock" && computerChoice === "Scissors") ||
      (playerChoice === "Paper" && computerChoice === "Rock") ||
      (playerChoice === "Scissors" && computerChoice === "Paper")
    ) {
      return "Player wins";
    }
    return "Computer wins";
  };

  const compareHands = (playerChoice, computerChoice) => {
    const winner = document.querySelector(".winner");
    const result = determineWinner(playerChoice, computerChoice);

    if (result === "Player wins") {
      pScore++;
    } else if (result === "Computer wins") {
      cScore++;
    }

    winner.textContent = result;
    updateScore();
    recordHistory(playerChoice, computerChoice, result);
  };

  startGame();
  playMatch();
};

game();
