import { FC } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
interface LayOutProps {
  children: React.ReactNode;
}
const Layout: FC<LayOutProps> = ({ children }) => {
  return (
    <>
      <Navbar></Navbar>
      <main>{children}</main>
      <Footer></Footer>
    </>
  );
};
export default Layout;
