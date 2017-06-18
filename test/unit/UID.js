var assert = require("assert");

var UID = require("../../lib/uid/UID");

suite('UID test', function () {
  before(function () {

  });

  test("Should create a new valid UID", function (done) {
    var uid = UID.create();

    assert(UID.isValid(uid), "The new uid is NOT valid");

    done();
  });

  test("Should check for an invalid uid", function (done) {
    assert(!UID.isValid("WRONG UID"), "The string 'WRONG UID' is a valid uid");

    done();
  });
});
