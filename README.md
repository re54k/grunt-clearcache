# grunt-clearcache

> Clear file cache by http request. Netease specially.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-clearcache --save
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-clearcache');
```

## The "clearcache" task

### Overview
In your project's Gruntfile, add a section named `clearcache` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  options: {
    url: 'http://127.0.0.1/Pro/Wap/full.json?',
    defaultN: '1-6'
  },
  clear: {
      basedir: 'img{n}.cache.netease.com/apps/wap/',
      css: '2',
      js: '1,3',
      img: '1-3',
      localRoot: 'test/upload/'
  }
})
```

### Options

#### options.url
Type: `String`
Default value: `''`

A valid url of clear interface. Don't forget the last '?'.

#### options.defaultN
Type: `String`
Default value: `'1-6'`

This value is used for server numbers. A valid string should be in such formats: '2', '3,5,6', '3-6'. These will be convert to Array ([2], [3,5,6], [3,4,5,6]).
In the target, value of properties as "css, js, img" are the same to defaultN's rule.

