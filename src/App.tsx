import { RouterProvider } from 'react-router';
import router from './components/route';
import ThemeWrapper from './context/ThemeWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();
function App() {
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper>
          <ReactQueryDevtools initialIsOpen={false} position='left' />
          <Toaster />
          <RouterProvider router={router}></RouterProvider>
        </ThemeWrapper>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
