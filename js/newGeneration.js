let gen = 0;

async function newGeneration() {
    gen++;
    const allModels = [];
    let weights = birds[0].getWeights();
    let learningrate = .2;
    let num = 10;

    if (highestFitness < 800) {
        learningrate = 1;
        num = 40;
    }

    if (highestFitness > 8000) {
        learningrate = .1;
        num = 5;
    }
    if (highestFitness > 20000) {
        learningrate = .02;
        num = 2.5;
    }

    for (let i = 0; i < TOTAL; i++) {
        const newModel = await birds[0].mutate(learningrate, weights, num)
        allModels.push(newModel)
    }


    console.log(birds[0].fitness)
    birds[0].brain.model.dispose()
    birds = [];
    pipes = [];
    allModels.forEach(model => {
        birds.push(new Bird(50, canvas.clientHeight / 2, model))
    })

    counter = 0;

    highestFitness = 0;

    console.log('NEW GENERATION: ' + gen)
}