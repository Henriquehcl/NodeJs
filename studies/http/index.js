import fs from 'fs'
import http from 'http'
import url from 'url'

const port = 3000

const server = http.createServer((req, res) => {
    /*res.write('hello')
    res.end()
    res.setHeader('Contenty-Type', 'text/html')
    res.end('<h1> Hello World!</h1>')
    */

    const urlInfo = url.parse(req.url, true)
    const name = urlInfo.query.name

    if (!name) {
        fs.readFile('input.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.write(data)
            return res.end()
        })
    }else{
        const nameNewLine = name + '\r\n'
        
        fs.appendFile('file.txt', nameNewLine, function(err, data){
            res.writeHead(302, {
                Location: '/',
            })
            return res.end()
        })
    }


})

server.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`)
})