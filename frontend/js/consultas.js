
const API_URL = 'http://localhost:3000';

const formulario = document.getElementById('form-consulta');
const campoEspecialidade = document.getElementById('especialidade');
const campoData = document.getElementById('dt_hora');
const campoLocal = document.getElementById('local_consulta');
const campoObservacao = document.getElementById('observacao');
const listaConsultas = document.getElementById('lista-consultas');
const mensagem = document.getElementById('mensagem');
const botaoSalvar = document.getElementById('salvar');
const botaoCancelar = document.getElementById('cancelar');
const tituloFormulario = document.getElementById('titulo-form');

let idEdicao = null;

function mostrarMensagem(texto) {
  mensagem.textContent = texto;
}

function limparFormulario() {
  formulario.reset();
  idEdicao = null;

  tituloFormulario.textContent = 'Nova consulta';
  botaoSalvar.textContent = 'Salvar consulta';
  botaoCancelar.hidden = true;
}

async function listarConsultas() {
  try {
    const resposta = await fetch(`${API_URL}/consultas`);

    if (!resposta.ok) {
      throw new Error('Erro ao listar consultas');
    }

    const consultas = await resposta.json();

    listaConsultas.innerHTML = '';

    if (consultas.length === 0) {
      listaConsultas.textContent = 'Nenhuma consulta cadastrada.';
      return;
    }

    for (const consulta of consultas) {
      const card = document.createElement('div');
      card.classList.add('consulta');

      const titulo = document.createElement('h3');
      titulo.textContent = consulta.especialidade;

      const data = document.createElement('p');
      data.textContent = `Data: ${String(consulta.dt_hora).slice(0, 10).split('-').reverse().join('/')}`;

      const local = document.createElement('p');
      local.textContent = `Local: ${consulta.local_consulta}`;

      const observacao = document.createElement('p');
      observacao.textContent = `Observações: ${consulta.observacao || 'Nenhuma'}`;

      const acoes = document.createElement('div');
      acoes.classList.add('acoes');

      const botaoEditar = document.createElement('button');
      botaoEditar.textContent = 'Editar';
      botaoEditar.classList.add('secundario');
      botaoEditar.addEventListener('click', () => editarConsulta(consulta));

      const botaoExcluir = document.createElement('button');
      botaoExcluir.textContent = 'Excluir';
      botaoExcluir.classList.add('excluir');
      botaoExcluir.addEventListener('click', () => excluirConsulta(consulta.id_consulta));

      acoes.appendChild(botaoEditar);
      acoes.appendChild(botaoExcluir);

      card.appendChild(titulo);
      card.appendChild(data);
      card.appendChild(local);
      card.appendChild(observacao);
      card.appendChild(acoes);

      listaConsultas.appendChild(card);
    }

  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao carregar consultas.');
  }
}

function editarConsulta(consulta) {
  idEdicao = consulta.id_consulta;

  campoEspecialidade.value = consulta.especialidade;
  campoData.value = String(consulta.dt_hora).slice(0, 10);
  campoLocal.value = consulta.local_consulta;
  campoObservacao.value = consulta.observacao || '';

  tituloFormulario.textContent = 'Editar consulta';
  botaoSalvar.textContent = 'Atualizar consulta';
  botaoCancelar.hidden = false;
}

async function salvarConsulta(evento) {
  evento.preventDefault();

  const dados = {
    especialidade: campoEspecialidade.value.trim(),
    dt_hora: campoData.value,
    local_consulta: campoLocal.value.trim(),
    observacao: campoObservacao.value.trim()
  };

  let url = `${API_URL}/consultas`;
  let metodo = 'POST';

  if (idEdicao !== null) {
    url = `${API_URL}/consultas/${idEdicao}`;
    metodo = 'PUT';
  }

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      throw new Error('Erro ao salvar consulta');
    }

    limparFormulario();
    await listarConsultas();
    mostrarMensagem('Consulta salva com sucesso!');

  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao salvar consulta.');
  }
}

async function excluirConsulta(id) {
  const confirmou = confirm('Deseja excluir esta consulta?');

  if (!confirmou) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/consultas/${id}`, {
      method: 'DELETE'
    });

    if (!resposta.ok) {
      throw new Error('Erro ao excluir consulta');
    }

    limparFormulario();
    await listarConsultas();
    mostrarMensagem('Consulta excluída com sucesso!');

  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao excluir consulta.');
  }
}

formulario.addEventListener('submit', salvarConsulta);

botaoCancelar.addEventListener('click', limparFormulario);

listarConsultas();