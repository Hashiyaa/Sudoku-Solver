import React, { useState } from "react"

const DIM = 3;

const Library = (props) => {
    return (
        <div>
            <List
                size={props.size}
                onSelectPuzzle={props.onSelectPuzzle}
            />
            <FileInput
                onUpload={props.onUpload}
            />
        </div>
    );
}

const List = (props) => {
    const [pageNum, setPageNum] = useState(0);

    const height = 5;
    const width = 3;
    
    const renderList = () => {
        const rows = Array(height).fill(0).map((e, i) => i);
        const cols = Array(width).fill(0).map((e, i) => i);
        return rows.map(row => {
            return (
                <tr key={row}>
                {
                    cols.map((col) => {
                        let index = pageNum * width * height + row * width + col;
                        if (index < props.size) {
                            return <td key={col}>
                                <button value={index} onClick={event => props.onSelectPuzzle(event.target.value)}>
                                    {index}
                                </button>
                            </td>
                        } else {
                            return null;
                        }
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
                    {renderList()}
                </tbody>
            </table>
            <button disabled={pageNum <= 0} onClick={() => setPageNum(pageNum - 1)}>
                Previous
            </button>
            <button disabled={pageNum >= Math.floor(props.size / (height * width))} onClick={() => setPageNum(pageNum + 1)}>
                Next
            </button>
        </div>
    );
}

const FileInput = (props) => {
    let fileInput = React.createRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!fileInput.current.files[0]) return;
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
                    if (puzzleStr.charAt(i) === '.' || puzzleStr.charAt(i) === '0') {
                        config[Math.floor(i / (DIM * DIM))][i % (DIM * DIM)] = Array(9).fill(0).map((e, i) => i + 1);
                    } else {
                        config[Math.floor(i / (DIM * DIM))][i % (DIM * DIM)] = [Number(puzzleStr.charAt(i))];
                    }
                }
                puzzleSet.push(config);
            });
            props.onUpload(puzzleSet);
        };
        fr.readAsText(fileInput.current.files[0]);
    }

    return (
        <form onSubmit={event => handleSubmit(event)}>
            <label>
                Upload file:
                <input type="file" ref={fileInput} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default Library;