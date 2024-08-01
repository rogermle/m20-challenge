import Quiz from "../../client/src/components/Quiz"
import questions from "../fixtures/questions.json"

describe('Quiz Component', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: '/api/questions/random'
    },
      {
        body: questions,
        statusCode: 200
      }
    ).as('getRandomQuestion')
  });

  it('should start the quiz and display the first question', () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getRandomQuestion');
    cy.get('.card').should('be.visible').and('contain', questions[0].question);
    cy.get('h2').should('not.be.empty');
  });

  it('should answer questions and complete the quiz', () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();

    // Answer questions
    cy.get('button').contains('1').click();

    // Verify the quiz completion
    cy.get('.alert-success').should('be.visible').and('contain', 'Your score');
  });

  it('should restart the quiz after completion', () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();

    // Answer questions
    cy.get('button').contains('1').click();

    // Restart the quiz
    cy.get('button').contains('Take New Quiz').click();

    // Verify the quiz is restarted
    cy.get('.card').should('be.visible');
    cy.get('h2').should('not.be.empty');
  });
});
