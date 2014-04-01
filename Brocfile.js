module.exports = function (broccoli) {
  var filterTemplates = require('broccoli-template')
  var uglifyJavaScript = require('broccoli-uglify-js')
  var compileES6 = require('broccoli-es6-concatenator')
  var pickFiles = require('broccoli-static-compiler')
  var env = require('broccoli-env').getEnv()            ;

  console.log(env);

  function preprocess (tree) {
    tree = filterTemplates(tree, {
      extensions: ['hbs', 'handlebars'],
      compileFunction: 'Ember.Handlebars.compile'
    })
    return tree
  }

  var app = broccoli.makeTree('app')
  app = pickFiles(app, {
    srcDir: '/',
    destDir: 'appkit' // move under appkit namespace
  })
  app = preprocess(app)

  var tests = broccoli.makeTree('tests')
  tests = pickFiles(tests, {
    srcDir: '/',
    destDir: 'appkit/tests'
  })
  tests = preprocess(tests)

  var vendor = broccoli.makeTree('vendor')

  var sourceTrees = [app, vendor]
  if (env !== 'production') {
    sourceTrees.push(tests)
  }
  sourceTrees = sourceTrees.concat(broccoli.bowerTrees())

  var appAndDependencies = new broccoli.MergedTree(sourceTrees)

  var applicationJs = compileES6(appAndDependencies, {
    loaderFile: 'loader.js',
    ignoredModules: [
      'ember/resolver'
    ],
    inputFiles: [
      'appkit/**/*.js'
    ],
    legacyFilesToAppend: [
      'jquery.js',
      'handlebars.js',
      'ember.js',
      'ember-data.js',
      'ember-resolver.js'
    ],
    wrapInEval: false,
    outputFile: '/assets/app.js'
  })

  if (env === 'production') {
    applicationJs = uglifyJavaScript(applicationJs, {
      // mangle: false,
      // compress: false
    })
  }

  var publicFiles = broccoli.makeTree('public')

  return [applicationJs, publicFiles]
}
