import React, { Component, Fragment } from 'react';
import Typer from '../components/typer';
import { Tweet } from '../components/tweet';

const TWEETS = [
    'We are the best.',
    'A purple wave is coming!',
    'Vote purple!',
    'Jobs! We need jobs!',
    'Purple is Perfect.'
];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export class BattleScene extends Component {

    constructor(props) {
        super(props);


        let queue = [...TWEETS];
        const prompt = queue.shift();

        this.state = {
            tweets: TWEETS,
            tweetQueue: queue,
            prompt: prompt,
            typerKey: Date.now()
        };
        this.props.client.onTweet((tweetObject) => {
            const { playerName, tweet } = tweetObject;
            // TODO: Put this tweet in the message stream in the middle
        });
    }

    onTyped(prompt) {
        let queue = this.state.tweetQueue;
        const newPrompt = queue.pop();
        queue.unshift(TWEETS[getRandomInt(TWEETS.length)])
        this.setState({prompt: newPrompt, tweetQueue: queue, typerKey: Date.now()});
        this.props.client.sendTweet(prompt);
    }

    render() {
        return (
            <div id="scene-battle">
                <div id="tweet-header">Win the News Cycle!</div>
                <div id="tweet-queue">
                    <div id="tweet-queue-header">Queue</div>
                    {(() => {
                        return this.state.tweetQueue.map((tweet, id) => <div className="tweet" key={id}>{tweet}</div>);
                    })()}
                </div>
                <div id="tweet-stream">
                    <div id="tweet-stream-header">Stream</div>
                    {(() =>
                        this.state.tweetQueue.map((tweet, id) => <Tweet className="tweet" text={tweet} key={id} />)
                    )()}
                </div>
                <div className="clear-fix" />
                <Typer key={this.state.typerKey} prompt={this.state.prompt} onTyped={this.onTyped.bind(this)} />
            </div>);
    }
}