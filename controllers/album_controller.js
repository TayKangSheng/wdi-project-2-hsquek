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

    var err = newAlbum.validateSync()
    if (err) {
      if (err.name === 'ValidationError') {
        console.log(err)
        var errMessages = []
        for (var key in err.errors) {
          errMessages.push(err.errors[key].message)
        }
        req.flash('flash', {
          type: 'danger',
          message: errMessages
        })
        res.redirect('/')
      }
    }

    if (req.files) {
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
    } else {
      console.log('album updated with no upload')
      newAlbum.save()
      res.redirect('/albums/')
    }

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
      // console.log('req.files is...');
      // console.log(req.files);
      var originalLength = updatedAlbum.photos.length
      // console.log(originalLength);
      if (req.files) {
        // console.log(req.files.length);
        req.files.forEach(function (file) {
          cloudinary.uploader.upload(file.path, function (result) {
            console.log('going into cloudinary')
            updatedAlbum.photos.push({
              url: result.url
            })
            console.log(result.url);
            console.log(updatedAlbum.photos.length);
            if (updatedAlbum.photos.length === originalLength + req.files.length) {
              // console.log(updatedAlbum.photos.length, originalLength + req.files.length);
              updatedAlbum.save(function (err, output) {
                if (err) return err
                res.redirect('/albums/' + updatedAlbum.id)
              })
            }
          })
        })
      } else {
        console.log('album updated with no upload')
        updatedAlbum.save()
        res.redirect('/albums/' + updatedAlbum.id)
      }
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
