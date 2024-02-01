const courseModel = require("../models/courses");
const { validationResult } = require("express-validator");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

const getAllCourse = asyncWrapper(async (req, res) => {
  const courses = await courseModel.find();
  res.json({ Status: httpStatusText.success, data: { courses } });
});
const getCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await courseModel.findById(courseId);
  if (!course) {
    const error = appError.create("Course not found", 404, httpStatusText.fail);
    return next(error);
  }
  return res.json({ Status: httpStatusText.success, data: { course } });
});

const addCourse = asyncWrapper(async (req, res, next) => {
  if (req.user.role === "admin") {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = appError.create(errors.array(), 400, httpStatusText.fail);
      return next(error);
    }
    const createCourse = await courseModel.create(req.body);
    res.json({ Status: httpStatusText.success, data: { createCourse } });
  } else {
    const error = appError.create(
      "You are not authorized",
      403,
      httpStatusText.error
    );
    return next(error);
  }
});

const updateCourse = asyncWrapper(async (req, res,next) => {
  const courseId = req.params.courseId;
  if (req.user.role === "admin") {
    const updatedCourse = await courseModel.updateOne(
      { _id: courseId },
      req.body
    );
    res.json({ Status: httpStatusText.success, data: { updatedCourse } });
  } else {
    const error = appError.create(
        "You are not authorized",
        403,
        httpStatusText.error
      );
      return next(error);
  }
});

const deleteCourse = asyncWrapper(async (req, res,next) => {
  const courseId = req.params.courseId;

  if (req.user.role === "admin") {
    await courseModel.deleteOne({ _id: courseId });
    res.json({ Status: httpStatusText.success, data: null });
  } else {
    const error = appError.create(
      "You are not authorized",
      403,
      httpStatusText.error
    );
    return next(error);
  }
});
module.exports = {
  getAllCourse,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
