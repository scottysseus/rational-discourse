import React, { Component } from 'react';
import Typer from '../components/typer';
import { Tweet } from '../components/tweet';
import Scoreboard from '../components/scoreboard';
import { Modal } from 'react-bootstrap';
import { getRandomInt } from '../utils';
import MusicPlayer from '../musicPlayer';

const getNewTweet = (party) => {
    const tweets = [
        `#${party} spread the word!`,
        `${party} is infallible.`,
        `Vote ${party}!`,
        `Jobs! We need jobs!`,
        `Hop on the ${party} train!`,
        `Liberty and justice, for some!`,
        `${party}: A little guy for the little guys`,
        `Can we? Yes... Should we, though?`,
        `Can you smell the freedom?`,
        `Fan the flames of freedom.`,
        `Who else are you going to trust?`,
        `Don't like them? Neither do we.`,
        `${party} is up 0.7% in the polls!`,
        `Change is scary. Let's avoid that.`,
        `We're the lesser of two evils`,
        `We're acceptable under the circumstances`,
        `Befuddled incompetence.`,
        `Businesses are people too.`,
        `Don't be sheep: join the herd!`,
        `Repudiate the debt!`,
        `Your children are at risk.`,
        `We don't like what we don't understand.`,
        `We've tried nothing and we're all out of ideas.`,
        `${party} is investing in our future`,
        `Ignorance, Arrogance, Belligerence`,
        `Don't trust anyone but us.`,
        `Save the suburbs!`,
        `Who needs treaties?`,
        `Our opposition is Terribly Corrupt`,
        `${party} has a lot of smart people.`,
        `We're the only way to save the country.`,
        `Our opposition is definitely colluding with somebody`,
        `Think for yourself! Listen to us!`,
        `We make problems. Go away!`,
        `We have solutions you didn't want and don't need`,
        `We make problems go away.`,
        `Things'll sort themselves out.`,
        `${party}: Thinking on your behalf`,
        `Use your anger! Vote ${party}!`,
        `Achieve utopia! Vote ${party}!`,
        `Famous celebrities are voting ${party}`,
        `"Vote ${party}!" -Specious Newspaper`,
        `Don't fact check on me.`,
        `E pluribus ${party}`,
        `${party} is tough on crime!`,
        `The other party smells of elderberries!`
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
            gameTime: 60,
            showScore: false,
            winner: "Nobody wins!",
        };
        this.props.client.onTweet(this.onTweetReceived.bind(this));
        this.props.client.onScoreChange(this.onScoreChanged.bind(this));
        this.props.client.onBattleState(this.showInstructions.bind(this));
    }

    showInstructions() {
        this.setState({ hostWaiting: false, showInstructions: true });
        window.setTimeout(() => {
            this.startCountdown();
        }, 2000 /* 2 seconds */);
    }

    startCountdown() {
        this.setState({ hostWaiting: false, showCountdown: true, showInstructions: false });
        MusicPlayer.playSfxCountdown();
        let intervalId = window.setInterval(() => {
            let countdown = this.state.countdown;
            countdown--;
            this.setState({ countdown: countdown }, () => {
                if (this.state.countdown < 0) {
                    window.clearInterval(intervalId);
                    this.startBattle();
                } else {
                    MusicPlayer.playSfxCountdown();
                }
            });
        }, 1000 /*1 second*/);
    }

    startBattle() {
        this.setState({ hostWaiting: false, waiting: false, showCountdown: false })
        MusicPlayer.stopMusicTitle();
        MusicPlayer.playMusicGameplay();
        let intervalId = window.setInterval(() => {
            let gameTime = this.state.gameTime;
            gameTime--;
            this.setState({gameTime: gameTime}, () => {
                if (this.state.gameTime < 1) {
                    window.clearInterval(intervalId);
                    this.showScore();
                }
            })
        }, 1000)
    }

    showScore() {
        // wait for any last score updates from the server first
        window.setTimeout(() => {
            let topScore = 0;
            let winner = "Nobody wins!";
            Object.keys(this.state.scores).forEach(party => {if(this.state.scores[party] > topScore) {
                topScore = this.state.party;
                winner = `${party} wins!`;
            }});
            this.setState({showScore: true, winner: winner})

        }, 1000)
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

    homeClicked() {
        this.props.onHome();
    }

    render() {
        return (
            <div id="scene-battle">
                {/* <div id="tweet-header">Win the News Cycle!</div> */}
                <Scoreboard scores={this.state.scores} />
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div id="tooter-header">
                        <img className="animate__animated animate__tada animate__infinite" id="tooter-header-logo" src="./assets/tooter.svg" height="64px" />
                        <div id="tooter-header-text">tooter</div>
                        
                    </div>
                    <p style={{color: "#1eabffff"}}>{this.state.gameTime}</p>
                </div>
                <div className="clear-fix" />
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
                <Modal animation={false} dialogClassName="pregame-modal" show={this.state.showCountdown} centered backdrop="static">
                    <Modal.Body>
                        <div style={{ width: "100%", textAlign: "center" }}>
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
                <Modal animation={false} dialogClassName="pregame-modal" show={(this.state.waiting && !this.state.hostWaiting && !this.state.showCountdown) || this.state.showInstructions} centered backdrop="static">
                    <Modal.Body>
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <h1 className="pregame-text">Spread your party's message!</h1>
                            <br />
                            <h1 className="pregame-text">Type the most toots below to win!</h1>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal animation={false} dialogClassName="pregame-modal" show={this.state.showScore} centered backdrop="static">
                    <Modal.Body>
                    <div style={{ width: "100%", textAlign: "center" }}>
                            <h1 className="pregame-text">{this.state.winner}</h1>
                            <div className="toot-blue-bg toot-button" variant="primary" onClick={this.homeClicked.bind(this)}>Home</div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}