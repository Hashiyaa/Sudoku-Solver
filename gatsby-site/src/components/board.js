import React, { useState } from "react"

const Board = (props) => {
    const renderTable = () => {
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
                            <Grid 
                                row={row}
                                col={col}
                                values={props.config[row][col]}
                                type={props.typeConfig[row][col]}
                                showPencilMark={props.showPencilMark}
                                onChange={props.onChange}
                                onPencilMarkChange={props.onPencilMarkChange}
                            />
                        </td>
                    })
                }
                </tr>
            )
        })
    }

    return (
        <div> 
            <table>
                <tbody>
                    {renderTable()}
                </tbody>
            </table>
        </div>
    );
}

const Grid = (props) => {
    const renderBlock = () => {
        const numbers = Array(3).fill(0).map((e, i) => i);
        return numbers.map((row) => {
            return (
                <tr key={row} >
                {
                    numbers.map((col) => {
                        let value = 3 * row + col + 1;
                        return <td key={col} className="in-block">
                            <Mark
                                row={props.row}
                                col={props.col}
                                value={value}
                                included={props.values.includes(value)}
                                onChange={props.onPencilMarkChange}
                            /> 
                        </td>
                    })
                }
                </tr>
            )
        })
    }

    if (props.values.length === 1) {
        return (
            <input className={"grid " + props.type} type="text" min="1" max="9"
                value={props.values[0]}
                onChange={event => props.onChange(props.row, props.col, Number(event.target.value))}
                onFocus={event => event.target.type = "number"}
                onBlur={event => event.target.type = "text"}>
            </input> 
        );
    } else if (props.showPencilMark) {
        return (
            <table className="grid">
                <tbody>
                    {renderBlock()}
                </tbody>
            </table>
        );
    } else {
        return (
            <input className="grid" type="text" min="1" max="9" value=""
                onChange={event => props.onChange(props.row, props.col, Number(event.target.value))}
                onFocus={event => event.target.type = "number"}
                onBlur={event => event.target.type = "text"}
            /> 
        );
    }
}

const Mark = (props) => {
    const [isClear, setIsClear] = useState(false);

    const handleClick = () => {
        setIsClear(!isClear);
        props.onChange(props.row, props.col, props.value, props.included && !isClear);
    }

    let value = "";
    let disabled = true;
    if (props.included) {
        disabled = false;
        if (!isClear)
            value = props.value.toString();
    }
    return (
        <button className="mark" disabled={disabled} onClick={() => handleClick()}> 
            {value}
        </button> 
    );
}

export default Board;