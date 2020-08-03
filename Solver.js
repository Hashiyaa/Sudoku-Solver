// @ts-check

const DIM = 3;

function calculate(config) {
    config = [
        // A easy one
        // [0, 0, 3, 0, 2, 0, 6, 0, 0],
        // [9, 0, 0, 3, 0, 5, 0, 0, 1],
        // [0, 0, 1, 8, 0, 6, 4, 0, 0],
        // [0, 0, 8, 1, 0, 2, 9, 0, 0],
        // [7, 0, 0, 0, 0, 0, 0, 0, 8],
        // [0, 0, 6, 7, 0, 8, 2, 0, 0],
        // [0, 0, 2, 6, 0, 9, 5, 0, 0],
        // [8, 0, 0, 2, 0, 3, 0, 0, 9],
        // [0, 0, 5, 0, 1, 0, 3, 0, 0],
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
        // hard
        // [0, 6, 0, 0, 2, 7, 8, 0, 0],
        // [0, 8, 0, 0, 0, 0, 0, 0, 0],
        // [0, 0, 0, 6, 0, 0, 7, 0, 1],
        // [5, 0, 3, 0, 0, 2, 0, 4, 0],
        // [0, 0, 0, 0, 7, 0, 0, 0, 0],
        // [0, 2, 0, 1, 0, 0, 5, 0, 9],
        // [4, 0, 1, 0, 0, 3, 0, 0, 0],
        // [0, 0, 0, 0, 0, 0, 0, 3, 0],
        // [0, 0, 9, 7, 6, 0, 0, 1, 0],
        // hidden pair 1
        // [0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [0, 0, 0, 0, 4, 2, 7, 3, 0],
        // [0, 0, 6, 7, 0, 0, 0, 4, 0],
        // [0, 9, 4, 0, 0, 0, 0, 0, 0],
        // [0, 0, 0, 0, 9, 6, 0, 0, 0],
        // [0, 0, 7, 0, 0, 0, 0, 2, 3],
        // [1, 0, 0, 0, 0, 0, 0, 8, 5],
        // [0, 6, 0, 0, 8, 0, 2, 7, 0],
        // [0, 0, 5, 0, 1, 0, 0, 0, 0],
        // hidden pair 2
        [0, 0, 0, 0, 3, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 7, 6, 0, 0, 9, 1, 4],
        [0, 9, 6, 0, 0, 0, 8, 0, 0],
        [0, 0, 5, 0, 0, 8, 0, 0, 0],
        [0, 3, 0, 0, 4, 0, 0, 0, 5],
        [0, 5, 0, 2, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 5, 6, 0],
        [9, 0, 4, 0, 1, 0, 0, 0, 0],
        // hardest
        // [8, 0, 0, 0, 0, 0, 0, 0, 0],
        // [0, 0, 3, 6, 0, 0, 0, 0, 0],
        // [0, 7, 0, 0, 9, 0, 2, 0, 0],
        // [0, 5, 0, 0, 0, 7, 0, 0, 0],
        // [0, 0, 0, 0, 4, 5, 7, 0, 0],
        // [0, 0, 0, 1, 0, 0, 0, 3, 0],
        // [0, 0, 1, 0, 0, 0, 0, 6, 8],
        // [0, 0, 8, 5, 0, 0, 0, 1, 0],
        // [0, 9, 0, 0, 0, 0, 4, 0, 0],
    ]

    let s = new Solver(config);
    return s.solve();
}

function loadFromLib() {

}

function saveToLib() {

}

class Solver {
    constructor(config) {
        this.domain = Array(9).fill(0).map(row => Array(9).fill(0).map(square => Array(9).fill(0).map((square, i) => i + 1)));
        config.forEach((row, i) => {
            row.forEach((square, j) => {
                if (square != 0) this.domain[i][j] = [square];
            });
        });
    }

