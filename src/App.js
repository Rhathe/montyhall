import React, { Component } from 'react';
import './App.css';
import Door from './Door.js';

const queryString = require('query-string');


class App extends Component {
	constructor(props) {
		super(props);
		const parsed = queryString.parse(window.location.search);
		this.doorNum = Math.min(Math.max(parseInt(parsed.doors, 10) || 3, 3), 100);
		this.state = Object.assign(this.resetDoors(), {
			games: 0,
			stayWins: 0,
			switchWins: 0,
		});
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
			doors: doors,
			games: this.state.games + 1,
			stayWins: this.state.stayWins + (correct && !switched && 1),
			switchWins: this.state.switchWins + (correct && switched && 1)
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
					<button onClick={() => this.clickStay()}>Stay</button>
					<span>or</span>
					<button onClick={() => this.clickSwitch()}>Switch</button>?
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

	changeDoors(ev) {
		window.location.search = queryString.stringify({doors: ev.target.value})
	}

	render() {
		var doors = [];
		for (var i = 0; i < this.doorNum; i++) {
			doors.push(this.renderDoor(i));
		}

		var recordMsg = '';
		if (this.state.games) {
			recordMsg = (
				<span>
					You have won {this.state.stayWins}/{this.state.games} by staying
					and {this.state.switchWins}/{this.state.games} by switching.
				</span>
			)
		}

		var options = Array(97).fill().map((_, i) => {
			let v = i + 3;
			return <option key={v} value={v}>{v}</option>
		})

		return (
			<div className="App">
				<div className="message">
					{this.renderMessage()}
				<p>
					{recordMsg}
				</p>
				</div>

				<div>
					{doors}
				</div>

				<p>
					<button onClick={() => this.retry()}>Retry</button>
				</p>

				<p className="door-num">
					<span>Doors:</span>
					<select value={this.doorNum} onChange={this.changeDoors}>
						{options}
					</select>
				</p>
			</div>
		);
	}
}

export default App;
