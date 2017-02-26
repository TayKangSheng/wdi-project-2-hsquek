const Event = require('../models/event')
const cloudinary = require('cloudinary')

let EventController = {
  listAll: function (req, res, next) {
    Event.find({familyGroup: req.user.familyGroup}, function (err, foundEvents, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('event/index', {
        foundEvents: foundEvents
      })
    })
  },

  listOne: function (req, res, next) {
    Event.findById(req.params.id, function (err, foundEvent, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('event/show', {
        foundEvent: foundEvent
      })
    })
  },

  makeNew: function (req, res, next) {
    res.render('event/create')
  },

  createNew: function (req, res, next) {
    let newEvent = new Event({
      name: req.body.events.name,
      date: req.body.events.date,
      status: req.body.events.status,
      completed: false,
      venue: req.body.events.venue,
      description: req.body.events.description,
      familyGroup: req.user.familyGroup
    })

    // console.log(newEvent);

    var err = newEvent.validateSync()
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

    console.log(req.files)
    if (req.files.length > 0) {
      req.files.forEach(function (file) {
        cloudinary.uploader.upload(file.path, function (result) {
          newEvent.attachments.push({
            url: result.url,
            name: file.originalname
          })
          if (newEvent.attachments.length === req.files.length) {
            newEvent.save(function (err, output) {
              if (err) return err
              res.redirect('/events')
            })
          }
        })
      })
    } else {
      newEvent.save()
      res.redirect('/events')
    }
  },

  editForm: function (req, res, next) {
    Event.findById(req.params.id, function (err, foundEvent, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('event/edit', {
        foundEvent: foundEvent
      })
    })
  },

  updateExisting: function (req, res, next) {
    Event.findByIdAndUpdate(req.params.id,
      {
        name: req.body.events.name,
        date: req.body.events.date,
        status: req.body.events.status,
        venue: req.body.events.venue,
        description: req.body.events.description,
        completed: req.body.events.completed
      },
    function (err, foundEvent, next) {
      if (err) {
        console.error(err)
        return next(err)
      }

      var toRemove = req.body.pullAttachments
      var thisArr = foundEvent.attachments

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
          spliceIdxArr.sort()
          for (var x = spliceIdxArr.length - 1; x >= 0; x--) {
            thisArr.splice(spliceIdxArr[x], 1)
          }
        }
      }

      var originalLength = foundEvent.attachments.length

      if (req.files.length > 0) {
        req.files.forEach(function (file) {
          cloudinary.uploader.upload(file.path, function (result) {
            foundEvent.attachments.push({
              url: result.url,
              name: file.originalname
            })

            if (foundEvent.attachments.length === originalLength + req.files.length) {
              foundEvent.save(function (err, output) {
                if (err) return err
                res.redirect('/events/' + foundEvent.id)
              })
            }
          })
        })
      } else {
        foundEvent.save()
        res.redirect('/events/' + foundEvent.id)
      }
    })
  },

  deleteRecord: function (req, res, next) {
    Event.findByIdAndRemove(req.params.id, function (err, output, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      console.log('removed' + req.params.id)
      res.redirect('/events')
    })
  }
}

module.exports = EventController
