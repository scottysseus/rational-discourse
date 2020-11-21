import React from "react";
import { Col, Container, Row } from "react-bootstrap";

export function Tweet(props) {
    const partyName = props.tweet.party.replaceAll(' ', '_');
    return <Container className="tweet">
        <Row>
            <Col>image</Col><Col>@{partyName}Official</Col><Col>{props.tweet.tweet}</Col>
        </Row>
    </Container>
} 