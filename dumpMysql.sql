-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS catalogo_pokemons;
USE catalogo_pokemons;

-- Criação da tabela 'usuarios'
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL 
);

-- Criação da tabela 'pokemons'
CREATE TABLE IF NOT EXISTS pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    habilidades TEXT NOT NULL,
    imagem TEXT,
    apelido TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);




