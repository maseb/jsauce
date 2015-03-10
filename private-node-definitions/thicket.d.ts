declare module "thicket" {

    class Options {
        static fromObject(obj:any): Options;
        getOrError(name: string): any;
        getOrElse(name: string, defaultValue:any): any;
    }

    class Channel {
        subscribe: (msg: any) => any;
    }

    class Mailbox {
        id(): string;
        ingressChannel(): Channel;
        oneShotChannel(): Channel;
        requestReplyChannel(): Channel;
    }

    class Exchange {
        mailbox(mboxId:string):Mailbox;
    }

    class Courier {
    }

    class ErrorClass {
        constructor(message?: string);
    }

    class Lang {
        static makeErrorClass(typeName: string, message: string) : ErrorClass;
    }

    interface LoaderSingleton {
        (name:string):any
    }

    export var c : LoaderSingleton
}
