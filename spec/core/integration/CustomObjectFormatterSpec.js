describe('Custom object formatters', function() {
  let env;

  beforeEach(function() {
    env = new jasmineUnderTest.Env();
    env.configure({ random: false });
  });

  it('scopes custom object formatters to a spec', function(done) {
    env.it('a spec with custom pretty-printer', function() {
      env.addCustomObjectFormatter(function(obj) {
        return 'custom(' + obj + ')';
      });
      env.expect(42).toBeUndefined();
    });

    env.it('a spec without custom pretty-printer', function() {
      env.expect(42).toBeUndefined();
    });

    const specResults = [];
    const specDone = function(result) {
      specResults.push(result);
    };
    const expectations = function() {
      expect(specResults[0].failedExpectations[0].message).toEqual(
        'Expected custom(42) to be undefined.'
      );
      expect(specResults[1].failedExpectations[0].message).toEqual(
        'Expected 42 to be undefined.'
      );
      done();
    };
    env.addReporter({ specDone: specDone });

    env.execute(null, expectations);
  });

  it('scopes custom object formatters to a suite', function(done) {
    env.it('a spec without custom pretty-printer', function() {
      env.expect(42).toBeUndefined();
    });

    env.describe('with custom pretty-printer', function() {
      env.beforeAll(function() {
        env.addCustomObjectFormatter(function(obj) {
          return 'custom(' + obj + ')';
        });
      });

      env.it('a spec', function() {
        env.expect(42).toBeUndefined();
      });
    });

    const specResults = [];
    const specDone = function(result) {
      specResults.push(result);
    };
    const expectations = function() {
      expect(specResults[0].failedExpectations[0].message).toEqual(
        'Expected 42 to be undefined.'
      );
      expect(specResults[1].failedExpectations[0].message).toEqual(
        'Expected custom(42) to be undefined.'
      );
      done();
    };
    env.addReporter({ specDone: specDone });

    env.execute(null, expectations);
  });

  it('throws an exception if you try to add a custom object formatter outside a runable', function() {
    expect(function() {
      env.addCustomObjectFormatter(function() {});
    }).toThrowError(
      'Custom object formatters must be added in a before function or a spec'
    );
  });
});
