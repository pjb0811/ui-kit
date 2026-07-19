import Content from './content';
import Footer from './footer';
import Header from './header';
import LayoutImpl, { type Props } from './layout';
import Sider from './sider';

type LayoutComponent = typeof LayoutImpl & {
  Content: typeof Content;
  Footer: typeof Footer;
  Header: typeof Header;
  Sider: typeof Sider;
};

const Layout = LayoutImpl as LayoutComponent;

Layout.Content = Content;
Layout.Footer = Footer;
Layout.Header = Header;
Layout.Sider = Sider;

export default Layout;
export type { Props };
export type { Props as ContentProps } from './content';
export type { Props as FooterProps } from './footer';
export type { Props as HeaderProps } from './header';
export type { Props as SiderProps } from './sider';
