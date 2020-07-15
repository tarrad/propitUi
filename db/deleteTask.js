const daleteTask = ((id, mysqlConnection) => {
    return new Promise(function(resolve, reject) {
            mysqlConnection.query('DELETE FROM tasks WHERE TaskId = ?',[id], (err, rows, fields) => {

                 if(!err){
                   resolve(200)
                }
                else{
                    reject(404)
                }
            })
    });
})

module.exports = daleteTask