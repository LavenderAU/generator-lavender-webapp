'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.pkg = require('../package.json');
  },

  askFor: function() {
    var done = this.async();

    // welcome message
    if (!this.options['skip-welcome-message']) {
      this.log(require('yosay')());
      this.log(chalk.magenta(
        'Out of the box I include HTML5 Boilerplate, jQuery, and a ' +
        'Gruntfile.js to build your app.'
      ));
    }

    var prompts = [{
      name: 'projectName',
      message: 'What is the job code for this project?',
      default: 'ABC1234'
    }, {
      name: 'devFolder',
      message: 'Ok so, where do you want to put the dev source files?',
      default: 'app'
    }, {
      name: 'buildFolder',
      message: 'And the compiled files?',
      default: 'dist'
    }, {
      name: 'devFile',
      message: 'Cheerios. Now enter the name of the html dev file?',
      default: 'index.html'
    }, {
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'jQuery v2 (default jQuery 1.11.1 will be installed)',
        value: 'jquery2'
      }, {
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: false
      }, {
        name: 'Less',
        value: 'includeLess',
        checked: false
      }, {
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: false
      }, {
        name: 'Core JS',
        value: 'includeCoreJS'
      }, {
        name: "Greensock TweenMax",
        value: "includeGreensock"
      }, {
        name: "HTML5Shiv",
        value: "includeHtml5shiv"
      }, {
        name: "Raphael JS",
        value: "includeRaphael"
      }, {
        name: "accounting.js",
        value: "includeAccounting"
      }, {
        name: "Jquery UI",
        value: "includeJqueryUI"
      }]
    }];

    this.prompt(prompts, function(answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.projectName = answers.projectName;
      this.devFolder = answers.devFolder;
      this.devFile = answers.devFile;

      this.jquery2 = hasFeature('jquery2');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeLess = hasFeature('includeLess');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeCoreJS = hasFeature('includeCoreJS');
      this.includeGreensock = hasFeature('includeGreensock');
      this.includeHtml5shiv = hasFeature('includeHtml5shiv');
      this.includeRaphael = hasFeature('includeRaphael');
      this.includeAccounting = hasFeature('includeAccounting');
      this.includeJqueryUI = hasFeature('includeJqueryUI');

      done();
    }.bind(this));
  },

  gruntfile: function() {
    this.template('Gruntfile.js');
  },

  packageJSON: function() {
    this.template('_package.json', 'package.json');
  },

  git: function() {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
  },

  bower: function() {
    var bower = {
      name: this._.slugify(this.appname),
      private: true,
      dependencies: {}
    };

    if (this.jquery2) {
      bower.dependencies.jquery = "~2.1.1";
    } else {
      bower.dependencies.jquery = "~1.11.1";
    }

    if (this.includeBootstrap) {
      var bs = 'bootstrap' + (this.includeLess ? '-less' : '');
      bower.dependencies[bs] = "~3.2.0";
      bower.dependencies.respond = "1.4.2";
    }

    if (this.includeModernizr) {
      bower.dependencies.modernizr = "~2.8.2";
    }

    if (this.includeCoreJS) {
      bower.dependencies['core-js'] = "";
    }

    if (this.includeGreensock) {
      bower.dependencies.greensock = "~1.13.2";
    }

    if (this.includeHtml5shiv) {
      bower.dependencies.html5shiv = "~3.7.2";
    }

    if (this.includeRaphael) {
      bower.dependencies.raphael = "~2.1.2";
    }

    if (this.includeAccounting) {
      bower.dependencies.accountingjs = "~0.3.2";
    }

    if (this.includeJqueryUI) {
      bower.dependencies["jquery-ui"] = "~1.11.1";
      bower.dependencies["jqueryui-touch-punch"] = "";
    }

    //this.copy('bowerrc', '.bowerrc');
    this.template('bowerrc', '.bowerrc');
    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  jshint: function() {
    this.copy('jshintrc', '.jshintrc');
  },

  editorConfig: function() {
    this.copy('editorconfig', '.editorconfig');
  },

  mainStylesheet: function() {
    var css = 'main.' + (this.includeLess ? 'less' : 'css');
    this.template(css, this.devFolder + '/styles/' + css);
  },

  writeIndex: function() {
    this.indexFile = this.engine(
      this.readFileAsString(join(this.sourceRoot(), this.devFile)),
      this
    );

    // wire Bootstrap plugins
    if (this.includeBootstrap) {
      var bs = 'bower_components/bootstrap' + (this.includeLess ? '-less' : '') + '/js/';

      this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        optimizedPath: 'scripts/plugins.js',
        sourceFileList: [
          bs + 'affix.js',
          bs + 'alert.js',
          bs + 'dropdown.js',
          bs + 'tooltip.js',
          bs + 'modal.js',
          bs + 'transition.js',
          bs + 'button.js',
          bs + 'popover.js',
          bs + 'carousel.js',
          bs + 'scrollspy.js',
          bs + 'collapse.js',
          bs + 'tab.js'
        ],
        searchPath: '.'
      });
    }

    this.indexFile = this.appendFiles({
      html: this.indexFile,
      fileType: 'js',
      optimizedPath: 'scripts/main.js',
      sourceFileList: ['scripts/main.js'],
      searchPath: [this.devFolder, '.tmp']
    });
  },

  app: function() {
    this.directory(this.devFolder);
    this.mkdir(this.devFolder + '/scripts');
    this.mkdir(this.devFolder + '/styles');
    this.mkdir(this.devFolder + '/images');
    this.mkdir(this.devFolder + '/images/sprite-src');
    this.write(this.devFolder + '/' + this.devFile, this.indexFile);

    if (this.includeCoreJS) {
      this.copy('core.main.js', this.devFolder + '/scripts/main.js');
    } else {
      this.write(this.devFolder + '/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
    }
  },

  install: function() {
    this.on('end', function() {
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install']
        }
      });

      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install']
        });
      }
    });
  }
});