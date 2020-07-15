const createTask = ((username,params, mysqlConnection) => {
    return new Promise(function(resolve, reject) {

        

                let query = `INSERT INTO tasks(Date,DescriptionOfTask,Email,Phone,Username)
                VALUES(?,?,?,?,?)`;
                var datetime = new Date();
                mysqlConnection.query(query, [datetime.toISOString().split('T')[0],params.description,params.email,params.phone,username ], (err, results, fields) => {
                    if (err) {
                        reject(404)
                    }
                    
                    query ="SELECT *  FROM tasks where TaskId = ?"

                    mysqlConnection.query(query, [results.insertId], (err, results, fields) => {
                        if (err) {
                            reject(404)
                        }
                        
                        resolve(results[0])
                      });

                    
                  });
        

    });
})

module.exports = createTask