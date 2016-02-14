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
    console.log(showingUsers)
    if (showingUsers && showingUsers.length) {
      _.forEach(showingUsers, (user) => {
        var columnCards = []
        columnCards.push(m('button.mui-btn.bui-btn--danger',{
          config:(el, isInit, context)=>{
            if(isInit){return}
            el.onclick = (event)=>{
              window.__ee.emit('USER:hideUserColumn', {user:user.get('user')})
            }
          }
          }, 'Remove user column'))
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
