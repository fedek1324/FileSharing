import { Observable } from 'rxjs/internal/Observable';

// DB doesnt work without additional delay after each command
// Error usually happens when deleting big files 
let additionalDelay = 1500; 
let currentyExecuting = false;

// call function immediately but return result with delay
export async function asyncDecoratorWithDelay(
  func: (obj: Object) => Observable<any>,
  arg: Object
) {
  if (currentyExecuting) {
    console.log('Blocked function call bcs executing already');
    return Promise.reject('Blocked function call bcs executing already');
  }

  currentyExecuting = true;
  console.log('Executing ' + currentyExecuting);

  let res = await func.apply(this, arg).toPromise();
  await new Promise((resolve) => setTimeout(() => resolve(1), additionalDelay));
  currentyExecuting = false;
  console.log('Executing ' + currentyExecuting);
  return res;

  // return new Promise((resolve, reject) => {
  //   func.apply(this, arg).toPromise()
  //     .then((res) => {
  //       return new Promise((resolve) => setTimeout(() => resolve(res), additionalDelay))
  //     })
  //     .then((res) => {
  //       currentyExecuting = false;
  //       console.log('Executing ' + currentyExecuting);
  //       resolve(res);
  //     } );
  // });

  // // call function and add handler which will change executing state
  // let promise = func
  //   .apply(this, arg)
  //   .toPromise()
  //   .then((res) => {
  //     currentyExecuting = false;
  //     console.log('Executing ' + currentyExecuting);
  //     return res;
  //   });
  // // wait  this.additionalDelay ms
  // await new Promise((resolve) => setTimeout(() => resolve(1), additionalDelay));
  // return promise;
}
