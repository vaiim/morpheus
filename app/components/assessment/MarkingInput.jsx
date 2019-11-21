import React from 'react';
import Select from 'react-select';
import classNames from 'classnames/bind';

import styles from '../../css/components/assessment';

const cx = classNames.bind(styles);

const SelectComponent = ({ data, option=null, ...props }) => {
  if(option) option.accessType = 'normal';
  return <input
      style={{width:'40px', border: '1px solid'}}
      className={cx('answer')}
      type="text"
      onChange={data.attach(option)}
      {...props}
    />
};

export default SelectComponent;
