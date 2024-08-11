import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { createContext, FC, useContext, useMemo, useState } from 'react';
import { contextWrapperProps, themeContext } from '../utils/types';

export const ThemeWrapperContext = createContext<themeContext>({
  toggleColorMode: () => {},
  colorMode: 'light',
});
export const usethemeUtils = () => {
  const themeutils = useContext(ThemeWrapperContext);
  return themeutils;
};
const ThemeWrapper: FC<contextWrapperProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const darkTheme = createTheme({
    palette: {
      mode,
    },
  });
  const themeWrapperUtils = useMemo(
    () => ({
      colorMode: mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          return prevMode === 'light' ? 'dark' : 'light';
        });
      },
    }),
    [mode]
  );
  return (
    <ThemeWrapperContext.Provider value={themeWrapperUtils}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeWrapperContext.Provider>
  );
};
export default ThemeWrapper;
