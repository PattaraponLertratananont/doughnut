package com.odde.doughnut.controllers;

import com.odde.doughnut.entities.ReviewPoint;
import com.odde.doughnut.entities.json.QuizQuestionViewedByUser;
import com.odde.doughnut.entities.json.SelfEvaluation;
import com.odde.doughnut.exceptions.UnexpectedNoAccessRightException;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.models.ReviewPointModel;
import com.odde.doughnut.models.Reviewing;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.testability.TestabilitySettings;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/review-points")
class RestReviewPointController {
  private final ModelFactoryService modelFactoryService;
  private UserModel currentUser;

  @Resource(name = "testabilitySettings")
  private final TestabilitySettings testabilitySettings;

  public RestReviewPointController(ModelFactoryService modelFactoryService, UserModel currentUser, TestabilitySettings testabilitySettings) {
    this.modelFactoryService = modelFactoryService;
    this.currentUser = currentUser;
    this.testabilitySettings = testabilitySettings;
  }

  @GetMapping("/{reviewPoint}")
  public ReviewPoint show(@PathVariable("reviewPoint") ReviewPoint reviewPoint)
      throws UnexpectedNoAccessRightException {
    currentUser.assertReadAuthorization(reviewPoint);
    return reviewPoint;
  }

  @GetMapping("/repeat")
  @Transactional
  public QuizQuestionViewedByUser repeatReview(@PathVariable("reviewPoint") ReviewPoint reviewPoint) {
    currentUser.assertLoggedIn();
    ReviewPointModel reviewPointModel = modelFactoryService.toReviewPointModel(reviewPoint);
    return reviewPointModel.getRandomQuizQuestion(testabilitySettings.getRandomizer(), currentUser.getEntity());
  }

  @PostMapping(path = "/{reviewPoint}/remove")
  public ReviewPoint removeFromRepeating(ReviewPoint reviewPoint) {
    reviewPoint.setRemovedFromReview(true);
    modelFactoryService.reviewPointRepository.save(reviewPoint);
    return reviewPoint;
  }

  @PostMapping(path = "/{reviewPoint}/self-evaluate")
  @Transactional
  public ReviewPoint selfEvaluate(
      ReviewPoint reviewPoint, @RequestBody SelfEvaluation selfEvaluation) {
    if (reviewPoint == null || reviewPoint.getId() == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The review point does not exist.");
    }
    currentUser.assertLoggedIn();
    modelFactoryService
        .toReviewPointModel(reviewPoint)
        .updateForgettingCurve(selfEvaluation.adjustment);
    return reviewPoint;
  }
}
