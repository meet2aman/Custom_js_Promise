enum PromiseState {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

type TPromiseResolve<T> = (value: T) => void;
type TPromiseReject<T> = (reason: T) => void;
type TPromiseExecutor<T, K> = (
  resolve: TPromiseResolve<T>,
  reject: TPromiseReject<K>
) => void;

type TPromiseThenCallback<T> = (value: T | undefined) => void;
type TPromiseCatchCallback<T> = (value: T | undefined) => void;
type TPromiseFinallyCallback = () => void;

/// class started from here

class MyPromise<T, K> {
  private _state: PromiseState = PromiseState.PENDING;

  private _successCallbackHandler: TPromiseThenCallback<T>[] = [];
  private _failureCallbackHandler: TPromiseCatchCallback<K>[] = [];
  private _finallyCallbackHandler: TPromiseFinallyCallback | undefined =
    undefined;

  private _value: T | undefined = undefined;
  private _reason: K | undefined = undefined;

  constructor(executor: TPromiseExecutor<T, K>) {
    executor(
      this._promiseResolver.bind(this),
      this._promiseRejector.bind(this)
    );
  }

  private _promiseResolver(value: T) {
    if (this._state == PromiseState.FULFILLED) return;
    this._state = PromiseState.FULFILLED;
    this._value = value;
    this._successCallbackHandler.forEach((cb) => cb(value));
    if (this._finallyCallbackHandler) this._finallyCallbackHandler();
  }

  private _promiseRejector(reason: K) {
    if (this._state == PromiseState.REJECTED) return;
    this._state = PromiseState.REJECTED;
    this._reason = reason;
    this._failureCallbackHandler.forEach((cb) => cb(reason));
    if (this._finallyCallbackHandler) this._finallyCallbackHandler();
  }

  public finally(handlerFn: TPromiseFinallyCallback) {
    if (this._state !== PromiseState.PENDING) {
      return handlerFn();
    }
    this._finallyCallbackHandler = handlerFn;
  }

  public then(handlerFn: TPromiseThenCallback<T>) {
    if (this._state == PromiseState.FULFILLED) {
      handlerFn(this._value);
    } else {
      this._successCallbackHandler.push(handlerFn);
    }
    return this;
  }
  public catch(handlerFn: TPromiseCatchCallback<K>) {
    if (this._state == PromiseState.REJECTED) {
      handlerFn(this._reason);
    } else {
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
