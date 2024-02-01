const express = require('express');
const router = express.Router()
const userController = require('../controllers/user');

    router.route("/").get(userController.getUsers)
    router.route("/register").post(userController.register)
    router.route("/login").post(userController.login)
    router.route("/:id").delete(userController.deleteUser)






module.exports = router
