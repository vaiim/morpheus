import React from 'react';
import Select from 'react-select';

const SelectComponent = ({ height='100%', width='100%', placeholder, data, options, ...props }) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted gray',
      color: state.isSelected ? 'white' : 'black',
      backgroundColor: state.isSelected ? '#f46e1f' : 'white',
      padding: '0.15rem',
    }),
    control: (provided, state) => ({
      ...provided,
      width,
      height,
      boxShadow: "none",
      borderColor: 'gray',
      '&:hover': { borderColor: '#f46e1f' }
    })
  }
  const handler = pair => {
    onChange(pair.value);
  }
  return <Select 
            styles={customStyles}
            value={{value: data.get(), label:data.get()}}
            onChange={pair => data.attach('direct')(pair.value)}
            options={options.map(x => ({value:x, label:x}))}
            placeholder={placeholder}
            isSearchable={false}
            {...props}
          />
};

export default SelectComponent;
