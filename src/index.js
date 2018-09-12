// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
//     window.location.reload(true);
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        window.location.reload(true);
    }
}


















let cardA;
let cardB;
let memoryGame = document.getElementById('memory-game')
let cards;
let attempts = document.getElementById('attempts')
let cardArray = []
let boardLock = false
let modalContent = document.getElementById('win-lose-modal')
let matchCounter = 0
const winSound = new Audio('./audio/cheering.wav')
const loseSound = new Audio('./audio/boo.wav')
const cardFlip = new Audio('./audio/card_flip.mp3')


Array.prototype.shuffle = function(){
    var i = this.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i+1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}





fetch('http://localhost:3000/api/v1/cards')
.then(response => response.json())
.then(cardsData => addCardDiv(cardsData))

function addCardDiv(cardsData){
  cardsData.forEach( card => {
    for(let i = 0; i < 2; i++){
    let cardDiv = document.createElement('div')
    cardDiv.className = "memory-card";
    cardDiv.dataset.name = `${card.name}`
    cardDiv.dataset.match = 'no-match'
    cardArray.push(cardDiv)
    cardDiv.innerHTML = `<img class="front-face" src="${card.image_url}">
                         <img class="back-face" src="${card.back_image}">`
    // memoryGame.append(cardDiv)
    }
    cardArray.shuffle()
    cardArray.forEach(heroObj => memoryGame.append(heroObj))
    addEventListener()
  })
  }
  function addEventListener(){
    cards = document.querySelectorAll("[data-match='no-match']")
    cards.forEach(card => card.addEventListener('click', flipCard))
  }

  function flipCard() {
    if (boardLock){
      return
    }
    if (this === cardA)
   {return}
    if (!cardA){
      cardFlip.play()
      cardA = this
      this.classList.add('flip')
      // if (cardA.class = 'frontface') {
      //   cardA.removeEventListener('click', flipCard)
      // }

    }else{
      cardFlip.play()
      cardB = this
        this.classList.add('flip');
    }
    cardMatch()
  }


  function cardMatch() {
    let match = cardA.dataset.name === cardB.dataset.name
     match ? matchSuccess() :  matchFailure()
  }

  function matchSuccess(){
    cardA.removeEventListener('click', flipCard)
    cardB.removeEventListener('click', flipCard)
    matchCounter += 1;
    if (matchCounter === 9){
      winSound.play()
      modalContent.innerText = 'You are so talented, your mother was right!!'
      modal.style.display = "block";}

    cardA = null
    cardB = null
  }

function matchFailure(){
  boardLock = true
  setTimeout(() => {
    cardA.classList.remove('flip');
    cardB.classList.remove('flip');
    cardFlip.play();
    cardA = null
    cardB = null
    attempts.innerText -= 1
    if (attempts.innerText == 0) {
      loseSound.play()
      modalContent.innerText = 'Out of attempts, click somewhere to play again!'
      modal.style.display = "block";
      // window.location.reload(true);
      return boardLock = true;
    }
    boardLock = false;
  }, 750);
}
