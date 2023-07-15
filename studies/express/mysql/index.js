const express = require('express')
const exphbs = require('express-handlebars')

//chamando a conexão com o banco
const conn = require('./db/conn')

const app = express()

// capturando o body da requisição post
app.use(
    express.urlencoded({
        extended: true
    })
)

//pegando o body em JSON
app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.post('/books/save', (req, res) =>{
    const title = req.body.title
    const pages = req.body.pages

    const sql = `INSERT INTO books (??,??) VALUES (?, ?)`
    const data = ['title', 'pages', title, pages]
    conn.query(sql, data, function(err){
        if(err){
            console.log(err)
            return
        }else{
            console.log('Salvo com sucesso')
            res.render('home')
        }
    })
    
})
app.get('/books', (req, res) => {
    
    const sql ='SELECT * FROM books'

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }else{
            
            const books = data
            console.log(books)

            //passando o resultado para a view
            res.render('books', { books })
        }
    })

})
app.get('/books/edit/:id', (req, res) => {
    
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    conn.query(sql, data, function(err, data){
        if(err){
            console.log(err)
            return
        }else{
            const book = data[0]
            console.log(book)
            res.render('editBook', { book })
        }
    })
})

app.get('/books/:id', (req, res) => {
    
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    conn.query(sql,data, function(err, data){
        if(err){
            console.log(err)
            return
        }else{
            const book = data[0]
            console.log(book)
            res.render('book', { book })
        }
    })
})

app.post('/books/update', (req,res) => {
    
    const id = req.body.id
    const title = req.body.title
    const pages = req.body.pages

    //const sql = `UPDATE books SET title = '${title}', pages = '${pages}' WHERE id = ${id}`
    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pages', pages, 'id', id]

    conn.query(sql,data, function(err){
        if(err){
            console.log(err)
            return
        }else{
            
            res.redirect('/books')
        }
    })
})

app.post('/books/delete/:id', (req,res) => {
    
    const id = req.params.id

    const sql = `DELETE FROM books WHERE ?? = ?`
    const data = ['id', id]

    conn.query(sql, data, function(err, data){
        if(err){
            console.log(err)
            return
        }else{
            
            res.redirect('/books')
        }
    })
})

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000)
