import Link from './Link';
import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Typography = ({ children, ...props }: TypographyProps) => {
  return <article {...props}>{children}</article>;
};

Typography.Link = Link;
Typography.Paragraph = Paragraph;
Typography.Text = Text;
Typography.Title = Title;

export { Link, Paragraph, Text, Title };

export default Typography;
