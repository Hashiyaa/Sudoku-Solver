// @ts-check

function calculate(config, dim = 3) {
    config = [
        // A easy one
        [0, 0, 3, 0, 2, 0, 6, 0, 0],
        [9, 0, 0, 3, 0, 5, 0, 0, 1],
        [0, 0, 1, 8, 0, 6, 4, 0, 0],
        [0, 0, 8, 1, 0, 2, 9, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 0, 6, 7, 0, 8, 2, 0, 0],
        [0, 0, 2, 6, 0, 9, 5, 0, 0],
        [8, 0, 0, 2, 0, 3, 0, 0, 9],
        [0, 0, 5, 0, 1, 0, 3, 0, 0],
        // A medium one
        // [0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [0, 0, 0, 0, 0, 3, 0, 8, 5],
        // [0, 0, 1, 0, 2, 0, 0, 0, 0],
        // [0, 0, 0, 5, 0, 7, 0, 0, 0],
        // [0, 0, 4, 0, 0, 0, 1, 0, 0],
        // [0, 9, 0, 0, 0, 0, 0, 0, 0],
        // [5, 0, 0, 0, 0, 0, 0, 7, 3],
        // [0, 0, 2, 0, 1, 0, 0, 0, 0],
        // [0, 0, 0, 0, 4, 0, 0, 0, 9],
    ]

    // generate the domain for each square and ensure node consistency
    let domain = Array(9).fill(0).map(row => new Array(9).fill(0).map(e => Array(9).fill(0).map((e, i) => i + 1)));
    config.forEach((row, i) => {
        row.forEach((square, j) => {
            if (square != 0) domain[i][j] = [square];
        });
    });
    // console.log(domain);

    let q = new Queue();
    for (let i = 0; i < Math.pow(dim, 2); i++) {
        for (let j = 0; j < Math.pow(dim, 2); j++) {
            getNeighbors([i, j], dim).forEach(n => q.enqueue([n, [i, j]]));
        }
    }
    // console.log(q.peek());

    while (!q.isEmpty()) {
        let arc = q.dequeue();
        let revised = false;
        let di = domain[arc[0][0]][arc[0][1]];
        let dj = domain[arc[1][0]][arc[1][1]];
        if (di.length === 1 && dj.length === 1) continue;
        for (let i = 0; i < di.length; i++) {
            let x = di[i];
            let ac = false;
            for (let j = 0; j < dj.length; j++) {
                let y = dj[j];
                if (y != x) {
                    ac = true;
                    revised = true;
                    break;
                }
            }
            if (!ac) di.splice(i, 1);
        }
        if (revised) {
            if (di.filter(e => e != 0).length === 0) return;
            getNeighbors(arc[0], dim).forEach(n => {
                if (n[0] != arc[1][0] || n[1] != arc[1][1])
                    q.enqueue([n, arc[0]]);
            });
        }
    }
    console.log(domain);
}

function getNeighbors(pos, dim = 3) {
    let neighbors = [];
    for (let i = 0; i < Math.pow(dim, 2); i++) {
        for (let j = 0; j < Math.pow(dim, 2); j++) {
            let row = i === pos[0] && j != pos[1];
            let col = i != pos[0] && j === pos[1];
            let block = (Math.floor(i / dim) === Math.floor(pos[0] / dim)) &&
                (Math.floor(j / dim) === Math.floor(pos[1] / dim)) &&
                !(i === pos[0] && j === pos[1]);
            if (row || col || block) neighbors.push([i, j]);
        }
    }
    return neighbors;
}