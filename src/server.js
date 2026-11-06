const express = require('express')
require('dotenv').config()

const db = require('./database')
const cors = require('cors');

const app = express()
const port = process.env.PORT || 3000
app.use(cors());

app.use(express.json())



app.get('/', (req, res) => {
    res.json({message: "API CRUD com Express e MySQL"})
})

app.post('/usuario', async (req, res) => {
    try {
        const {nome, email, senha} = req.body

        if(!nome || !email || !senha){
            return res.status(400).json({ message: 'Todos os campos são obrigatórios'})
        }

        const [resultado] = await db.query(
            'INSERT INTO usuario(nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        )

        res.status(201).json({
            id_usuario: resultado.insertId,
            nome,
            email,
            senha
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar usuário'})
    }
})

//teste
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dias
  }
}));