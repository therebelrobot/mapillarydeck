var m = require('mithril')

module.exports = function (props) {
  // this is run on instantiation
  return function mithrilLayout (ctrl) {
    // this is run on redraw

    // set up user column
    var userCards = []
    var theseUsers = []
    props.users.each((user) => {
      var username = user.get('user')
      console.log(user.get('user'), user.get('avatar'), user.get('member_since'))
      if (username.indexOf(props.settings.searchQuery()) === 0) {
        theseUsers.push(user)
      }
    })
    _.forEach(theseUsers, (user) => {

      userCards.push(m('.card.mui-panel', {
        'data-user': user.get('user')
      }, [
        m('img.avatar', {src: user.get('avatar')}),
        m('h3', user.get('user')),
        m('em', 'user since ' + user.get('member_since')),
        m('i.fa.fa-chevron-right', {
          config: (el, isInit, context) => {
            if (isInit) {return }
            el.onclick = (event) => {
              window.__ee.emit('ALLUSERS:showUserColumn', {user: user.get('user')})
            }
          }
        })
      ]))
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
    return m('.wrapper', [
      m('nav.mui-appbar', [
        m('.logo', [
          m('i.fa.fa-map-o'),
          ' ',
          'MapillaryDeck'
        ])
      ]),
      m('section.content', [
        m('article.column.mui-panel', userCards),

        m('article.column.mui-panel', [
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
        ]),

        m('article.column.mui-panel', [
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
        ]),

        m('article.column.mui-panel', [
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
        ])
      ])
    ])
  }
}
