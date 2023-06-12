import hasuraFeatureGenerator from './generator';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readProjectConfiguration } from '@nx/devkit';
import type { Tree } from '@nx/devkit';

import type { HasuraFeatureGeneratorSchema } from './schema';

describe('hasura-feature generator', () => {
  let tree: Tree;
  const options: HasuraFeatureGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await hasuraFeatureGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
