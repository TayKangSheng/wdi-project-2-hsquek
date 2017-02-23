const express = require('express')
const Router = express.Router()
const FamilyController = require('../controllers/family_controller')

Router.get('/', FamilyController.listFamily)

Router.get('/create', FamilyController.newFamily)

Router.post('/create', FamilyController.addFamily)

Router.get('/newuser', FamilyController.newUser)

Router.post('/newuser', FamilyController.createUser)

Router.get('/:id/pushuser', FamilyController.pushUserForm)

Router.put('/:id', FamilyController.pushUser)

Router.get('/:id/deleteuser', FamilyController.deleteUserForm)

Router.delete('/:id', FamilyController.deleteUser)

module.exports = Router
