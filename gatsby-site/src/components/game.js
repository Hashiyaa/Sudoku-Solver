import React, { useState } from "react"
import Puzzle from "../components/puzzle"
// import Library from "../components/library"

const Game = () => {
    const [showPencilMark, setShowPencilMark] = useState(false);

    const handleShowPencilMark = () => {
        setShowPencilMark(!showPencilMark);
    }

    return (
        <div className="game">
            <Puzzle
                showPencilMark={showPencilMark}
            />
            <Settings
                 onChange={() => handleShowPencilMark()}
            />
        </div>
    );
}


const Settings = (props) => {
    return (
        <form>
            <input type="checkbox" id="showMark" onChange={props.onChange}/>
            <label htmlFor="showMark"> Show pencial marks </label>
        </form>
    );
}


export default Game;