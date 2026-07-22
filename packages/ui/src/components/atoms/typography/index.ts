import Link from './link';
import Paragraph from './paragraph';
import Text from './text';
import Title from './title';
import TypographyImpl, { type Props } from './typography';

type TypographyComponent = typeof TypographyImpl & {
  Link: typeof Link;
  Paragraph: typeof Paragraph;
  Text: typeof Text;
  Title: typeof Title;
};

const Typography = TypographyImpl as TypographyComponent;

Typography.Link = Link;
Typography.Paragraph = Paragraph;
Typography.Text = Text;
Typography.Title = Title;

export { Link, Paragraph, Text, Title };
export default Typography;
export type { Props };
