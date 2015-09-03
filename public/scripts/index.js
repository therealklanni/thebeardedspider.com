'use strict'

import $ from 'jquery'

const $body = $('body')
const $userMenu = $('.user-menu')
const $userMenuItems = $('.user-menu-items')

$body.on('click', () => {
  $userMenuItems.hide()
})

$userMenu.on('click', e => {
  e.stopImmediatePropagation()
  $userMenuItems.toggle()
})
