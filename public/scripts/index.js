'use strict'

import $ from 'jquery'

const $body = $('body')
const $userMenu = $('.user-menu')
const $userMenuItems = $('.user-menu-items')
const $videoOverlays = $('.video-overlay')
const $videoLightbox = $('.video-lightbox')
const $videoClose = $('.video-lightbox .fa-times')
const $videoPlayer = $('.video-player')

$body.on('click', () => {
  $userMenuItems.hide()
})

$userMenu.on('click', e => {
  e.stopImmediatePropagation()
  $userMenuItems.toggle()
})

$videoOverlays.on('click', e => {
  const $target = $(e.currentTarget)
  const videoId = $target.data('videoId')
  $videoLightbox.addClass('opaque')
  $videoPlayer.html(`<iframe width=100% height=100% src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`)
})

$videoClose.on('click', () => {
  $videoLightbox.removeClass('opaque')
  $videoPlayer.html('')
})
