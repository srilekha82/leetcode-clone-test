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
      {Object.keys(supportedLanguages).map((l, id) => {
        return (
          <MenuItem key={`${id}${l}`} value={l}>
            {
              //@ts-ignore
              supportedLanguages[l]
            }
          </MenuItem>
        );
      })}
    </Select>
  );
}
