import React from "react";
import { Col, Container, Row } from "react-bootstrap";

export function Tweet(props) {
    const partyName = props.tweet.party.replaceAll(' ', '_');
    return <div className="tweet">
        <div className="tweet-avatar"></div>
        <div className="tweet-account-name">{partyName} <span class="tooter-blue-fg">✔</span></div>
        <div className="tweet-handle">@{partyName}Official</div>
        <div className="tweet-text">{props.tweet.tweet}</div>
        <div style="clear: both;">
            <div class="tweet-control">🗩</div>
            <div class="tweet-control">⭯</div>
            <div class="tweet-control">🫀</div>
            <div class="tweet-control">🥔</div>
        </div>
    </div>
} 