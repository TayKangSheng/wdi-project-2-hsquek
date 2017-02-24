const Album = require('../models/album')
const Photo = require('../models/photo')
const cloudinary = require('cloudinary')

const AlbumController = {
  listAll: function (req, res, next) {
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

  listOne: function (req, res, next) {
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

  makeNew: function (req, res, next) {
    res.render('album/create')
  },

  createNew: function (req, res, next) {
    let newAlbum = new Album({
      name: req.body.albums.name,
      date: req.body.albums.date,
      description: req.body.albums.description,
      familyGroup: req.user.familyGroup
    })

    var validationErr = newAlbum.validateSync()
    if (validationErr) {
      console.log('validation error occured')
      req.flash('flash', {
        type: 'danger',
        message: 'Validation error'
      })
      res.redirect('/')
    }

    req.files.forEach(function (file) {
      cloudinary.uploader.upload(file.path, function (result) {
        newAlbum.photos.push({
          url: result.url
        })
        if (newAlbum.photos.length === req.files.length) {
          newAlbum.save(function (err, output) {
            if (err) return err
            res.redirect('/albums')
          })
        }
      })
    })

  //   Album.create(req.body.params, function (err, output) {
  //     if (err) {
  //       console.log(err)
  //       if (err.name === 'ValidationError') {
  //         let errMessages = []
  //         for (var field in err.errors) {
  //           errMessages.push(err.errors[field].message)
  //         }
  //
  //         req.flash('flash', {
  //           type: 'danger',
  //           message: errMessages
  //         })
  //         res.redirect('/')
  //       }
  //
  //       return next(err)
  //     }
  //     req.flash('flash', {
  //       type: 'success',
  //       message: 'Created an animal with name: ' + output.name
  //     })
  //     res.redirect('/')
  //   })
  },

  editForm: function (req, res, next) {
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

  updateExisting: function (req, res, next) {
    // console.log(req.body);
    Album.findByIdAndUpdate(req.params.id,
      {
        name: req.body.albums.name,
        date: req.body.albums.date,
        description: req.body.albums.description
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

  deleteRecord: function (req, res, next) {
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
