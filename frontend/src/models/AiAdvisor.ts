export type AiQuestion = {
  question: string;
  options: AiQuestionOption[];
};

type AiQuestionOption = {
  option: string;
  correct: boolean;
  explanation: string;
};

const questionResponseFormatExample = {
  question: "",
  options: [
    {
      option: "",
      correct: true,
      explanation: "",
    },
  ],
};
export default class AiAdvisor {
  textContent: Generated.TextContent;

  constructor(textContent: Generated.TextContent) {
    this.textContent = textContent;
  }

  promptWithContext(): string {
    return `Please provide the description for the note titled: ${this.textContent.title}`;
  }

  questionPrompt(): string {
    return `Given the note with title: ${this.textContent.title}
and description:
${this.textContent.description}

please generate a multiple-choice question with 3 options and 1 correct option.
Please vary the option text length, so that the correct answer isn't always the longest one.
The response should be JSON-formatted as follows: ${JSON.stringify(
      questionResponseFormatExample
    )}`;
  }
}
