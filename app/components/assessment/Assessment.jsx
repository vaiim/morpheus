import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';

import { Link } from 'react-router';

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
    return <div className={cx('marking-field')} key={data.getName()}>
              <div className={cx('marking-order')}>
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
    const { student, answers, submit, years, pdf } = this.props;
    return (
      <div
        className={cx('assessment')}
      >
          <div className={cx('email-container')}>
            <form onSubmit={submit}>
              <span className={cx('label')}>First Name :</span>
              <input
                className={cx('input')}
                type="text"
                value={student.access('firstName').get()}
                onChange={student.access('firstName').attach()}
                placeholder="First Name"
              />
              <span className={cx('label-second')}>Surname : </span>
              <input
                className={cx('input')}
                type="text"
                value={student.access('familyName').get()}
                onChange={student.access('familyName').attach()}
                placeholder="Family Name"
              />
              <br/>
              Grade
              <Select
                width="180px"
                height={'30px'}
                placeholder="선택해 주세요" 
                data={student.access('grade')}
                options={years}
              />
              <br />
              <br />
              <div className={cx('container-wrapper')}>
                <div className={cx('answers-container')}>
                  <div className={cx('answers-section')}>
                    <div className={cx('answers-section-title')} style={{'backgroundColor': 'red'}}>
                      English
                    </div>
                    <div className={cx('answers')}>
                    { this.createFields(answers.access('english'), this.links['english'], this.links['math']).map((x, i) => <div key={i}>{x}</div>) }
                    </div>
                  </div>
                  <div className={cx('answers-section')}>
                    <div className={cx('answers-section-title')} style={{'backgroundColor': 'green'}}>
                      Mathematics
                    </div>
                    <div className={cx('answers')}>
                    { this.createFields(answers.access('math'), this.links['math'], this.links['general']).map((x, i) => <div key={i}>{x}</div>) }
                    </div>
                  </div>
                  <div className={cx('answers-section')}>
                    <div className={cx('answers-section-title')} style={{'backgroundColor': 'orange'}}>
                      General Abilities
                    </div>
                    <div className={cx('answers')}>
                    { this.createFields(answers.access('general'), this.links['general']).map((x, i) => <div key={i}>{x}</div>) }
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <br />
              <div className={cx('button-area')}>
                <Link className={cx('button-back')} to={'/'}>
                  Back
                </Link>
                {!pdf && <input
                          className={cx('button')}
                          type="submit"
                          value={'Submit'} />}
                {pdf && <a href={"/assets/" + pdf + ".pdf"} target="_blank">Open PDF</a>}
              </div>
            </form>
          </div>
      </div>
    )
  }
}


// Connects React component to the redux store
// It does not modify the component class passed to it
// Instead, it returns a new, connected component class, for you to use.
export default AssessmentComponent;