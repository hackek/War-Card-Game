import Deck from "./deck.js"

const CARD_VALUE_MAP = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

const computerCardSlot = document.querySelector(".computer-card-slot")
const playerCardSlot = document.querySelector(".player-card-slot")
const computerDeckElement = document.querySelector(".computer-deck")
const playerDeckElement = document.querySelector(".player-deck")
const text = document.querySelector(".text")
// const delay = 1000;

let playerDeck, computerDeck, inRound, stop, virtualPlayer, virtualComputer

document.addEventListener("click", () => {
  if (stop) {
    startGame()
    return
  }

  if (inRound) {
    cleanBeforeRound()
  } else {
    flipCards()
  }
})

startGame()
async function startGame() {
  const deck = new Deck();
  deck.shuffle();
  deck.viewContents();

  const deckMidpoint = Math.ceil(deck.numberOfCards / 2)
  playerDeck = new Deck(deck.cards.slice(0, deckMidpoint))
  computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards))

  virtualPlayer = await makePartialDeck(playerDeck.viewContents());
  virtualComputer = await makePartialDeck(computerDeck.viewContents());

  inRound = false
  stop = false

  cleanBeforeRound()
}

function cleanBeforeRound() {
  inRound = false
  computerCardSlot.innerHTML = ""
  playerCardSlot.innerHTML = ""
  text.innerText = ""

  updateDeckCount()
}

async function flipCards() {
  inRound = true

  const playerCard = playerDeck.pop()
  const computerCard = computerDeck.pop()

  revealNextCard(virtualPlayer, "player", playerCard.virtualConversion());
  revealNextCard(virtualComputer, "computer", computerCard.virtualConversion());
  // setTimeout(() => revealNextCard(virtualPlayer, "player", playerCard.virtualConversion()), delay);
  // setTimeout(() => revealNextCard(virtualComputer, "computer", computerCard.virtualConversion()), delay);

  playerCardSlot.appendChild(playerCard.getHTML())
  computerCardSlot.appendChild(computerCard.getHTML())

  updateDeckCount();

  if (isRoundWinner(playerCard, computerCard)) {
    text.innerText = "Win"
    playerDeck.push(playerCard)
    playerDeck.push(computerCard)
    allocateWinnings(virtualPlayer, "player", playerCard.virtualConversion());
    allocateWinnings(virtualPlayer, "player", computerCard.virtualConversion());
    // setTimeout(() => allocateWinnings(virtualPlayer, "player", playerCard.virtualConversion()), delay);
    // setTimeout(() => allocateWinnings(virtualPlayer, "player", computerCard.virtualConversion()), delay);
  } else if (isRoundWinner(computerCard, playerCard)) {
    text.innerText = "Lose"
    computerDeck.push(playerCard)
    computerDeck.push(computerCard)
    allocateWinnings(virtualComputer, "computer", playerCard.virtualConversion());
    allocateWinnings(virtualComputer, "computer", computerCard.virtualConversion());
    // setTimeout(() => allocateWinnings(virtualComputer, "computer", playerCard.virtualConversion()), delay);
    // setTimeout(() => allocateWinnings(virtualComputer, "computer", computerCard.virtualConversion()), delay);
  } else {
    text.innerText = "Draw"
    playerDeck.push(playerCard)
    computerDeck.push(computerCard)
    allocateWinnings(virtualPlayer, "player", playerCard.virtualConversion());
    allocateWinnings(virtualComputer, "computer", computerCard.virtualConversion());
    // setTimeout(() => allocateWinnings(virtualPlayer, "player", playerCard.virtualConversion()), delay);
    // setTimeout(() => allocateWinnings(virtualComputer, "computer", computerCard.virtualConversion()), delay);
  }

  if (isGameOver(playerDeck)) {
    text.innerText = "You Lose!!"
    stop = true
  } else if (isGameOver(computerDeck)) {
    text.innerText = "You Win!!"
    stop = true
  }
}

function updateDeckCount() {
  computerDeckElement.innerText = computerDeck.numberOfCards
  playerDeckElement.innerText = playerDeck.numberOfCards
}

function isRoundWinner(cardOne, cardTwo) {
  return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
}

function isGameOver(deck) {
  return deck.numberOfCards === 0
}


