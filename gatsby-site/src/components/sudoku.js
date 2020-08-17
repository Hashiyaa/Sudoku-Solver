import React, { useState } from "react"
import calculate from "./solver"
import Board from "./board"
import Library from "./library"

const Game = () => {
    const [library, setLibrary] = useState([]);
    const [history, setHistory] = useState([]);
    const [configCur, setConfigCur] = useState(-1);
    const [config, setConfig] = useState(Array(9).fill(0).map(row => new Array(9).fill(0).map(grid =>  Array(9).fill(0).map((value, i) => i + 1))));
    const [typeConfig, setTypeConfig] = useState(Array(9).fill(0).map(row => new Array(9).fill("unplaced")));
    const [playerChanges, setPlayerChanges] = useState([]);
    const [showPencilMark, setShowPencilMark] = useState(false);

    const updateHisotry = (config_new, typeConfig_new) => {
        let history_slice = history.slice(0, configCur + 1);
        history_slice.push({
            config: JSON.parse(JSON.stringify(config_new)), 
            typeConfig: JSON.parse(JSON.stringify(typeConfig_new)),
        });
        setHistory(history_slice);
        setConfigCur(configCur + 1);
        
        console.log(history);
        console.log(configCur);
    }

    const handleUpload = (lib) => {
        let config_in = lib[0].slice();
        let typeConfig_slice = typeConfig.slice();
        config_in.forEach((row, i) => 
            row.forEach((grid, j) => {
                if (grid.length === 1) 
                    typeConfig_slice[i][j] = "given"
            })
        );
        if (configCur >= 0) {
            alert("Be careful that uploading new puzzles will overwrite the editing history of the current puzzle!")
        }
        setLibrary(lib);
        setConfig(config_in);
        setTypeConfig(typeConfig_slice);
        setConfigCur(-1);
        
        updateHisotry(config, typeConfig);
        // console.log(config);
        // console.log(typeConfig);
    }

    const handleShowPencilMark = () => {
        setShowPencilMark(!showPencilMark);
    }

    const handleChangePencilMark = (row, col, value, included) => {
        let playerChanges_slice = playerChanges.slice();
        playerChanges_slice.push({row: row, col: col, value: value, included: included});
        setPlayerChanges(playerChanges_slice);
    }

    const handleUpdate = () => {
        let config_slice = config.slice();
        let typeConfig_slice = typeConfig.slice();
        playerChanges.forEach(change => {
            if (change.included) {
                let idx = 0;
                for (let i = 0; i < config_slice[change.row][change.col].length; i++) {
                    if (config_slice[change.row][change.col][i] > change.value) {
                        idx = i;
                        break;
                    }
                }
                config_slice[change.row][change.col].splice(idx, 0, change.value);
            } else {
                let idx = config_slice[change.row][change.col].indexOf(change.value)
                config_slice[change.row][change.col].splice(idx, 1);
                if (config_slice[change.row][change.col].length === 1) {
                    typeConfig_slice[change.row][change.col] = "placed";
                }
                if (config_slice[change.row][change.col].length === 0) {
                    alert("Each grid should have at least one number!")
                }
            }
        });
        if (playerChanges.length > 0)
            updateHisotry(config_slice, typeConfig_slice);
        setConfig(config_slice);
        setTypeConfig(typeConfig_slice);
        setPlayerChanges([]);
    }

    const handleUndo = () => {
        setConfig(JSON.parse(JSON.stringify(history[configCur].config)));
        setTypeConfig(JSON.parse(JSON.stringify(history[configCur].typeConfig)));
        setConfigCur(configCur - 1);
    }

    const handleRedo = () => {
        setConfig(JSON.parse(JSON.stringify(history[configCur].config)));
        setTypeConfig(JSON.parse(JSON.stringify(history[configCur].typeConfig)));
        setConfigCur(configCur + 1);
    }
    
    const handleSolve = (algo) => {
        let sol = calculate(config, algo);
        let typeConfig_slice = typeConfig.slice();
        sol.forEach((row, i) => {
            row.forEach((grid, j) => {
                if (grid.length === 1 && typeConfig_slice[i][j] === "unplaced") {
                    // console.log(typeConfig);
                    typeConfig_slice[i][j] = "placed";
                }
            });
        });
        this.updateHisotry(sol, typeConfig_slice);
        setConfig(sol);
        setTypeConfig(typeConfig_slice);
    }

    return (
        <div className="game">
            <div className="library">
                <Library
                    onUpload={() => handleUpload()}
                />
            </div>
            <div className="puzzle">
                <Board
                    config={config}
                    typeConfig={typeConfig}
                    showPencilMark={showPencilMark}
                    onPencilMarkChange={() => handleChangePencilMark()}
                />
                <Setting
                    onChange={() => handleShowPencilMark()}
                />
            </div>
            <div className="update">
                <button disabled={configCur < 0} 
                    onClick={() => handleUpdate()}> Update </button>
                <button disabled={configCur <= 0} 
                    onClick={() => handleUndo()}> Undo </button>
                <button disabled={configCur < 0 || configCur >= history.length - 1} 
                    onClick={() => handleRedo()}> Redo </button><br/>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("test")}> Test </button><br/>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("naked_single")}> Naked Single </button>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("naked_pair")}> Naked Pair </button>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("naked_triple")}> Naked Triple </button>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("naked_quadruple")}> Naked Quadruple </button><br/>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("hidden_single")}> Hidden Single </button>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("hidden_pair")}> Hidden Pair </button>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("hidden_triple")}> Hidden Triple </button>
                <button disabled={configCur < 0} 
                    onClick={() => handleSolve("hidden_quadruple")}> Hidden Quadruple </button>
            </div>
        </div>
    );
}

const Setting = (props) => {
    return (
        <form>
            <input type="checkbox" id="showMark" onChange={props.onChange}/>
            <label htmlFor="showMark"> Show pencial marks </label>
        </form>
    );
}

export default Game;