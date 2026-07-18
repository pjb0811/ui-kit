import Link from './link';
import Paragraph from './paragraph';
import Text from './text';
import Title from './title';

export interface Props extends React.ComponentPropsWithoutRef<'article'> {}

const Typography = ({ children, ...props }: Props) => {
  return <article {...props}>{children}</article>;
};

Typography.Link = Link;
Typography.Paragraph = Paragraph;
Typography.Text = Text;
Typography.Title = Title;

export { Link, Paragraph, Text, Title };

export default Typography;
