const path = require('path');
const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');
const NodeJsInputFileSystem = require('enhanced-resolve/lib/NodeJsInputFileSystem');
const CachedInputFileSystem = require('enhanced-resolve/lib/CachedInputFileSystem');

const CACHED_DURATION = 60000;
const fileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), CACHED_DURATION);

const resolver = ResolverFactory.createResolver({
  alias: {
    palette: path.resolve(__dirname, 'src/palette')
  },
  extensions: ['.css'],
  modules: ['src', 'node_modules'],
  useSyncFileSystemCalls: true,
  fileSystem
});

module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-import': {
      resolve(id, basedir) {
        return resolver.resolveSync({}, basedir, id);
      }
    },
    'postcss-nested': {},
    'postcss-simple-extend': {},
    'postcss-simple-vars': {}
  }
};
