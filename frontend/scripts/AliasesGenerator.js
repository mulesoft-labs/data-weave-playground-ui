// @ts-check

const program = require('commander');
const fs = require('fs');

function isDirectory(path) {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

function generateJestAliases(aliases, packagePath) {
  var moduleNameMapper = Object.keys(aliases).reduce((acc, key) => {
    let path = aliases[key];
    const isDir = isDirectory(path);
    const scope = isDir ? '(.*)' : '';
    if (isDir) {
      path = `${path}$1`;
    }
    return { ...acc, [`^${key}${scope}`]: `<rootDir>/${path}` };
  }, {});

  const package = require(packagePath);
  return {
    ...package,
    jest: {
      ...package.jest,
      moduleNameMapper: {
        ...package.jest.moduleNameMapper,
        ...moduleNameMapper
      }
    }
  };
}

function generateTsAliases(aliases, tsconfigPath) {
  const paths = Object.keys(aliases).reduce((acc, key) => {
    const path = aliases[key];
    const isDir = isDirectory(path);
    const scope = isDir ? '*' : '';
    const matches = isDir ? [`${path}${scope}`, path] : [path];
    return { ...acc, [`${key}${scope}`]: matches };
  }, {});

  const tsconfig = require(tsconfigPath);
  return {
    ...tsconfig,
    compilerOptions: {
      ...tsconfig.compilerOptions,
      paths
    }
  };
}

program
  .version('0.1.0')
  .usage('[options] <file>')
  .option('-j, --jest [jest]', 'Path to package.json file')
  .option('-t, --ts [ts]', 'Path to tsconfig.json file');

program.parse(process.argv);
if (!program.args[0]) {
  console.error('a path to aliases.js is required');
  process.exit(1);
}

console.log('\nGenerating aliases...\n');

const aliases = require(`../${program.args[0]}`);
if (program.jest) {
  const path2Jest = `../${program.jest}`;
  const packageJsonContent = generateJestAliases(aliases, path2Jest);
  fs.writeFile(program.jest, JSON.stringify(packageJsonContent, null, 2), 'utf8', function(err) {
    if (err) return console.log(err);
    console.log(`${path2Jest} generated`);
  });
}

if (program.ts) {
  const path2TsConfig = `../${program.ts}`;
  const packageJsonContent = generateTsAliases(aliases, path2TsConfig);
  fs.writeFile(program.ts, JSON.stringify(packageJsonContent, null, 2), 'utf8', function(err) {
    if (err) return console.log(err);
    console.log(`${path2TsConfig} generated`);
  });
}
