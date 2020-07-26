// @ts-check

function calculate(config) {
    config = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0, 8, 5],
        [0, 0, 1, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 5, 0, 7, 0, 0, 0],
        [0, 0, 4, 0, 0, 0, 1, 0, 0],
        [0, 9, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 7, 3],
        [0, 0, 2, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 9],
    ]
    let domain = getDomain(config);
    doAC3(domain);
}

// generate the domain for each square and ensure node consistency
function getDomain(config) {
    let domain = Array(9).fill(0).map(row => new Array(9).fill(0).map(e => Array(9).fill(0).map((e, i) => i + 1)));
    config.forEach((row, i) => {
        row.forEach((square, j) => {
            if (square != 0) {
                domain[i][j] = [square];
            }
        });        
    });
    // console.log(domain);
    return domain;
}

function doAC3(domain) {
    let given = [];
    domain.forEach((row, i) => {
        row.forEach((square, j) => {
            if (square.length === 1) {
                given.push([i, j]);
            }
        });
    });

    let q = new Queue();

    given.forEach(pos => {
        getNeighbors(pos).forEach(n => q.enqueue([n, pos]));
    });

    console.log(q.peek());
}

function getNeighbors(pos, dim=3) {
    let neighbors = [];
    for (let i = 0; i < Math.pow(dim, 2); i++) {
        for (let j = 0; j < Math.pow(dim, 2); j++) {
            let row = i === pos[0] && j != pos[1];
            let col = i != pos[0] && j === pos[1];
            let block = (Math.floor(i / dim) === Math.floor(pos[0] / dim)) && 
                (Math.floor(j / dim) === Math.floor(pos[1] / dim));
            if (row || col || block) {
                neighbors.push([i, j]);
            }
        }
    }
    return neighbors;
}
