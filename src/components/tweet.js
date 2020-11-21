import React from "react";
import { Col, Container, Row } from "react-bootstrap";

export function Tweet(props) {
    return <Container className="tweet">
        <Row>
            <Col>image</Col><Col>{props.text}</Col>
        </Row>
    </Container>
} 