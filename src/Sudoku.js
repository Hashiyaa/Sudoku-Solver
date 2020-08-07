
class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.handleUpload(loadFromLibFile(this.fileInput.current.files[0]));
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Upload file:
                    <input type="file" ref={this.fileInput} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        );
    }
}

class Mark extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClear: false,
        };
    }

    handleClick() {
        let isClear = this.state.isClear
        this.setState({
            isClear: !isClear,
        });
    }

    render() {
        let value = "";
        if (!this.state.isClear) {
            value = this.props.value;
        }
        return (
            <button className="mark" onClick={this.handleClick.bind(this)}> 
                {value}
            </button> 
        );
    }
}

class Square extends React.Component {
    constructor(props) {
        super(props);
    }

    renderBlock() {
        const numbers = Array(3).fill(0).map((e, i) => i);
        return numbers.map((row) => {
            return (
                <tr key={row} >
                {
                    numbers.map((col) => {
                        let number = 3 * row + col;
                        return <td key={col} className="in-block">
                            <Mark
                                value={(row * 3 + col + 1).toString()}
                            /> 
                        </td>
                    })
                }
                </tr>
            )
        })
    }

    render() {
        if (this.props.value.length == 1) {
            return (
                <input className="square {this.props.type}" type="text" min="1" max="9"
                    value={this.props.value[0]}
                    onChange={event => this.props.onChange(this.props.row, this.props.col, Number(event.target.value))}
                    onFocus={() => event.target.type = "number"}
                    onBlur={() => event.target.type = "text"}>
                </input> 
            );
        } else {
            return (
                <table>
                    <tbody>
                        {this.renderBlock()}
                    </tbody>
                </table>
            );
        }
    }
}

class Board extends React.Component {
    renderTable() {
        const numbers = Array(9).fill(0).map((e, i) => i);
        const w1 = "1px", w2 = "3px", w3 = "5px";
        return numbers.map((row) => {
            return (
                <tr key={row}>
                {
                    numbers.map((col) => {
                        let borderArr = [w1, w1, w1, w1]; // top, right, bottom, left
                        if (row == 0) borderArr[0] = w3;
                        if (row == 3 || row == 6) borderArr[0] = w2;
                        if (row == 8) borderArr[2] = w3;
                        if (col == 0) borderArr[3] = w3;
                        if (col == 3 || col == 6) borderArr[3] = w2;
                        if (col == 8) borderArr[1] = w3;
                        return <td key={col} style={{borderWidth: borderArr.join(" ")}}>
                            <Square 
                                row={row}
                                col={col}
                                type={this.props.typeConfig[row][col]}
                                value={this.props.config[row][col]}
                                onChange={this.props.onChange}
                            />
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
                <table>
                    <tbody>
                        {this.renderTable()}
                    </tbody>
                </table>
            </div>
        );
    }
}

class Puzzle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: Array(9).fill(0).map(row => new Array(9).fill(0).map(square =>  Array(9).fill(0).map((value, i) => i + 1))),
            typeConfig: Array(9).fill(0).map(row => new Array(9).fill("unplaced"))
        };
    }
  
    handleChange(i, j, number) {
        // const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // const current = history[history.length - 1];
        const config = this.state.config.slice();
        const typeConfig = this.state.typeConfig.slice();
        config[i][j] = [number];
        typeConfig[i][j] = "given";
        this.setState({
            config: config,
            typeConfig: typeConfig,
        });
    }

    handleSolve() {
        this.setState({
            config: calculate(this.state.config)
        });
        
    }
  
    render() {
        return (
            <div>
                <div className="board">
                    <Board
                        config={this.state.config}
                        typeConfig={this.state.typeConfig}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                <div>
                    <button onClick={this.handleSolve.bind(this)}> Solve </button>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lib: [],
        }
    }

    handleUpload(lib) {
        this.setState({
            lib: lib,
        })
    }

    handlePlay(mode) {
        if (mode == "test") {
            this.state.lib.forEach(puzzle => {
            });
        } else if (mode == "solve") {
        } else {
            console.log("Mode should be either test or solve!")
        }
    }

    render() {
        return (
            <div className="game">
                <div className="info">
                    <ol>
                        <li key="enter">
                            <p>Enter the puzzle in the grid above.</p>
                        </li>
                        <li key="solve">
                            <p>Click "Solve" to get the answer.</p>
                        </li>
                    </ol>
                    <FileInput
                        handleUpload={this.handleUpload.bind(this)}
                    />
                </div>
                <div className="puzzle">
                    <Puzzle/>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
