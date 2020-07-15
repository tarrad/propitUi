const updateTask = ((username,params, mysqlConnection) => {
    return new Promise(function(resolve, reject) {

                console.log(params);

                const query = `UPDATE tasks SET completed = ?, DescriptionOfTask = ?,Phone = ?,Email = ? WHERE TaskId = ?`;
                mysqlConnection.query(query, [params.completed, params.description,params.phone,params.email,params.id ], (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        reject(404)
                    }
                    resolve(200)
                  });
        

    });
})

module.exports = updateTask