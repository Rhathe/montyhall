import React, { Component } from 'react';

function Door(props) {
	var show = 'Goat';
	if (!props.door.opened) show = 'Door';
	else if (props.door.car) show = 'Car'

	return (
		<button className="door" onClick={props.onClick}>
			{show}
		</button>
	);
}

export default Door;
