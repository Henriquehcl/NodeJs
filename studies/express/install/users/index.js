const express = require('express')
const path = require('path')

const router = express.Router()

const basePath = path.join(__dirname, '../templates')



router.get('/add', (req, res) => {
    res.sendFile(`${basePath}/userForm.html`)
})

router.post('/save', (req, res) => {
    console.log(req.body)
    
    const name = req.body.name
    const age = req.body.age

    console.log(`O nome é ${name} e a idade ${age}`)
    res.sendFile(`${basePath}/userForm.html`)
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    console.log(`Buscando pelo ID ${id}`)

    res.sendFile(`${basePath}/user.html`);
})


//exportando o module
module.exports = router
