package com.odde.doughnut.controllers;

import static org.junit.jupiter.api.Assertions.*;

import com.odde.doughnut.entities.*;
import com.odde.doughnut.exceptions.ApiException;
import com.odde.doughnut.exceptions.UnexpectedNoAccessRightException;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.testability.MakeMe;
import com.odde.doughnut.testability.TestabilitySettings;
import com.odde.doughnut.testability.builders.NoteBuilder;
import com.theokanning.openai.client.OpenAiApi;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class RestAssessmentControllerTests {
  @Mock OpenAiApi openAiApi;
  @Autowired MakeMe makeMe;
  private UserModel currentUser;
  private RestAssessmentController controller;
  private TestabilitySettings testabilitySettings = new TestabilitySettings();

  @BeforeEach
  void setup() {
    currentUser = makeMe.aUser().toModelPlease();
    controller =
        new RestAssessmentController(
            openAiApi, makeMe.modelFactoryService, testabilitySettings, currentUser);
  }

  @Nested
  class assessmentQuestionOrderTest {
    private Notebook notebook;
    private Note topNote;
    private int representativeNumberOfAttempts = 30;

    Set<Integer> performAssessments(int numberOfAttempts) throws UnexpectedNoAccessRightException {
      Set<Integer> questionIds = new HashSet<>();
      for (int i = 0; i < numberOfAttempts; i++) {
        List<QuizQuestion> assessment = controller.generateAssessmentQuestions(notebook);
        Integer questionId = assessment.get(0).getId();
        questionIds.add(questionId);
      }
      return questionIds;
    }

    @BeforeEach
    void setup() {
      topNote = makeMe.aHeadNote("OnlineAssessment").creatorAndOwner(currentUser).please();
      notebook = topNote.getNotebook();
      notebook.getNotebookSettings().setNumberOfQuestionsInAssessment(1);
    }

    @Test
    void shouldPickRandomNotesForAssessment() throws UnexpectedNoAccessRightException {
      makeMe.theNote(topNote).withNChildrenThat(10, NoteBuilder::hasAnApprovedQuestion).please();

      Set<Integer> questionIds = performAssessments(representativeNumberOfAttempts);

      assertTrue(questionIds.size() > 1, "Expected questions from different notes.");
    }

    @Test
    void shouldPickRandomQuestionsFromTheSameNote() throws UnexpectedNoAccessRightException {
      makeMe
          .theNote(topNote)
          .withNChildrenThat(1, noteBuilder -> noteBuilder.hasApprovedQuestions(10))
          .please();
      Set<Integer> questionIds = performAssessments(representativeNumberOfAttempts);
      assertTrue(questionIds.size() > 1, "Expected questions from the same note.");
    }
  }

  @Nested
  class generateOnlineAssessmentTest {
    private Notebook notebook;
    private Note topNote;

    @BeforeEach
    void setup() {
      topNote = makeMe.aHeadNote("OnlineAssessment").creatorAndOwner(currentUser).please();
      notebook = topNote.getNotebook();
    }

    @Test
    void whenNotLogin() {
      controller =
          new RestAssessmentController(
              openAiApi,
              makeMe.modelFactoryService,
              testabilitySettings,
              makeMe.aNullUserModelPlease());
      assertThrows(
          ResponseStatusException.class, () -> controller.generateAssessmentQuestions(notebook));
    }

    @Test
    void shouldNotBeAbleToAccessNotebookWhenUserHasNoPermission() {
      User anotherUser = makeMe.aUser().please();
      notebook.setOwnership(anotherUser.getOwnership());
      assertThrows(
          UnexpectedNoAccessRightException.class,
          () -> controller.generateAssessmentQuestions(notebook));
    }

    @Test
    void shouldBeAbleToAccessNotebookThatIsInTheBazaar() throws UnexpectedNoAccessRightException {
      Note noteOwnedByOtherUser = makeMe.aNote().please();
      makeMe
          .theNote(noteOwnedByOtherUser)
          .withNChildrenThat(6, NoteBuilder::hasAnApprovedQuestion)
          .please();
      noteOwnedByOtherUser.getNotebook().getNotebookSettings().setNumberOfQuestionsInAssessment(5);
      BazaarNotebook bazaarNotebook =
          makeMe.aBazaarNotebook(noteOwnedByOtherUser.getNotebook()).please();
      List<QuizQuestion> assessment =
          controller.generateAssessmentQuestions(bazaarNotebook.getNotebook());
      assertEquals(5, assessment.size());
    }

    @Test
    void shouldReturn5QuestionsWhenThereAreMoreThan5NotesWithQuestions()
        throws UnexpectedNoAccessRightException {
      makeMe.theNote(topNote).withNChildrenThat(5, NoteBuilder::hasAnApprovedQuestion).please();
      notebook.getNotebookSettings().setNumberOfQuestionsInAssessment(5);
      List<QuizQuestion> assessment = controller.generateAssessmentQuestions(notebook);
      assertEquals(5, assessment.size());
    }

    @Test
    void shouldThrowExceptionWhenThereAreNotEnoughQuestions() {
      makeMe.theNote(topNote).withNChildrenThat(4, NoteBuilder::hasAnApprovedQuestion).please();
      assertThrows(ApiException.class, () -> controller.generateAssessmentQuestions(notebook));
    }

    @Test
    void shouldGetOneQuestionFromEachNoteOnly() {
      makeMe
          .theNote(topNote)
          .withNChildrenThat(
              3,
              noteBuilder -> {
                noteBuilder.hasAnApprovedQuestion();
                noteBuilder.hasAnApprovedQuestion();
                noteBuilder.hasAnApprovedQuestion();
              })
          .please();

      assertThrows(ApiException.class, () -> controller.generateAssessmentQuestions(notebook));
    }
  }
}
