describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
    cy.get('body').find('h6').should('have.text', 'Please login');

    cy.get('input[type=text]').type('a@a.com');
    cy.get('input[type=password]').type('123');

    cy.intercept(
      {
        method: 'POST',
        url: '/authen/authen-req',
      },
      { success: true, userInfo: { email: 'a@a.com', role: 'user' } },
    ).as('login');
    cy.intercept(
      {
        method: 'GET',
        url: '/authen/user',
      },
      { user: { email: 'a@a.com', role: 'user' } },
    ).as('getUser');

    cy.get('button[type=submit]').click();

    cy.wait('@login');
    cy.wait('@getUser');

    cy.get('body').contains('Available quizzes to join:', { timeout: 1000 });
    cy.url().should('include', '/list-quizzes');
  });
});
