const express = require('express')
const router = express.Router()
const EventController = require('../controllers/event_controller')

router.get('/', EventController.listAll)

router.get('/new', EventController.makeNew)

router.get('/:id', EventController.listOne)

router.post('/', EventController.createNew)

router.get('/:id/update', EventController.editForm)

router.put('/:id', EventController.updateExisting)

router.delete('/:id', EventController.deleteRecord)

module.exports = router
