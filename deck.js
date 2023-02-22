const SUITS = ["♠", "♣", "♥", "♦"]
const SUITLETTERS = {"♠": "S", "♣": "C", "♥": "H", "♦": "D"}
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]

export default class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards
  }

  get numberOfCards() {
    return this.cards.length
  }

  pop() {
    return this.cards.shift()
  }

  push(card) {
    this.cards.push(card)
  }

  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1))
      const oldValue = this.cards[newIndex]
      this.cards[newIndex] = this.cards[i]
      this.cards[i] = oldValue
    }
  }

  viewContents() {
    let deckContents = ((this.cards).map(card => card.virtualConversion())).join(",");
    console.log(deckContents);
    // console.log((this.cards).map(card => card.value+SUITLETTERS[card.suit]));
    return deckContents;
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit
    this.value = value
  }

  get color() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red"
  }

  getHTML() {
    const cardDiv = document.createElement("div")
    cardDiv.innerText = this.suit
    cardDiv.classList.add("card", this.color)
    cardDiv.dataset.value = `${this.value} ${this.suit}`
    return cardDiv
  }

  virtualConversion() {
    return this.value == "10" ? "0"+SUITLETTERS[this.suit] : this.value+SUITLETTERS[this.suit];
  }
}

function freshDeck() {
  return SUITS.flatMap(suit => {
    return VALUES.map(value => {
      return new Card(suit, value)
    })
  })
}