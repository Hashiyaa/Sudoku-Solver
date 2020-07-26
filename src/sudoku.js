class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    renderTable() {
        const numbers = Array(9).fill(0).map((e, i) => i);
        const w1 = "1px", w2 = "3px", w3 = "5px";
        return numbers.map((row) => {
            return (
                <tr key={row}>
                {
                    numbers.map((col) => {
                        let borderArr = [w1, w1, w1, w1]; // top, right, bottom, left
                        if (row === 0) borderArr[0] = w3;
                        if (row === 3 || row === 6) borderArr[0] = w2;
                        if (row === 8) borderArr[2] = w3;
                        if (col === 0) borderArr[3] = w3;
                        if (col === 3 || col === 6) borderArr[3] = w2;
                        if (col === 8) borderArr[1] = w3;
                        return <td key={col} style={{borderWidth: borderArr.join(" ")}}>
                            <input className="square" type="number" min="1" max="9"
                                onChange={event => this.props.onChange(row, col, Number(event.target.value))}
                                onFocus={() => event.target.type = "number"}
                                onBlur={() => event.target.type = "text"}>
                            </input> 
                        </td>
                    })
                }
                </tr>
            )
        })
    }

    render() {
        return (
            <div> 
            {
                <table>
                    <tbody>
                        {this.renderTable()}
                    </tbody>
                </table>
            }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: Array(9).fill("").map(row => new Array(9).fill(0))
        };
    }
  
    handleChange(i, j, number) {
        // const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // const current = history[history.length - 1];
        const config = this.state.config.slice();
        // if (calculateWinner(squares) || squares[i]) {
        //     return;
        // }
        config[i][j] = number;
        this.setState({
            config: config,
        });
    }
  
    render() {
        // const moves = [1].map((step, move) => {
        //     const desc = move ?
        //         'Go to move #' + move :
        //         'Go to game start';
        //     return (
        //         <li key={move}>
        //             <button onClick={() => this.jumpTo(move)}>{desc}</button>
        //         </li>
        //     );
        // });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        // config={this.state.config}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                    <div className="game-info">
                    <ol>
                        <li key="enter">
                            <p>Enter the puzzle in the grid above.</p>
                        </li>
                        <li key="solve">
                            <p>Click "Solve" to get the answer.</p>
                        </li>
                    </ol>
                    <div>
                        <button onClick={() => {
                            console.log(this.state.config);
                            calculate(this.state.config);
                        }}>
                            Solve
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculate(config) {
    
}
