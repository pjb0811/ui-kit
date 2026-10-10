import { Tree } from '@repo/ui';

export default function TreeDemo() {
  return (
    <Tree
      aria-label="Project files"
      checkable
      defaultExpandedKeys={['project']}
      defaultCheckedKeys={['docs']}
      nodes={[
        {
          key: 'project',
          label: 'Project',
          children: [
            { key: 'docs', label: 'Documentation' },
            {
              key: 'src',
              label: 'Source',
              children: [
                { key: 'components', label: 'Components' },
                { key: 'styles', label: 'Styles' },
              ],
            },
            { key: 'locked', label: 'Private files', disabled: true },
          ],
        },
      ]}
    />
  );
}
