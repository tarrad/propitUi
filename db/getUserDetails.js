 const getUserDetails = ((name,mysqlConnection) => {

    return new Promise(function(resolve, reject) {
        mysqlConnection.query('SELECT * From Users where username = ?',[name], (err, rows, fields) => {
        
            if(rows.length === 0){
                reject('Username not found')
            }
            else if(!err){
               
               resolve(rows)
            }
            else{
                console.log(err)
                reject(err)
            }
        })
    });
 })     



module.exports = getUserDetails