import React, { Fragment } from 'react';
import { ProgressBar } from 'react-bootstrap';

function textColor(partyColorHex) {
    const rgb = partyColorHex.substring(partyColorHex.charAt(0) === '#' ? 1 : 0)
        .match(/.{1,2}/g);

    var luminance = Math.round(((parseInt(rgb[0], 16) * 299) + 
                (parseInt(rgb[1], 16) * 587) + 
                (parseInt(rgb[2], 16) * 114)) / 1000); 
    return (luminance > 125) ? 'black' : 'white'; 
}

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
                        style={{background: player.color, color: textColor(player.color), fontWeight: "bold", height: "30px", padding:"8px"}}/>
                ))()
            }
        </ProgressBar>
    </Fragment>
}