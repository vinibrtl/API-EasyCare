CREATE DATABASE IF NOT EXISTS PI;

USE PI;

CREATE TABLE IF NOT EXISTS usuario(
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(25) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(250) NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS documentos(
	id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    data_documentos TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    arquivo VARCHAR(100) NOT NULL,
    observacao VARCHAR(200) NOT NULL,
	FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS campanha_saude (
    id_campanha INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    data_inicio DATE,
    data_fim DATE
);

CREATE TABLE IF NOT EXISTS vinculo_familiar (
	id_vinculo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_familiar INT NOT NULL,
    parentesco VARCHAR(100) NOT NULL,
    permissoes VARCHAR(500) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_familiar) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS lembretes (
    id_lembretes INT AUTO_INCREMENT PRIMARY KEY,
	id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    data_hora DATE,
    tipo VARCHAR (100) NOT NULL,
	FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
); 

CREATE TABLE IF NOT EXISTS consulta (
	id_consulta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    dt_hora DATE,
    especialidade VARCHAR(100) NOT NULL,
    local_consulta VARCHAR(100) NOT NULL,
    observacao VARCHAR(200) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS receita (
	id_receita INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
	dt_emissao VARCHAR(8) NOT NULL,
    medico VARCHAR(100) NOT NULL,
    arquivo VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)	
);

CREATE TABLE IF NOT EXISTS exame (
    id_exame INT AUTO_INCREMENT PRIMARY KEY,
	id_usuario INT NOT NULL,
    nome VARCHAR(60) NOT NULL,
    data_exame DATE,
    arquivo VARCHAR (200) NOT NULL,
	resultado VARCHAR (200) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);