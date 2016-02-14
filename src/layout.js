var m = require('mithril')

module.exports = function(props){
  return function mithrilLayout(ctrl){
    return m('.wrapper', [
      m('nav.mui-appbar',[
        m('.logo',[
          m('i.fa.fa-map-o'),
          ' ',
          'MapillaryDeck'
        ])
      ]),
      m('section.content',[
        m('article.column.mui-panel',[
          m('.card.mui-panel',[
            m('img.avatar', {src:'http://placehold.it/100x100'})
          ]),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
          m('.card.mui-panel'),
        ]),

          m('article.column.mui-panel',[
            m('.card.mui-panel'),
            m('.card.mui-panel'),
            m('.card.mui-panel'),
            m('.card.mui-panel'),
            m('.card.mui-panel'),
          ]),

            m('article.column.mui-panel',[
              m('.card.mui-panel'),
              m('.card.mui-panel'),
              m('.card.mui-panel'),
              m('.card.mui-panel'),
              m('.card.mui-panel'),
            ]),

              m('article.column.mui-panel',[
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
