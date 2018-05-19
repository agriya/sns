'use strict';

describe('Service: usersForgotPassword', function () {

  // load the service's module
  beforeEach(module('SnsApp'));

  // instantiate service
  var usersForgotPassword;
  beforeEach(inject(function (_usersForgotPassword_) {
    usersForgotPassword = _usersForgotPassword_;
  }));

  it('should do something', function () {
    expect(!!usersForgotPassword).toBe(true);
  });

});
