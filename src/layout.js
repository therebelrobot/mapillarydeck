var m = require('mithril')
var components = require('./components')

module.exports = function (props) {
  // this is run on instantiation
  return function mithrilLayout (ctrl) {
    // this is run on redraw

    // set up user column
    var userCards = []
    var theseUsers = []
    props.users.each((user) => {
      var username = user.get('user')
      if (username.indexOf(props.settings.searchQuery()) === 0) {
        theseUsers.push(user)
      }
    })
    _.forEach(theseUsers, (user) => {

      userCards.push(components.userCard({
        user: user.get('user'),
        avatar: user.get('avatar'),
        member_since: user.get('member_since'),
        arrowEvent: 'ALLUSERS:showUserColumn'
      }))
    })
    if (!userCards.length) {
      userCards.push(m('.card.mui-panel', [
        m('h3', 'No user found with the query'),
        m('em', props.settings.searchQuery())
      ]))
    }
    // add search bar to users column
    userCards.unshift(m('.mui-textfield', [
      m('input', {
        type: 'text',
        placeholder: 'Search',
        onchange: m.withAttr('value', props.settings.searchQuery),
        onkeyup: m.withAttr('value', props.settings.searchQuery),
        value: props.settings.searchQuery()
      })
    ]))

    // set up all user feed

    var allFeedsCards = []
    var feed = props.users.fetchFeeds()
    feed = _.sortBy(feed, 'updated_at')
    if (props.settings.reverseSort) {
      feed = feed.reverse()
    }
    _.forEach(feed, (activity) => {
      if (activity.image_url.indexOf('missing-image.png') > -1) {
        activity.image_url = 'https://placeholdit.imgix.net/~text?txtsize=20&txt=image%20not%20available&w=100&h=100'
      }
      switch (activity.action) {
        case 'useronwatchingimageaddedtoshape':
          allFeedsCards.push(components.imageAddedToShape(activity))
          break
        case 'useronwatchingcommentonimage':
          allFeedsCards.push(components.commentOnImage(activity))
          break
        case 'useronwatchingcommentinshape':
          allFeedsCards.push(components.commentInShape(activity))
          break
        default:
          allFeedsCards.push(components.defaultActivity(activity))
      }
    })
    if (!allFeedsCards.length) {
      allFeedsCards.push(m('.card.mui-panel', [
        m('h3', 'No activity found')
      ]))
    }

    // Set up user columns
    var userColumns = []
    var showingUsers = props.users.filter({inView: true})
    if (showingUsers && showingUsers.length) {
      _.forEach(showingUsers, (user) => {
        var columnCards = []
        var thisUserName = user.get('user')
        columnCards.push(m('button.mui-btn.mui-btn--danger', {
          config: function (el, isInit, context) {
            if (isInit) {return }
            el.onclick = function (event) {
              window.__ee.emit('USER:hideUserColumn', {user: thisUserName})
            }
          }
        }, 'Remove user column'))
        columnCards.push(m('button.mui-btn.mui-btn--default', {
          config: function (el, isInit, context) {
            if (isInit) {return }
            el.onclick = function (event) {
              window.__ee.emit('USER:reverseFeed', {user: thisUserName})
            }
          }
        }, 'Reverse Feed'))
        columnCards.push(components.userCard({
          user: user.get('user'),
          avatar: user.get('avatar'),
          member_since: user.get('member_since'),
          arrowEvent: false
        }))
        var thisUserFeed = user.get('feed')
        if (user.get('reverseFeed')) {
          thisUserFeed = thisUserFeed.reverse()
        }
        _.forEach(thisUserFeed, (activity) => {
          if (activity.image_url.indexOf('missing-image.png') > -1) {
            activity.image_url = 'https://placeholdit.imgix.net/~text?txtsize=20&txt=image%20not%20available&w=100&h=100'
          }
          switch (activity.action) {
            case 'useronwatchingimageaddedtoshape':
              columnCards.push(components.imageAddedToShape(activity))
              break
            case 'useronwatchingcommentonimage':
              columnCards.push(components.commentOnImage(activity))
              break
            case 'useronwatchingcommentinshape':
              columnCards.push(components.commentInShape(activity))
              break
            default:
              columnCards.push(components.defaultActivity(activity))
          }
        })
        userColumns.push(m('article.column.mui-panel', columnCards))
      })
    }
    var contentColumns = userColumns
    contentColumns.unshift(m('article.column.mui-panel', allFeedsCards))
    contentColumns.unshift(m('article.column.mui-panel', userCards))
    return m('.wrapper', [
      m('nav.mui-appbar', [
        m('.logo', [
          m('i.fa.fa-map-o'),
          ' ',
          'MapillaryDeck'
        ])
      ]),
      m('section.content', contentColumns)
    ])
  }
}
