var jwtDecode = require('jwt-decode');

const decode = ((params) => {
    return new Promise(function(resolve, reject) {
        try{
            
            const decoded = jwtDecode(params);
            console.log(decoded)
            resolve(decoded)
        }
        catch(err){
            reject(401)
        }        

    });
})

module.exports = decode