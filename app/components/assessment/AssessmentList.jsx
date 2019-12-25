import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';

import autoBind from 'react-autobind';

import MarkingInput from './MarkingInput';
import Select from '../Select';

import hourGlassSvg from '../../images/hourglass.svg';
import styles from '../../css/components/assessment';

const cx = classNames.bind(styles);


class AssessmentComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { exams } = this.props;
    return (
      <div className={cx('assessment')}>
        <div className={cx('container')}>
          List comes here
          <div>
          { exams && exams.map(exam => <div><Link to={"/assessment/" + exam._id} key={exam._id}>{exam.student.name + ' ' + exam.student.grade}</Link></div>)}
          </div>
        </div>
      </div>
    )
  }
}

export default AssessmentComponent;