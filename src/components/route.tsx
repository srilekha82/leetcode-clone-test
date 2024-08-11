import { createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home';
import ProblemsSet from './Pages/Problems';
import Problem from './Pages/Problem/Index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/problems',
    element: <ProblemsSet />,
  },
  {
    path: '/problems/:problemname',
    element: <Problem />,
  },
]);
export default router;
