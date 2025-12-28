import { cn } from '@repo/ui/utils';

import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Sider from './Sider';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Layout = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={cn('flex w-full flex-wrap content-start', className)}
      {...props}
    >
      {children}
    </div>
  );
};

Layout.Content = Content;
Layout.Footer = Footer;
Layout.Header = Header;
Layout.Sider = Sider;

export { Content, Footer, Header, Sider };

export default Layout;
