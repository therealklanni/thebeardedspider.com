import bug from 'debug'
const debug = bug('bearded:indexRouter')

import express from 'express'
const router = express.Router()

import dotty from 'dotty'
import got from 'got'

router.get('/', (req, res) => {
  const viewData = {
    title: 'The Bearded Spider'
  }

  if (req.isAuthenticated()) {
    const user = req.user
    user.logo = user.logo || `https://robohash.org/${req.user.displayName}.png?set=set3`
    viewData.user = user
  }

  const reqParms = [
    ['part', 'snippet'],
    ['channelId', 'UCJ5HW_Wl9NFyZCG_rHozyvw'],
    ['maxResults', '2'],
    ['order', 'viewCount'],
    ['type', 'video'],
    ['fields', 'items(id%2Csnippet)'],
    ['key', process.env.YOUTUBE_API_KEY]
  ]

  got(`https://www.googleapis.com/youtube/v3/search?${reqParms.map(x => x.join('=')).join('&')}`, {
    json: true
  })
    .then(resp => {
      const items = resp.body.items
      debug('youtube search results', items)
      const videos = items.map((video => ({
        thumbnail: dotty.get(video, 'snippet.thumbnails.high.url'),
        videoId: dotty.get(video, 'id.videoId'),
        title: dotty.get(video, 'snippet.title')
      })))
      debug(videos)
      viewData.videos = videos
      res.render('index', viewData)
    })
    .catch(() => {
      debug('failed to get youtube search results')
      res.render('index', viewData)
    })
})

export default router
