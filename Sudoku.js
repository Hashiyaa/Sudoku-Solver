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
            config: Array(9).fill(0).map(function (row) {
                return new Array(9).fill(0).map(function (square) {
                    return Array(9).fill(0).map(function (value, i) {
                        return i + 1;
                    });
                });
            }),
            typeConfig: Array(9).fill(0).map(function (row) {
                return new Array(9).fill("unplaced");
            }),
            showPencilMark: false
        };
        return _this;
    }

    _createClass(Game, [{
        key: "handleUpload",
        value: function handleUpload(lib) {
            var typeConfig = this.state.typeConfig.slice();
            var config = lib[0];
            config.forEach(function (row, i) {
                return row.forEach(function (square, j) {
                    if (square.length == 1) typeConfig[i][j] = "given";
                });
            });
            this.setState({
                library: lib,
                config: config,
                typeConfig: typeConfig
            });
            // console.log(this.state.config);
            // console.log(this.state.typeConfig);
        }
    }, {
        key: "handlePencilMark",
        value: function handlePencilMark(event) {
            this.setState({
                showPencilMark: !this.state.showPencilMark
            });
        }
    }, {
        key: "handleChange",
        value: function handleChange(i, j, number) {
            // const history = this.state.history.slice(0, this.state.stepNumber + 1);
            // const current = history[history.length - 1];
            var config = this.state.config.slice();
            var typeConfig = this.state.typeConfig.slice();
            config[i][j] = [number];
            typeConfig[i][j] = "given";
            this.setState({
                config: config,
                typeConfig: typeConfig
            });
        }
    }, {
        key: "handleSolve",
        value: function handleSolve() {
            var _this2 = this;

            var sol = calculate(this.state.config);
            this.setState({
                config: sol
            });
            sol.forEach(function (row, i) {
                row.forEach(function (square, j) {
                    if (square.length == 1 && _this2.state.typeConfig[i][j] == "unplaced") {
                        var typeConfig = _this2.state.typeConfig.slice();
                        console.log(typeConfig);
                        typeConfig[i][j] = "placed";
                        _this2.setState({
                            typeConfig: typeConfig
                        });
                    }
                });
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
                        onChange: this.handlePencilMark.bind(this)
                    })
                ),
                React.createElement(
                    "div",
                    { className: "puzzle" },
                    React.createElement(Board, {
                        config: this.state.config,
                        typeConfig: this.state.typeConfig,
                        showPencilMark: this.state.showPencilMark,
                        onChange: this.handleChange.bind(this)
                    })
                ),
                React.createElement(
                    "div",
                    { className: "update" },
                    React.createElement(
                        "button",
                        { onClick: this.handleSolve.bind(this) },
                        " Solve "
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

        var _this3 = _possibleConstructorReturn(this, (FileInput.__proto__ || Object.getPrototypeOf(FileInput)).call(this, props));

        _this3.handleSubmit = _this3.handleSubmit.bind(_this3);
        _this3.fileInput = React.createRef();
        return _this3;
    }

    _createClass(FileInput, [{
        key: "handleSubmit",
        value: function handleSubmit(event) {
            event.preventDefault();
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
            var _this6 = this;

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
                            React.createElement(Square, {
                                row: row,
                                col: col,
                                value: _this6.props.config[row][col],
                                type: _this6.props.typeConfig[row][col],
                                showPencilMark: _this6.props.showPencilMark,
                                onChange: _this6.props.onChange
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

var Square = function (_React$Component5) {
    _inherits(Square, _React$Component5);

    function Square(props) {
        _classCallCheck(this, Square);

        return _possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).call(this, props));
    }

    _createClass(Square, [{
        key: "renderBlock",
        value: function renderBlock() {
            var _this8 = this;

            var numbers = Array(3).fill(0).map(function (e, i) {
                return i;
            });
            return numbers.map(function (row) {
                return React.createElement(
                    "tr",
                    { key: row },
                    numbers.map(function (col) {
                        var numberStr = "";
                        var number = 3 * row + col + 1;
                        if (_this8.props.value.includes(number)) {
                            numberStr = number.toString();
                        }
                        return React.createElement(
                            "td",
                            { key: col, className: "in-block" },
                            React.createElement(Mark, {
                                value: numberStr
                            })
                        );
                    })
                );
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this9 = this;

            if (this.props.value.length == 1) {
                return React.createElement("input", { className: "square " + this.props.type, type: "text", min: "1", max: "9",
                    value: this.props.value[0],
                    onChange: function onChange(event) {
                        return _this9.props.onChange(_this9.props.row, _this9.props.col, Number(event.target.value));
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
                    { className: "square" },
                    React.createElement(
                        "tbody",
                        null,
                        this.renderBlock()
                    )
                );
            } else {
                return React.createElement("input", { className: "square", type: "text", min: "1", max: "9", value: "",
                    onChange: function onChange(event) {
                        return _this9.props.onChange(_this9.props.row, _this9.props.col, Number(event.target.value));
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

    return Square;
}(React.Component);

var Mark = function (_React$Component6) {
    _inherits(Mark, _React$Component6);

    function Mark(props) {
        _classCallCheck(this, Mark);

        var _this10 = _possibleConstructorReturn(this, (Mark.__proto__ || Object.getPrototypeOf(Mark)).call(this, props));

        _this10.state = {
            isClear: false
        };
        return _this10;
    }

    _createClass(Mark, [{
        key: "handleClick",
        value: function handleClick() {
            var isClear = this.state.isClear;
            this.setState({
                isClear: !isClear
            });
        }
    }, {
        key: "render",
        value: function render() {
            var value = "";
            if (!this.state.isClear) {
                value = this.props.value;
            }
            return React.createElement(
                "button",
                { className: "mark", onClick: this.handleClick.bind(this) },
                value
            );
        }
    }]);

    return Mark;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById('root'));