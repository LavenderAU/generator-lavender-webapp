/*global describe, beforeEach, it*/

var path = require('path');
var assert = require('assert');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var _ = require('underscore');

describe('Lavender webapp generator', function() {
  // not testing the actual run of generators yet
  it('the generator can be required without throwing', function() {
    this.app = require('../app');
  });

  describe('run test', function() {

    var expectedContent = [
      ['bower.json', /"name": "tmp"/],
      ['package.json', /"name": "tmp"/]
    ];
    var expected = [
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      'package.json',
      'bower.json',
      'Gruntfile.js',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html'
    ];

    var options = {
      'skip-install-message': true,
      'skip-install': true,
      'skip-welcome-message': true,
      'skip-message': true
    };

    var runGen;

    beforeEach(function() {
      runGen = helpers
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withGenerators([
          [helpers.createDummyGenerator(), 'mocha:app']
        ]);
    });

    it('creates expected files', function(done) {
      runGen.withOptions(options).on('end', function() {

        assert.file([].concat(
          expected,
          'app/styles/main.css',
          'app/scripts/main.js'
        ));
        assert.noFile([
          'app/styles/main.less'
        ]);

        assert.fileContent(expectedContent);
        assert.noFileContent([
          ['Gruntfile.js', /modernizr/],
          ['app/index.html', /modernizr/],
          ['bower.json', /modernizr/],
          ['package.json', /modernizr/],
          ['Gruntfile.js', /bootstrap/],
          ['app/index.html', /bootstrap/],
          ['bower.json', /bootstrap/],
          ['Gruntfile.js', /less/],
          ['app/index.html', /Less/],
          ['.gitignore', /\.tmp/],
          ['package.json', /grunt-contrib-less/],
          ['Gruntfile.js', /bootstrap-less/],
          ['bower.json', /bootstrap-less/]
        ]);
        done();
      });
    });

    it('creates expected modernizr components', function(done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeModernizr']
      })
        .on('end', function() {

          assert.fileContent([
            ['Gruntfile.js', /modernizr/],
            ['app/index.html', /modernizr/],
            ['bower.json', /modernizr/],
            ['package.json', /modernizr/],
          ]);

          done();
        });
    });

    it('creates expected bootstrap components', function(done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeBootstrap']
      })
        .on('end', function() {

          assert.fileContent([
            ['Gruntfile.js', /bootstrap/],
            ['app/index.html', /Bootstrap/],
            ['bower.json', /bootstrap/],
            ['bower.json', /respond/]
          ]);

          done();
        });
    });

    it('creates expected LESS components', function(done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeLess']
      })
        .on('end', function() {

          assert.fileContent([
            ['Gruntfile.js', /less/],
            ['app/index.html', /Less/],
            ['.gitignore', /\.tmp/],
            ['package.json', /grunt-contrib-less/]
          ]);

          assert.noFileContent([
            ['package.json', /grunt-contrib-less/]
          ]);

          done();
        });
    });

    it('creates expected CoreJS components', function(done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeCoreJS']
      })
        .on('end', function() {

          assert.fileContent([
            ['app/index.html', /Core JS/],
            ['bower.json', /core-js/],
            ['app/scripts/main.js', /core.wirings.Module/]
          ]);

          assert.noFileContent([
            ['app/scripts/main.js', /Allo/]
          ]);

          done();
        });
    });

    it('creates expected 3rd party components', function(done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeGreensock', 'html5shiv', 'raphael', 'includeAccounting']
      })
        .on('end', function() {

          assert.fileContent([
            ['app/index.html', /Greensock/],
            ['bower.json', /greensock/],

            ['app/index.html', /HTML5shiv/],
            ['bower.json', /html5shiv/],

            ['app/index.html', /Raphael/],
            ['bower.json', /raphael/],

            ['app/index.html', /Accounting/],
            ['bower.json', /accountingjs/]
          ]);

          done();
        });
    });

    it('creates expected jQuery UI components', function(done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeJqueryUI']
      })
        .on('end', function() {

          assert.fileContent([
            ['app/index.html', /jQuery UI/],
            ['bower.json', /jquery-ui/],
            ['bower.json', /jqueryui-touch-punch/]
          ]);

          done();
        });
    });

    it('creates expected LESS and Bootstrap components', function(done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeLess', 'includeBootstrap']
      }).on('end', function() {

        assert.fileContent([
          ['Gruntfile.js', /bootstrap-less/],
          ['bower.json', /bootstrap-less/]
        ]);

        done();
      });
    });
  });
});