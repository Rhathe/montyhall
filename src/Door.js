import React, {} from 'react';
import './Door.css';

function Door(props) {
	const door = props.door;
	var show = door.car ? 'Car' : 'Goat';
	if (!door.opened) show = 'Closed';

	var className = show.toLowerCase();
	var arrowClassName = door.chosen ? 'chosen': '';
	if (props.switched) {
		arrowClassName += door.chosen ? ' switched' : (door.other ? ' chosen' : '');
	}

	return (
		<div className="door">
			<div className={'clickable ' + className} onClick={props.onClick}>
				<div className="panel">
					<div className="knob">
					</div>
				</div>
			</div>
			<div className={'arrow ' + arrowClassName}>
				^
			</div>
		</div>
	);
}

export default Door;
