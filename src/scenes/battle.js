import { BaseScene } from "./scene";
import React, { Component, Fragment } from 'react';
export class BattleScene extends Component {
    constructor(props) {
      super(props);
      this.state = {tweet: 'We are the best.' };
    }
  
    handleKeyPress(event) {
        console.log(event.target.value);
    }

    render() {
        return <Fragment>
            <h2> Win the News Cycle! </h2>
            <div className="row">
                <div id="conversation">
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-12">
                    <label for="exampleFormControlTextarea1">Type your tweet:</label>
                    <q>{this.state.tweet}</q>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="10" onKeyPress={this.handleKeyPress.bind(this)}></textarea>
                </div>
            </div>
        </Fragment>;
    }
}