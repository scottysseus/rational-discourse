import React, { Component } from 'react';
import Typer from '../components/typer';
import { Tweet } from '../components/tweet';
import Scoreboard from '../components/scoreboard';
import { Modal } from 'react-bootstrap';
import { getRandomInt } from '../utils';
import MusicPlayer from '../musicPlayer';

const getNewTweet = (party) => {
    const tweets  = [
        `${party} is infallible.`,
        `Vote ${party}!`,
        `Jobs! We need jobs!`,
        `Hop on the ${party} train!`,
        `Liberty and justice, for some!`,
        `${party}: A little guy for the little guys`,
        `Can we? Yes... Should we, though?`,
        `Can you smell the freedom?`,
        `Fan the flames of freedom.`,
        `Who are you going to trust?`,
        `Don't like them? Neither do we.`,
        `${party} is up 0.7% in the polls!`,
        `Change is scary. Let's avoid that.`,
        `We're the lesser of two evils`,
        `Acceptable under the circumstances`,
        `Befuddled incompetence.`,
        `Businesses are people too.`,
        `Don't be sheep: join the herd!`,
        `Repudiate the debt!`,
        `Your children are at risk.`,
        `We don't like what we don't understand.`,
        `We've tried nothing and we're all out of ideas.`,
        `Investing in our future`,
        `Ignorance, Arrogance, Belligerence`,
        `Don't trust anyone but us.`,
        `Save the suburbs!`,
        `Who needs treaties?`,
        `Our opposition is Terribly Corrupt`,
        `${party} has a lot of smart people.`,
        `The only way to save the country.`,
        `Definitely colluding with somebody`,
        `Think for yourself! Listen to us!`,
        `We make problems. Go away!`,
        `Solutions you didn't want and don't need`,
        `We make problems go away.`,
        `Things'll sort themselves out.`,
        `Thinking on your behalf`,
        `Use your anger! Vote ${party}!`,
    ]
    return tweets[getRandomInt(tweets.length)];
};

export class BattleScene extends Component {

    constructor(props) {
        super(props);


        let queue = [getNewTweet(props.party), getNewTweet(props.party), getNewTweet(props.party)];
        const prompt = queue.shift();

        this.state = {
            party: props.party,
            tweetQueue: queue,
            tweetStream: [],
            prompt: prompt,
            typerKey: Date.now(),
            scores: {},
            hostWaiting: props.host,
            waiting: true,
            countdown: 3,
            showCountdown: false,
            showInstructions: false,
        };
        this.props.client.onTweet(this.onTweetReceived.bind(this));
        this.props.client.onScoreChange(this.onScoreChanged.bind(this));
        this.props.client.onBattleState(this.showInstructions.bind(this));
    }

    showInstructions() {
        this.setState({hostWaiting: false, showInstructions: true});
        window.setTimeout(() => {
            this.startBattle();
        }, 2000 /* 2 seconds */);
    }

    startBattle() {
        this.setState({hostWaiting: false, showCountdown: true, showInstructions: false});
        MusicPlayer.playSfxCountdown();
        let intervalId = window.setInterval(() => {
            let countdown = this.state.countdown;
            countdown--;
            this.setState({countdown: countdown}, () => {
                if(this.state.countdown < 0) {
                    window.clearInterval(intervalId);
                    this.setState({hostWaiting: false, waiting: false, showCountdown: false})
                    MusicPlayer.stopMusicTitle();
                    MusicPlayer.playMusicGameplay();
                } else {
                    MusicPlayer.playSfxCountdown();
                }
            });
        }, 1000 /*1 second*/);
    }

    onTyped(prompt) {
        let queue = this.state.tweetQueue;
        const newPrompt = queue.pop();
        queue.unshift(getNewTweet(this.state.party));
        this.setState({ prompt: newPrompt, tweetQueue: queue, typerKey: Date.now() });
        MusicPlayer.playSfxTweet();
        this.props.client.sendTweet(prompt);
    }

    onTweetReceived({ playerName, tweet }) {
        let tweetStream = this.state.tweetStream;
        tweetStream.push({ party: playerName, tweet: tweet });
        this.setState({ tweetStream: tweetStream });
        MusicPlayer.playSfxTweet();
        let elem = document.getElementById('tweet-stream');
        elem.scrollTop = elem.scrollHeight;

        // let ding = async function () {
        //     // AUDIO: TO BE ADDED
        //     var audio = new Audio('');
        //     audio.type = 'audio/wav';

        //     try {
        //         await audio.play();
        //         console.log('Playing...');
        //     } catch (err) {
        //         console.log('Failed to play...' + err);
        //     }
        // };
        // ding();
    }

    onScoreChanged(scores) {
        this.setState({ scores: scores });
    }

    render() {
        return (
            <div id="scene-battle">
                <div id="tweet-header">Win the News Cycle!</div>
                <Scoreboard scores={this.state.scores} />

                <div id="tooter-header">
                    <img className="animate__animated animate__tada animate__infinite" id="tooter-header-logo" src="./assets/tooter.svg" height="64px"/>
                    <div id="tooter-header-text">tooter</div>
                </div>
                <div className="clear-fix"/>
                <div id="tweet-stream">
                    {(() => this.state.tweetStream.map((tweet, id) => <Tweet className="tweet" tweet={tweet} key={id} />))()}
                </div>
                <Typer key={this.state.typerKey} prompt={this.state.prompt} onTyped={this.onTyped.bind(this)} />
                <Modal id="host-modal" centered backdrop="static" show={this.state.hostWaiting}>
                    <Modal.Header>
                        <Modal.Title>Waiting for opponent...</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Share this code with a friend:</p>
                        <pre>{this.props.lobbyId}</pre>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                <Modal dialogClassName="pregame-modal" show={this.state.showCountdown} centered backdrop="static">
                    <Modal.Body>
                        <div style={{width: "100%", textAlign: "center"}}>
                        {
                            (() => {
                                if (this.state.countdown >= 1) {
                                    return <h1 className="pregame-text">{this.state.countdown}</h1>;
                                } else {
                                    return <h1 className="pregame-text">Start!</h1>
                                }
                            })()
                        }
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal dialogClassName="pregame-modal" show={(this.state.waiting && !this.state.hostWaiting && !this.state.showCountdown) || this.state.showInstructions} centered backdrop="static">
                    <Modal.Body>
                        <div style={{width: "100%", textAlign: "center"}}>
                            {
                                (() => {
                                    if (!this.state.showInstructions) {
                                        return <h1 className="pregame-text">Loading...</h1>;
                                    } else {
                                        return <div>
                                            <h1 className="pregame-text">Spread Propaganda!</h1>
                                            <br/>
                                            <h1 className="pregame-text">Type the most toots below to win!</h1>
                                        </div>;
                                    }
                                })()
                            }
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}