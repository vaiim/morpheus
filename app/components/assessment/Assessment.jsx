import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    this.links = {
      english: this.getRefs(),
      math: this.getRefs(),
      general: this.getRefs()
    };
  }

  getRefs(created=[], count=20) {
    if(count <= 0) return created;
    created.push(React.createRef());
    return this.getRefs(created, count - 1);
  }

  inputChanged(index, refs, nextRefs) {
    return (data) => {
      if(!data) return;
      if(index >= 19) {
        nextRefs && nextRefs[0].current.focus();
      }
      else {
        refs[index + 1].current.focus();
      }
    }
  }

  getField(index, data, refs, nextRefs) {
    return <div style={{width:'100%', display: 'flex'}} key={data.getName()}>
              <div style={{width:'20px'}}>
                { index + 1 }
              </div>
              {refs && <MarkingInput data={data} link={refs[index]} callback={this.inputChanged(index, refs, nextRefs)} />}
            </div>
  }

  createFields(data, refs, nextRefs=null) {
    const fields = [[], [], [], []];
    for(let i=0;i<20;i++) {
      fields[parseInt(i/5)].push(this.getField(i, data.access(i), refs, nextRefs));
    }
    return fields;
  }

  render() {
    const { student, answers, submit, years } = this.props;
    return (
      <div
        className={cx('assessment')}
      >
        <div className={cx('container')}>
          <img className={cx('loading')} alt="loading" src={hourGlassSvg} />
          <div className={cx('email-container')}>
            <form onSubmit={submit}>
              First Name
              <input
                className={cx('input')}
                type="text"
                onChange={student.access('firstName').attach()}
                placeholder="First Name"
              />
              Family Name
              <input
                className={cx('input')}
                type="text"
                onChange={student.access('familyName').attach()}
                placeholder="Family Name"
              />
              Grade
              <Select
                height={'3rem'}
                placeholder="선택해 주세요" 
                data={student.access('grade')}
                options={years}
              />
              <input
                className={cx('button')}
                type="submit"
                value={'Submit'} />
            </form>
          </div>
        </div>
        <div className={cx('container')}>
          <div className={cx('answers-section')}>
            { this.createFields(answers.access('english'), this.links['english'], this.links['math']).map((x, i) => <div key={i}>{x}</div>) }
          </div>
          <div className={cx('answers-section')}>
            { this.createFields(answers.access('math'), this.links['math'], this.links['general']).map((x, i) => <div key={i}>{x}</div>) }
          </div>
          <div className={cx('answers-section')}>
            { this.createFields(answers.access('general'), this.links['general']).map((x, i) => <div key={i}>{x}</div>) }
          </div>
        </div>
      </div>
    )
  }
}


// Connects React component to the redux store
// It does not modify the component class passed to it
// Instead, it returns a new, connected component class, for you to use.
export default AssessmentComponent;