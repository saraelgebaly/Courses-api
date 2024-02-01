const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses');
const {validationSchema} = require('../middlewares/validationSchema');
const userAuthorization = require('../middlewares/verifyToken');



router.route("/").get(coursesController.getAllCourse);
router.route("/").post(userAuthorization,validationSchema(),coursesController.addCourse);
router.route("/:courseId").get(coursesController.getCourse);
router.route("/:courseId").patch(userAuthorization,coursesController.updateCourse);
router.route("/:courseId").delete(userAuthorization,coursesController.deleteCourse);


module.exports= router