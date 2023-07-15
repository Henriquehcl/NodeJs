// modulos externos

import inquirer from 'inquirer';
import chalk from 'chalk';

//modulos internos
import fs from 'fs'
import { parse } from 'path';

console.log('Start')

operation()

function operation() {


    inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'O que deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }, ]).then((answer) => {
            const action = answer['action']
            if (action == 'Criar Conta') {
                createAccount()
            }else if(action == 'Consultar Saldo'){
                getAccountBalance()
            }else if(action == 'Depositar'){
                return deposit()
            }else if(action == 'Sacar'){
                withdraw()
            }else if(action == 'Sair'){
                console.log(chalk.bgBlue('Até logo!'))
                process.exit()
            }
        })
        .catch((err) => console.log(err))
}

//create an account
function createAccount() {
    console.log(chalk.green('Defina as opções da sua conta!'))
    buildAccount()
}

function buildAccount() {
    inquirer.prompt([{
            name: 'accountName',
            message: 'Digite o nome para sua conta:'
        }, ])
        .then((answer) => {
            const accountName = answer['accountName']
            console.info(accountName)

            //verificar se diretorio existe. se não, cria novo

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts')
            }

            //verificar se nome de conta existe
            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(
                    chalk.bgRed.black('Conte existente')
                )
                buildAccount()
                return
            }else{
            //criado o arquivo com informações da conta
            fs.writeFileSync(
                `accounts/${accountName}.json`,
                '{"balance": 0}',
                function (err) {
                    console.log(err)
                },
                console.log(chalk.green('Conta criada com sucesso!'))
            )
            }
            
            operation()
        })
        .catch((err) => console.log(err))
}

//add an amount to user account
function deposit(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta'
        }
    ])
    .then((answer) =>{
        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name:'amount',
                message: 'Quanto deseja depositar?'
            },
        ]).then((answer) =>{

            const amount = answer['amount']

            //add an amount
            addAmount(accountName, amount)
            operation()
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Conta não encontrada'))
        return false
    }

    return true
}

function addAmount(accountName, amount){

    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(`accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function(err){
        console.log(err)
    },
    )
    console.log(chalk.green(`foi depositado o valor de R$${amount}`))
    
}

function getAccount(accountName){

    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: 'utf8',
        flag: 'r',
    })
    return JSON.parse(accountJSON)
}

function getAccountBalance(){

    inquirer.prompt([
        {
            name:'accountName',
            message:'Qual sua conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue(`O saldo da conta é R$${accountData.balance}`))
        operation()
    }).catch(err => console.log(err))
}

//withdraw an amount from user account
function withdraw(){

    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual a conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return withdraw()
        }
        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor para saque?'
            }
        ]).then((answer)=> {
            const amount = answer['amount']
            removeAmount(accountName, amount)
           
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

}

function removeAmount(accountName, amount){

    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro. Tenta novamente!'))
        return withdraw()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponível'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        }
    )
    console.log(chalk.green(`Saque no valor de R$${amount} realizado com sucesso!`))
    operation()
}