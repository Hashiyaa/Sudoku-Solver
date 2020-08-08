
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            library: [],
            history: [], 
            configCur: -1,
            config: Array(9).fill(0).map(row => new Array(9).fill(0).map(grid =>  Array(9).fill(0).map((value, i) => i + 1))),
            typeConfig: Array(9).fill(0).map(row => new Array(9).fill("unplaced")),
            playerChanges: [],
            showPencilMark: false,
        }
    }

    updateHisotry(config, typeConfig) {
        let history = this.state.history.slice(0, this.state.configCur + 1);
        history.push({
            config: JSON.parse(JSON.stringify(config)), 
            typeConfig: JSON.parse(JSON.stringify(typeConfig))
        });
        let configCur = this.state.configCur + 1;
        this.setState({
            history: history,
            configCur: configCur,
        });
        
        console.log(history);
        console.log(configCur);
    }

    handleUpload(lib) {
        let config = lib[0].slice();
        let typeConfig = this.state.typeConfig.slice();
        config.forEach((row, i) => 
            row.forEach((grid, j) => {
                if (grid.length == 1) 
                    typeConfig[i][j] = "given"
            })
        );
        this.updateHisotry(config, typeConfig);
        this.setState({
            library: lib,
            config: config,
            typeConfig: typeConfig,
        });
        // console.log(this.state.config);
        // console.log(this.state.typeConfig);
    }

    handleShowPencilMark(event) {
        this.setState({
            showPencilMark: !this.state.showPencilMark,
        });
    }

    handleChangePencilMark(row, col, value, included) {
        let playerChanges = this.state.playerChanges.slice();
        playerChanges.push({row: row, col: col, value: value, included: included});
        this.setState({
            playerChanges: playerChanges,
        });
    }

    handleChange(i, j, number) {
        // const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // const current = history[history.length - 1];
        // const config = this.state.config.slice();
        // const typeConfig = this.state.typeConfig.slice();
        // config[i][j] = [number];
        // typeConfig[i][j] = "given";
        // this.setState({
        //     config: config,
        //     typeConfig: typeConfig,
        // });
    }

    handleUpdate() {
        let config = this.state.config.slice();
        let typeConfig = this.state.typeConfig.slice();
        this.state.playerChanges.forEach(change => {
            if (change.included) {
                let idx = 0;
                for (let i = 0; i < config[change.row][change.col].length; i++) {
                    if (config[change.row][change.col][i] > change.value) {
                        idx = i;
                        break;
                    }
                }
                config[change.row][change.col].splice(idx, 0, change.value);
            } else {
                let idx = config[change.row][change.col].indexOf(change.value)
                config[change.row][change.col].splice(idx, 1);
                if (config[change.row][change.col].length == 1) {
                    typeConfig[change.row][change.col] = "placed";
                }
                if (config[change.row][change.col].length == 0) {
                    alert("Each grid should have at least one number!")
                }
            }
        });
        if (this.state.playerChanges.length > 0)
            this.updateHisotry(config, typeConfig);
        this.setState({
            config: config,
            typeConfig: typeConfig,
            playerChanges: [],
        })
    }

    handleUndo() {
        let configCur = this.state.configCur - 1;
        console.log(configCur);
        this.setState({
            config: JSON.parse(JSON.stringify(this.state.history[configCur].config)),
            typeConfig: JSON.parse(JSON.stringify(this.state.history[configCur].typeConfig)),
            configCur: configCur,
        });
    }

    handleRedo() {
        let configCur = this.state.configCur + 1;
        console.log(configCur);
        this.setState({
            config: JSON.parse(JSON.stringify(this.state.history[configCur].config)),
            typeConfig: JSON.parse(JSON.stringify(this.state.history[configCur].typeConfig)),
            configCur: configCur,
        });
    }
    
    handleSolve(algo) {
        let config = calculate(this.state.config, algo);
        let typeConfig = this.state.typeConfig.slice();
        config.forEach((row, i) => {
            row.forEach((grid, j) => {
                if (grid.length == 1 && this.state.typeConfig[i][j] == "unplaced") {
                    // console.log(typeConfig);
                    typeConfig[i][j] = "placed";
                }
            });
        });
        this.updateHisotry(config, typeConfig);
        this.setState({
            config: config,
            typeConfig: typeConfig,
        });
    }

    handlePlay(mode) {
        if (mode == "test") {
            this.state.library.forEach(puzzle => {
            });
        } else if (mode == "solve") {
        } else {
            console.log("Mode should be either test or solve!")
        }
    }

    render() {
        let buttonDisabled = this.state.configCur < 0;
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
                        onUpload={this.handleUpload.bind(this)}
                    />
                    <Setting
                        onChange={this.handleShowPencilMark.bind(this)}
                    />
                </div>
                <div className="puzzle">
                    <Board
                        config={this.state.config}
                        typeConfig={this.state.typeConfig}
                        showPencilMark={this.state.showPencilMark}
                        onChange={this.handleChange.bind(this)}
                        onPencilMarkChange={this.handleChangePencilMark.bind(this)}
                    />
                </div>
                <div className="update">
                    <button disabled={this.state.configCur < 0} 
                        onClick={this.handleUpdate.bind(this)}> Update </button>
                    <button disabled={this.state.configCur <= 0} 
                        onClick={this.handleUndo.bind(this)}> Undo </button>
                    <button disabled={this.state.configCur < 0 || this.state.configCur >= this.state.history.length - 1} 
                        onClick={this.handleRedo.bind(this)}> Redo </button><br/>
                    <button disabled={this.state.configCur < 0} 
                        onClick={() => this.handleSolve("naked_single")}> Naked Single </button>
                    <button disabled={this.state.configCur < 0} 
                        onClick={() => this.handleSolve("hidden_single")}> Hidden Single </button>
                </div>
            </div>
        );
    }
}

