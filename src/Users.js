var BackboneModel = require('@kahwee/backbone-deep-model')
var BackboneCollection = require('backbone').Collection

var m = require('mithril')
var _ = require('lodash')
var InternalPromise = Promise || require('bluebird')
var request = require('superagent')

var User = BackboneModel.extend({
  defaults: {

  },
  initialize: function InitializeUserModel() {
    this.on('change', function (model) {
      console.log('something changed in user!')
      m.redraw(true)
    })
  },
  fetch: function fetchUserModel (props) {
    return new InternalPromise((resolve, reject) => {
      var url
      var userCall = request.get(url)
      userCall.type('json')
      userCall.accept('json')
      userCall.end((err, res) => {
        if (err) return reject(err)

      })
    })
  },
  fetchFeed: function fetchFeedUserModel (props) {
    return new InternalPromise((resolve, reject) => {
      var url
      var userFeedCall = request.get(url)
      userFeedCall.type('json')
      userFeedCall.accept('json')
      userFeedCall.end((err, res) => {
        if (err) return reject(err)

      })
    })
  }
})

var UserList = BackboneCollection.extend({
  model: User,
  initialize: function initializeUserList () {
    console.log('User List Collection instantiated')
  },

  fetch: function fetchUserListCollection (props) {
    return new InternalPromise((resolve, reject) => {
      var url
      var envListCall = request.get(url)
      envListCall.type('json')
      envListCall.accept('json')
      envListCall.end((err, res) => {
        if (err) return reject(err)
      })
    })
  }
})

module.exports = {
  UserList: UserList,
  User: User
}