////////////////////////////////////////////////////////////////////////////////////////////
// Function to create virtual representations of split decks
async function makePartialDeck(inputCards) {
  return fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${inputCards}`)
    .then(response => response.json())
    .then(inputDeck => {
      console.log(inputDeck);
      return inputDeck.deck_id;});
}

// Draws from the virtual deck in question
async function revealNextCard(deckId, name, drawnCard) {
  // let drawnCard = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
  // .then(response => response.json())
  // .then(currentDeck => {
  //   console.log(currentDeck.cards[0].code);
  //   return currentDeck.cards[0].code});

  await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?cards=${drawnCard}`)
    .then(response => response.json())
    .then(modifiedDeck => {
      // console.log(modifiedDeck);
      console.log(drawnCard);
      return drawnCard});
  await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${name}/add/?cards=${drawnCard}`)
    .then(response => response.json())
    .then(modifiedDeck => {
      // console.log(modifiedDeck);
      return modifiedDeck});
}

async function allocateWinnings(deckId, name, card) {
  await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?cards=1`)
    .then(response => response.json())
    .then(modifiedDeck => {
      // console.log(modifiedDeck);
      // console.log(card);
      return card});
}

/////////////////////////////////////////////////////////////////////////
// asyncronous program aspect
// async function makeStarterDeck() {
//   return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
//     .then(response => response.json())
//     .then(masterDeck => {
//       console.log(masterDeck)
//       return masterDeck.deck_id;});
// }

// async function splitDeckInHalf(unsplitId) {
//   return fetch(`https://deckofcardsapi.com/api/deck/${unsplitId}/draw/?count=26`)
//     .then(response => response.json())
//     .then(playerDeck => (playerDeck.cards).map(card => card.code))
//     .then(playerCards => fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${playerCards.join(",")}`))
//     .then(response => response.json())
//     .then(playerDeck => {
//       console.log(playerDeck)
//       return playerDeck.deck_id});
// }
// async function apiStartGame() {
//   // let startingDeck = await makeStarterDeck();
//   // let startingPlayerDeck = await splitDeckInHalf(startingDeck);
//   // let startingComputerDeck = await splitDeckInHalf(startingDeck);
//   // let testDraw1 = await revealNextCard(startingPlayerDeck, "player");
//   // let testDraw2 = await revealNextCard(startingComputerDeck, "computer");
//   inRound = false
//   stop = false

//   //cleanupBeforeRound();
// }

// apiStartGame();

// async function getDeckContents(deckId) {
//   return await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/list/`)
//     .then(response => {
//       console.log(response.json());
//       return response.json();
//     });
// }

// function cleanupBeforeRound() {
//   inRound = false
//   computerCardSlot.innerHTML = ""
//   playerCardSlot.innerHTML = ""
//   text.innerText = ""

//   updateTheDeckCount()
// }

// // Needs modifying
// async function updateTheDeckCount() {
//   computerDeckElement.innerText = computerDeck.numberOfCards
//   playerDeckElement.innerText = playerDeck.numberOfCards
// }

// Modifies the API deck representation
// async function revealNextCard(deckId, name) {
//   let drawnCard = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
//   .then(response => response.json())
//   .then(currentDeck => {
//     console.log(currentDeck.cards[0].code);
//     return currentDeck.cards[0].code});
//   let updateDiscard = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${name}/add/?cards=${drawnCard}`)
//     .then(response => response.json())
//     .then(modifiedDeck => {
//       console.log(modifiedDeck);
//       return modifiedDeck});
//   return drawnCard;
// }

// Flips and modifies the API deck representations
// async function flipTheCards() {
//   inRound = true;
//   let playerCard = revealNextCard(startingPlayerDeck, "player");
//   let computerCard = revealNextCard(startingComputerDeck, "computer");

//   if (isRoundWinner(playerCard, computerCard)) {
//     text.innerText = "Win"
//     playerDeck.push(playerCard)
//     playerDeck.push(computerCard)
//   } else if (isRoundWinner(computerCard, playerCard)) {
//     text.innerText = "Lose"
//     computerDeck.push(playerCard)
//     computerDeck.push(computerCard)
//   } else {
//     text.innerText = "Draw"
//     playerDeck.push(playerCard)
//     computerDeck.push(computerCard)
//   }

//   if (isGameOver(playerDeck)) {
//     text.innerText = "You Lose!!"
//     stop = true
//   } else if (isGameOver(computerDeck)) {
//     text.innerText = "You Win!!"
//     stop = true
//   }
// }