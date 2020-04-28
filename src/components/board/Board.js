import React, { Component } from "react"
import clone from "clone-deep"
import "./board.css"
import Cell, { CellState } from "../Cell/cell"

export default class Board extends Component {
	constructor(props) {
		super(props)
		const { size } = props
		this.state = this.getFreshState(size)
	}

	getFreshState(size) {
		const board = []
		let chars = this.randomChars((size * size) / 2)
		// add another of each char
		chars = [...chars, ...chars]
		shuffle(chars)
		for (let y = 0; y < size; y++) {
			board[y] = []
			for (let x = 0; x < size; x++) {
				board[y].push({
					char: chars.shift(),
					state: CellState.Closed,
					x,
					y,
				})
			}
		}
		return { board, clicks: 0 }
	}

	randomChars(amount) {
		const chars = [
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
		]

		if (amount > 26) {
			throw new Error("Can't get more than 26 chars")
		}
		const chosen = []
		while (chosen.length < amount) {
			const index = Math.floor(Math.random() * amount)
			if (!chosen.includes(chars[index])) {
				chosen.push(chars[index])
			}
		}

		return chosen
	}

	getCellsByState(cellState) {
		return this.state.board.flat().filter(({ state }) => state === cellState)
	}

	handleCellClick({ x, y }) {
		if (this.state.board[y][x].state === CellState.Found) {
			return
		}
		const setStateAndIncreaseClicks = (newState) => {
			this.setState({ ...newState, clicks: this.state.clicks + 1 })
		}
		const openCells = this.getCellsByState(CellState.Open)
		const newBoard = clone(this.state.board)
		switch (openCells.length) {
			case 1:
				if (
					!cellEquals(openCells[0], this.state.board[y][x]) &&
					this.state.board[y][x].char === openCells[0].char
				) {
					newBoard[y][x].state = CellState.Found
					newBoard[openCells[0].y][openCells[0].x].state = CellState.Found
					setStateAndIncreaseClicks({ board: newBoard })
					break
				}
			case 0:
				newBoard[y][x].state = CellState.Open
				setStateAndIncreaseClicks({ board: newBoard })
				break
			case 2:
				for (const { x, y } of openCells) {
					newBoard[y][x].state = CellState.Closed
				}
				newBoard[y][x].state = CellState.Open
				setStateAndIncreaseClicks({ board: newBoard })
				break
			default:
				throw new Error("invalid amount of open cells")
		}
	}

	render() {
		const { size } = this.props
		return (
			<div>
				<div
					className="board"
					style={{
						gridTemplateColumns: `repeat(${size}, 1fr)`,
						gridTemplateRows: `repeat(${size}, 1fr)`,
					}}
				>
					{this.state.board.flat().map(({ state, char, x, y }) => (
						<Cell
							key={`${x},${y}`}
							state={state}
							char={char}
							onClick={(event) => {
								event.preventDefault()
								this.handleCellClick({ x, y })
							}}
						/>
					))}
				</div>
				<button
					onClick={() => {
						this.setState(this.getFreshState(this.props.size))
					}}
				>
					Reset
				</button>
				<span>Clicks: {this.state.clicks}</span>
			</div>
		)
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

const cellEquals = (a, b) => {
	console.log(a, b)
	return a.x === b.x && a.y === b.y && a.state === b.state && a.char === b.char
}
