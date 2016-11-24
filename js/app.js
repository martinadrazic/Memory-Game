if (!localStorage.getItem('rank')) {
  localStorage.setItem('rank', JSON.stringify({ easy: [], medium: [], hard: [] }));
}
var rankList = JSON.parse(localStorage.getItem('rank')); //object

var gameDisplay = document.getElementById('displayOfCards');
var gameInfo = document.getElementById('gameInfo');
var startDisplay = document.getElementById('start-container');
var rankDisplay = document.getElementById('rank-container');
var modal = document.getElementById('modal-container');
var close = document.getElementById("close");
var result = document.getElementById('result');
var twitter = document.getElementById('twitter');
var facebook = document.getElementById('facebook');
var username = document.getElementById('username');
var usernameError = document.getElementById('usernameError');
var tabcontent = document.getElementsByClassName("tabcontent");
var tablinks = document.getElementsByClassName("tablinks");

var cardImages = [];
for (var i = 0; i < 32; i++) {
  cardImages.push('images/' + i + '.jpg');
}
cardImages = shuffle(cardImages);

var Card = function (id) {
  this.id = id;
  this.img = cardImages[this.id];
  this.el = document.createElement('div');
  this.el.className = 'flipper';
  this.el.innerHTML = cardHTML.replace('%data%', this.img);

  var _this = this;
  this.el.onclick = function () {
    _this.el.classList.toggle('flipped');
  }
}

var Game = function (level, name) {
  this.username = name;
  //
  this.level = level;
  this.levelEl = document.createElement('span');
  this.levelEl.innerHTML = 'Level: ' + this.getLevelName(this.level);
  //
  this.pairsOfCards = this.level * this.level / 2;
  this.cards = [];
  //
  this.numClicks = 0;
  this.numClicksEl = document.createElement('span');
  this.numClicksEl.innerHTML = numberOfMovesHTML.replace('%data%', '0');
  //
  this.timerEl = document.createElement('span');
  this.timerEl.innerHTML = timeHTML.replace('%data%', '0');
  // 
  this.startTime();
}

Game.prototype.getLevelName = function (level) {
  switch (level) {
    case 4: {
      return "Easy"
    }
    case 6: {
      return "Medium"
    }
    case 8: {
      return "Hard"
    }
  }
}

Game.prototype.startTime = function () {
  this.timerCount = 0;
  var _this = this;
  this.timer = setInterval(function () {
    _this.timerCount++;
    _this.timerEl.innerHTML = timeHTML.replace('%data%', _this.timerCount);
  }, 1000);
}

Game.prototype.createDeck = function () {
  for (var i = 0; i < this.pairsOfCards; i++) {
    this.cards.push(new Card(i));
    this.cards.push(new Card(i));
  }
  this.cards = shuffle(this.cards);
}

Game.prototype.getFlippedCards = function () {
  return this.cards.filter(function (card) {
    return card.el.classList.contains('flipped') && !card.el.classList.contains('matched');
  });
}

Game.prototype.gameOver = function () {
  clearInterval(this.timer);
  show(modal);
  result.innerHTML = resultMessage.replace('%data%', this.numClicks);
  twitter.setAttribute('href', twitterUrl.replace('%data%', this.numClicks));
  facebook.setAttribute('href', facebookUrl.replace('%data%', this.numClicks));

  rankList[this.getLevelName(this.level).toLowerCase()].push({
    username: this.username,
    clicks: this.numClicks,
    time: this.timerCount
  })
  localStorage.setItem('rank', JSON.stringify(rankList));
}

Game.prototype.createContent = function () {
  gameInfo.appendChild(this.levelEl);
  gameInfo.appendChild(this.numClicksEl);
  gameInfo.appendChild(this.timerEl);

  var content = document.createElement('div');
  content.className = 'game' + this.level;
  content.onclick = this.update.bind(this); //bind -> var _this = this

  this.cards.forEach(function (card) {
    content.appendChild(card.el);
  })
  return content;
}

Game.prototype.update = function () {
  this.numClicks++;
  this.numClicksEl.innerHTML = numberOfMovesHTML.replace('%data%', this.numClicks);

  var flipped = this.getFlippedCards();
  if (flipped.length === 2) {
    var same = flipped[0].id == flipped[1].id;
    if (same) {
      setTimeout(function () {
        flipped[0].el.classList.add('matched');
        flipped[1].el.classList.add('matched');
      }, 600);
      this.pairsOfCards--;
      if (this.pairsOfCards === 0) {
        this.gameOver();
      }
    } else {
      setTimeout(function () {
        flipped[0].el.classList.remove('flipped');
        flipped[1].el.classList.remove('flipped');
      }, 600);
    }
  }
  return this.numClicks;
}

function playGame() {
  if (!username.value) {
    show(usernameError);
    return;
  }

  gameInfo.innerHTML = '';
  gameDisplay.innerHTML = '';
  hide(startDisplay);
  show(gameInfo);
  show(gameDisplay);

  var level = parseInt(document.getElementById('level').value);
  var game = new Game(level, username.value);

  game.createDeck();
  gameDisplay.appendChild(game.createContent());
}

//MODAL

close.onclick = function () {
  hide(modal);
  showRank();
}

window.onclick = function (event) {
  if (event.target === modal) {
    hide(modal);
    showRank();
  }
}

//RANK LIST

function showRank() {
  hide(gameInfo);
  hide(gameDisplay);
  show(rankDisplay);
  showRankByLevel('easy');
  showRankByLevel('medium');
  showRankByLevel('hard');
}

function showRankByLevel(level) {
  if (!rankList[level].length) {
    return;
  }

  var levelEl = document.getElementById(level);
  levelEl.innerHTML = '';
  var limit;

  rankList[level].sort(compare);

  if (rankList[level].length > 10) {
    limit = 10;
  } else {
    limit = rankList[level].length;
  }
  for (var i = 0; i < limit; i++) {
    var playerScore = rankList[level][i];
    levelEl.innerHTML += rankItemHTML.replace('%numeration%', i + 1)
      .replace('%username%', playerScore.username)
      .replace('%click%', playerScore.clicks)
      .replace('%time%', playerScore.time);
  }
}

function openLevel(event, levelName) {
  for (var i = 0; i < tabcontent.length; i++) {
    hide(tabcontent[i]);
    tablinks[i].classList.remove("active");
  }
  show(document.getElementById(levelName));
  event.currentTarget.classList.add("active");
}

function playAgain() {
  hide(rankDisplay);
  show(startDisplay);
}

username.addEventListener('keyup', function (event) {
  if (username.value.length > 0) {
    hide(usernameError);
  } else {
    show(usernameError);
  }
})

