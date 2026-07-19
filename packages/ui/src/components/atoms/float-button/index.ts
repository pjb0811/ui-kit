import BackTop from './back-top';
import FloatButtonImpl, { type Props } from './float-button';

type FloatButtonComponent = typeof FloatButtonImpl & {
  BackTop: typeof BackTop;
};

const FloatButton = FloatButtonImpl as FloatButtonComponent;

FloatButton.BackTop = BackTop;

export default FloatButton;
export type { Props };
