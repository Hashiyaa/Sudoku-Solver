// @ts-check

const DIM = 3;

export default function calculate(config, algo) {
    let s = new Solver(config);
    if (algo === "naked_single") {
        s.ac3();
    } else if (algo === "naked_pair") {
        s.nakedPairProp();
    } else if (algo === "naked_triple") {
        s.nakedTripleProp();
    } else if (algo === "naked_quadruple") {
        s.nakedQuadrupleProp();
    } else if (algo === "hidden_single") {
        s.hiddenSingleProp();
    } else if (algo === "hidden_pair") {
        s.hiddenPairProp();
    } else if (algo === "hidden_triple") {
        s.hiddenTripleProp();
    } else if (algo === "hidden_quadruple") {
        s.hiddenQuadrupleProp();
    } else {
        let iter = 1;
        while (iter > 0) {
            s.ac3();
            s.hiddenSingleProp();
            s.ac3();
            iter--;
        }
    }
    return s.config.slice();
}

function containPos(arr, pos) {
    let contained = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] === pos[0] && arr[i][1] === pos[1]) {
            contained = true;
            break;
        }
    }
    return contained;
}

function getPosFromIndex(i, j, type) {
    let pos = [i, j];
    if (type === 1) {
        pos = [j, i];
    }
    if (type === 2) {
        pos = [Math.floor(i / DIM) * DIM + Math.floor(j / DIM),
            Math.floor(i % DIM) * DIM + Math.floor(j % DIM)
        ];
    }
    return pos;
}

class Solver {
    constructor(config) {
        this.config = config;
    }

    isComplete() {
        this.config.forEach(row => {
            row.forEach(grid => {
                if (grid.length > 1) return false;
            })
        });
        return true;
    }

    getNeighbors(pos) {
        let neighbors = [];
        for (let i = 0; i < DIM * DIM; i++) {
            for (let j = 0; j < DIM * DIM; j++) {
                let row = i === pos[0] && j !== pos[1];
                let col = i !== pos[0] && j === pos[1];
                let block = (Math.floor(i / DIM) === Math.floor(pos[0] / DIM)) &&
                    (Math.floor(j / DIM) === Math.floor(pos[1] / DIM)) &&
                    !(i === pos[0] && j === pos[1]);
                if (row || col || block) neighbors.push([i, j]);
            }
        }
        return neighbors;
    }

    ac3() {
        // AC-3
        let q = [];
        for (let i = 0; i < DIM * DIM; i++) {
            for (let j = 0; j < DIM * DIM; j++) {
                this.getNeighbors([i, j]).forEach(n => q.push([n, [i, j]]));
            }
        }
        // console.log(q.peek());

        let revised = false;
        while (q.length !== 0) {
            let arc = q.pop();
            let updated = false;
            let di = this.config[arc[0][0]][arc[0][1]];
            let dj = this.config[arc[1][0]][arc[1][1]];
            for (let i = 0; i < di.length; i++) {
                let x = di[i];
                let ac = false;
                for (let j = 0; j < dj.length; j++) {
                    let y = dj[j];
                    if (y !== x) {
                        ac = true;
                        break;
                    }
                }
                if (!ac) {
                    revised = true;
                    updated = true;
                    di.splice(i, 1);
                }
            }

            if (updated) {
                if (di.filter(e => e !== 0).length === 0) return;
                this.getNeighbors(arc[0]).forEach(n => {
                    if (n[0] !== arc[1][0] || n[1] !== arc[1][1])
                        q.push([n, arc[0]]);
                });
            }
        }
        return revised;
    }

