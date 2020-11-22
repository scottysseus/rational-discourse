import React, { Fragment } from 'react';
import { ProgressBar } from 'react-bootstrap';

const COLORS = [
    'white',
    '#1eabffff'
];

/* props.players = [
    {
        name: "player1 party",
        color: "#2902945"
    }
] */
export default function Scoreboard(props) {
    let total = 0;
    Object.keys(props.scores).forEach(name => total += props.scores[name]);
    if (total === 0) {
        Object.keys(props.scores).forEach(name => props.scores[name] = 50);
    }

    return <Fragment>
        <ProgressBar style={{height: "22px", border: "1px solid #ccc"}}>
           {
                (() => 
                    Object.keys(props.scores).map((name, i) => <ProgressBar key={i}
                        now={props.scores[name] + 100} 
                        label={name}
                        style={{background: COLORS[i], color: COLORS[(i +1) % 2], height: "20px"}}/>
                ))()
            }
        </ProgressBar>
    </Fragment>
}