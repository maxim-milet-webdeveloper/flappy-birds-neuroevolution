const canvas = document.getElementById("flappy-birds");
let TOTAL = 200;
let counter = 0;
let highestFitness = 0;
const fitnessDOM = document.getElementById('fitness');

const ctx = canvas.getContext('2d');
let birds = [];
let pipes = [];

(async function setup() {
    tf.setBackend('cpu')
    for (let i = 0; i < TOTAL; i++) {
        birds[i] = new Bird(50, canvas.clientHeight / 2);
        birds[i].draw();
    }
    await sleep(1500);
    draw()
})();


function draw() {
    if (counter % 110 === 0) {
        createPipe()
    }
    counter++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].offscreen()) {
            pipes.splice(i, 1)
        } else {
            pipes[i].update();
            pipes[i].draw()
        }
    }

    for (let i = 0; i < birds.length; i++) {
        if (birds[i].y === canvas.height - birds[i].radius || birds[i].hit()) {
            if (birds.length === 1) {
                newGeneration();
                break;
            } else {
                birds[i].brain.model.dispose()
                birds.splice(i, 1);
            }
        } else {
            birds[i].update();
            birds[i].think();
            birds[i].draw();
        }
    }

    if (birds[0].fitness > highestFitness) {
        highestFitness = birds[0].fitness;
    }
    if (counter % 10 == 0) {
        fitnessDOM.textContent = 'Highest Score: ' + highestFitness;
    }
    setTimeout(() => {
        draw();
    }, 1)
}

function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

function createPipe() {
    const firstNum = getRndInteger(20, canvas.height - 295);
    const secondNum = firstNum + getRndInteger(200, 250);
    pipes.push(new Pipe(firstNum, secondNum));
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}