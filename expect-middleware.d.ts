/// <reference path="typings/index.d.ts" />

interface Function {
    name: string
}

declare module 'type-of' {
    function _typeof(target: any): string;

    export = _typeof;
}

declare module 'expect' {
    type Middleware = (req: any, res: any, next: Function) => void;
    type Assertion = (target: any) => boolean;

    interface Expectation {
        toHave(args: string | string[]): Middleware;
        toHaveOneOf(args: string[]): Middleware;
        toExist(): Middleware;
        toBeOfType(args: string): Middleware;
        toAssert(functioToTest: Assertion): Middleware;
    }

    function expect(target: string): Expectation;

    export = expect;
}
