import { useAuthSlice } from '../../../store/authslice/auth';
import Footer from '../../UI/Footer';
import ProblemsSet from '../Problems';
import HomeNavbar from './HomeNavbar';
import { useQuery } from '@tanstack/react-query';
import getUser from '../../../services/getUser';
import { useLocation } from 'react-router';

function Home() {
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const { state } = useLocation();
  const { data, isError, error } = useQuery({
    queryKey: ['get-user'],
    queryFn: () => getUser(state),
    enabled: isLogedIn && state !== '',
  });

  if (isError) {
    console.log(error);
  }

  return (
    <>
      <HomeNavbar />
      <main className='tw-mt-4'>
        <ProblemsSet user={data?.data ?? null} />
      </main>
      <Footer />
    </>
  );
}

export default Home;