class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.fileInput.current.files[0]) return;
        let onUpload = this.props.onUpload;
        const validCharSet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
        let fr = new FileReader();
        fr.onload = function() {
            let puzzleSet = [];
            let lib = fr.result.toString().split("\n");
            lib.forEach(puzzleStr => {
                let config = Array(DIM * DIM).fill(0).map(row => Array(DIM * DIM).fill(0));
                puzzleStr = puzzleStr.trim();
                let length = Math.min(puzzleStr.length, Math.pow(DIM, 4));
                for (let i = 0; i < length; i++) {
                    if (!validCharSet.includes(puzzleStr.charAt(i))) {
                        break;
                    }
                    if (puzzleStr.charAt(i) == '.' || puzzleStr.charAt(i) == '0') {
                        config[Math.floor(i / (DIM * DIM))][i % (DIM * DIM)] = Array(9).fill(0).map((e, i) => i + 1);
                    } else {
                        config[Math.floor(i / (DIM * DIM))][i % (DIM * DIM)] = [Number(puzzleStr.charAt(i))];
                    }
                }
                puzzleSet.push(config);
            });
            onUpload(puzzleSet);
        };
        fr.readAsText(this.fileInput.current.files[0]);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Upload file:
                    <input type="file" ref={this.fileInput} />
                </label>
                <button type="submit">Submit</button>
            </form>
        );
    }
}

class Setting extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form>
                <input type="checkbox" id="showMark" onChange={this.props.onChange}/>
                <label> Show pencial marks </label>
            </form>
        );
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
                            <Grid 
                                row={row}
                                col={col}
                                values={this.props.config[row][col]}
                                type={this.props.typeConfig[row][col]}
                                showPencilMark={this.props.showPencilMark}
                                onChange={this.props.onChange}
                                onPencilMarkChange={this.props.onPencilMarkChange}
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

class Grid extends React.Component {
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
                        let value = 3 * row + col + 1;
                        return <td key={col} className="in-block">
                            <Mark
                                row={this.props.row}
                                col={this.props.col}
                                value={value}
                                included={this.props.values.includes(value)}
                                onChange={this.props.onPencilMarkChange}
                            /> 
                        </td>
                    })
                }
                </tr>
            )
        })
    }

    render() {
        if (this.props.values.length == 1) {
            return (
                <input className={"grid " + this.props.type} type="text" min="1" max="9"
                    value={this.props.values[0]}
                    onChange={event => this.props.onChange(this.props.row, this.props.col, Number(event.target.value))}
                    onFocus={() => event.target.type = "number"}
                    onBlur={() => event.target.type = "text"}>
                </input> 
            );
        } else if (this.props.showPencilMark) {
            return (
                <table className="grid">
                    <tbody>
                        {this.renderBlock()}
                    </tbody>
                </table>
            );
        } else {
            return (
                <input className="grid" type="text" min="1" max="9" value=""
                    onChange={event => this.props.onChange(this.props.row, this.props.col, Number(event.target.value))}
                    onFocus={() => event.target.type = "number"}
                    onBlur={() => event.target.type = "text"}
                /> 
            );
        }
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
        let isClear = !this.state.isClear;
        this.props.onChange(this.props.row, this.props.col, this.props.value, 
            this.props.included && !isClear);
        this.setState({
            isClear: isClear,
        });
    }

    render() {
        let value = "";
        let disabled = true;
        if (this.props.included) {
            disabled = false;
            if (!this.state.isClear)
                value = this.props.value.toString();
        }
        return (
            <button className="mark" disabled={disabled} 
                onClick={this.handleClick.bind(this)}> {value}
            </button> 
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
