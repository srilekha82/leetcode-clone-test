import { RouterProvider } from 'react-router';
import router from './components/route';
import ThemeWrapper from './context/ThemeWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper>
        <RouterProvider router={router}></RouterProvider>
      </ThemeWrapper>
    </QueryClientProvider>
  );
}

export default App;
