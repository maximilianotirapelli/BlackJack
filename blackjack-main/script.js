const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const suits = ['♠', '♥', '♣', '♦']

let allDecks = [];
let dealerHand = [];
let playerHand = [];

const cardModel = document.createElement('div');
cardModel.classList.add('card');

const dealer = document.getElementById("dealer");
const player = document.getElementById("player");
const hit = document.getElementById("hit");
const pass = document.getElementById("pass");
const buttonContainer = document.getElementById("button-container");
const notice = document.getElementById("notice");
const nextHand = document.getElementById("next-hand");


const createDeck = () => {
    const deck = [];
    suits.forEach((suit) => {
        values.forEach((value) => {
            const card = value + suit;
            deck.push(card)
        })
    })
    return deck;
}

const shuffleDecks = (num) => {
    for (let i = 0; i < num; i++) {
        const newDeck = createDeck();
        allDecks = [...allDecks, ...newDeck];
    }
}

const chooseRandomCard = () => {
    const totalCards = allDecks.length;
    let randomNumber = Math.floor(Math.random() * totalCards);
    const randomCard = allDecks[randomNumber];
    allDecks.splice(randomNumber, 1)
    return randomCard;
}

const dealHands = async () => {

    dealerHand = [await chooseRandomCard(), await chooseRandomCard()];
    playerHand = [await chooseRandomCard(), await chooseRandomCard()];

    return { dealerHand, playerHand }
}

const calcHandValue = (hand) => {
    let value = 0;
    let hasAce = false;
    hand.forEach((card) => {
        let cardValue = card.length === 2 ? card.substring(0, 1) : card.substring(0, 2);
        if (cardValue === 'A') hasAce = true;
        else if (cardValue === 'J' || cardValue === 'Q' || cardValue === 'K') value += 10;
        else value += Number(cardValue);
    })
    if (hasAce) value + 11 > 21 ? value += 1 : value += 11;
    return value;
}

const showNotice = (text) => {
    notice.children[0].children[0].innerHTML = text;
    notice.style.display = "flex";
    buttonContainer.style.display = "none";

}

const determineWinner = async () => {
    let playerValue = await calcHandValue(playerHand);
    let dealerValue = await calcHandValue(dealerHand);
    let text = `
Your hand is ${playerHand} with a value of ${playerValue}.
The dealers hand is ${dealerHand} with a value of ${dealerValue}.
${playerValue > dealerValue ? "<em>You win!</em>" : "<em>Dealer Wins!</em>"}
    `
    showNotice(text)
}

const hitDealer = async () => {
    const hiddenCard = dealer.children[0];
    hiddenCard.classList.remove('back');
    hiddenCard.innerHTML = dealerHand[0];
    const card = await chooseRandomCard();
    dealerHand.push(card)
    const newCard = cardModel.cloneNode(true);
    newCard.innerHTML = card;
    dealer.append(newCard);
    let handValue = await calcHandValue(dealerHand);
    if (handValue <= 16) {
        hitDealer()
    } else if (handValue === 21) {
        showNotice("Dealer has 21! Dealer wins!")
    }
    else if (handValue > 21) {
        showNotice("Dealer bust! You win!")
    }
    else {
        determineWinner()
    }
}

const hitPlayer = async () => {
    const card = await chooseRandomCard();
    playerHand.push(card);
    let handValue = await calcHandValue(playerHand);
    const newCard = cardModel.cloneNode(true);
    newCard.innerHTML = card;
    player.append(newCard);
    if (handValue <= 21) {

    } else {
        let text = `Bust! Your hand is ${playerHand} with a value of ${handValue}.`
        showNotice(text)
    }
}

const clearHands = () => {
    while (dealer.children.length > 0) {
        dealer.children[0].remove()
    }
    while (player.children.length > 0) {
        player.children[0].remove()
    }
    return true;
}

const play = async () => {
    if(allDecks.length < 10) shuffleDecks()
    clearHands()
    const { dealerHand, playerHand } = await dealHands();
    dealerHand.forEach((card, index) => {
        const newCard = cardModel.cloneNode(true);
        (card[card.length -1] === '♥' || card[card.length -1] === '♦') && newCard.setAttribute('data-red', true);
        index === 0 ? newCard.classList.add('back') : newCard.innerHTML = card;
        dealer.append(newCard);
    })
    playerHand.forEach((card) => {
        const newCard = cardModel.cloneNode(true);
        (card[card.length -1] === '♥' || card[card.length -1] === '♦') && newCard.setAttribute('data-red', true);
        newCard.innerHTML = card;
        player.append(newCard);
    })
    notice.style.display = "none";
    buttonContainer.style.display = "block"
}

hit.addEventListener('click', hitPlayer)
pass.addEventListener('click', hitDealer)
nextHand.addEventListener('click', play)


shuffleDecks(3)
play()

