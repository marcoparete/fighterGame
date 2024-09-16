function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    reset();
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'You Win';
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'You Lose';
    }
}

let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0 && (!player.dead && !enemy.dead)) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
    }
}
//creates the button
document.getElementById('refreshButton').addEventListener('click', function() {
    location.reload();  // Reload the page
});

//makes the button appear
function reset(){
    document.querySelector('#refreshButton').style.display = 'flex';
}
