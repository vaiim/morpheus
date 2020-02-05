import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import autoBind from 'react-autobind';

import { manualLogin, logOut, signUp, toggleLoginMode, examSubmit } from '../actions/users';
import { authService } from '../services';
import { examLoaded, examNew } from '../actions/topics';

import AssessmentList from '../components/assessment/AssessmentList';
import styles from '../css/components/assessment';

const cx = classNames.bind(styles);

class Main extends Component {
  constructor(props) {
    super(props);
    const { exams } = this.props;
    this.state = { exams, loading: false, keyword: ''};
    autoBind(this);
  }

  createClicked() {
    const { examNew } = this.props;
    examNew();
    browserHistory.push('/assessment');
  }

  examClicked(item) {
    return async event => {
      if(this.state.loading) return;
      this.setState({loading: true});
      const examId = item._id;
      const res = await authService().getExam(examId);
      const { examLoaded } = this.props;
      examLoaded(res.data);
      browserHistory.push('/assessment/' + examId);
    }
  }

  keywordTyped(event) {
    const s = event.target.value;
    this.setState({keyword: s});
  }

  async checkKeyword(event) {
    const s = event.target.value;
    if (event.key === 'Enter') {
      const res = await authService().searchList(s.replace(/[^a-z]/gi, ' ').replace(/\s+/gi, ' ').trim());
      this.setState({exams: res.data});
    }
  }

  render() {
    const { user, logOut } = this.props;
    return <div>
      <div className={cx('main-button-area')}>
        <a
          className={cx('button')}
          onClick={this.createClicked}
        >Create</a>
        <input
          className={cx('input')}
          type="text"
          value={this.state.keyword}
          onChange={this.keywordTyped}
          onKeyPress={this.checkKeyword}
          placeholder="First Name"
        />
        { user.authenticated &&
          <Link
            onClick={logOut}
            className={cx('item')} to="/">Logout
          </Link>
        }
      </div>
      <br />
      <AssessmentList exams={this.state.exams} handleClick={this.examClicked} loading={this.state.loading} />
      <br />
    </div>;
  }
}

Main.propTypes = {
};

// Function passed in to `connect` to subscribe to Redux store updates.
// Any time it updates, mapStateToProps is called.
function mapStateToProps({user, topic}) {
  return {
    user,
    exams: topic.list
  };
}

// Connects React component to the redux store
// It does not modify the component class passed to it
// Instead, it returns a new, connected component class, for you to use.
export default connect(mapStateToProps, { examLoaded, examNew, logOut })(Main);