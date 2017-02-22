const Album = require('../models/album')
const Photo = require('../models/photo')

const AlbumController = {
  listAll: function (req, res) {
    Album.find({}, function (err, foundAlbums, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      // res.render('event/index', {
      //   foundEvents: foundEvents
      // })
      res.send('albums here')
    })
  },

  listOne: function (req, res) {
    Album.findById(req.params.id, function (err, foundAlbum, next) {
      if (err) {
        console.error(err)
        return next(err)
        // res.send('err but listOne')
      }
      // res.render('event/show', {
      //   foundAlbum: foundAlbum
      // })
      res.send('found one album')
    })
  },

  makeNew: function (req, res) {
    // res.render('event/create')
    res.send('make new album here')
  },

  createNew: function (req, res) {

    // create photos first
    // find out what the output from input multiple is

    let newAlbum = new Album({
      name: req.body.albums.name,
      date: req.body.albums.date,
      photos: req.body.albums.photoArr
    })

    newAlbum.save(function (err, output, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      console.log(output)
      // res.redirect('/events')
      
    })
  },



}
