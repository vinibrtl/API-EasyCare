//configs:
const express = require('express')
require('dotenv').config()
//importando do arquivo do banco de dados
const db = require('./database')
const cors = require('cors');

const app = express()
const port = process.env.PORT || 3000
app.use(cors());

app.use(express.json())
//-----------------------------------------------------------------
app.get('/', (req, res) => {
    res.json({message: "API CRUD com Express e MySQL"})
})

const idUsuario = 1;

// USUARIO

app.post('/usuarios', async (req, res) => {
    try {
        const {nome, email, senha} = req.body

        if(!nome || !email || !senha){
            return res.status(400).json({ message: 'Todos os campos são obrigatórios'})
        }

        const [resultado] = await db.query(
            'INSERT INTO usuarios(nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        )

        res.status(201).json({
            id_usuario: resultado.insertId,
            nome,
            email,
            senha
        })
    }  catch (error) {
    console.error('Erro no cadastro:', error);

    res.status(500).json({
        message: 'Erro ao cadastrar usuário'
    });
}
})

app.post('/api/login', async (req, res) => {
    try {
      const { email, senha } = req.body;
  
      if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
      }
  
      const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  
      if (usuarios.length === 0) {
        return res.status(401).json({ message: 'E-mail ou senha inválidos' });
      }
  
      const usuario = usuarios[0];
      //const senhaOk = await bcrypt.compare(senha, usuario.senha);
      const senhaOk = usuario.senha
      if (!senhaOk) {
        return res.status(401).json({ message: 'E-mail ou senha inválidos' });
      }
  
      //req.session.usuarioId = usuario.id_usuario;
  
      res.json({
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        message: 'Login realizado com sucesso',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  });
  
  // Dados do usuário logado
  /*app.get('/api/usuario', exigirLogin, async (req, res) => {
    try {
      const [usuarios] = await db.query(
        'SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?',
        [req.session.usuarioId]
      );
  
      if (usuarios.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      res.json(usuarios[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  });  */


app.get('/usuario', async (req, res) => {
    try {
        const [usuarios] = await db.query(
            'SELECT id_usuario, nome, email FROM usuario'
        );

        res.json(usuarios);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
});


app.get('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [usuarios] = await db.query(
            'SELECT id_usuario, nome, email FROM usuario WHERE id_usuario = ?',
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        res.json(usuarios[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
});


app.put('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({
                message: 'Nome e e-mail são obrigatórios'
            });
        }

        const [resultado] = await db.query(
            'UPDATE usuario SET nome = ?, email = ? WHERE id_usuario = ?',
            [nome, email, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        res.json({ message: 'Usuário atualizado com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
});


app.delete('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM usuario WHERE id_usuario = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        res.json({ message: 'Usuário excluído com sucesso' });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                message: 'Não é possível excluir um usuário com registros vinculados'
            });
        }

        res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
});


app.get('/documentos', async (req, res) => {
    try {
        const [documentos] = await db.query(
            'SELECT * FROM documentos WHERE id_usuario = ?',
            [idUsuario]
        );

        res.json(documentos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar documentos' });
    }
});

app.post('/documentos', async (req, res) => {
    try {
        const { tipo, titulo, arquivo, observacao } = req.body;

        if (!tipo || !titulo || !arquivo) {
            return res.status(400).json({
                message: 'Preencha os campos obrigatórios'
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO documentos (id_usuario, tipo, titulo, arquivo, observacao) VALUES (?, ?, ?, ?, ?)',
            [idUsuario, tipo, titulo, arquivo, observacao || '']
        );

        res.status(201).json({
            id_documento: resultado.insertId,
            message: 'Documento cadastrado com sucesso'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar documento' });
    }
});

app.put('/documentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, titulo, arquivo, observacao } = req.body;

        const [resultado] = await db.query(
            'UPDATE documentos SET tipo = ?, titulo = ?, arquivo = ?, observacao = ? WHERE id_documento = ? AND id_usuario = ?',
            [tipo, titulo, arquivo, observacao || '', id, idUsuario]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                message: 'Documento não encontrado'
            });
        }

        res.json({ message: 'Documento atualizado com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar documento' });
    }
});

app.delete('/documentos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM documentos WHERE id_documento = ? AND id_usuario = ?',
            [id, idUsuario]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                message: 'Documento não encontrado'
            });
        }

        res.json({ message: 'Documento excluído com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir documento' });
    }
});


app.get('/consultas', async (req, res) => {
    try {
        const [consultas] = await db.query(
            'SELECT * FROM consulta WHERE id_usuario = ?',
            [idUsuario]
        );

        res.json(consultas);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar consultas' });
    }
});

app.post('/consultas', async (req, res) => {
    try {
        const { dt_hora, especialidade, local_consulta, observacao } = req.body;

        const [resultado] = await db.query(
            'INSERT INTO consulta (id_usuario, dt_hora, especialidade, local_consulta, observacao) VALUES (?, ?, ?, ?, ?)',
            [idUsuario, dt_hora, especialidade, local_consulta, observacao || '']
        );

        res.status(201).json({
            id_consulta: resultado.insertId,
            message: 'Consulta cadastrada com sucesso'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar consulta' });
    }
});

app.put('/consultas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { dt_hora, especialidade, local_consulta, observacao } = req.body;

        const [resultado] = await db.query(
            'UPDATE consulta SET dt_hora = ?, especialidade = ?, local_consulta = ?, observacao = ? WHERE id_consulta = ? AND id_usuario = ?',
            [dt_hora, especialidade, local_consulta, observacao || '', id, idUsuario]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                message: 'Consulta não encontrada'
            });
        }

        res.json({ message: 'Consulta atualizada com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar consulta' });
    }
});

app.delete('/consultas/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM consulta WHERE id_consulta = ? AND id_usuario = ?',
            [id, idUsuario]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                message: 'Consulta não encontrada'
            });
        }

        res.json({ message: 'Consulta excluída com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir consulta' });
    }
});


app.listen (port, () => {
    console.log(`Server rodando em http://localhost:${port}`);
})