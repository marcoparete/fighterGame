const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

//this is to add delays so the player can not spam attack
let playerCanAttack = true
let enemyCanAttack = true

//this delays the enemy movement so he is not being called to move every frame, causing him to move back and forth a lot
let canCallMovement = true

const gravityConstant = .72; // Adjusted from gravity value in the second snippet

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: './img/background.png'
});

const shop = new Sprite({
  position: { x: 600, y: 128 },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
});

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 215, y: 157 }, // Offset adjusted
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  sprites: {
    idle: { imageSrc: './img/samuraiMack/Idle.png', framesMax: 8 },
    run: { imageSrc: './img/samuraiMack/Run.png', framesMax: 8 },
    jump: { imageSrc: './img/samuraiMack/Jump.png', framesMax: 2 },
    fall: { imageSrc: './img/samuraiMack/Fall.png', framesMax: 2 },
    attack1: { imageSrc: './img/samuraiMack/Attack1.png', framesMax: 6 },
    takeHit: { imageSrc: './img/samuraiMack/Take Hit - white silhouette.png', framesMax: 4 },
    death: { imageSrc: './img/samuraiMack/Death.png', framesMax: 6 }
  },
  attackBox: { offset: { x: 100, y: 50 }, width: 100, height: 50 }
});

// Movement logic for the enemy AI
//this makes the enemy movement somewhat random but still competitive
function movement(player, enemy){
    let distance = enemy.position.x - player.position.x
    let randomDistance  = Math.random() // random number between 0 and 1
    let smartDistance  = .5 //smart distance will help the bot move back and forth based on the players velocity or if the player has attacked
    if(player.velocity.x<0 || playerCanAttack == false){ 
        smartDistance  = .33 //the enemy is more likely to move left if the player has attacked or if the player is retreating
    } 
    else{
        smartDistance = .66 //the enemy will be more likely to retreat if the player is standing still or if the player is moving towards them
    }

    let randomAttack = Math.random() //the enemy has a 40% chance of attacking when within 125 pixels
    let randomJump = Math.random()
    let randomBack = ((Math.random()) * 100) + 924 //this gives a number between 0 and 1, multiples it to make it between 0 and 100 and adds 924 to make the distance near the width of the canvas. If the enemy is in this range he will move forward
    //By doing this, I can make it seem like an actual bot but it is just trying to get as close as possible or back away if too close
    let move = distance * randomDistance * smartDistance
    console.log(enemy.position.y)
    if(!enemy.dead && !player.dead){
        if(move > 50 || enemy.position.x + enemy.width > randomBack){ //this is calculated by taking the average of randomDistance1 x smartDistance (.25) and the desired pixels away a player should be before the enemy moves forward(200) - 50 pixel width
            enemy.velocity.x = -5
        }
        else if(move > 35){ //this is calculated by taking the average of randomDistance1 x smartDistance (.25) and the desired pixels away a player should be before the enemy moves backwards(140)- 50 pixel width
            enemy.velocity.x = 0
        }
        else{
            enemy.velocity.x = 5
        }
        if(randomJump>.90 && enemy.position.y + enemy.height === 331){ //331 is when the enemy is on the ground floor
            enemy.velocity.y += -35
        }
        if(enemyCanAttack === true && distance < 175 && (randomAttack > .6 || enemy.position.x + enemy.width > randomBack)){ // the enemy will attack more often when backed into the corner
            enemyCanAttack = false
            setTimeout(function(){enemyCanAttack = true},1250)
            enemy.attack()
        }
    }
    else{
        enemy.velocity.x = 0
    }
    
}


const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: 'blue',
  offset: { x: 215, y: 167 }, // Offset adjusted
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: { imageSrc: './img/kenji/Idle.png', framesMax: 4 },
    run: { imageSrc: './img/kenji/Run.png', framesMax: 8 },
    jump: { imageSrc: './img/kenji/Jump.png', framesMax: 2 },
    fall: { imageSrc: './img/kenji/Fall.png', framesMax: 2 },
    attack1: { imageSrc: './img/kenji/Attack1.png', framesMax: 4 },
    takeHit: { imageSrc: './img/kenji/Take hit.png', framesMax: 3 },
    death: { imageSrc: './img/kenji/Death.png', framesMax: 7 }
  },
  attackBox: { offset: { x: -170, y: 50 }, width: 100, height: 50 }
});

const keys = {
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false }
};

function updateHealthBar(playerHealth, enemyHealth) {
  gsap.to('#playerHealth', { width: playerHealth + '%' });
  gsap.to('#enemyHealth', { width: enemyHealth + '%' });
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  player.velocity.x = 0;
  //enemy.velocity.x = 0;

  //enemy movement
  if(canCallMovement){
    movement(player, enemy)
    canCallMovement = false
    setTimeout(function(){canCallMovement = true},300)
  }

  // Player movement
  if (keys.ArrowLeft.pressed && player.lastKey === 'ArrowLeft') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.ArrowRight.pressed && player.lastKey === 'ArrowRight') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // Player jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // Enemy jumping and running movement
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }
  if (enemy.velocity.y === 0 && enemy.velocity.x === 0){
    enemy.switchSprite('idle')
  }
  if (enemy.velocity.x < 0) {
    enemy.switchSprite('run');
  } else if (enemy.velocity.x > 0) {
    enemy.switchSprite('run');
  }

  // Collision and attacks
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    updateHealthBar(player.health, enemy.health);
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    updateHealthBar(player.health, enemy.health);
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy });
    reset();
  }
}

animate();
decreaseTimer();

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        player.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        player.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        player.velocity.y = -20;
        break;
      case ' ':
        player.attack();
        break;
    }
  }

});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});
