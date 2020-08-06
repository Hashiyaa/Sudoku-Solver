// @ts-check

const DIM = 3;

function calculate(config) {
    let s = new Solver(config);
    return s.solve();
}

function loadFromLibFile(file) {
    const validCharSet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    let puzzleSet = [];
    let fr = new FileReader();
    fr.onload = function() {
        let lib = fr.result.toString().split("\n");
        lib.forEach(puzzleStr => {
            let config = Array(DIM * DIM).fill(0).map(row => Array(DIM * DIM).fill(0));
            puzzleStr = puzzleStr.trim();
            let length = Math.min(puzzleStr.length, Math.pow(DIM, 4));
            for (let i = 0; i < length; i++) {
                if (!validCharSet.includes(puzzleStr.charAt(i))) {
                    break;
                }
                if (puzzleStr.charAt(i) == '.') {
                    config[Math.floor(i / (DIM * DIM))][i % (DIM * DIM)] = 0;
                } else {
                    config[Math.floor(i / (DIM * DIM))][i % (DIM * DIM)] = Number(puzzleStr.charAt(i));
                }
            }
            puzzleSet.push(config);
        });
    };
    fr.readAsText(file);
    return puzzleSet;
}

function saveToLib() {

}

class Solver {
    constructor(config) {
        this.domain = Array(DIM * DIM).fill(0).map(row => Array(DIM * DIM).fill(0).map(square => Array(DIM * DIM).fill(0).map((square, i) => i + 1)));
        config.forEach((row, i) => {
            row.forEach((square, j) => {
                if (square != 0) this.domain[i][j] = [square];
            });
        });
    }

    solve() {
        let iter = 10;
        while (iter > 0) {
            this.ac3();
            this.hiddenSinglesProp();
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

    // hidden singles
    hiddenSinglesProp() {
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
            
            let revised = false;
            // a house (type) is either a row (0), a column (1), or a block (2)
            counters.forEach((house, type) => {
                house.forEach((count, index) => {
                    if (count < 1) {
                        return;
                    } 
                    if (count == 1) {
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
                            if (pos.length > 0) {
                                this.domain[pos[0]][pos[1]] = [index + 1];
                                revised = true;
                                break;
                            }
                        }
                    } 
                });
            });
        }
    }

    // hiddlen pairs
    // TODO: hidden triplets and hidden quads
    hiddenProp() {
                    // 1st dim: row, column, block
            // 2nd dim: pair, triplet, quad
            let hiddenNums = Array(3).fill(0).map(e => Array(3).fill(0).map(e => Array()));
            let revised = false;
        // else if (count < 5) {
        //     // 0 -> pair, 1 -> triplet, 2-> quad
        //     let comb = count - 2;
        //     for (let k = 0; k < DIM * DIM; k++) {
        //         let pos = [];
        //         if (type == 0) {
        //             if (this.domain[i][k].length > 1 && this.domain[i][k].includes(index + 1)) {
        //                pos = [i, k];
        //             }
        //         } else if (type == 1) {
        //             if (this.domain[k][i].length > 1 && this.domain[k][i].includes(index + 1)) {
        //                 pos = [k, i];
        //             }
        //         } else {
        //             let r = Math.floor(i / DIM) * DIM + Math.floor(k / DIM);
        //             let c = Math.floor(i % DIM) * DIM + Math.floor(k % DIM);
        //             if (this.domain[r][c].length > 1 && this.domain[r][c].includes(index + 1)) {
        //                 pos = [r, c];
        //             }
        //         }
        //         let contained = false;
        //         for (let p = 0; p < hiddenNums[type][comb].length; p++) {
        //             if (hiddenNums[type][comb][p].pos.join() == pos.join()) {
        //                 contained = true;
        //                 if (!hiddenNums[type][comb][p].number.includes(index + 1)) {
        //                     hiddenNums[type][comb][p].number.push(index + 1);
        //                 }
        //                 break;
        //             }
        //         }
        //         if (!contained && pos.length > 0) {
        //             hiddenNums[type][comb].push({pos: pos, number: [index + 1]});
        //         }
        //     }
        // }
        // // update hiddlen pairs, hidden triplets and hidden quads
        // for (let count = 2; count < 5; count++) {
        //     // if (count > 3) continue;
        //     if (revised) {
        //         this.ac3();
        //         revised = false;
        //     }
        //     let comb = count - 2;
        //     if (comb > 0) 
        //         hiddenNums[type][comb] = hiddenNums[type][comb].concat(hiddenNums[type][comb - 1]);
        //     let equalPos = [];
        //     let numSet = [];
        //     let posSet = [];
        //     for (let l = 0; l < hiddenNums[type][comb].length; l++) {
        //         hiddenNums[type][comb][l].number.forEach(n => {
        //             if (!numSet.includes(n)) {
        //                 numSet.push(n);
        //             }
        //         });
                
        //         // for (let k = j + 1; k < hiddenNums[type][comb].length; k++) {
        //         //     if (hiddenNums[type][comb][j].number.length > 1 && 
        //         //         hiddenNums[type][comb][j].number.length <= count && 
        //         //         hiddenNums[type][comb][j].number.join() == hiddenNums[type][comb][k].number.join()) {
        //         //         if (!equalPos.includes(j)) equalPos.push(j);
        //         //         if (!equalPos.includes(k)) equalPos.push(k);
        //         //     }
        //         // }
        //     }
        //     if (count == equalPos.length) {
        //         equalPos.forEach(n => {
        //             let pos = hiddenNums[type][comb][n].pos;
        //             this.domain[pos[0]][pos[1]] = hiddenNums[type][comb][n].number;
        //             revised = true;
        //         });
        //     }
        // }
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