    nakedPairProp() {
        let revised = false;
        for (let i = 0; i < DIM * DIM; i++) {
            // 0 -> row, 1-> col, 2-> block
            for (let type = 0; type < 3; type++) {
                for (let j = 0; j < this.config.length - 1; j++) {
                    let pos1 = getPosFromIndex(i, j, type);
                    if (this.config[pos1[0]][pos1[1]].length !== 2) continue;
                    for (let k = j + 1; k < this.config.length; k++) {
                        let pos2 = getPosFromIndex(i, k, type);
                        if (this.config[pos2[0]][pos2[1]].length !== 2) continue;
                        let numbers = [];
                        this.config[pos1[0]][pos1[1]].forEach(value => {
                            if (!numbers.includes(value)) numbers.push(value);
                        });
                        this.config[pos2[0]][pos2[1]].forEach(value => {
                            if (!numbers.includes(value)) numbers.push(value);
                        });
                        if (numbers.length === 2) {
                            for (let n = 0; n < numbers.length; n++) {
                                let num = numbers[n];
                                if (type === 0) {
                                    for (let idx = 0; idx < DIM * DIM; idx++) {
                                        if (idx !== pos1[1] && idx !== pos2[1] && this.config[pos1[0]][idx].includes(num)) {
                                            revised = true;
                                            let index = this.config[pos1[0]][idx].indexOf(num);
                                            this.config[pos1[0]][idx].splice(index, 1);
                                        }
                                    }
                                } else if (type === 1) {
                                    for (let idx = 0; idx < DIM * DIM; idx++) {
                                        if (idx !== pos1[0] && idx !== pos2[0] &&
                                            this.config[idx][pos1[1]].includes(num)) {
                                            revised = true;
                                            let index = this.config[idx][pos1[1]].indexOf(num);
                                            this.config[idx][pos1[1]].splice(index, 1);
                                        }
                                    }
                                } else {
                                    for (let idx = 0; idx < DIM * DIM; idx++) {
                                        let r = Math.floor(pos1[0] / DIM) * DIM + Math.floor(idx / DIM);
                                        let c = Math.floor(pos1[1] / DIM) * DIM + idx % DIM;
                                        if (!(r === pos1[0] && c === pos1[1]) &&
                                            !(r === pos2[0] && c === pos2[1]) &&
                                            this.config[r][c].includes(num)) {
                                            revised = true;
                                            let index = this.config[r][c].indexOf(num);
                                            this.config[r][c].splice(index, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return revised;
    }

    nakedTripleProp() {
        let revised = false;
        for (let i = 0; i < DIM * DIM; i++) {
            // 0 -> row, 1-> col, 2-> block
            for (let type = 0; type < 3; type++) {
                for (let j = 0; j < this.config.length - 2; j++) {
                    let pos1 = getPosFromIndex(i, j, type);
                    if (this.config[pos1[0]][pos1[1]].length === 1 ||
                        this.config[pos1[0]][pos1[1]].length > 3) continue;
                    for (let k = j + 1; k < this.config.length - 1; k++) {
                        let pos2 = getPosFromIndex(i, k, type);
                        if (this.config[pos2[0]][pos2[1]].length === 1 ||
                            this.config[pos2[0]][pos2[1]].length > 3) continue;
                        for (let l = k + 1; l < this.config.length; l++) {
                            let pos3 = getPosFromIndex(i, l, type);
                            if (this.config[pos3[0]][pos3[1]].length === 1 ||
                                this.config[pos3[0]][pos3[1]].length > 3) continue;
                            let numbers = [];
                            this.config[pos1[0]][pos1[1]].forEach(value => {
                                if (!numbers.includes(value)) numbers.push(value);
                            });
                            this.config[pos2[0]][pos2[1]].forEach(value => {
                                if (!numbers.includes(value)) numbers.push(value);
                            });
                            this.config[pos3[0]][pos3[1]].forEach(value => {
                                if (!numbers.includes(value)) numbers.push(value);
                            });
                            if (numbers.length === 3) {
                                for (let n = 0; n < numbers.length; n++) {
                                    let num = numbers[n];
                                    if (type === 0) {
                                        for (let idx = 0; idx < DIM * DIM; idx++) {
                                            if (idx !== pos1[1] && idx !== pos2[1] && idx !== pos3[1] && this.config[pos1[0]][idx].includes(num)) {
                                                revised = true;
                                                let index = this.config[pos1[0]][idx].indexOf(num);
                                                this.config[pos1[0]][idx].splice(index, 1);
                                            }
                                        }
                                    }
                                    if (type === 1) {
                                        for (let idx = 0; idx < DIM * DIM; idx++) {
                                            if (idx !== pos1[0] && idx !== pos2[0] && idx !== pos3[0] &&
                                                this.config[idx][pos1[1]].includes(num)) {
                                                revised = true;
                                                let index = this.config[idx][pos1[1]].indexOf(num);
                                                this.config[idx][pos1[1]].splice(index, 1);
                                            }
                                        }
                                    }
                                    if (type === 2) {
                                        for (let idx = 0; idx < DIM * DIM; idx++) {
                                            let r = Math.floor(pos1[0] / DIM) * DIM + Math.floor(idx / DIM);
                                            let c = Math.floor(pos1[1] / DIM) * DIM + idx % DIM;
                                            if (!(r === pos1[0] && c === pos1[1]) &&
                                                !(r === pos2[0] && c === pos2[1]) &&
                                                !(r === pos3[0] && c === pos3[1]) &&
                                                this.config[r][c].includes(num)) {
                                                revised = true;
                                                let index = this.config[r][c].indexOf(num);
                                                this.config[r][c].splice(index, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return revised;
    }

    nakedQuadrupleProp() {
        let revised = false;
        for (let i = 0; i < DIM * DIM; i++) {
            // 0 -> row, 1-> col, 2-> block
            for (let type = 0; type < 3; type++) {
                for (let j = 0; j < this.config.length - 3; j++) {
                    let pos1 = getPosFromIndex(i, j, type);
                    if (this.config[pos1[0]][pos1[1]].length === 1 ||
                        this.config[pos1[0]][pos1[1]].length > 4) continue;
                    for (let k = j + 1; k < this.config.length - 2; k++) {
                        let pos2 = getPosFromIndex(i, k, type);
                        if (this.config[pos2[0]][pos2[1]].length === 1 ||
                            this.config[pos2[0]][pos2[1]].length > 4) continue;
                        for (let l = k + 1; l < this.config.length - 1; l++) {
                            let pos3 = getPosFromIndex(i, l, type);
                            if (this.config[pos3[0]][pos3[1]].length === 1 ||
                                this.config[pos3[0]][pos3[1]].length > 4) continue;
                            for (let m = l + 1; m < this.config.length; m++) {
                                let pos4 = getPosFromIndex(i, m, type);
                                if (this.config[pos4[0]][pos4[1]].length === 1 ||
                                    this.config[pos4[0]][pos4[1]].length > 4) continue;
                                let numbers = [];
                                this.config[pos1[0]][pos1[1]].forEach(value => {
                                    if (!numbers.includes(value)) numbers.push(value);
                                });
                                this.config[pos2[0]][pos2[1]].forEach(value => {
                                    if (!numbers.includes(value)) numbers.push(value);
                                });
                                this.config[pos3[0]][pos3[1]].forEach(value => {
                                    if (!numbers.includes(value)) numbers.push(value);
                                });
                                this.config[pos4[0]][pos4[1]].forEach(value => {
                                    if (!numbers.includes(value)) numbers.push(value);
                                });
                                if (numbers.length === 4) {
                                    for (let n = 0; n < numbers.length; n++) {
                                        let num = numbers[n];
                                        if (type === 0) {
                                            for (let idx = 0; idx < DIM * DIM; idx++) {
                                                if (idx !== pos1[1] && idx !== pos2[1] &&
                                                    idx !== pos3[1] && idx !== pos4[1] &&
                                                    this.config[pos1[0]][idx].includes(num)) {
                                                    revised = true;
                                                    let index = this.config[pos1[0]][idx].indexOf(num);
                                                    this.config[pos1[0]][idx].splice(index, 1);
                                                }
                                            }
                                        }
                                        if (type === 1) {
                                            for (let idx = 0; idx < DIM * DIM; idx++) {
                                                if (idx !== pos1[0] && idx !== pos2[0] &&
                                                    idx !== pos3[0] && idx !== pos4[0] &&
                                                    this.config[idx][pos1[1]].includes(num)) {
                                                    revised = true;
                                                    let index = this.config[idx][pos1[1]].indexOf(num);
                                                    this.config[idx][pos1[1]].splice(index, 1);
                                                }
                                            }
                                        }
                                        if (type === 2) {
                                            for (let idx = 0; idx < DIM * DIM; idx++) {
                                                let r = Math.floor(pos1[0] / DIM) * DIM + Math.floor(idx / DIM);
                                                let c = Math.floor(pos1[1] / DIM) * DIM + idx % DIM;
                                                if (!(r === pos1[0] && c === pos1[1]) &&
                                                    !(r === pos2[0] && c === pos2[1]) &&
                                                    !(r === pos3[0] && c === pos3[1]) &&
                                                    !(r === pos4[0] && c === pos4[1]) &&
                                                    this.config[r][c].includes(num)) {
                                                    revised = true;
                                                    let index = this.config[r][c].indexOf(num);
                                                    this.config[r][c].splice(index, 1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return revised;
    }

    countPosForEachNum(i) {
        let counters = Array(3).fill(0).map(e => Array(DIM * DIM).fill(0).map(v => []));
        for (let j = 0; j < DIM * DIM; j++) {
            this.config[i][j].forEach(n => counters[0][n - 1].push([i, j]));
            this.config[j][i].forEach(n => counters[1][n - 1].push([j, i]));
            let r = Math.floor(i / DIM) * DIM + Math.floor(j / DIM);
            let c = Math.floor(i % DIM) * DIM + Math.floor(j % DIM);
            this.config[r][c].forEach(n => counters[2][n - 1].push([r, c]));
        }
        // console.log(counters);
        return counters;
    }

    // hidden singles
    hiddenSingleProp() {
        let revised = false;
        for (let i = 0; i < DIM * DIM; i++) {
            // counters for rows, cols and blocks
            let counters = this.countPosForEachNum(i);
            // a house (type) is either a row (0), a column (1), or a block (2)
            for (let j = 0; j < counters.length; j++) {
                for (let k = 0; k < counters[j].length; k++) {
                    if (counters[j][k].length === 1) {
                        this.config[counters[j][k][0][0]][counters[j][k][0][1]] = [k + 1];
                        revised = true;
                    }
                }
            }
        }
        return revised;
    }

    hiddenPairProp() {
        let revised = false;
        for (let i = 0; i < DIM * DIM; i++) {
            // counters for rows, cols and blocks
            let counters = this.countPosForEachNum(i);
            for (let c = 0; c < counters.length; c++) {
                let house = counters[c];
                for (let j = 0; j < house.length - 1; j++) {
                    if (house[j].length === 1) continue;
                    for (let k = j + 1; k < house.length; k++) {
                        if (house[k].length === 1) continue;
                        let grids = [];
                        house[j].forEach(pos => {
                            if (!containPos(grids, pos)) grids.push(pos);
                        });
                        house[k].forEach(pos => {
                            if (!containPos(grids, pos)) grids.push(pos);
                        });
                        if (grids.length === 2) {
                            grids.forEach(grid => {
                                this.config[grid[0]][grid[1]] =
                                    this.config[grid[0]][grid[1]].filter(v =>
                                        v === j + 1 || v === k + 1
                                    );
                            });
                            revised = true;
                        }
                    }
                }
            }
        }
        return revised;
    }

    hiddenTripleProp() {
        let revised = false;
        for (let i = 0; i < DIM * DIM; i++) {
            // counters for rows, cols and blocks
            let counters = this.countPosForEachNum(i);
            for (let c = 0; c < counters.length; c++) {
                let house = counters[c];
                for (let j = 0; j < house.length - 2; j++) {
                    if (house[j].length === 1) continue;
                    for (let k = j + 1; k < house.length - 1; k++) {
                        if (house[k].length === 1) continue;
                        for (let l = k + 1; l < house.length; l++) {
                            if (house[l].length === 1) continue;
                            let grids = [];
                            house[j].forEach(pos => {
                                if (!containPos(grids, pos)) grids.push(pos);
                            });
                            house[k].forEach(pos => {
                                if (!containPos(grids, pos)) grids.push(pos);
                            });
                            house[l].forEach(pos => {
                                if (!containPos(grids, pos)) grids.push(pos);
                            });
                            if (grids.length === 3) {
                                grids.forEach(grid => {
                                    this.config[grid[0]][grid[1]] =
                                        this.config[grid[0]][grid[1]].filter(v =>
                                            v === j + 1 || v === k + 1 || v === l + 1
                                        );
                                });
                                revised = true;
                            }
                        }
                    }
                }
            }
        }
        return revised;
    }

    hiddenQuadrupleProp() {
        let revised = false;
        for (let i = 0; i < DIM * DIM; i++) {
            // counters for rows, cols and blocks
            let counters = this.countPosForEachNum(i);
            for (let c = 0; c < counters.length; c++) {
                let house = counters[c];
                for (let j = 0; j < house.length - 3; j++) {
                    if (house[j].length === 1) continue;
                    for (let k = j + 1; k < house.length - 2; k++) {
                        if (house[k].length === 1) continue;
                        for (let l = k + 1; l < house.length - 1; l++) {
                            if (house[l].length === 1) continue;
                            for (let m = l + 1; m < house.length; m++) {
                                if (house[m].length === 1) continue;
                                let grids = [];
                                house[j].forEach(pos => {
                                    if (!containPos(grids, pos)) grids.push(pos);
                                });
                                house[k].forEach(pos => {
                                    if (!containPos(grids, pos)) grids.push(pos);
                                });
                                house[l].forEach(pos => {
                                    if (!containPos(grids, pos)) grids.push(pos);
                                });
                                house[m].forEach(pos => {
                                    if (!containPos(grids, pos)) grids.push(pos);
                                });
                                if (grids.length === 4) {
                                    grids.forEach(grid => {
                                        this.config[grid[0]][grid[1]] =
                                            this.config[grid[0]][grid[1]].filter(v =>
                                                v === j + 1 || v === k + 1 || v === l + 1 || v === m + 1
                                            );
                                    });
                                    revised = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return revised;
    }

    omission() {

    }

}