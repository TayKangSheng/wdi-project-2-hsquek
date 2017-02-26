const express = require('express')
const Router = express.Router()
const FamilyController = require('../controllers/family_controller')

Router.get('/', FamilyController.listFamily)

Router.get('/create', FamilyController.newFamily)

Router.post('/create', FamilyController.addFamily)

Router.get('/:id/update', FamilyController.updateForm)

Router.put('/:id', FamilyController.updateFamily)

Router.delete('/:id', FamilyController.deleteFamily)

module.exports = Router
