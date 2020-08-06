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

var Board = function (_React$Component2) {
    _inherits(Board, _React$Component2);

    function Board() {
        _classCallCheck(this, Board);

        return _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).apply(this, arguments));
    }

    _createClass(Board, [{
        key: "renderTable",
        value: function renderTable() {
            var _this3 = this;

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
                        if (row === 0) borderArr[0] = w3;
                        if (row === 3 || row === 6) borderArr[0] = w2;
                        if (row === 8) borderArr[2] = w3;
                        if (col === 0) borderArr[3] = w3;
                        if (col === 3 || col === 6) borderArr[3] = w2;
                        if (col === 8) borderArr[1] = w3;
                        return React.createElement(
                            "td",
                            { key: col, style: { borderWidth: borderArr.join(" ") } },
                            React.createElement("input", { className: "square", type: "text", min: "1", max: "9",
                                value: _this3.props.config[row][col] > 0 ? _this3.props.config[row][col] : "",
                                onChange: function onChange(event) {
                                    return _this3.props.onChange(row, col, Number(event.target.value));
                                },
                                onFocus: function onFocus() {
                                    return event.target.type = "number";
                                },
                                onBlur: function onBlur() {
                                    return event.target.type = "text";
                                } })
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

var Game = function (_React$Component3) {
    _inherits(Game, _React$Component3);

    function Game(props) {
        _classCallCheck(this, Game);

        var _this4 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

        _this4.state = {
            lib: [],
            config: Array(9).fill(0).map(function (row) {
                return new Array(9).fill(0);
            })
        };
        return _this4;
    }

    _createClass(Game, [{
        key: "handleUpload",
        value: function handleUpload(lib) {
            this.setState({
                lib: lib
            });
        }
    }, {
        key: "handleChange",
        value: function handleChange(i, j, number) {
            // const history = this.state.history.slice(0, this.state.stepNumber + 1);
            // const current = history[history.length - 1];
            var config = this.state.config.slice();
            // if (calculateWinner(squares) || squares[i]) {
            //     return;
            // }
            config[i][j] = number;
            this.setState({
                config: config
            });
        }

        // mode: test, 1 -> solve

    }, {
        key: "handleSolve",
        value: function handleSolve(mode) {
            if (mode == "test") {
                var solultions = [];
                this.state.lib.forEach(function (puzzle) {
                    var sol = calculate(puzzle);
                    solultions.push(sol);
                    console.log(sol);
                });
                this.setState({
                    config: solultions[0]
                });
            } else if (mode == "solve") {
                this.setState({
                    config: calculate(this.state.config)
                });
            } else {
                console.log("Mode should be either test or solve!");
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            return React.createElement(
                "div",
                { className: "game" },
                React.createElement(
                    "div",
                    { className: "game-board" },
                    React.createElement(Board, {
                        config: this.state.config,
                        onChange: this.handleChange.bind(this)
                    })
                ),
                React.createElement(
                    "div",
                    { className: "game-info" },
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
                    }),
                    React.createElement(
                        "button",
                        { onClick: function onClick() {
                                return _this5.handleSolve("test");
                            } },
                        " Solve "
                    )
                )
            );
        }
    }]);

    return Game;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById('root'));