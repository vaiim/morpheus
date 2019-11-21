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
  }

  componentDidMount() {
    console.log('this.refs init:', this.refs);
  }

  getField(index, data) {
    const option = {
      pre: (input) => {
        console.log('this.refs', this.refs);
        // console.log(this.refs, this.refs[data.getName()]);
        // this.refs[data.getName()].nextSibling.focus();
        return input
      }
    }
    this[data.getName()] = React.createRef();
    return <div style={{width:'100%', display: 'flex'}} key={data.getName()}>
              <div style={{width:'20px'}}>
                { index }
              </div>
              <MarkingInput data={data} option={option} ref={this[data.getName()]} />
            </div>
  }

  createFields(data) {
    const fields = [[], [], [], []];
    for(let i=0;i<20;i++) {
      fields[parseInt(i/5)].push(this.getField(i+1, data.access(i)));
    }
    return fields;
  }

  render() {
    const { user, answers, submit, years } = this.props;
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
              Grade
              <Select
                height={'3rem'}
                placeholder="선택해 주세요" 
                data={user.access('grade')}
                options={years}
              />
              <input ref="submit"
                className={cx('button')}
                type="submit"
                value={'Submit'} />
            </form>
          </div>
        </div>
        <div className={cx('container')}>
          <div className={cx('answers-section')}>
            { this.createFields(answers.access('english')).map((x, i) => <div key={i}>{x}</div>) }
          </div>
          <div className={cx('answers-section')}>
            { this.createFields(answers.access('math')).map((x, i) => <div key={i}>{x}</div>) }
          </div>
          <div className={cx('answers-section')}>
            { this.createFields(answers.access('general')).map((x, i) => <div key={i}>{x}</div>) }
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