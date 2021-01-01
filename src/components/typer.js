import React from 'react';
import { Container, Form, Row } from 'react-bootstrap';

export default class Typer extends React.Component {

    constructor(props) {
        super(props);
        this.state = { typed: "", promptComplete: "", promptRemainig: this.props.prompt };
        this.textChangedCallback = this.textChanged.bind(this);
    }

    componentDidMount() {
        this.searchInput.focus();
    }

    textChanged(event) {
        const prompt = this.props.prompt;
        if (prompt.indexOf(event.target.value) !== 0) {
            return;
        }

        const typed = event.target.value;
        const complete = prompt.substring(0, typed.length);
        const remaining = prompt.substring(typed.length);
        this.setState({ typed: typed, promptComplete: complete, promptRemainig: remaining }, () => {
            if (complete === prompt) {
                this.props.onTyped(prompt);
            }
        });
    }

    render() {
        return <Container id={this.props.id}>
            <Row>
                <div id="tweet-prompt" className="lead"><span id="tweet-prompt-complete">{this.state.promptComplete}</span><span id="tweet-prompt">{this.state.promptRemainig}</span></div>
                <Form.Control ref={inputEl => (this.searchInput = inputEl)} value={this.state.typed} type="text" placeholder="Type your toot" onChange={this.textChangedCallback}></Form.Control>
            </Row>
        </Container>
    }

}