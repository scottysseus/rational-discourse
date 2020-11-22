import React, { Fragment } from 'react';
import { ProgressBar } from 'react-bootstrap';

const COLORS = [
    'white',
    '#1eabffff'
];

function invertHex(hex) {
    return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
  }

/* props.players = [e
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
        <ProgressBar style={{height: "30px"}}>
           {
                (() => 
                    props.players.map((player, i) => <ProgressBar key={i}
                        now={props.scores[player.name] + 100} 
                        label={player.name}
                        style={{background: player.color, color: invertHex(player.color), fontWeight: "bold", height: "30px", padding:"8px"}}/>
                ))()
            }
        </ProgressBar>
    </Fragment>
}