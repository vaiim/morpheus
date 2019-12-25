import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';

import autoBind from 'react-autobind';

import MarkingInput from './MarkingInput';
import Select from '../Select';

import styles from '../../css/components/assessment';

const cx = classNames.bind(styles);


class AssessmentComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { exams, handleClick } = this.props;
    return (
      <div className={cx('assessment')}>
        <div className={cx('container')}>
          List comes here
          <div>
          { exams && exams.map(exam => <div><div onClick={handleClick(exam)}>{exam.student.name + ' ' + exam.student.grade}</div></div>)}
          </div>
        </div>
      </div>
    )
  }
}

export default AssessmentComponent;