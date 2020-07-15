const getTasks = ((name, isAdmin, mysqlConnection) => {
    return new Promise(function(resolve, reject) {
        if(Number(isAdmin) === 1){
            mysqlConnection.query('SELECT * From tasks', (err, rows, fields) => {

                 if(!err){
                     
                 
                   
                   resolve(rows)
                }
                else{
                    
                    reject(err)
                }
            })
        }
        else{
            console.log(name + " tsahc")
            mysqlConnection.query('SELECT * From tasks where Username = ?',[name], (err, rows, fields) => {
                 if(!err){
                   resolve(rows)
                }
                else{
                    reject(err)
                }
            })


        }

    });
})

function convertDigitIn(str){
    return str.split('/').reverse().join('/');
 }

module.exports = getTasks