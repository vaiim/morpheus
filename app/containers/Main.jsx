import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import AssessmentList from '../components/assessment/AssessmentList';
import { manualLogin, signUp, toggleLoginMode, examSubmit } from '../actions/users';
import styles from '../css/components/assessment';

const cx = classNames.bind(styles);

class Main extends Component {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  render() {
    const { user, exams } = this.props;

    return <AssessmentList exams={exams} />;
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
export default connect(mapStateToProps, {})(Main);