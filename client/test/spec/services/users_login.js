'use strict';

describe('Service: usersLogin', function () {

  // load the service's module
  beforeEach(module('SnsApp'));

  // instantiate service
  var usersLogin;
  beforeEach(inject(function (_usersLogin_) {
    usersLogin = _usersLogin_;
  }));

  it('should do something', function () {
    expect(!!usersLogin).toBe(true);
  });

});
