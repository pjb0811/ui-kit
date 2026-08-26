import { Container } from '@repo/ui';

export default function ContainerDemo() {
  return (
    <Container
      maxWidth="md"
      className="rounded-lg border border-dashed border-gray-300 py-8
        text-center dark:border-gray-700"
    >
      Centered, max-width <code>md</code> content with responsive gutters.
    </Container>
  );
}
