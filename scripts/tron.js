const canvas = document.getElementById('tron');
const context = canvas.getContext('2d');
const pixels = 16;

class Player {
  constructor(x, y, colour, stroke, shadow, outline) {
    this.colour = colour;
    this.stroke = stroke;
    this.shadow = shadow;
    this.outline = outline;
    this.dead = false;
    this.direction = '';
    this.key = '';
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;

    this.constructor.counter = (this.constructor.counter || 0) + 1;
    this.id = this.constructor.counter;
    Player.allInstances.push(this);
  };
};

Player.allInstances = [];

let player1 = new Player (112,112, '#ff5f5f', '#3f0000', '#f66', '#7f0000')
let player2 = new Player (384,384, '#00bf00', '#001f00', '#0f0', '#005f00')

function setDirection(key, player, up, right, down, left) {
  switch (key) {
    case up:
      if (player.direction !== 'DOWN') {
        player.key = 'UP';
      };
      break;
    case right:
      if (player.direction !== 'LEFT') {
        player.key = 'RIGHT';
      };
      break;
    case down:
      if (player.direction !== 'UP') {
        player.key = 'DOWN';
      };
      break;
    case left:
      if (player.direction !== 'RIGHT') {
        player.key = 'LEFT';
      };
      break;
    default:
      break;
  };
};

function handleKeyPress(e) {
  let currentKey = e.keyCode;
  e.preventDefault();
  setDirection(currentKey, player1, 38, 39, 40, 37);
  setDirection(currentKey, player2, 87, 68, 83, 65);
};
document.addEventListener('keydown', handleKeyPress);

function setPlayableArea(canvas, pixels) {
  let playableArea = new Set();
  for (let i = 0; i < canvas.width / pixels; i++) {
    for (let j = 0; j < canvas.height / pixels; j++) {
      playableArea.add(`${i * pixels}x${j * pixels}y`);
    };
  };
  return playableArea;
};

let playableArea = setPlayableArea(canvas, pixels);

function renderPlayers(players) {
  players.forEach(player => {
    context.shadowColor = player.shadow;
    context.shadowBlur = 8;

    context.fillStyle = player.colour;
    context.fillRect(player.x, player.y, pixels, pixels);

    context.beginPath();
    context.moveTo(player.x, player.y);
    context.lineTo(player.x+pixels, player.y);
    context.lineTo(player.x+pixels, player.y+pixels);
    context.fillStyle = '#ffffffbf'
    context.fill();

    context.strokeStyle = player.stroke;
    context.strokeRect(player.x, player.y, pixels, pixels);
  });
};

renderPlayers(Player.allInstances);
let outcome, winnerColor, playerCount = Player.allInstances.length;

