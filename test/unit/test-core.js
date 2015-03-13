
var jsauce = require("../../dist/lib-node/jsauce"),
    Promise = require("bluebird"),
    assert = require("assert"),
    thicket = require("thicket"),
    Exchange = thicket.c("messaging/exchange"),
    CountdownLatch = thicket.c("countdown-latch"),
    ProcessManager = jsauce.c("process-manager"),
    Errors = jsauce.c("errors");




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
        pm = new ProcessManager({ exchange: ex });

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

  it("should timeout if it doesn't receive a handshake", function(done) {
    var delegate = {},
        spec = {
          pType: "local",
          handshakeTimeout: 30,
          delegateBuilder: function() {
            return delegate;
          }
        },
        ex = new Exchange(),
        pm = new ProcessManager({ exchange: ex }),
        latch = new CountdownLatch(1, function() {
          assert.ok(true);
          ex.dispose();
          pm.dispose();
          done();
        });

    pm
      .launch(spec)
      .then(function() {
        assert.ok(false, "shouldn't get here");
      })
      .catch(Errors.HandshakeTimeoutError, function(err) {
        assert.ok(err);
        latch.step();
      });
  });

  it("should be able to receive a message via a pid", function(done) {
    var delegate = {
          onReqHandshake: Promise.method(function() {
            return {};
          }),
          onMsgMessage: Promise.method(function(msg) {
            assert.ok(msg.data);
            assert.equal("hello", msg.data);
            latch.step();
          })
        },
        spec = {
          pType: "local",
          delegateBuilder: function() {
            return delegate;
          }
        },
        ex = new Exchange(),
        pm = new ProcessManager({ exchange: ex }),
        latch = new CountdownLatch(1, function() {
          pm.dispose();
          ex.dispose();
          done();
        });

    pm
      .launch(spec)
      .then(function(pid) {
        pid.send("hello")
      });
  });


});
