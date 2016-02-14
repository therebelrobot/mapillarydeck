// global dependencies
var m = require('mithril')
var _ = require('lodash')
var InternalPromise = Promise || require('bluebird')
window.jQuery = require('jquery') // because backbone is complaining

// Set up internal model and layouts
var User = require('./Users.js')
var users = window.users = new User.UserList()
var layout = require('./layout')

var appSettings = {}

// set up global event emitter
window.__ee = require('event-emitter')()

// set up app structure
var app = {
  view: layout({users:users, settings:appSettings}),
  controller: function(){
    console.log('controller loaded')
    // halt rendering until user info is pulled
    m.startComputation()

    // set up temorary in-app settings
    appSettings.searchQuery = m.prop('')

    // set up event listeners
    window.__ee.on('ALLUSERS:showUserColumn', showUserColumn)
    window.__ee.on('USER:hideUserColumn', hideUserColumn)

    // Fetch the first batch of user info
    users.fetch().then(()=>{
      console.log('users loaded')
      // render now
      m.endComputation()
    })
  }
}

// initialize app
m.mount(document.getElementById("mapillarydeck-app"), app);

// set up event fired functions
function showUserColumn (data) {
  console.log('showing new column!', data.user)
  var thisUser = users.find({user:data.user})
  thisUser.set({inView:true})
}
function hideUserColumn (data) {
  console.log('showing new column!', data.user)
  var thisUser = users.find({user:data.user})
  thisUser.set({inView:false})
}
