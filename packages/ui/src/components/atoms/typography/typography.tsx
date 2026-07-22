export interface Props extends React.ComponentPropsWithoutRef<'article'> {}

const Typography = ({ children, ...props }: Props) => {
  return <article {...props}>{children}</article>;
};

export default Typography;
