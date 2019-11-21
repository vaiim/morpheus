import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import Select from '../components/Select';
import Assessment from '../components/assessment/Assessment';
import { DataBinder } from '../utils/bindStates';
import { manualLogin, signUp, toggleLoginMode } from '../actions/users';
import styles from '../css/components/assessment';

const cx = classNames.bind(styles);

class LoginOrRegister extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      user: {},
      answers: {
        english: [],
        math: [],
        general: [],
      },
    };

    autoBind(this);

    this.dataBound = new DataBinder(this.state, {component: this});
  }

  handleOnSubmit(event) {
    event.preventDefault();

    const { manualLogin, signUp, user: { isLogin } } = this.props;
    const email = ReactDOM.findDOMNode(this.refs.email).value;
    const password = ReactDOM.findDOMNode(this.refs.password).value;

    if (isLogin) {
      manualLogin({ email, password });
    } else {
      signUp({ email, password });
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
    const { isWaiting, message, isLogin } = this.props.user;
    const user = this.dataBound.access('user');
    const answers = this.dataBound.access('answers');

    return <Assessment user={user} answers={answers} submit={this.handleOnSubmit} years={this.getYears()} />;
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
function mapStateToProps({user}) {
  return {
    user
  };
}

// Connects React component to the redux store
// It does not modify the component class passed to it
// Instead, it returns a new, connected component class, for you to use.
export default connect(mapStateToProps, { manualLogin, signUp, toggleLoginMode })(LoginOrRegister);

