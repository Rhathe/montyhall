import React, { Component } from 'react';
import './App.css';
import Door from './Door.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.doorNum = 30;
		this.state = this.resetDoors();
	}

	resetDoors() {
		const doors = Array(this.doorNum).fill().map(_ => ({
			opened: false,
			chosen: false,
			other: false,
			car: false,
		}));

		const carDoor = doors[Math.floor(Math.random()*doors.length)];
		carDoor.car = true;

		return {
			mode: 'initial',
			doors: doors,
			switched: false,
			correct: false
		};
	}

	handleDoorClick(i) {
		if (this.state.mode === 'initial') {
			const doors = this.state.doors.slice();
			var otherDoors = Array(doors.length).fill().map((_, index) => index);
			otherDoors.splice(i, 1);
			var otherDoor = null;

			otherDoors.forEach(index => {
				let door = doors[index];
				door.opened = true;
				if (door.car) otherDoor = door;
			});

			doors[i].chosen = true;

			const otherIndex = otherDoors[Math.floor(Math.random()*otherDoors.length)];
			otherDoor = otherDoor || doors[otherIndex];
			otherDoor.opened = false;
			otherDoor.other = true;

			this.setState({
				mode: 'stayOrSwitch',
				doors: doors
			});
		}
	}

	

	clickStay() {
		this.checkFinal(false)
	}

	clickSwitch() {
		this.checkFinal(true);
	}

	checkFinal(switched) {
		const doors = this.state.doors.slice();
		var correct = false;

		doors.forEach(door => {
			if (door.car) {
				if (switched) {
					if (door.other) correct = true;
				} else if (door.chosen) {
					correct = true;
				}
			}
			door.opened = true;
		});

		this.setState({
			switched: switched,
			correct: correct,
			mode: 'final',
			doors: doors
		});
	}

	renderDoor(i) {
		return (
			<Door
				key={i}
				door={this.state.doors[i]}
				switched={this.state.switched}
				mode={this.state.mode}
				onClick={() => this.handleDoorClick(i)}
			/>
		);
	}

	renderMessage() {
		const msgs = {
			'initial': (
				<div>Pick a door</div>
			),
			'stayOrSwitch': (
				<div>
					<div>Stay or Switch?</div>
					<button onClick={() => this.clickStay()}>Stay</button>
					<button onClick={() => this.clickSwitch()}>Switch</button>
				</div>
			),
			'final': this.state.correct ?
				(
					<div>
						Congratulations! You win a car!
					</div>
				) :
				(
					<div>
						Sorry, you get a goat...
					</div>
				)
		};


		return msgs[this.state.mode];
	}

	retry() {
		this.setState(this.resetDoors());
	}

	reset() {
	}

	render() {
		var doors = [];
		for (var i = 0; i < this.doorNum; i++) {
			doors.push(this.renderDoor(i));
		}

		return (
			<div className="App">
				<div className="message">
					{this.renderMessage()}
				</div>

				<div>
					{doors}
				</div>

				<p>
					<button onClick={() => this.retry()}>Retry</button>
				</p>
				<p>
					<button onClick={() => this.reset()}>Reset All</button>
				</p>
			</div>
		);
	}
}

export default App;
