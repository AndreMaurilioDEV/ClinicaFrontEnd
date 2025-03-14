import { useContext } from 'react';
import themeContext from '../theme/themeContext';
import useFormInput from './useFormInput';

export const useFilters = () => {
  const theme = useContext(themeContext);
  const name = useFormInput('');
 
  const handleChange = (value: string) => {
    name.onChange(value);
    theme.handleFilter(value);
  };

  return {
    name,
    handleChange
  };
};