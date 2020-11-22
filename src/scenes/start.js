import React, { Fragment } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { getRandomInt } from '../utils';

const MAX_PARTY_NAME_LENGTH = 16;
function isPartyNameValid(name) {
    if (!name || name.length > MAX_PARTY_NAME_LENGTH) {
        return false
    }
    return true;
}

const PARTY_NAMES = [
    'Greenback Labor Party',
    'National Humpback Whalers Association',
    'Partisans for Nationalistic Hippo Breeding',
    'Leprechauns for Licentious Liberty',
    'Dorf-Moot Sthralthim Vac Ornaight',
    'American Society for Benchwarming',
    'Brotherhood of Heavy-Metal Janitors',
    'National Party of Failed Magicians and Illusionists',
    'United Consortium of Animal Husbanders',
    'U.S. Confederation of Layer Cakers',
    'Coaliton of Indebted Yoga Instructors',
    'Party for the Advancement of Scuba',
    'H.O.R.S.E.',
    'Conference of Pre-Aristotelian Logicians',
    'Corpus of Semi-Realistic Mime Impersonators',
    'American Federation of Self-Made Criminals',
    'United Blind Optometrists\' Party',
    'American Congregation of Varmint Trappers',
    'Sugar-Mama Society of America',


];

export class StartScene extends React.Component {

    constructor(props) {
        super(props);
        this.client = props.client;
        this.state = { startOpen: false, joinOpen: false, partyName: "", lobbyId: "", partyInvalid: false, lobbyInvalid: false};

        this.openStartDialog = () => { this.setState({ startOpen: true }); }
        this.closeStartDialog = () => { this.setState({ startOpen: false }); }

        this.openJoinDialog = () => { this.setState({ joinOpen: true }); }
        this.closeJoinDialog = () => { this.setState({ joinOpen: false }); }

        this.changePartyName = (event) => {
            let partyInvalid = false;
            if (!isPartyNameValid(event.target.value)) {
                partyInvalid = true;
            }
            this.setState({partyName: event.target.value, partyInvalid: partyInvalid});
        };

        this.changeLobbyId = (event) => {
            let lobbyInvalid = false;
            if (event.target.value === "") {
                lobbyInvalid = true;
            }
            this.setState({lobbyId: event.target.value, lobbyInvalid: lobbyInvalid});
        };
    }

    startGame() {
        if(!isPartyNameValid(this.state.partyName)) {
            this.setState({partyInvalid: true});
            return
        }
        const startPromise = this.client.startGame({name: this.state.partyName});
        
        startPromise.then(lobby => {
            this.closeStartDialog();
            this.props.onStart(lobby);
        });
    }

    joinGame() {
        if(this.state.lobbyId === "") {
            this.setState({lobbyInvalid: true});
            return
        }

        if(!isPartyNameValid(this.state.partyName)) {
            this.setState({partyInvalid: true});
            return
        }

        const joinPromise = this.client.joinGame(this.state.lobbyId, {name: this.state.partyName});
        joinPromise.then(lobby => {
            console.log(lobby);
            this.closeJoinDialog();
            this.props.onJoin(lobby);
        });
    }

    render() {
        const placeholderParty = PARTY_NAMES[getRandomInt(PARTY_NAMES.length)];
        return <Fragment>
            <div id="tooter-header">Rational Discourse</div>
            <img id="tooter" src="./assets/tooter.png" />
            <div className="toot-blue-bg toot-button" onClick={this.openStartDialog}>Start</div>
            <div className="toot-blue-bg toot-button" onClick={this.openJoinDialog}>Join</div>
            <Modal centered show={this.state.startOpen} onHide={this.closeStartDialog}>
                <Modal.Header closeButton >
                    <Modal.Title>Start a Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Enter a name for your political party:</Form.Label>
                        <Form.Control isInvalid={this.state.partyInvalid} value={this.state.partyName} onChange={this.changePartyName} type="text" placeholder={placeholderParty} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.startGame.bind(this)}>Start</Button>
                </Modal.Footer>
            </Modal>
            <Modal centered show={this.state.joinOpen} onHide={this.closeJoinDialog}>
                <Modal.Header closeButton >
                    <Modal.Title>Join a Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Enter the lobby code:</Form.Label>
                        <Form.Control isInvalid={this.state.lobbyInvalid} required onChange={this.changeLobbyId} value={this.state.lobbyId} type="text"/>
                        
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Enter a name for your political party:</Form.Label>
                        <Form.Control isInvalid={this.state.partyInvalid} value={this.state.partyName} onChange={this.changePartyName} type="text" placeholder="Greenback Labor Party" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.joinGame.bind(this)}>Join</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    }
}