// global dependencies
var m = require('mithril')
var _ = require('lodash')
var InternalPromise = Promise || require('bluebird')
window.jQuery = require('jquery') // because backbone is complaining

// Set up internal model and layouts
var User = require('./Users.js')
var layout = require('./layout')

// set up global event emitter
window.__ee = require('event-emitter')()

// set up app structure
var app = {
  view: layout({userModel:User}),
  controller: function(){
    console.log('controller loaded')
  }
}
// initialize app
m.mount(document.getElementById("mapillarydeck-app"), app);
