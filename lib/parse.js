const fs = require('fs')
const path = require('path')

const YAML = require('js-yaml')
const glob = require('glob')

module.exports = function parse (root, pattern = '**/*-spec.yaml', suffix = '.spec.yaml', prefix = 'api', shadow = false) {
  let definition
  try {
    fs.statSync(root + '/spec/swagger.yaml')
    definition = YAML.load(fs.readFileSync(path.join(root, '/spec/swagger.yaml')))
  } catch (err) {
    // use default swagger.yaml file
    definition = YAML.load(fs.readFileSync(path.join(__dirname, '../swagger.yaml')))
  }
  // TODO remove pattern, use suffix
  definition.paths = glob.sync(pattern, {cwd: root}).sort().reduce((paths, file) => {
    const location = path.join(root, file)
    const yaml = YAML.load(fs.readFileSync(location, 'utf8'))
    if (shadow) {
      Object.assign(paths, yaml)
    } else {
      // TODO remove prefix
      const name = from(suffix, file, prefix)
      paths[name] = yaml
    }
    return paths
  }, {});
  ['definitions', 'parameters'].forEach((target) => {
    definition[target] = loadFiles(`spec/${target}/*.yaml`, root)
  })
  definition['x-pages'] = loadFiles('spec/pages/*.md', root)
  if (isExist(root + '/spec/errors.yaml')) {
    definition['x-errors'] = YAML.load(fs.readFileSync(root + '/spec/errors.yaml'))
  }

  return definition
}

function loadFiles (pattern, root) {
  return glob.sync(pattern, {cwd: root}).reduce((defs, file) => {
    const location = path.join(root, file)
    const name = path.parse(file).name
    defs[name] = fs.readFileSync(location, 'utf8')
    if (path.extname(file) === '.yaml') {
      defs[name] = YAML.load(defs[name])
    }
    return defs
  }, {})
}

function isExist (file) {
  try {
    fs.accessSync(file)
    return true
  } catch (err) {
    return false
  }
}

function from (suffix, location, destPrefix) {
  destPrefix = destPrefix || DEST_PREFIX
  return location.slice(destPrefix.length, -suffix.length)
}