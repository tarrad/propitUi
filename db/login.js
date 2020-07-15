const bcrypt = require('bcrypt')
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken')
const key = '67324814a307ba404b6749759d73c0a49e466b4b95b6a9b08ee5695caa8cb2512c04cdf367a0f85bd1464b4c1335c348f92484336a5c8518b303608440e5acc8'

const getUser = ((params, mysqlConnection) => {
    return new Promise(function(resolve, reject) {
        
        mysqlConnection.query('SELECT * From Users where username = ?',[params.username], (err, rows, fields) => {
        
            if(rows.length === 0){
                reject();
            }
            else if(!err){
                console.log(params)
                const hashedPassword = bcrypt.hashSync(params.password+params.username, 10);
                if(bcrypt.compareSync(params.password+params.username, rows[0].Digest))
                {
                    const accessToken = jwt.sign({
                        // 1 hour expiration
                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                        data: params.username
                      }, key);
                      resolve(accessToken)
                }
                else{
                    reject();
                }
                
            }
            else{
                reject();
            }
        })

    });
})


module.exports = getUser



