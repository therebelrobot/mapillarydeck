var m = require('mithril')

module.exports = function (props) {
  return m('.card.mui-panel.user', {
    'data-user': props.user
  }, [
    m('img.avatar', {src: props.avatar}),
    m('h3', props.user),
    m('em', 'user since ' + props.member_since),
    m('i.fa.fa-chevron-right', {
      className: !props.arrowEvent?'hidden':'',
      config: (el, isInit, context) => {
        if (isInit) {return }
        el.onclick = (event) => {
          window.__ee.emit(props.arrowEvent, {user: props.user})
        }
      }
    })
  ])
}
