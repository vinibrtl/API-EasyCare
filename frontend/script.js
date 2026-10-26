
const API_URL = 'http://localhost:3000';

const formulario = document.getElementById('user-form');
const campoNome = document.getElementById('nome');
const campoSenha = document.getElementById('senha');
const campoEmail = document.getElementById('email');
const mensagem = document.getElementById('mensagem');
const botaoCadastrar = document.getElementById('btnCadastrar')

function mostrarMensagem(texto, tipo = 'info') {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

async function criarUsuario(evento) {
  evento.preventDefault();

  const dados = {
    nome: campoNome.value.trim(),
    email: campoEmail.value.trim(),
    senha: campoSenha.value,
  };

  console.log("chegou aqui");
  try {
    const resposta = await fetch(`${API_URL}/usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });
    
    
    const resultado = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(resultado.message || 'Erro ao criar usuário.');
    }

    mostrarMensagem('Usuário criado com sucesso!', 'sucesso');
    formulario.reset();

  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message, 'erro');
  }
}

formulario.addEventListener('submit', criarUsuario)