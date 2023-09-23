package com.odde.doughnut.testability.builders;

import com.odde.doughnut.entities.Note;
import com.odde.doughnut.entities.SuggestedQuestionForFineTuning;
import com.odde.doughnut.testability.EntityBuilder;
import com.odde.doughnut.testability.MakeMe;

public class MarkedQuestionBuilder extends EntityBuilder<SuggestedQuestionForFineTuning> {
  public MarkedQuestionBuilder(MakeMe makeMe) {
    super(makeMe, new SuggestedQuestionForFineTuning());
    ofNote(makeMe.aNote().please());
    entity.setUserId(makeMe.aUser().please().getId());
    entity.setQuizQuestion(makeMe.aQuestion().please());
  }

  @Override
  protected void beforeCreate(boolean needPersist) {}

  public MarkedQuestionBuilder ofNote(Note note) {
    entity.setNote(note);
    return this;
  }

  public MarkedQuestionBuilder withRawQuestion(String question) {
    entity.getQuizQuestion().setRawJsonQuestion(question);
    return this;
  }
}
