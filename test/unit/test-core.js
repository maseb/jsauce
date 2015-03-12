
var jsauce = require("../../dist/lib-node/jsauce"),
    Promise = require("bluebird"),
    assert = require("assert"),
    thicket = require("thicket"),
    Exchange = thicket.c("messaging/exchange"),
    ProcessManager = jsauce.c("process-manager");



describe("ProcessManager", function() {
  it("should exist", function() {
    assert.ok(ProcessManager);
  });

  it("should be able to launch a process", function(done) {
    var delegate = {
          onReqHandshake: function(msg) {
            return Promise.resolve({});
          }
        },
        spec = {
          pType: "local",
          delegateBuilder: function() {
            return delegate;
          }
        },
        ex = new Exchange(),
        pm = new ProcessManager({exchange: ex});

    pm
      .launch(spec)
      .then(function(pid) {
        assert.ok(pid);
        assert.ok(pm.doesOwn(pid), "ProcessManager owns the pid it returned");
      })
      .finally(function() {
        pm.dispose();
        ex.dispose();
        done();
      });
  });


});
