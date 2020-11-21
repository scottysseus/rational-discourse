import React, { Component, Fragment } from 'react';

export class AgendaStepSelect extends Component {

  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.props.handleChange(this.props.index, event.target.value);
  }

  render() {
    return <Fragment>
      <select className="custom-select" onChange={this.handleChange.bind(this)}>
        <option value="up">Up</option>
        <option value="down">Down</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>
    </Fragment>;
  }
}

export class AgendaScene extends Component {
  constructor(props) {
    super(props);
    this.state = {agenda: ["up", "up", "up", "up"]};
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Submitted");
  }

  handleChange(index, value) {
    const agenda = this.state.agenda;
    agenda[index] = value;
    this.setState({agenda});
    console.log(this.state);
  }

  render() {
    return <Fragment>
      <div className="row">
        <div className="col-md-12">
          
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h2>Choose Your Agenda!</h2>
          First, we must go
          <form onSubmit={this.handleSubmit}>
          <AgendaStepSelect index={0} value={this.state.agenda[0]} handleChange={this.handleChange.bind(this)} />
          Then, of course, we go
          <AgendaStepSelect index={1} value={this.state.agenda[1]} handleChange={this.handleChange.bind(this)} />
          And just when things seem darkest we will go
          <AgendaStepSelect index={2} value={this.state.agenda[2]} handleChange={this.handleChange.bind(this)} />
          So that, finally, we go
          <AgendaStepSelect index={3} value={this.state.agenda[3]} handleChange={this.handleChange.bind(this)} />
          </form>
        </div>
      </div>
    </Fragment>;
  }
}