const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

//partials
const hbs = exphbs.create({
    partialsDir: ['views/partials']
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/products', (req, res) => {
    const products = [{
            title: "bota",
            category: "vestuário",
            price: "R$500,00",
            qtd: "5",
        },
        {
            title: "Barrca",
            category: "Equipamentos",
            price: "R$1.500,00",
            qtd: "3",
        },
        {
            title: "Lanterna cabeça",
            category: "acessótios",
            price: "R$100,00",
            qtd: "15",
        },
    ]

    res.render('products',{products})
})

app.get('/', (req, res) => {

    res.render('home')
})

app.listen(5000, () => {
    console.log('Running')
})