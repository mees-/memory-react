import React from "react"
import "./cell.css"

export const CellState = {
	Open: "open",
	Closed: "closed",
	Found: "found",
}

const colorFromState = (state) => {
	switch (state) {
		case CellState.Open:
			return "blue"
		case CellState.Closed:
			return "red"
		case CellState.Found:
			return "yellow"
		default:
			throw new Error("unkown enum value")
	}
}

const Cell = ({ state, char, ...rest }) => (
	<div className={`cell ${state}`} {...rest}>
		<span>{char}</span>
	</div>
)

export default Cell
