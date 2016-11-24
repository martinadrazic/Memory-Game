var cardHTML = '<div><span class="card front"><img src="images/logo.png"></span>' +
    '<span class="card back"><img src="%data%"></span></div>';
var message = 'I have just finished Memory Game with %data% clicks. Try to beat me!';
var twitterUrl = 'https://twitter.com/intent/tweet?text=' + message;
var facebookUrl = 'https://www.facebook.com/dialog/feed?app_id=202375073505780&link=http://martinadrazic.com&picture=http://fbrell.com/f8.jpg&name=Memory%20Game&display=popup&description=' + message;
var resultMessage = 'Game over! You have clicked: %data% times!';
var numberOfMovesHTML = 'Number of moves: %data%';
var timeHTML = 'Time: %data%';
var rankItemHTML = '<p class="rankItem">  <span>%numeration%.</span><span> %username%</span> <span>%click% clicks</span> <span> %time% seconds</span></p>';

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function compare(a, b) {
    if (a.clicks !== b.clicks) {
        return a.clicks - b.clicks;
    } else {
        return a.time - b.time;
    }
}

function hide(element) {
    element.style.display = 'none';
}

function show(element) {
    element.style.display = 'block';
}






