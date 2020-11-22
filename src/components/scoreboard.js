import React, { Fragment } from 'react';
import { ProgressBar } from 'react-bootstrap';

const COLORS = [
    'purple',
    'blue'
];

export default function Scoreboard(props) {
    let total = 0;
    Object.keys(props.scores).forEach(name => total += props.scores[name]);
    if (total === 0) {
        Object.keys(props.scores).forEach(name => props.scores[name] = 50);
    }

    return <Fragment>
        <ProgressBar>
           {
                (() => 
                    Object.keys(props.scores).map((name, i) => <ProgressBar key={i}
                        now={props.scores[name] * 100} 
                        label={name}
                        style={{background: COLORS[i]}}/>
                ))()
            }
        </ProgressBar>
    </Fragment>
}