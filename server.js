import app from './src/app.js';
const port = process.env.DEV_APP_PORT
const server = app.listen(port, () => {
    console.log(`server stated on port ${port}`)
})

// process.on('SIGNIN', () => {
//     server.close(() => console.log(`server closed`))
// })