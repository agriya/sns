'use strict';

describe('Service: page', function () {

  // load the service's module
  beforeEach(module('SnsApp'));

  // instantiate service
  var page;
  beforeEach(inject(function (_page_) {
    page = _page_;
  }));

  it('should do something', function () {
    expect(!!page).toBe(true);
  });

});