    solve() {
        let iter = 1;
        while (iter > 0) {
            this.ac3();
            this.hiddenProp();
            this.nakedProp();
            iter--;
        }
        // console.log(this.domain);

        let answer = this.domain.map(row => row.map(square => square.join("")));

        return answer;
    }

    ac3() {
        // AC-3
        let q = new Queue();
        for (let i = 0; i < DIM * DIM; i++) {
            for (let j = 0; j < DIM * DIM; j++) {
                this.getNeighbors([i, j]).forEach(n => q.enqueue([n, [i, j]]));
            }
        }
        // console.log(q.peek());

        while (!q.isEmpty()) {
            let arc = q.dequeue();
            let revised = false;
            let di = this.domain[arc[0][0]][arc[0][1]];
            let dj = this.domain[arc[1][0]][arc[1][1]];
            for (let i = 0; i < di.length; i++) {
                let x = di[i];
                let ac = false;
                for (let j = 0; j < dj.length; j++) {
                    let y = dj[j];
                    if (y != x) {
                        ac = true;
                        break;
                    }
                }
                if (!ac) {
                    revised = true;
                    di.splice(i, 1);
                }
            }

            if (revised) {
                if (di.filter(e => e != 0).length === 0) return;
                this.getNeighbors(arc[0]).forEach(n => {
                    if (n[0] != arc[1][0] || n[1] != arc[1][1])
                        q.enqueue([n, arc[0]]);
                });
            }
        }
    }

    // hidden singles, hiddlen pairs
    // TODO: hidden triplets and hidden quads
    hiddenProp() {
        for (let i = 0; i < DIM * DIM; i++) {
            // counters for rows, cols and blocks
            let counters = Array(3).fill(0).map(e => Array(DIM * DIM).fill(0));
            for (let j = 0; j < DIM * DIM; j++) {
                this.domain[i][j].forEach(n => counters[0][n - 1]++);
                this.domain[j][i].forEach(n => counters[1][n - 1]++);
                let r = Math.floor(i / DIM) * DIM + Math.floor(j / DIM);
                let c = Math.floor(i % DIM) * DIM + Math.floor(j % DIM);
                this.domain[r][c].forEach(n => counters[2][n - 1]++);
            }
            
            let pairs = Array(3).fill(0).map(e => Array());
            // a house (type) is either a row (0), a column (1), or a block (2)
            counters.forEach((house, type) => {
                house.forEach((count, index) => {
                    if (count < 1) {
                        return;
                    } else if (count == 1) {
                        for (let k = 0; k < DIM * DIM; k++) {
                            if (type == 0) {
                                if (this.domain[i][k].length > 1 && this.domain[i][k].includes(index + 1)) {
                                    this.domain[i][k] = [index + 1];
                                    break;
                                }
                            } else if (type == 1) {
                                if (this.domain[k][i].length > 1 && this.domain[k][i].includes(index + 1)) {
                                    this.domain[k][i] = [index + 1];
                                    break;
                                }
                            } else {
                                let r = Math.floor(i / DIM) * DIM + Math.floor(k / DIM);
                                let c = Math.floor(i % DIM) * DIM + Math.floor(k % DIM);
                                if (this.domain[r][c].length > 1 && this.domain[r][c].includes(index + 1)) {
                                    this.domain[r][c] = [index + 1];
                                    break;
                                }
                            }
                        }
                    } else if (count == 2) {
                        for (let k = 0; k < DIM * DIM; k++) {
                            let pos = [];
                            if (type == 0) {
                                if (this.domain[i][k].length > 1 && this.domain[i][k].includes(index + 1)) {
                                   pos = [i, k];
                                }
                            } else if (type == 1) {
                                if (this.domain[k][i].length > 1 && this.domain[k][i].includes(index + 1)) {
                                    pos = [k, i];
                                }
                            } else {
                                let r = Math.floor(i / DIM) * DIM + Math.floor(k / DIM);
                                let c = Math.floor(i % DIM) * DIM + Math.floor(k % DIM);
                                if (this.domain[r][c].length > 1 && this.domain[r][c].includes(index + 1)) {
                                    pos = [r, c];
                                }
                            }
                            let contained = false;
                            for (let p = 0; p < pairs[type].length; p++) {
                                if (pairs[type][p].pos.join() == pos.join()) {
                                    contained = true;
                                    if (!pairs[type][p].number.includes(index + 1)) {
                                        pairs[type][p].number.push(index + 1);
                                    }
                                    break;
                                }
                            }
                            if (!contained && pos.length > 0) {
                                pairs[type].push({pos: pos, number: [index + 1]});
                            }
                        }
                    }
                });
                this.ac3();
                if (pairs[type].length > 0) {
                    for (let j = 0; j < pairs[type].length - 1; j++) {
                        for (let k = j + 1; k < pairs[type].length; k++) {
                            if (pairs[type][j].number.length > 1 && 
                                pairs[type][j].number.join() == pairs[type][k].number.join()) {
                                let p1 = pairs[type][j].pos;
                                let p2 = pairs[type][k].pos;
                                this.domain[p1[0]][p1[1]] = pairs[type][j].number;
                                this.domain[p2[0]][p2[1]] = pairs[type][k].number;
                            }
                        }
                    }
                }
            });
            // console.log(pairs);
        }
    }

