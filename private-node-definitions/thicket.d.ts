declare module "thicket" {

    class Options {
        static fromObject(obj:any):Options;
        getOrError(name:string): any;
        getOrElse(name:string, defaultValue:any):any;
    }

    class Mailbox {

    }

    class Exchange {
        mailbox(mboxId:string):Mailbox;
    }

    interface LoaderSingleton {
        (name:string):any
    }

    export var c : LoaderSingleton
}