function draw() {
  if (Player.allInstances.filter(player => !player.key).length === 0) {

    if (playerCount === 1) {
      const alivePlayers = Player.allInstances.filter(player => player.dead === false);
      outcome = `Player ${alivePlayers[0].id} wins!`;
      winnerColor = alivePlayers[0].shadow;
    } else if (playerCount === 0) {
      outcome = 'Draw!';
      winnerColor = '#ffffffff';
    };

    if (outcome) {
      createResultsScreen(winnerColor);
      clearInterval(game);
      // document.getElementById("p1").innerHTML = `Player 1 score: ${player1.score}`
    };

    Player.allInstances.forEach(player => {

      if (player.key) {
        player.direction = player.key;

        context.shadowColor = player.shadow;
        context.shadowBlur = 4;

        context.fillStyle = player.colour;
        context.fillRect(player.x, player.y, pixels, pixels);

        context.beginPath();
        context.moveTo(player.x, player.y);
        context.lineTo(player.x+pixels, player.y);
        context.lineTo(player.x+pixels, player.y+pixels);
        context.fillStyle = '#ffffffbf'
        context.fill();

        context.strokeStyle = player.stroke;
        context.strokeRect(player.x, player.y, pixels, pixels);


        if (!playableArea.has(`${player.x}x${player.y}y`) && player.dead === false) {
          player.dead = true;
          player.direction = '';
          playerCount -= 1;
        }

        playableArea.delete(`${player.x}x${player.y}y`);

        if (!player.dead) {
          if (player.direction === "LEFT")
            {
              player.x -= pixels;

              let grd = context.createLinearGradient(player.x+4, player.y, player.x+16, player.y);
              grd.addColorStop(0, player.shadow);
              grd.addColorStop(1, 'white');
              let grd2 = context.createLinearGradient(player.x, player.y, player.x+16, player.y);
              grd2.addColorStop(0, 'black');
              grd2.addColorStop(1, player.outline);

              context.beginPath();
              context.moveTo(player.x, player.y+8);
              context.lineTo(player.x+16, player.y+16);
              context.lineTo(player.x+16, player.y);
              context.lineTo(player.x, player.y+8);
              context.fillStyle = grd;
              context.strokeStyle = grd2;
              context.shadowColor = 'white'
              context.shadowBlur = 8;
              context.fill();
              context.stroke();
            };
          if (player.direction === "UP")
            {
              player.y -= pixels;

              let grd = context.createLinearGradient(player.x, player.y+4, player.x, player.y+16);
              grd.addColorStop(0, player.shadow);
              grd.addColorStop(1, 'white');
              let grd2 = context.createLinearGradient(player.x, player.y, player.x, player.y+16);
              grd2.addColorStop(0, 'black');
              grd2.addColorStop(1, player.outline);

              context.beginPath();
              context.moveTo(player.x+8, player.y);
              context.lineTo(player.x+16, player.y+16);
              context.lineTo(player.x, player.y+16);
              context.lineTo(player.x+8, player.y);
              context.fillStyle = grd;
              context.strokeStyle = grd2;
              context.shadowColor = 'white'
              context.shadowBlur = 8;
              context.fill();
              context.stroke();
            };
          if (player.direction === "RIGHT")
            {
              player.x += pixels;

              let grd = context.createLinearGradient(player.x, player.y, player.x+12, player.y);
              grd.addColorStop(0, 'white');
              grd.addColorStop(1, player.shadow);
              let grd2 = context.createLinearGradient(player.x, player.y, player.x+16, player.y);
              grd2.addColorStop(0, player.outline);
              grd2.addColorStop(1, 'black');

              context.beginPath();
              context.moveTo(player.x+16, player.y+8);
              context.lineTo(player.x, player.y+16);
              context.lineTo(player.x, player.y);
              context.lineTo(player.x+16, player.y+8);
              context.fillStyle = grd;
              context.strokeStyle = grd2;
              context.shadowColor = 'white'
              context.shadowBlur = 8;
              context.fill();
              context.stroke();
            };
          if (player.direction === "DOWN")
            {
              player.y += pixels;

              let grd = context.createLinearGradient(player.x, player.y, player.x, player.y+12);
              grd.addColorStop(0, 'white');
              grd.addColorStop(1, player.shadow);
              let grd2 = context.createLinearGradient(player.x, player.y, player.x, player.y+16);
              grd2.addColorStop(0, player.outline);
              grd2.addColorStop(1, 'black');

              context.beginPath();
              context.moveTo(player.x+8, player.y+16);
              context.lineTo(player.x+16, player.y);
              context.lineTo(player.x, player.y);
              context.lineTo(player.x+8, player.y+16);
              context.fillStyle = grd;
              context.strokeStyle = grd2;
              context.shadowColor = 'white'
              context.shadowBlur = 8;
              context.fill();
              context.stroke();
            };
        }};

    });

}};

let game = setInterval(draw, 100);

function createResultsScreen() {
  const resultNode = document.createElement('div1');
  resultNode.id = 'result';

  const resultNodeBox = document.createElement("div2");

  const resultText = document.createElement("h1");
  resultText.innerText = outcome;
  resultText.style.color = winnerColor;

  const replayButton = document.createElement("resetbutton");
  replayButton.innerText = 'REPLAY (ENTER)';

  replayButton.onclick = () => {
    replayButton.style.background = '#00bfbfff';
    replayButton.style.color = '#000000ff';
    setTimeout( () => {resetGame()}, 250 );
  };

  resultNode.appendChild(resultNodeBox);
  resultNodeBox.appendChild(resultText);
  resultNodeBox.appendChild(replayButton);
  document.querySelector('body').appendChild(resultNode);

  document.addEventListener('keydown', (e) => {
    let key = event.keyCode;
    if (key == 13 || key == 32 || key == 27 || key == 82)
      resetGame();
  });
};

function showKeys(){
  const controls = document.getElementById("Window");
  controls.style.visibility = 'visible';
  controls.addEventListener('click', () => {
    controls.style.visibility = 'hidden';
  });
};

function resetGame() {
  const result = document.getElementById('result');
  if (result) result.remove();
  context.clearRect(0, 0, canvas.width, canvas.height);
  playableArea = setPlayableArea(canvas, pixels);

    Player.allInstances.forEach(player => {
      player.x = player.startX;
      player.y = player.startY;
      player.dead = false;
      player.direction = '';
      player.key = '';
    });

    playerCount = Player.allInstances.length;
    renderPlayers(Player.allInstances);
    outcome = '';
    winnerColor = '';

    clearInterval(game);
    game = setInterval(draw, 100);
  };




