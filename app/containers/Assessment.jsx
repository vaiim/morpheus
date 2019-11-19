import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import { DataBinder } from '../utils/bindStates';
import { manualLogin, signUp, toggleLoginMode } from '../actions/users';
import styles from '../css/components/assessment';
import hourGlassSvg from '../images/hourglass.svg';

const cx = classNames.bind(styles);

class LoginOrRegister extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      user: {},
      answers: {},
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

  render() {
    const { isWaiting, message, isLogin } = this.props.user;
    const user = this.dataBound.access('user');
    const answers = this.dataBound.access('answers');

    return (
      <div
        className={cx('login', {
          waiting: isWaiting
        })}
      >
        <div className={cx('container')}>
          <img className={cx('loading')} alt="loading" src={hourGlassSvg} />
          <div className={cx('email-container')}>
            <form onSubmit={this.handleOnSubmit}>
              First Name
              <input
                className={cx('input')}
                type="text"
                onChange={user.access('firstName').attach()}
                placeholder="First Name"
              />
              Family Name
              <input
                className={cx('input')}
                type="text"
                onChange={user.access('familyName').attach()}
                placeholder="Family Name"
              />
              <p
                className={cx('message', {
                'message-show': message && message.length > 0 && false
              })}>{message}</p>
              <input
                className={cx('button')}
                type="submit"
                value={isLogin ? 'Login' : 'Register'} />
            </form>
          </div>
        </div>
      </div>
    );
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

