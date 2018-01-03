import React, { Component } from 'react';
import './App.css';
import Door from './Door.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.doorNum = 3;
		this.resetDoors();
	}

	resetDoors() {
		this.state = {
			doors: Array(this.doorNum).fill({
				opened: false,
				car: false
			})
		}
	}

	renderDoor(i) {
		return (
			<Door
				key={i}
				door={this.state.doors[i]}
			/>
		);
	}

	render() {
		var doors = [];
		for (var i = 0; i < this.doorNum; i++) {
			doors.push(this.renderDoor(i));
		}

		return (
			<div className="App">
				{doors}
			</div>
		);
	}
}

export default App;
