"use strict";
var PromiseState;
(function (PromiseState) {
    PromiseState["PENDING"] = "pending";
    PromiseState["FULFILLED"] = "fulfilled";
    PromiseState["REJECTED"] = "rejected";
})(PromiseState || (PromiseState = {}));
/// class started from here
class MyPromise {
    constructor(executor) {
        this._state = PromiseState.PENDING;
        this._successCallbackHandler = [];
        this._failureCallbackHandler = [];
        this._finallyCallbackHandler = undefined;
        this._value = undefined;
        this._reason = undefined;
        executor(this._promiseResolver.bind(this), this._promiseRejector.bind(this));
    }
    _promiseResolver(value) {
        if (this._state == PromiseState.FULFILLED)
            return;
        this._state = PromiseState.FULFILLED;
        this._value = value;
        this._successCallbackHandler.forEach((cb) => cb(value));
        if (this._finallyCallbackHandler)
            this._finallyCallbackHandler();
    }
    _promiseRejector(reason) {
        if (this._state == PromiseState.REJECTED)
            return;
        this._state = PromiseState.REJECTED;
        this._reason = reason;
        this._failureCallbackHandler.forEach((cb) => cb(reason));
        if (this._finallyCallbackHandler)
            this._finallyCallbackHandler();
    }
    finally(handlerFn) {
        if (this._state !== PromiseState.PENDING) {
            return handlerFn();
        }
        this._finallyCallbackHandler = handlerFn;
    }
    then(handlerFn) {
        if (this._state == PromiseState.FULFILLED) {
            handlerFn(this._value);
        }
        else {
            this._successCallbackHandler.push(handlerFn);
        }
        return this;
    }
    catch(handlerFn) {
        if (this._state == PromiseState.REJECTED) {
            handlerFn(this._reason);
        }
        else {
            this._failureCallbackHandler.push(handlerFn);
        }
        return this;
    }
}
function customPromise() {
    return new MyPromise((resolve, reject) => {
        resolve(1);
        // reject("Bad Error");
    });
}
customPromise()
    .then((value) => {
    console.log("Promise Resolved ", value);
})
    .catch((reason) => {
    console.log("Rejected", reason);
})
    .finally(() => console.log("Everything Done!"));
