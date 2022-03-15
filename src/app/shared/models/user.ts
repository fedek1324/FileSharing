export interface User {
    id: number,
    email : string,
    password : string,
    files? : number[]
}