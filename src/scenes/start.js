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
    'Anti-Nebraska Party',
    'Nonpartisan League',
    'Concerned Citizens Party',
    'Anti-Masonic Party',
    'Anti-Jacksonian Party',
    'Know Nothings',
    'Rent Is Too Damn High Party',
    'Nullifier Party',
    'Silver Party',
    'Personal Choice Party',
    'Modern Whig Party'
];

const placeholderParty = PARTY_NAMES[getRandomInt(PARTY_NAMES.length)];

export class StartScene extends React.Component {

    constructor(props) {
        super(props);
        this.client = props.client;
        this.state = { startOpen: false, joinOpen: false, partyName: "", lobbyId: "", partyInvalid: false, lobbyInvalid: false, color: "#00ff00"};

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

        this.changeColor = (event) => {
            this.setState({color: event.target.value});
        }
    }

    startGame() {
        if(!isPartyNameValid(this.state.partyName)) {
            this.setState({partyInvalid: true});
            return
        }
        const startPromise = this.client.startGame({name: this.state.partyName, color: this.state.color});
        
        startPromise.then(lobby => {
            this.closeStartDialog();
            this.props.onStart(lobby, this.state.partyName);
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

        const joinPromise = this.client.joinGame(this.state.lobbyId, {name: this.state.partyName, color: this.state.color});
        joinPromise.then(lobby => {
            this.closeJoinDialog();
            this.props.onJoin(lobby, this.state.partyName);
        });
    }

    render() {
        
        return <Fragment>
            <div className="animate__animated animate__rubberBand" id="title">Rational Discourse</div>
            <img className="animate__animated animate__flipInY" id="tooter" src="./assets/tooter.png" />
            <div style={{marginTop: "35%"}} className="animate__animated animate__zoomInLeft toot-blue-bg toot-button" onClick={this.openStartDialog}>Start</div>
            <div className="animate__animated animate__zoomInRight toot-blue-bg toot-button" onClick={this.openJoinDialog}>Join</div>
            <Modal centered show={this.state.startOpen} onHide={this.closeStartDialog}>
                <Modal.Header closeButton >
                    <Modal.Title>Start a Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Enter a name for your political party:</Form.Label>
                        <Form.Control isInvalid={this.state.partyInvalid} value={this.state.partyName} onChange={this.changePartyName} type="text" placeholder={placeholderParty} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Pick your party's color:</Form.Label>
                        <Form.Control type="color" value={this.state.color} onChange={this.changeColor}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <div className="toot-blue-bg toot-button" variant="primary" onClick={this.startGame.bind(this)}>Start</div>
                </Modal.Footer>
            </Modal>
            <Modal centered show={this.state.joinOpen} onHide={this.closeJoinDialog}>
                <Modal.Header closeButton >
                    <Modal.Title>Join a Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Enter lobby code:</Form.Label>
                        <Form.Control isInvalid={this.state.lobbyInvalid} required onChange={this.changeLobbyId} value={this.state.lobbyId} type="text"/>
                        
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Enter a name for your political party:</Form.Label>
                        <Form.Control isInvalid={this.state.partyInvalid} value={this.state.partyName} onChange={this.changePartyName} type="text" placeholder={placeholderParty} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Pick your party's color:</Form.Label>
                        <Form.Control type="color" value={this.state.color} onChange={this.changeColor}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <div className="toot-blue-bg toot-button" variant="primary" onClick={this.joinGame.bind(this)}>Join</div>
                </Modal.Footer>
            </Modal>
        </Fragment>
    }
}