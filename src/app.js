import React, { Fragment } from 'react';
import { StartScene } from './scenes/start';
import { BattleScene } from './scenes/battle';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }


  onStart(lobby) {

  }

  render() {
    return (
      <Fragment>
        <h1>Rational Discourse</h1>
        <StartScene client={this.props.client} onStart={this.onStart.bind(this)} />
        {/* <AgendaScene name="myscene" /> */}
        <BattleScene />
      </Fragment>
    );
  }
}