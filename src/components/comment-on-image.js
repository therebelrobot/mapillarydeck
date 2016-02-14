var m = require('mithril')
var moment = require('moment')
module.exports = function (activity) {
  return m('.card.mui-panel.comment-on', {
    'data-activity-id': activity.id
  }, [
    m('img.avatar', {src: activity.image_url}),
    m('h3', 'Comment On Image'),
    m('h4', activity.main_description),
    m('em', activity.user),
    m('br'),
    m('em', activity.location),
    m('br'),
    m('em', moment(activity.updated_at/1000, 'X').format('YYYY-MM-DD HH:mm:ss'))
  ])
}
