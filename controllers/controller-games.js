const express = require("express");
const {
  selectCategories,
  selectReviewByID,
  updateReviewByID,
  selectUsers,
  selectReviews,
  selectCommentsByID,
  addComment,
  removeCommentByID,
  selectCommentByID,
} = require("../models/models-games");

exports.getAllCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  if (isNaN(review_id)) {
    return next({
      status: 400,
      msg: `'${review_id}' is not a valid review number!`,
    });
  }
  selectReviewByID(review_id)
    .then((review) => {
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `This review doesn't exist!`,
        });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch(next);
};

exports.patchReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(review_id)) {
    return next({
      status: 400,
      msg: `'${review_id}' is not a valid review number!`,
    });
  }

  if (isNaN(inc_votes)) {
    return next({
      status: 400,
      msg: `'${inc_votes}' is not a valid value!`,
    });
  }

  updateReviewByID(review_id, inc_votes)
    .then((review) => {
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `This review doesn't exist!`,
        });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getAllReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
      selectReviews(sort_by, order, category)
    .then((reviews) => {
      if (reviews.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Category not found",
        })
      }
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getCommentsByID = (req, res, next) => {
  const { review_id } = req.params;

  if (isNaN(review_id)) {
    return next({
      status: 400,
      msg: `'${review_id}' is not a valid review number!`,
    });
  }
  selectReviewByID(review_id)
    .then((review) => {
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: "There are no comments because this review doesn't exist!",
        });
      } else {
        return selectCommentsByID(review_id);
      }
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.createComment = (req, res, next) => {
  const { review_id } = req.params;
  if (typeof req.body.username !== "string" || typeof req.body.body !== "string") {
    return next({
      status: 400,
      msg: `Body doesn't contain mandatory keys`,
    });
  }

  addComment(req.body, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      if (err.code === "23503" && err.constraint === "comments_author_fkey") {
        return next({
          status: 404,
          msg: "This username doesn't exist!",
        });
      }
      if (err.code === "23503" && err.constraint === "comments_review_id_fkey") {
        return next({
          status: 404,
          msg: "You can't add a comment here because the review doesn't exist!",
        });
      }

      if (err.code === "22P02") {
        return next({
          status: 404,
          msg: "Invalid Review ID!",
        });
      }

      return next(err);
    });
};

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;

  if (isNaN(comment_id)) {
    return next({
      status: 404,
      msg: `Invalid Comment ID!`,
    });
  }
  selectCommentByID(comment_id)
    .then((comment) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `This comment doesn't exist!`,
        })
      }
      return comment
    })
    .then(() => {
      removeCommentByID(comment_id).then(() => {
        res.status(204).send();
      });
    })
    .catch(next);
};
