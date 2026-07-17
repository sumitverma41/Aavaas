///ye error calss handler bnaya gya hai koi random route search ke liye a'page not found';

class expressError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode = statusCode;
        this.message= message;
    }
}
module.exports = expressError;