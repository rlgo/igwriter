const fileupload = require('express-fileupload')
const reader = require('any-text');
const cors = require('cors')
const express = require('express')
const app = express()
const port = 8929

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    preserveExtension: 5
}));

app.post('/file', cors({
    origin: 'https://igwriter.web.app',
    optionsSuccessStatus: 200
}), (req, res) => {
    if (!req.files) {
        console.log("no files")
        res.send("no files")
        return
    }
    const path = __dirname + '/' + req.files.file.name

    req.files.file.mv(path, (error) => {
        reader.getText(path).then(function (data) {
            console.log(data)
            res.send(data)
        });
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})