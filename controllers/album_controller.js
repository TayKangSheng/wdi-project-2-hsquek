const Album = require('../models/album')
const Photo = require('../models/photo')
const cloudinary = require('cloudinary')

const AlbumController = {
  listAll: function (req, res) {
    Album.find({familyGroup: req.user.familyGroup}, function (err, foundAlbums, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('album/index', {
        foundAlbums: foundAlbums
      })
    })
  },

  listOne: function (req, res) {
    Album.findById(req.params.id, function (err, foundAlbum, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('album/show', {
        foundAlbum: foundAlbum
      })
    })
  },

  makeNew: function (req, res) {
    res.render('album/create')
  },

  createNew: function (req, res) {
    let newAlbum = new Album({
      name: req.body.albums.name,
      date: req.body.albums.date,
      description: req.body.albums.description,
      familyGroup: req.user.familyGroup
    })

    req.files.forEach(function (file) {
      cloudinary.uploader.upload(file.path, function (result) {
        newAlbum.photos.push({
          url: result.url
        })
        if (newAlbum.photos.length === req.files.length) {
          newAlbum.save(function (err, output) {
            if (err) return err
            res.redirect('/albums')
            // res.send('album created')
          })
        }
      })
    })
    // newAlbum.save(function (err, output) {
    //   if (err) return console.error(err)
    //   res.redirect('/albums')
    // })
  },

  editForm: function (req, res) {
    Album.findById(req.params.id, function (err, foundAlbum, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('album/edit', {
        foundAlbum: foundAlbum
      })
    })
  },

  updateExisting: function (req, res) {
    console.log(req.body);
    Album.findByIdAndUpdate(req.params.id,
      {
        $set: {
          name: req.body.albums.name,
          date: req.body.albums.date,
          description: req.body.albums.description
        }
      },
    function (err, updatedAlbum, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      console.log(updatedAlbum)
      res.redirect('/albums/' + updatedAlbum.id)
    })
  },

  deleteRecord: function (req, res) {
    Album.findByIdAndRemove(req.params.id, function (err, output, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      console.log('removed' + req.params.id)
      res.redirect('/albums')
    })
  }
}

module.exports = AlbumController
