const express = require('express')
const exphbs = require('express-handlebars')

//models
const User = require('./models/User')
const Address = require('./models/Address')

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
//create user
app.get('/users/add', (req, res) => {
    res.render('adduser')
})
//save use
app.post('/users/create', async (req, res) => {

    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    if (newsletter === 'on') {
        newsletter = true
    } else {
        newsletter = false
    }
    console.log(req.body)
    await User.create({
        name,
        occupation,
        newsletter
    })

    res.redirect('/')
})
//get user
app.get('/users/:id', async (req, res) => {

    const id = req.params.id
    try {
        /**
         * para trazer o relacionamento é utilizado o "include: Addres"
         * Sem o relacionamento pode ser usado "raw: true"
         */
        //const user = await User.findOne({raw: true, where: {id: id}})
        const user = await User.findOne({
            include: Address,
            where: {
                id: id
            }
        })
        //sem relacionament - not use relantionship
        //res.render('userview', { user })

        //usando relacionamento - using relationship
        res.render('userview', {
            user: user.get({
                plain: true
            })
        })
    } catch (error) {
        console.log(error)
    }

})
//delete user
app.post('/users/delete/:id', async (req, res) => {

    const id = req.params.id

    await User.destroy({
        where: {
            id: id
        }
    })

    res.redirect('/')
})
//edit user
app.get('/users/edit/:id', async (req, res) => {

    const id = req.params.id

    const user = await User.findOne({
        raw: true,
        where: {
            id: id
        }
    })

    res.render('useredit', {
        user
    })
})
//update user
app.post('/users/update', async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    if (newsletter === 'on') {
        newsletter = true
    } else {
        newsletter = false
    }

    const userData = {
        id,
        name,
        occupation,
        newsletter
    }

    await User.update(userData, {
        where: {
            id: id
        }
    })

    res.redirect('/')
})
//add address
app.post('/address/create', async (req, res) => {
    const UserId = req.body.UserId
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    const address = {
        UserId,
        street,
        number,
        city
    }

    await Address.create(address)

    res.redirect(`/users/${UserId}`)
})
//delete address
app.post('/address/delete', async (req, res) => {

    const UserId = req.body.UserId
    const id = req.body.id

    await Address.destroy({ where: {id:id},
    })

    res.redirect(`/users/${UserId}`)
})
//home
app.get('/', async (req, res) => {

    const users = await User.findAll({
        raw: true
    })

    console.log(users)
    res.render('home', {
        users: users
    })
})

conn.sync().then(() => { // use "sync({force:true})" to drop all tables
    app.listen(3000)
}).catch((err) => console.log(err))