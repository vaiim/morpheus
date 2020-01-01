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
    this.state = {mouseIndex: -1};
    autoBind(this);
  }

  mouseOver(index) {
    return event => this.setState({mouseIndex: index});
  }

  render() {
    const { exams, handleClick } = this.props;
    return (
      <div className={cx('assessment')}>
        <div className={cx('list-container')}>
          <div>
            <div className={cx('list-header', 'padding-left')} style={{width: '350px'}}>Name</div>
          { exams && exams.map((exam, i) => <div className={cx('list-item', 'padding-left', {hover: i === this.state.mouseIndex})} key={exam._id} onClick={handleClick(exam)} onMouseOver={this.mouseOver(i)}>
            {exam.student.name}</div>)
          }
          </div>
          <div>
            <div className={cx('list-header')} style={{width: '130px'}}>Grade</div>
          { exams && exams.map((exam, i) => <div className={cx('list-item', {hover: i === this.state.mouseIndex})} key={exam._id} onClick={handleClick(exam)} onMouseOver={this.mouseOver(i)}>
            {exam.student.grade}</div>)}
          </div>
          <div>
            <div className={cx('list-header')} style={{width: '230px'}}>Registration Date</div>
          { exams && exams.map((exam, i) => <div className={cx('list-item', {hover: i === this.state.mouseIndex})} key={exam._id} onClick={handleClick(exam)} onMouseOver={this.mouseOver(i)}>
            {exam.created && String(exam.created).split('T')[0]}</div>)}
          </div>
        </div>
      </div>
    )
  }
}

export default AssessmentComponent;