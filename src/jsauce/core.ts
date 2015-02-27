/// <reference path="./lib.d.ts" />

import thicket  = require("thicket");
import _        = require("underscore");
import Promise  = require("bluebird");

var Options     = thicket.c("options");

export interface IPid {}

export interface IProcess {
    mailboxId() : string;
}

export interface IProcessSpec {}

export class ProcessManager {
    constructor() {}
    launch(spec: IProcessSpec) : Promise<IPid> {
        return Promise
            .bind(this)
            .then(function() {

                return {};
            });
    }
}

export interface ILocalProcessOpts {
    mailboxId?: string;
}

export class LocalProcess implements IProcess {
    private _mailboxId: string;

    constructor(o?: ILocalProcessOpts) {
        var opts = Options.fromObject(o);
        this._mailboxId = opts.getOrError("mailboxId");
    }

    /**
     * The MailboxId for this process.
     *
     * I would love for this to return an alias to a string, but my editor doesn't
     * resolve exported type aliases properly. Maybe I need a better editor.
     * @returns {string}
     */
    mailboxId(): string {
        return this._mailboxId;
    }
}
