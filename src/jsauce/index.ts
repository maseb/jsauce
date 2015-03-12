
/// <reference path="./lib.d.ts" />

import thicket           = require("thicket");
import core              = require("./core");

var ComponentRegistry    = thicket.c("component-registry");

var c = new ComponentRegistry();

c.registerMany([
    {
        module: core.ProcessManager,
        as: "process-manager"
    },
    {
        module:core.Errors,
        as: "errors"
    }
]);

export = c;
