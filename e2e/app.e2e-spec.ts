import { ScrumDeckPage } from './app.po';

describe('scrum-deck App', () => {
  let page: ScrumDeckPage;

  beforeEach(() => {
    page = new ScrumDeckPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
