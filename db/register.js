const bcrypt = require('bcrypt')
const sha256 = require('js-sha256');


const register = ((params, mysqlConnection) => {
    return new Promise(function(resolve, reject) {
        console.log(params.username)
        mysqlConnection.query('SELECT * From Users where username = ?',[params.username], (err, rows, fields) => {
            
            if(rows.length > 0){
                console.log(err)
                reject("Username exists");
            }
            else if(!err){


                const hashedPassword = bcrypt.hashSync(params.password+params.username, 10);
                let hash = sha256.create();
                hash.update(hashedPassword);
                const query = `INSERT INTO users(Username,Digest,Admin)
                VALUES(?,?,?)`;
                mysqlConnection.query(query, [params.username,hashedPassword,params.admin ], (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        reject(500)
                    }
                    resolve(200)
                  });
                  
            }
            else{
                console.log(err)
                reject(500);
            }
        })

    });
})


module.exports = register

