//configs:
const express = require('express')
require('dotenv').config()
//importando do arquivo do banco de dados
const db = require('./database')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
//-----------------------------------------------------------------
app.get('/', (req, res) => {
    res.json({message: "API CRUD com Express e MySQL"})
})

// USUARIO


app.get('/usuarios', async (req, res) => {

    try{

        const [usuarios] = await db.query('SELECT * FROM usuario ORDER BY id_usuario DESC')

        res.json(usuarios)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: 'Erro ao listar usuários',
            erro: error.message
        })

    }

})

app.get('/usuarios/:id_usuario', async (req, res) => {
    try {
        const {id_usuario} = req.params
        const [usuarios] = await db.query(
            'SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]
        )

        if (usuarios.length === 0){
            return res.status(404).json({ message: 'Usuário não encontrado'})
        }

        res.json(usuarios[0])
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar usuário'})
    }
})

app.get('/usuarios/busca/:nome', async (req, res) => {
    try {
        const {nome} = req.params
        const [usuarios] = await db.query(
            'SELECT * FROM usuario WHERE nome = ?', [nome]
        )

        if (usuarios.length === 0){
            return res.status(404).json({ message: 'Usuário não encontrado'})
        }

        res.json(usuarios[0])
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar usuário'})
    }
})

app.post('/usuarios', async (req, res) => {
    try {
        const {nome, cpf, data_nascimento, email, senha, telefone} = req.body

        if(!nome || !cpf || !data_nascimento || !email || !senha || !telefone){
            return res.status(400).json({ message: 'Todos os campos são obrigatórios'})
        }

        const [resultado] = await db.query(
            'INSERT INTO usuario (nome, cpf, data_nascimento, email, senha, telefone) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, cpf, data_nascimento, email, senha, telefone]
        )

        res.status(201).json({
            id_usuario: resultado.insertId,
            nome,
            cpf,
            data_nascimento,
            email,
            senha,
            telefone
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar usuário'})
    }
})

app.put('/usuarios/:id_usuario', async (req,res) => {
    try {
        const {id_usuario} = req.params
        const {nome, cpf, data_nascimento, email, senha, telefone} = req.body

        if(!nome || !cpf || !data_nascimento || !email || !senha || !telefone){
            return res.status(400).json({ message: 'Todos os campos são obrigatórios'})
        }

        const [resultado] = await db.query(
            'UPDATE usuario SET nome = ?, cpf = ?, data_nascimento = ?, email = ?, senha = ?, telefone = ? WHERE id_usuario = ?',
            [nome, cpf, data_nascimento, email, senha, telefone, id_usuario]
        )

        if(resultado.affectedRows === 0 ){
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        res.json({
            id_usuario,
            nome,
            cpf,
            data_nascimento,
            email,
            senha,
            telefone
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário'})
    }
})

app.delete('/usuarios/:id_usuario', async (req, res) => {
    try {
        const {id_usuario} = req.params
        const [resultado] = await db.query(
            'DELETE FROM usuario WHERE id_usuario = ?', [id_usuario]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        res.status(204).send()
    } catch(error) {
        res.status(500).json({ message: 'Erro ao excluir usuário' })
    }
})

// CAMPANHA_SAUDE

app.get('/campanhas', async (req, res) => {
    try{
        const [campanhas] = await db.query('SELECT * FROM campanha_saude ORDER BY id_campanha DESC')
        res.json(campanhas)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar campanhas'})
    }
})

app.get('/campanhas/:id', async (req, res) => {
    try {
        const {id} = req.params
        const [campanhas] = await db.query(
            'SELECT * FROM campanha_saude WHERE id_campanha = ?', [id]
        )

        if (campanhas.length === 0){
            return res.status(404).json({ message: 'Campanha não encontrada'})
        }

        res.json(campanhas[0])
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar campanha'})
    }
})

app.get('/campanhas/busca/:titulo', async (req, res) => {
    try {
        const {titulo} = req.params
        const [campanhas] = await db.query(
            'SELECT * FROM campanha_saude WHERE titulo = ?', [titulo]
        )

        if (campanhas.length === 0){
            return res.status(404).json({ message: 'Campanha não encontrada'})
        }

        res.json(campanhas[0])
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar campanha'})
    }
})

app.post('/campanhas', async (req, res) => {
    try {
        const {titulo, descricao, data_inicio, data_fim} = req.body

        if(!titulo){
            return res.status(400).json({ message: 'Título é obrigatório'})
        }

        const [resultado] = await db.query(
            'INSERT INTO campanha_saude (titulo, descricao, data_inicio, data_fim) VALUES (?, ?, ?, ?)',
            [titulo, descricao || null, data_inicio || null, data_fim || null]
        )

        res.status(201).json({
            id_campanha: resultado.insertId,
            titulo,
            descricao: descricao || null,
            data_inicio: data_inicio || null,
            data_fim: data_fim || null
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar campanha'})
    }
})

app.put('/campanhas/:id', async (req,res) => {
    try {
        const {id} = req.params
        const {titulo, descricao, data_inicio, data_fim} = req.body

        if(!titulo){
            return res.status(400).json({ message: 'Título é obrigatório'})
        }

        const [resultado] = await db.query(
            'UPDATE campanha_saude SET titulo = ?, descricao = ?, data_inicio = ?, data_fim = ? WHERE id_campanha = ?',
            [titulo, descricao || null, data_inicio || null, data_fim || null, id]
        )

        if(resultado.affectedRows === 0 ){
            return res.status(404).json({ message: 'Campanha não encontrada' })
        }

        res.json({
            id_campanha: id,
            titulo,
            descricao: descricao || null,
            data_inicio: data_inicio || null,
            data_fim: data_fim || null
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar campanha'})
    }
})

app.delete('/campanhas/:id', async (req, res) => {
    try {
        const {id} = req.params
        const [resultado] = await db.query(
            'DELETE FROM campanha_saude WHERE id_campanha = ?', [id]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Campanha não encontrada' })
        }

        res.status(204).send()
    } catch(error) {
        res.status(500).json({ message: 'Erro ao excluir campanha' })
    }
})

app.listen (port, () => {
    console.log(`Server rodando em http://localhost:${port}`);
})