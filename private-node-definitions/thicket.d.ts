declare module "thicket" {

    class Options {
        static fromObject(obj: any): Options;
        getOrError(name:string): any;
    }

    interface LoaderSingleton {
        (name: string): any
    }

    export var c : LoaderSingleton
}
