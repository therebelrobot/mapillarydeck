var BackboneModel = require('@kahwee/backbone-deep-model')
var BackboneCollection = require('backbone').Collection

var m = require('mithril')
var _ = require('lodash')
var InternalPromise = Promise || require('bluebird')
var request = require('superagent')

var localForage = require('localforage')

var clientID = 'Tm01Y1kzQWpyN2RlYWczRzM0MnRVUTpjNzQ0ZDVlYTJlMTYyMmE5'

var defaultUserList = [
  'jesolem',
  'gyllen',
  'peterneubauer',
/*'yubkuang',*/
/*'paugargallo',*/
/*'oscarlorentz',*/
/*'kamfski',*/
/*'uddback',*/
/*'globalbanana',*/
/*'janineyoong',*/
/*'travel_193',*/
/*'juhaszlevi',*/
/*'katrinhumal'*/
/* None of these users returned anything */
  'julien_n',
  'mgageo',
  'riblit',
  'razia',
  'haxpett',
  'nielsbeck',
  'roshan'
]

var User = BackboneModel.extend({
  defaults: {
    about: '',
    avatar: false,
    connections_all: 0,
    distance_all: 0,
    histogram: [],
    images_none_processed: 0,
    images_hidden: 44,
    images_all: 0,
    member_since: '',
    user: '',
    user_uuid: '',
    feed: [],
    inView: false,
    reverseFeed: false
  },
  initialize: function InitializeUserModel () {
    this.on('change', function (model) {
      var thisJSONtoSave = model.toJSON()
      localForage.setItem(model.get('user'), thisJSONtoSave)
      m.redraw(true)
    })
  },
  fetch: function fetchUserModel (props) {
    return new InternalPromise((resolve, reject) => {
      localForage.getItem(this.get('user')).then((storedUser) => {
        if (!storedUser || !storedUser.avatar) {
          var url = 'https://a.mapillary.com/v2/u/' +
            this.get('user') +
            '?client_id=' + clientID
          var userCall = request.get(url)
          userCall.type('json')
          userCall.accept('json')
          userCall.end((err, res) => {
            if (err) {return reject(err)}
            if (res.body) {
              res.body.avatar = res.body.avatar || 'https://placeholdit.imgix.net/~text?txtsize=20&txt=avatar%20not%20available&w=100&h=100'
              this.set(res.body)
              return this.fetchFeed().then(resolve).catch(reject)
            }
            reject()
          })
        } else {
          console.log('loading from local data')
          this.set(storedUser)
          resolve()
        }
      })

    })
  },
  fetchFeed: function fetchFeedUserModel (props) {
    return new InternalPromise((resolve, reject) => {
      var url = 'https://a.mapillary.com/v2/u/' +
        this.get('user') +
        '/feed?client_id=' + clientID
      var userFeedCall = request.get(url)
      userFeedCall.type('json')
      userFeedCall.accept('json')
      userFeedCall.end((err, res) => {
        if (err) {return reject(err)}
        if (res.body) {
          var currentFeed = this.get('feed')
          currentFeed.concat(res.body.feed)
          currentFeed = _.uniq(currentFeed)
          this.set({feed:currentFeed})
          return resolve()
        }
        reject()
      })
    })
  },
  pollFeed: function pollFeedUserModel (props) {
    return this.fetchFeed().then(()=>{
      window.setTimeout(()=>{
          this.pollFeed(props)
      }, 10000)
    })
  }
})

var UserList = BackboneCollection.extend({
  model: User,
  initialize: function initializeUserList () {},

  fetch: function fetchUserListCollection (props) {
    return new InternalPromise((resolve, reject) => {
      var initialUsers = _.clone(defaultUserList)
      initialUsers = _.map(initialUsers, (user) => {
        return new User({user: user})
      })
      this.set(initialUsers)
      var fetchAllUsers = []
      this.each((user) => {
        fetchAllUsers.push(user.fetch(props))
      })
      InternalPromise.all(fetchAllUsers).then(resolve).catch(reject)
    })
  },
  fetchNewUser: function fetchNewUserListCollection (props) {},
  fetchFeeds: function fetchUserListCollection (props) {
    var feeds = this.pluck('feed')
    feeds = _.flatten(feeds)
    return feeds
  },
  pollFeeds:function pollFeedsUserListCollection(){
    var userPolls = []
    this.each(function(user){
        userPolls.push(user.pollFeed())
    })
    InternalPromise.all(userPolls)
  }
})

module.exports = {
  UserList: UserList,
  User: User
}
