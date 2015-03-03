/// <reference path="./lib.d.ts" />

import thicket  = require("thicket");
import _        = require("underscore");
import Promise  = require("bluebird");
import mori     = require("mori");

var Options     = thicket.c("options"),
    UUID        = thicket.c("uuid");

export interface IPid {
    id(): string;
}

export interface IProcess {
    mailboxId() : string;
}

export interface IProcessSpec {}

export interface IProcessManagerOpts {}

export class ProcessManager {
    private _procs : mori.HashMap<string,IPid>;
    private _exchange : thicket.Exchange;

    constructor(o?: IProcessManagerOpts) {
        var opts = Options.fromObject(o);
        this._exchange = opts.getOrError("exchange");
        this._procs    = mori.hashMap<string,IPid>();
    }

    launch(spec: IProcessSpec) : Promise<IPid> {
        return Promise
            .bind(this)
            .then(function(): IPid {
                var mbox = this._exchange.mailbox(UUID.v4()),
                    pid  = new LocalPid({mailboxId: mbox.id()}),
                    proc = new LocalProcess({
                        mailbox: mbox
                    });
                this._procs = mori.assoc(this._procs, pid.id(), proc);
                return pid;
            });
    }

    doesOwn(pid: IPid) : boolean {
        return mori.hasKey(this._procs, pid.id());
    }
}

export interface ILocalProcessOpts {
    mailboxId?: string;
}

export class LocalProcess implements IProcess {
    private _mailbox: any;

    constructor(o?: ILocalProcessOpts) {
        var opts = Options.fromObject(o);
        this._mailbox = opts.getOrError("mailbox");
    }

    /**
     * The MailboxId for this process.
     *
     * I would love for this to return an alias to a string, but my editor doesn't
     * resolve exported type aliases properly. Maybe I need a better editor.
     * @returns {string}
     */
    mailboxId(): string {
        return this._mailbox.id();
    }
}

export interface ILocalPidOpts {
    mailboxId: string;
}

export class LocalPid implements IPid {
    private _mailboxId: string;
    private _id: string;
    constructor(o?:ILocalPidOpts) {
        var opts : thicket.Options = Options.fromObject(o);

        this._id        = opts.getOrElse("id", UUID.v4());
        this._mailboxId = opts.getOrError("mailboxId");

    }
    id(): string {
        return this._id;
    }
}
