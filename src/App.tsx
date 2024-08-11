import { RouterProvider } from 'react-router';
import router from './components/route';
import ThemeWrapper from './context/ThemeWrapper';

function App() {
  return (
    <ThemeWrapper>
      <RouterProvider router={router}></RouterProvider>
    </ThemeWrapper>
  );
}

export default App;
