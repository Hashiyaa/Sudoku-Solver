var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileInput = function (_React$Component) {
    _inherits(FileInput, _React$Component);

    function FileInput(props) {
        _classCallCheck(this, FileInput);

        var _this = _possibleConstructorReturn(this, (FileInput.__proto__ || Object.getPrototypeOf(FileInput)).call(this, props));

        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.fileInput = React.createRef();
        return _this;
    }

    _createClass(FileInput, [{
        key: "handleSubmit",
        value: function handleSubmit(event) {
            event.preventDefault();
            this.props.handleUpload(loadFromLibFile(this.fileInput.current.files[0]));
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
                React.createElement("br", null),
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

var Mark = function (_React$Component2) {
    _inherits(Mark, _React$Component2);

    function Mark(props) {
        _classCallCheck(this, Mark);

        var _this2 = _possibleConstructorReturn(this, (Mark.__proto__ || Object.getPrototypeOf(Mark)).call(this, props));

        _this2.state = {
            isClear: false
        };
        return _this2;
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

var Square = function (_React$Component3) {
    _inherits(Square, _React$Component3);

    function Square(props) {
        _classCallCheck(this, Square);

        return _possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).call(this, props));
    }

    _createClass(Square, [{
        key: "renderBlock",
        value: function renderBlock() {
            var numbers = Array(3).fill(0).map(function (e, i) {
                return i;
            });
            return numbers.map(function (row) {
                return React.createElement(
                    "tr",
                    { key: row },
                    numbers.map(function (col) {
                        var number = 3 * row + col;
                        return React.createElement(
                            "td",
                            { key: col, className: "in-block" },
                            React.createElement(Mark, {
                                value: (row * 3 + col + 1).toString()
                            })
                        );
                    })
                );
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            if (this.props.value.length == 1) {
                return React.createElement("input", { className: "square {this.props.type}", type: "text", min: "1", max: "9",
                    value: this.props.value[0],
                    onChange: function onChange(event) {
                        return _this4.props.onChange(_this4.props.row, _this4.props.col, Number(event.target.value));
                    },
                    onFocus: function onFocus() {
                        return event.target.type = "number";
                    },
                    onBlur: function onBlur() {
                        return event.target.type = "text";
                    } });
            } else {
                return React.createElement(
                    "table",
                    null,
                    React.createElement(
                        "tbody",
                        null,
                        this.renderBlock()
                    )
                );
            }
        }
    }]);

    return Square;
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
                                type: _this6.props.typeConfig[row][col],
                                value: _this6.props.config[row][col],
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

var Puzzle = function (_React$Component5) {
    _inherits(Puzzle, _React$Component5);

    function Puzzle(props) {
        _classCallCheck(this, Puzzle);

        var _this7 = _possibleConstructorReturn(this, (Puzzle.__proto__ || Object.getPrototypeOf(Puzzle)).call(this, props));

        _this7.state = {
            config: Array(9).fill(0).map(function (row) {
                return new Array(9).fill(0).map(function (square) {
                    return Array(9).fill(0).map(function (value, i) {
                        return i + 1;
                    });
                });
            }),
            typeConfig: Array(9).fill(0).map(function (row) {
                return new Array(9).fill("unplaced");
            })
        };
        return _this7;
    }

    _createClass(Puzzle, [{
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
            this.setState({
                config: calculate(this.state.config)
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "board" },
                    React.createElement(Board, {
                        config: this.state.config,
                        typeConfig: this.state.typeConfig,
                        onChange: this.handleChange.bind(this)
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "button",
                        { onClick: this.handleSolve.bind(this) },
                        " Solve "
                    )
                )
            );
        }
    }]);

    return Puzzle;
}(React.Component);

var Game = function (_React$Component6) {
    _inherits(Game, _React$Component6);

    function Game(props) {
        _classCallCheck(this, Game);

        var _this8 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

        _this8.state = {
            lib: []
        };
        return _this8;
    }

    _createClass(Game, [{
        key: "handleUpload",
        value: function handleUpload(lib) {
            this.setState({
                lib: lib
            });
        }
    }, {
        key: "handlePlay",
        value: function handlePlay(mode) {
            if (mode == "test") {
                this.state.lib.forEach(function (puzzle) {});
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
                        handleUpload: this.handleUpload.bind(this)
                    })
                ),
                React.createElement(
                    "div",
                    { className: "puzzle" },
                    React.createElement(Puzzle, null)
                )
            );
        }
    }]);

    return Game;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById('root'));