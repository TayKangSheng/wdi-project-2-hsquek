const express = require('express')
const Router = express.Router()
const FamilyController = require('../controllers/family_controller')

Router.get('/', FamilyController.listFamily)

Router.get('/create', FamilyController.newFamily)

Router.post('/create', FamilyController.addFamily)

Router.get('/newUser', FamilyController.newUser)

Router.post('/newUser', FamilyController.createUser)

Router.put('/', FamilyController.pushUser)

Router.delete('/', FamilyController.deleteUser)

module.exports = Router
