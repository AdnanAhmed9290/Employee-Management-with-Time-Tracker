import { CiphertrickNotifyPage } from './app.po';

describe('ciphertrick-notify App', () => {
  let page: CiphertrickNotifyPage;

  beforeEach(() => {
    page = new CiphertrickNotifyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
