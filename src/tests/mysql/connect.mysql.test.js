import mysql from 'mysql2'
const pool = mysql.createPool({
    host: 'localhost',
    port: 8811,
    user: 'root',
    password: 'tiesnode',
    database: 'shopDEV'
})

const batchSize = 100000 // adjust batch size
const totalSize = 10_000_000 // adjust total size
let currentId = 1
console.time('::::::TIMER:::')
const insertBatch = async () => {
    const values = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address]);
        currentId++
    }
    if (!values.length) {
        console.timeEnd('::::::TIMER:::')
        pool.end(err => {
            if (err) {
                console.log(`error occurred while running batch`)
            } else {
                console.log(`Connection pool close successfully`)
            }
        })
        return
    }
    const sql = `INSERT INTO shopDEV_table (id, name, age, address) VALUES ?`
    pool.query(sql, [values], async function (err, results) {
        if (err) throw err
        console.log(`Inserted ${results.affectedRows} records`)
        await insertBatch()
    })
}
insertBatch().catch(console.error)

// perform a sample operation
// pool.query('SELECT 1 + 1 AS solution', function (err, result) {})
//  pool.query('SELECT 1 + 1 AS solution', function (err, result) {
//     if (err) throw err
//     console.log(`query result: ${result}`)
    
//     pool.end(err => {
//         if (err) throw err
//         console.log('Connection pool closed')
//     })
//  })