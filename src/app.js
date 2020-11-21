import React, { Fragment } from 'react';
import { StartScene } from './scenes/start';
import { BattleScene } from './scenes/battle';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }


  onStart(lobby) {
    console.log("hiding the start scene :)");
    console.log(lobby);
  }

  onJoin(lobby) {
    console.log("hiding the start scene :)");
    console.log(lobby);
  }

  render() {
    return (
      <Fragment>
        <h1>Rational Discourse</h1>
        <StartScene client={this.props.client} onStart={this.onStart.bind(this)} onJoin={this.onJoin.bind(this)} />
        {/* <AgendaScene name="myscene" /> */}
        <BattleScene client={this.props.client} />
      </Fragment>
    );
  }
}