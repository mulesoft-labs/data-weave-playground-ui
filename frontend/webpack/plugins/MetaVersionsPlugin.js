const fs = require('fs');
const path = require('path');
const index = fs.readFileSync('static/index.html', 'utf-8');

function MetaVersionsPlugin(options) {
  // Configure your plugin with options...
}

const getVersion = (module, dependency) => {
  if (dependency) {
    return require(path.resolve(__dirname, `../../node_modules/${module}/package.json`)).devDependencies[dependency];
  } else {
    return require(path.resolve(__dirname, `../../node_modules/${module}/package.json`)).version;
  }
};

const processTemplate = index => {
  const PARSER_VERSION = getVersion('@mulesoft/dw-parser-js');
  const DW_MONACO_VERSION = getVersion('@mulesoft/data-weave-monaco');
  const DW_MONACO_PARSER_VERSION = getVersion('@mulesoft/data-weave-monaco', '@mulesoft/dw-parser-js');
  const BUILD_TIMESTAMP = new Date().toLocaleString();

  console.log('|_ PARSER_VERSION', PARSER_VERSION);
  console.log('|_ DW_MONACO_VERSION', DW_MONACO_VERSION);
  console.log('|_ DW_MONACO_PARSER_VERSION', DW_MONACO_PARSER_VERSION);
  console.log('|_ BUILD_TIMESTAMP', BUILD_TIMESTAMP);

  index = index
    .replace(/\{PARSER_VERSION\}/gim, PARSER_VERSION)
    .replace(/\{DW_MONACO_VERSION\}/gim, DW_MONACO_VERSION)
    .replace(/\{DW_MONACO_PARSER_VERSION\}/gim, DW_MONACO_PARSER_VERSION)
    .replace(/\{BUILD_TIMESTAMP\}/gim, BUILD_TIMESTAMP);
  return index;
};

MetaVersionsPlugin.prototype.apply = compiler => {
  compiler.plugin('emit', function(compilation, callback) {
    //fs.writeFileSync(`build/index.html`, processTemplate(index), 'utf-8');

    compilation.assets['index.html'] = {
      source: function() {
        return processTemplate(index);
      },
      size: function() {
        return 0;
      }
    };

    callback();
  });
};

module.exports = MetaVersionsPlugin;
