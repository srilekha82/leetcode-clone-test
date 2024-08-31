import { MenuItem, Select } from '@mui/material';
import { supportedLanguages } from '../../../constants/Index';

export default function LanguageDropDown({
  language,
  handleChange,
}: {
  handleChange: (id: number) => void;
  language: number;
}) {
  return (
    <Select
      labelId='language'
      id='supported language'
      value={language}
      label='supported language'
      onChange={(event) => handleChange(event.target.value as number)}
      size='small'
    >
      {supportedLanguages.map((l) => {
        return <MenuItem value={l.id}>{l.name}</MenuItem>;
      })}
    </Select>
  );
}
