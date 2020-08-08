var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Game = function (_React$Component) {
    _inherits(Game, _React$Component);

    function Game(props) {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

        _this.state = {
            library: [],
            history: [],
            configCur: -1,
            config: Array(9).fill(0).map(function (row) {
                return new Array(9).fill(0).map(function (grid) {
                    return Array(9).fill(0).map(function (value, i) {
                        return i + 1;
                    });
                });
            }),
            typeConfig: Array(9).fill(0).map(function (row) {
                return new Array(9).fill("unplaced");
            }),
            playerChanges: [],
            showPencilMark: false
        };
        return _this;
    }

    _createClass(Game, [{
        key: "updateHisotry",
        value: function updateHisotry(config, typeConfig) {
            var history = this.state.history.slice(0, this.state.configCur + 1);
            history.push({
                config: JSON.parse(JSON.stringify(config)),
                typeConfig: JSON.parse(JSON.stringify(typeConfig))
            });
            var configCur = this.state.configCur + 1;
            this.setState({
                history: history,
                configCur: configCur
            });

            console.log(history);
            console.log(configCur);
        }
    }, {
        key: "handleUpload",
        value: function handleUpload(lib) {
            var config = lib[0].slice();
            var typeConfig = this.state.typeConfig.slice();
            config.forEach(function (row, i) {
                return row.forEach(function (grid, j) {
                    if (grid.length == 1) typeConfig[i][j] = "given";
                });
            });
            this.updateHisotry(config, typeConfig);
            this.setState({
                library: lib,
                config: config,
                typeConfig: typeConfig
            });
            // console.log(this.state.config);
            // console.log(this.state.typeConfig);
        }
    }, {
        key: "handleShowPencilMark",
        value: function handleShowPencilMark(event) {
            this.setState({
                showPencilMark: !this.state.showPencilMark
            });
        }
    }, {
        key: "handleChangePencilMark",
        value: function handleChangePencilMark(row, col, value, included) {
            var playerChanges = this.state.playerChanges.slice();
            playerChanges.push({ row: row, col: col, value: value, included: included });
            this.setState({
                playerChanges: playerChanges
            });
        }
    }, {
        key: "handleChange",
        value: function handleChange(i, j, number) {
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
    }, {
        key: "handleUpdate",
        value: function handleUpdate() {
            var config = this.state.config.slice();
            var typeConfig = this.state.typeConfig.slice();
            this.state.playerChanges.forEach(function (change) {
                if (change.included) {
                    var idx = 0;
                    for (var i = 0; i < config[change.row][change.col].length; i++) {
                        if (config[change.row][change.col][i] > change.value) {
                            idx = i;
                            break;
                        }
                    }
                    config[change.row][change.col].splice(idx, 0, change.value);
                } else {
                    var _idx = config[change.row][change.col].indexOf(change.value);
                    config[change.row][change.col].splice(_idx, 1);
                    if (config[change.row][change.col].length == 1) {
                        typeConfig[change.row][change.col] = "placed";
                    }
                    if (config[change.row][change.col].length == 0) {
                        alert("Each grid should have at least one number!");
                    }
                }
            });
            if (this.state.playerChanges.length > 0) this.updateHisotry(config, typeConfig);
            this.setState({
                config: config,
                typeConfig: typeConfig,
                playerChanges: []
            });
        }
    }, {
        key: "handleUndo",
        value: function handleUndo() {
            var configCur = this.state.configCur - 1;
            console.log(configCur);
            this.setState({
                config: JSON.parse(JSON.stringify(this.state.history[configCur].config)),
                typeConfig: JSON.parse(JSON.stringify(this.state.history[configCur].typeConfig)),
                configCur: configCur
            });
        }
    }, {
        key: "handleRedo",
        value: function handleRedo() {
            var configCur = this.state.configCur + 1;
            console.log(configCur);
            this.setState({
                config: JSON.parse(JSON.stringify(this.state.history[configCur].config)),
                typeConfig: JSON.parse(JSON.stringify(this.state.history[configCur].typeConfig)),
                configCur: configCur
            });
        }
    }, {
        key: "handleSolve",
        value: function handleSolve(algo) {
            var _this2 = this;

            var config = calculate(this.state.config, algo);
            var typeConfig = this.state.typeConfig.slice();
            config.forEach(function (row, i) {
                row.forEach(function (grid, j) {
                    if (grid.length == 1 && _this2.state.typeConfig[i][j] == "unplaced") {
                        // console.log(typeConfig);
                        typeConfig[i][j] = "placed";
                    }
                });
            });
            this.updateHisotry(config, typeConfig);
            this.setState({
                config: config,
                typeConfig: typeConfig
            });
        }
    }, {
        key: "handlePlay",
        value: function handlePlay(mode) {
            if (mode == "test") {
                this.state.library.forEach(function (puzzle) {});
            } else if (mode == "solve") {} else {
                console.log("Mode should be either test or solve!");
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var buttonDisabled = this.state.configCur < 0;
            return React.createElement(
                "div",
                { className: "game" },
                React.createElement(
                    "div",
                    { className: "info" },
                    React.createElement(
                        "ol",
                        null,
                        React.createElement(
                            "li",
                            { key: "enter" },
                            React.createElement(
                                "p",
                                null,
                                "Enter the puzzle in the grid above."
                            )
                        ),
                        React.createElement(
                            "li",
                            { key: "solve" },
                            React.createElement(
                                "p",
                                null,
                                "Click \"Solve\" to get the answer."
                            )
                        )
                    ),
                    React.createElement(FileInput, {
                        onUpload: this.handleUpload.bind(this)
                    }),
                    React.createElement(Setting, {
                        onChange: this.handleShowPencilMark.bind(this)
                    })
                ),
                React.createElement(
                    "div",
                    { className: "puzzle" },
                    React.createElement(Board, {
                        config: this.state.config,
                        typeConfig: this.state.typeConfig,
                        showPencilMark: this.state.showPencilMark,
                        onChange: this.handleChange.bind(this),
                        onPencilMarkChange: this.handleChangePencilMark.bind(this)
                    })
                ),
                React.createElement(
                    "div",
                    { className: "update" },
                    React.createElement(
                        "button",
                        { disabled: this.state.configCur < 0,
                            onClick: this.handleUpdate.bind(this) },
                        " Update "
                    ),
                    React.createElement(
                        "button",
                        { disabled: this.state.configCur <= 0,
                            onClick: this.handleUndo.bind(this) },
                        " Undo "
                    ),
                    React.createElement(
                        "button",
                        { disabled: this.state.configCur < 0 || this.state.configCur >= this.state.history.length - 1,
                            onClick: this.handleRedo.bind(this) },
                        " Redo "
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "button",
                        { disabled: this.state.configCur < 0,
                            onClick: function onClick() {
                                return _this3.handleSolve("naked_single");
                            } },
                        " Naked Single "
                    ),
                    React.createElement(
                        "button",
                        { disabled: this.state.configCur < 0,
                            onClick: function onClick() {
                                return _this3.handleSolve("hidden_single");
                            } },
                        " Hidden Single "
                    )
                )
            );
        }
    }]);

    return Game;
}(React.Component);

var FileInput = function (_React$Component2) {
    _inherits(FileInput, _React$Component2);

    function FileInput(props) {
        _classCallCheck(this, FileInput);

        var _this4 = _possibleConstructorReturn(this, (FileInput.__proto__ || Object.getPrototypeOf(FileInput)).call(this, props));

        _this4.handleSubmit = _this4.handleSubmit.bind(_this4);
        _this4.fileInput = React.createRef();
        return _this4;
    }

    _createClass(FileInput, [{
        key: "handleSubmit",
        value: function handleSubmit(event) {
            event.preventDefault();
            if (!this.fileInput.current.files[0]) return;
            var onUpload = this.props.onUpload;
            var validCharSet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
            var fr = new FileReader();
            fr.onload = function () {
                var puzzleSet = [];
                var lib = fr.result.toString().split("\n");
                lib.forEach(function (puzzleStr) {
                    var config = Array(DIM * DIM).fill(0).map(function (row) {
                        return Array(DIM * DIM).fill(0);
                    });
                    puzzleStr = puzzleStr.trim();
                    var length = Math.min(puzzleStr.length, Math.pow(DIM, 4));
                    for (var i = 0; i < length; i++) {
                        if (!validCharSet.includes(puzzleStr.charAt(i))) {
                            break;
                        }
                        if (puzzleStr.charAt(i) == '.' || puzzleStr.charAt(i) == '0') {
                            config[Math.floor(i / (DIM * DIM))][i % (DIM * DIM)] = Array(9).fill(0).map(function (e, i) {
                                return i + 1;
                            });
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
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "form",
                { onSubmit: this.handleSubmit },
                React.createElement(
                    "label",
                    null,
                    "Upload file:",
                    React.createElement("input", { type: "file", ref: this.fileInput })
                ),
                React.createElement(
                    "button",
                    { type: "submit" },
                    "Submit"
                )
            );
        }
    }]);

    return FileInput;
}(React.Component);

var Setting = function (_React$Component3) {
    _inherits(Setting, _React$Component3);

    function Setting(props) {
        _classCallCheck(this, Setting);

        return _possibleConstructorReturn(this, (Setting.__proto__ || Object.getPrototypeOf(Setting)).call(this, props));
    }

    _createClass(Setting, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "form",
                null,
                React.createElement("input", { type: "checkbox", id: "showMark", onChange: this.props.onChange }),
                React.createElement(
                    "label",
                    null,
                    " Show pencial marks "
                )
            );
        }
    }]);

    return Setting;
}(React.Component);

var Board = function (_React$Component4) {
    _inherits(Board, _React$Component4);

    function Board() {
        _classCallCheck(this, Board);

        return _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).apply(this, arguments));
    }

    _createClass(Board, [{
        key: "renderTable",
        value: function renderTable() {
            var _this7 = this;

            var numbers = Array(9).fill(0).map(function (e, i) {
                return i;
            });
            var w1 = "1px",
                w2 = "3px",
                w3 = "5px";
            return numbers.map(function (row) {
                return React.createElement(
                    "tr",
                    { key: row },
                    numbers.map(function (col) {
                        var borderArr = [w1, w1, w1, w1]; // top, right, bottom, left
                        if (row == 0) borderArr[0] = w3;
                        if (row == 3 || row == 6) borderArr[0] = w2;
                        if (row == 8) borderArr[2] = w3;
                        if (col == 0) borderArr[3] = w3;
                        if (col == 3 || col == 6) borderArr[3] = w2;
                        if (col == 8) borderArr[1] = w3;
                        return React.createElement(
                            "td",
                            { key: col, style: { borderWidth: borderArr.join(" ") } },
                            React.createElement(Grid, {
                                row: row,
                                col: col,
                                values: _this7.props.config[row][col],
                                type: _this7.props.typeConfig[row][col],
                                showPencilMark: _this7.props.showPencilMark,
                                onChange: _this7.props.onChange,
                                onPencilMarkChange: _this7.props.onPencilMarkChange
                            })
                        );
                    })
                );
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "table",
                    null,
                    React.createElement(
                        "tbody",
                        null,
                        this.renderTable()
                    )
                )
            );
        }
    }]);

    return Board;
}(React.Component);

