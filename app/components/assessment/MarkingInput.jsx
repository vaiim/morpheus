import React from 'react';
import Select from 'react-select';
import classNames from 'classnames/bind';

import styles from '../../css/components/assessment';

const cx = classNames.bind(styles);

const MarkingInputComponent = ({ data, link, callback, ...props }) => {
  const option = {
    accessType: 'normal',
    pre: data => {
      if(typeof(data) === 'string' && data.length > 0) {
        data = data.toUpperCase()[0];
        if('ABCD'.indexOf(data) >= 0) return data;
      }
      return '';
    }, 
    after: data => {
      callback(data);
    }
  };
  return <input
      style={{width:'30px', border: '1px solid'}}
      className={cx('input-small', 'answer')}
      type="text"
      value={data.get()}
      onFocus={(event) => event.target.select()}
      onChange={data.attach(option)}
      ref={link}
      {...props}
    />
};

export default MarkingInputComponent;
