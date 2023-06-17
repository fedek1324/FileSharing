import { Observable } from "rxjs/internal/Observable";

let additionalDelay = 1500; // DB doesnt work without additional delay after each command

export async function asyncDecoratorWithDelay(func : (obj : Object ) => Observable<any>, arg : Object) {
    let promise = func.apply(this, arg).toPromise();
    await new Promise(resolve => setTimeout(() => resolve(1), additionalDelay)); // wait  this.additionalDelay ms
    return promise;
}