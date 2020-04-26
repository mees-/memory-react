import React from "react"

import Board from "./components/board/Board"

function App() {
	return (
		<div className="App">
			<Board size={6} cellSize="200px" />
		</div>
	)
}

export default App
