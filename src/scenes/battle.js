import React, { Component, Fragment } from 'react';
import { ListGroup } from 'react-bootstrap';

export class BattleScene extends Component {

    constructor(props) {
      super(props);
      this.state = {
          tweets: ['We are the best.',
                   'A purple wave is coming!',
                   'Vote purple!',
                   'Jobs! We need jobs!',
                   'Purple is Perfect.']
       };
    }
  
    handleKeyPress(event) {
        console.log(event.key);
        let tweets = this.state.tweets;
        tweets.push("yet another tweet! go purp!");
        this.setState({tweets: tweets});
    }

    render() {
        return (
        <div id="scene-battle">
            <div id="tweet-header">Win the News Cycle!</div>
            <div id="tweet-queue">
                {(() => {
                    let tweets = [];
                    let id = 1;
                    this.state.tweets.forEach(tweet =>{tweets.push(<div className="tweet" key={id}>{tweet}</div>); id++;});
                    return tweets;  
                })()}
            </div>
            <div id="tweet-stream">
            </div>
            <div id="tweet-active">
                {this.state.tweets[0]}
            </div>
            <div id="tweet-input">
                <textarea id="tweet-input-textarea"></textarea>
            </div>
        </div>);
    }
}