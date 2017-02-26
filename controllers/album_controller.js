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

    if (req.files.length > 0) {
      req.files.forEach(function (file) {
        cloudinary.uploader.upload(file.path, function (result) {
          newAlbum.photos.push({
            url: result.url,
            name: file.originalname
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
    Album.findByIdAndUpdate(req.params.id,
      {
        name: req.body.albums.name,
        date: req.body.albums.date,
        description: req.body.albums.description
      },
    function (err, foundAlbum, next) {
      if (err) {
        console.error(err)
        return next(err)
      }

      console.log('1')
      console.log(foundAlbum.photos)

      var toRemove = req.body.pullPhotos
      var thisArr = foundAlbum.photos

      if (toRemove) {
        if (!Array.isArray(toRemove)) {
          let idx = (function () {
            for (var i = 0; i < thisArr.length; i++) {
              if (thisArr[i].url === toRemove) {
                return i
              }
            }
          })()
          thisArr.splice(idx, 1)
        } else {
          var spliceIdxArr = []
          for (var j = 0; j < toRemove.length; j++) {
            for (var n = 0; n < thisArr.length; n++) {
              if (thisArr[n].url === toRemove[j]) {
                if (!spliceIdxArr.includes(n)) {
                  spliceIdxArr.push(n)
                }
              }
            }
          }
          console.log('pre spliced arr is ', thisArr)
          spliceIdxArr.sort()
          for (var x = spliceIdxArr.length - 1; x >= 0; x--) {
            thisArr.splice(spliceIdxArr[x], 1)
          }
          console.log('arr after splice is ', thisArr)
        }
      }

      // if (toRemove) {
      //   if (!Array.isArray(toRemove)) {
      //     thisArr.splice(thisArr.indexOf(toRemove), 1)
      //   } else {
      //     toRemove.forEach(function (removeOne) {
      //       thisArr.splice(thisArr.indexOf(removeOne), 1)
      //     })
      //   }
      // }

      // console.log('2')
      // console.log(foundAlbum.photos)

      var originalLength = foundAlbum.photos.length

      // console.log(originalLength);

      if (req.files.length > 0) {
        // console.log(req.files.length);
        req.files.forEach(function (file) {
          cloudinary.uploader.upload(file.path, function (result) {
            // console.log('going into cloudinary')
            foundAlbum.photos.push({
              url: result.url,
              name: file.originalname
            })
            // console.log(result.url)
            // console.log(foundAlbum.photos.length)
            if (foundAlbum.photos.length === originalLength + req.files.length) {
              // console.log(foundAlbum.photos.length, originalLength + req.files.length);
              foundAlbum.save(function (err, output) {
                if (err) return err
                res.redirect('/albums/' + foundAlbum.id)
              })
            }
          })
        })
      } else {
        // console.log('album updated with no upload')
        foundAlbum.save()
        res.redirect('/albums/' + foundAlbum.id)
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

  // addPhoto: function (req, res, next) {
  //
  // }
}

module.exports = AlbumController