    // naked pairs
    // TODO: naked triplets and quads
    nakedProp(kMax=3) {
        for (let k = 2; k < kMax; k++) {
            for (let i = 0; i < DIM * DIM; i++) {
                for (let j = 0; j < DIM * DIM; j++) {
                    if (this.domain[i][j].length == k) {
                        
                        let neighbors = this.getNeighbors([i, j])
                        neighbors.forEach(n => {
                            if (this.domain[n[0]][n[1]].join() == this.domain[i][j].join()) {
                                if (i == n[0]) {
                                    for (let c = 0; c < DIM * DIM; c++) {
                                        if (c != j && c != n[1]) {
                                            this.domain[i][c] = this.domain[i][c].filter(e => !this.domain[i][j].includes(e));
                                        }
                                    }
                                }
                                if (j == n[1]) {
                                    for (let r = 0; r < DIM * DIM; r++) {
                                        if (r != i && r != n[0]) {
                                            this.domain[r][j] = this.domain[r][j].filter(e => !this.domain[i][j].includes(e));
                                        }
                                    }
                                }
                                if ((Math.floor(i / DIM) == Math.floor(n[0] / DIM)) &&
                                    (Math.floor(j / DIM) == Math.floor(n[1] / DIM))) {
                                    for (let b = 0; b < DIM * DIM; b++) {
                                        let num = Math.floor(i / DIM) * DIM + Math.floor(j / DIM);
                                        let r = Math.floor(num / DIM) * DIM + Math.floor(b / DIM);
                                        let c = Math.floor(num % DIM) * DIM + Math.floor(b % DIM);
                                        if ((r != i && r != n[0]) || (c != j && c != n[1])) {
                                            this.domain[r][c] = this.domain[r][c].filter(e => !this.domain[i][j].includes(e));
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    }

    omission() {

    }

    isComplete() {
        this.domain.forEach(row => {
            row.forEach(square => {
                if (square.length > 1) return false;
            })
        });
        return true;
    }

    getNeighbors(pos) {
        let neighbors = [];
        for (let i = 0; i < DIM * DIM; i++) {
            for (let j = 0; j < DIM * DIM; j++) {
                let row = i === pos[0] && j != pos[1];
                let col = i != pos[0] && j === pos[1];
                let block = (Math.floor(i / DIM) === Math.floor(pos[0] / DIM)) &&
                    (Math.floor(j / DIM) === Math.floor(pos[1] / DIM)) &&
                    !(i === pos[0] && j === pos[1]);
                if (row || col || block) neighbors.push([i, j]);
            }
        }
        return neighbors;
    }
}