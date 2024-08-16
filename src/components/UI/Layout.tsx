import { FC } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
interface LayOutProps {
  children: React.ReactNode;
  className?: string;
}
const Layout: FC<LayOutProps> = ({ children, className }) => {
  return (
    <>
      <Navbar></Navbar>
      <main className={className}>{children}</main>
      <Footer></Footer>
    </>
  );
};
export default Layout;
