const API_URL = 'http://localhost:3000';

const totalConsultas = document.getElementById('total-consultas');
const totalDocumentos = document.getElementById('total-documentos');
const resumoConsultas = document.getElementById('resumo-consultas');
const resumoDocumentos = document.getElementById('resumo-documentos');
const mensagem = document.getElementById('mensagem');

async function carregarConsultas() {
    try {
        const resposta = await fetch(`${API_URL}/consultas`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar consultas');
        }

        const consultas = await resposta.json();
        totalConsultas.textContent = consultas.length;
        resumoConsultas.innerHTML = '';

        if (consultas.length === 0) {
            resumoConsultas.textContent = 'Nenhuma consulta cadastrada.';
            return;
        }

        for (let i = 0; i < consultas.length && i < 3; i++) {
            const consulta = consultas[i];
            const registro = document.createElement('div');
            registro.classList.add('registro');

            const titulo = document.createElement('h3');
            titulo.textContent = consulta.especialidade;

            const detalhes = document.createElement('p');
            const data = String(consulta.dt_hora).slice(0, 10);
            detalhes.textContent = `${data} - ${consulta.local_consulta}`;

            registro.appendChild(titulo);
            registro.appendChild(detalhes);
            resumoConsultas.appendChild(registro);
        }
    } catch (erro) {
        console.error(erro);
        totalConsultas.textContent = '—';
        resumoConsultas.textContent = 'Não foi possível carregar as consultas.';
    }
}

async function carregarDocumentos() {
    try {
        const resposta = await fetch(`${API_URL}/documentos`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar documentos');
        }

        const documentos = await resposta.json();
        totalDocumentos.textContent = documentos.length;
        resumoDocumentos.innerHTML = '';

        if (documentos.length === 0) {
            resumoDocumentos.textContent = 'Nenhum documento cadastrado.';
            return;
        }

        for (let i = 0; i < documentos.length && i < 3; i++) {
            const documento = documentos[i];
            const registro = document.createElement('div');
            registro.classList.add('registro');

            const titulo = document.createElement('h3');
            titulo.textContent = documento.titulo;

            const detalhes = document.createElement('p');
            detalhes.textContent = documento.tipo;

            registro.appendChild(titulo);
            registro.appendChild(detalhes);
            resumoDocumentos.appendChild(registro);
        }
    } catch (erro) {
        console.error(erro);
        totalDocumentos.textContent = '—';
        resumoDocumentos.textContent = 'Não foi possível carregar os documentos.';
    }
}

carregarConsultas();
carregarDocumentos();