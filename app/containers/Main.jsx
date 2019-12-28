import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import autoBind from 'react-autobind';

import { manualLogin, signUp, toggleLoginMode, examSubmit } from '../actions/users';
import { authService } from '../services';
import { examLoaded } from '../actions/topics';

import AssessmentList from '../components/assessment/AssessmentList';
import styles from '../css/components/assessment';

const cx = classNames.bind(styles);

class Main extends Component {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  examClicked(item) {
    return async event => {
      const examId = item._id;
      const res = await authService().getExam(examId);
      const { examLoaded } = this.props;
      examLoaded(res.data);
      browserHistory.push('/assessment/' + examId);
    }
  }

  render() {
    const { user, exams } = this.props;

    return <div>
      <Link
        className={cx('button')}
        to="/assessment"
      >Create</Link>
      <AssessmentList exams={exams} handleClick={this.examClicked} />
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
export default connect(mapStateToProps, { examLoaded })(Main);