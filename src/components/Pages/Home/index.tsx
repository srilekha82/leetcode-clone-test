import Footer from '../../UI/Footer';
import ProblemsSet from '../Problems';
import HomeNavbar from './HomeNavbar';

function Home() {
  return (
    <>
      <HomeNavbar />
      <main className='tw-mt-4'>
        <ProblemsSet />
      </main>
      <Footer />
    </>
  );
}

export default Home;