var Grid = function (_React$Component5) {
    _inherits(Grid, _React$Component5);

    function Grid(props) {
        _classCallCheck(this, Grid);

        return _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props));
    }

    _createClass(Grid, [{
        key: "renderBlock",
        value: function renderBlock() {
            var _this9 = this;

            var numbers = Array(3).fill(0).map(function (e, i) {
                return i;
            });
            return numbers.map(function (row) {
                return React.createElement(
                    "tr",
                    { key: row },
                    numbers.map(function (col) {
                        var value = 3 * row + col + 1;
                        return React.createElement(
                            "td",
                            { key: col, className: "in-block" },
                            React.createElement(Mark, {
                                row: _this9.props.row,
                                col: _this9.props.col,
                                value: value,
                                included: _this9.props.values.includes(value),
                                onChange: _this9.props.onPencilMarkChange
                            })
                        );
                    })
                );
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this10 = this;

            if (this.props.values.length == 1) {
                return React.createElement("input", { className: "grid " + this.props.type, type: "text", min: "1", max: "9",
                    value: this.props.values[0],
                    onChange: function onChange(event) {
                        return _this10.props.onChange(_this10.props.row, _this10.props.col, Number(event.target.value));
                    },
                    onFocus: function onFocus() {
                        return event.target.type = "number";
                    },
                    onBlur: function onBlur() {
                        return event.target.type = "text";
                    } });
            } else if (this.props.showPencilMark) {
                return React.createElement(
                    "table",
                    { className: "grid" },
                    React.createElement(
                        "tbody",
                        null,
                        this.renderBlock()
                    )
                );
            } else {
                return React.createElement("input", { className: "grid", type: "text", min: "1", max: "9", value: "",
                    onChange: function onChange(event) {
                        return _this10.props.onChange(_this10.props.row, _this10.props.col, Number(event.target.value));
                    },
                    onFocus: function onFocus() {
                        return event.target.type = "number";
                    },
                    onBlur: function onBlur() {
                        return event.target.type = "text";
                    }
                });
            }
        }
    }]);

    return Grid;
}(React.Component);

var Mark = function (_React$Component6) {
    _inherits(Mark, _React$Component6);

    function Mark(props) {
        _classCallCheck(this, Mark);

        var _this11 = _possibleConstructorReturn(this, (Mark.__proto__ || Object.getPrototypeOf(Mark)).call(this, props));

        _this11.state = {
            isClear: false
        };
        return _this11;
    }

    _createClass(Mark, [{
        key: "handleClick",
        value: function handleClick() {
            var isClear = !this.state.isClear;
            this.props.onChange(this.props.row, this.props.col, this.props.value, this.props.included && !isClear);
            this.setState({
                isClear: isClear
            });
        }
    }, {
        key: "render",
        value: function render() {
            var value = "";
            var disabled = true;
            if (this.props.included) {
                disabled = false;
                if (!this.state.isClear) value = this.props.value.toString();
            }
            return React.createElement(
                "button",
                { className: "mark", disabled: disabled,
                    onClick: this.handleClick.bind(this) },
                " ",
                value
            );
        }
    }]);

    return Mark;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById('root'));