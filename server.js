const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Certifique-se de que 'fs' está importado

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuração do Multer (Deixe-o aqui) ---
// ...

// --- Middlewares ---
// 1. Serve arquivos estáticos da pasta 'public' (HTML, CSS, JS do frontend)
app.use(express.static('public'));

// 2. Serve as imagens da pasta 'uploads' (para visualização das imagens individuais)
app.use('/uploads', express.static('uploads'));

// --- Rotas ---
// Rota para a página inicial (se você tiver uma, embora 'express.static' já sirva 'index.html')
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Rota para lidar com o upload da imagem (POST)
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }
    res.send({ filePath: '/uploads/' + req.file.filename });
});

// Rota para listar as imagens (GET /images)
// ESTA É A ROTA QUE VOCÊ ESTÁ TENDO PROBLEMAS, VERIFIQUE SE ELA ESTÁ EXATAMENTE ASSIM
app.get('/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            // É bom logar o erro no console do servidor também
            console.error('Erro ao escanear o diretório de uploads:', err);
            return res.status(500).send('Não foi possível escanear o diretório: ' + err);
        }
        const imageFiles = files.filter(file => {
            return /\.(jpg|jpeg|png|gif)$/i.test(file);
        }).map(file => '/uploads/' + file);

        res.json(imageFiles);
    });
});

// --- Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Crie uma pasta chamada "uploads" na raiz do projeto para salvar as imagens.');
});