//mongodb error handle ke liye
function wrapSync(fn){
return function (req,res,next){
    fn(req,res,next).catch(next)
}
}


module.exports = wrapSync;