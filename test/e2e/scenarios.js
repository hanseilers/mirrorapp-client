'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('mirrorApp', function() {
browser.debugger();
  browser.get('/');

  it('should automatically redirect to /start when location hash/fragment is empty', function() {
    expect(browser.getLocationAbssUrl()).toMatch("#/start");
  });


 
});
