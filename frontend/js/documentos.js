const API_URL = 'http://localhost:3000';

const formulario = document.getElementById('form-documento');
const campoTitulo = document.getElementById('titulo');
const campoTipo = document.getElementById('tipo');
const campoArquivo = document.getElementById('arquivo');
const campoObservacao = document.getElementById('observacao');
const listaDocumentos = document.getElementById('lista-documentos');
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
  tituloFormulario.textContent = 'Novo documento';
  botaoSalvar.textContent = 'Salvar documento';
  botaoCancelar.hidden = true;
}

async function listarDocumentos() {
  try {
    const resposta = await fetch(`${API_URL}/documentos`);
    if (!resposta.ok) throw new Error('Erro ao listar documentos');
    const documentos = await resposta.json();
    listaDocumentos.innerHTML = '';

    if (documentos.length === 0) {
      listaDocumentos.textContent = 'Nenhum documento cadastrado.';
      return;
    }

    for (const documento of documentos) {
      const card = document.createElement('article');
      card.classList.add('documento');

      const titulo = document.createElement('h3');
      titulo.textContent = documento.titulo;
      const tipo = document.createElement('p');
      tipo.textContent = `Tipo: ${documento.tipo}`;
      const observacao = document.createElement('p');
      observacao.textContent = `Observações: ${documento.observacao || 'Nenhuma'}`;
      const link = document.createElement('a');
      link.textContent = 'Abrir documento';
      link.href = documento.arquivo;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const acoes = document.createElement('div');
      acoes.classList.add('acoes');
      const botaoEditar = document.createElement('button');
      botaoEditar.textContent = 'Editar';
      botaoEditar.classList.add('secundario');
      botaoEditar.addEventListener('click', () => editarDocumento(documento));
      const botaoExcluir = document.createElement('button');
      botaoExcluir.textContent = 'Excluir';
      botaoExcluir.classList.add('excluir');
      botaoExcluir.addEventListener('click', () => excluirDocumento(documento.id_documento));

      acoes.appendChild(botaoEditar);
      acoes.appendChild(botaoExcluir);
      card.appendChild(titulo);
      card.appendChild(tipo);
      card.appendChild(observacao);
      card.appendChild(link);
      card.appendChild(acoes);
      listaDocumentos.appendChild(card);
    }
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao carregar documentos.');
  }
}

function editarDocumento(documento) {
  idEdicao = documento.id_documento;
  campoTitulo.value = documento.titulo;
  campoTipo.value = documento.tipo;
  campoArquivo.value = documento.arquivo;
  campoObservacao.value = documento.observacao || '';
  tituloFormulario.textContent = 'Editar documento';
  botaoSalvar.textContent = 'Atualizar documento';
  botaoCancelar.hidden = false;
}

async function salvarDocumento(evento) {
  evento.preventDefault();
  const dados = {
    titulo: campoTitulo.value.trim(),
    tipo: campoTipo.value,
    arquivo: campoArquivo.value.trim(),
    observacao: campoObservacao.value.trim()
  };

  let url = `${API_URL}/documentos`;
  let metodo = 'POST';
  if (idEdicao !== null) {
    url = `${API_URL}/documentos/${idEdicao}`;
    metodo = 'PUT';
  }

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) throw new Error('Erro ao salvar documento');
    limparFormulario();
    await listarDocumentos();
    mostrarMensagem('Documento salvo com sucesso!');
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao salvar documento.');
  }
}

async function excluirDocumento(id) {
  if (!confirm('Deseja excluir este documento?')) return;
  try {
    const resposta = await fetch(`${API_URL}/documentos/${id}`, {method: 'DELETE'});
    if (!resposta.ok) throw new Error('Erro ao excluir documento');
    limparFormulario();
    await listarDocumentos();
    mostrarMensagem('Documento excluído com sucesso!');
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao excluir documento.');
  }
}

formulario.addEventListener('submit', salvarDocumento);
botaoCancelar.addEventListener('click', limparFormulario);
listarDocumentos();
