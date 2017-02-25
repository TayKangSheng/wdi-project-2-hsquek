const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: './uploads/' })
// const Album = require('../models/album')

const AlbumController = require('../controllers/album_controller')

router.get('/', AlbumController.listAll)

router.get('/new', AlbumController.makeNew)

router.get('/:id', AlbumController.listOne)

router.post('/', upload.array('albums[photos]', 10), AlbumController.createNew)

router.get('/:id/update', AlbumController.editForm)

router.put('/:id', upload.array('albums[photos]', 10), AlbumController.updateExisting)

router.delete('/:id', AlbumController.deleteRecord)

module.exports = router
