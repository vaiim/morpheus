import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import Select from '../components/Select';
import Assessment from '../components/assessment/Assessment';
import { DataBinder } from '../utils/bindStates';
import { manualLogin, signUp, toggleLoginMode, examSubmit } from '../actions/users';
import { authService } from '../services';

class LoginOrRegister extends Component {
  constructor(props) {
    super(props);

    const { answers, student, _id }= this.props.exam || {};
    this.state = { 
      student: {},
      answers: {
        english: [],
        math: [],
        general: [],
      },
      pdfLink: null,
      ref: null,
      waiting: false,
    };

    if(_id) {
      this.state.ref = _id;
    }

    if(student) {
      const [firstName, familyName] = student.name.split(' ');
      this.state.student = {
        firstName,
        familyName,
        grade: 'grade ' + student.grade,
      }
    }

    if(answers) {
      this.state.answers = {...answers};
    }

    autoBind(this);

    this.dataBound = new DataBinder(this.state, {component: this});
  }

  async handleOnSubmit(event) {
    event.preventDefault();
    if(this.state.waiting) return;
    
    this.setState({waiting: true});
    const res = await authService().examSubmit(this.state);
    if(res.data && res.data.pdf) {
      this.setState({pdfLink: res.data.pdf, waiting: false});
    }
    else {
      //something wrong
    }
  }

  getYears() {
    const years = ['Kinder'];
    for(let i=1; i<=12; i++) {
      years.push('Year ' + i);
    }
    return years;
  }

  render() {
    const { user } = this.props;
    const student = this.dataBound.access('student');
    const answers = this.dataBound.access('answers');

    return <Assessment 
            student={student} 
            answers={answers} 
            submit={this.handleOnSubmit}
            submitText={this.state.waiting? 'Waiting...' : 'Submit'}
            pdf={this.state.pdfLink} 
            years={this.getYears()} />;
  }
}

LoginOrRegister.propTypes = {
  user: PropTypes.object,
  manualLogin: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  toggleLoginMode: PropTypes.func.isRequired
};

// Function passed in to `connect` to subscribe to Redux store updates.
// Any time it updates, mapStateToProps is called.
function mapStateToProps({user, topic}) {
  return {
    user,
    exam: topic.exam
  };
}

// Connects React component to the redux store
// It does not modify the component class passed to it
// Instead, it returns a new, connected component class, for you to use.
export default connect(mapStateToProps, { manualLogin, signUp, toggleLoginMode, examSubmit })(LoginOrRegister);

