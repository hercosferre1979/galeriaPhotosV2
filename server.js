const express = require('express');
const multer = require('multer');
const path = require('path'); // Módulo nativo do Node.js para lidar com caminhos de arquivos

const app = express();
const PORT = process.env.PORT || 8080;

// --- Configuração do Multer para o Upload ---
// Configura o armazenamento das imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define a pasta onde as imagens serão salvas
        cb(null, 'uploads/'); // Garanta que esta pasta exista!
    },
    filename: function (req, file, cb) {
        // Gera um nome único para o arquivo usando a data e o nome original
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Inicializa o Multer com a configuração de armazenamento
const upload = multer({ storage: storage });

// --- Middlewares ---
// Serve arquivos estáticos da pasta 'public' (HTML, CSS, JS do frontend)
app.use(express.static('public'));

// Serve as imagens da pasta 'uploads' (para visualização)
app.use('/uploads', express.static('uploads'));

// --- Rotas ---
// Rota para a página inicial (servida pelo express.static)
app.get('/', (req, res) => {
    // Isso é opcional se você usar app.use(express.static('public')) e seu index.html estiver lá
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para lidar com o upload da imagem
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }
    // Retorna o caminho da imagem para o frontend
    res.send({ filePath: '/uploads/' + req.file.filename });
});

// Rota para listar as imagens (para visualização)
app.get('/images', (req, res) => {
    const fs = require('fs'); // Módulo nativo para manipulação de arquivos
    const directoryPath = path.join(__dirname, 'uploads');

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return res.status(500).send('Não foi possível escanear o diretório: ' + err);
        }
        // Filtra para garantir que são apenas arquivos de imagem (pode ser mais robusto)
        const imageFiles = files.filter(file => {
            return /\.(jpg|jpeg|png|gif)$/i.test(file);
        }).map(file => '/uploads/' + file); // Adiciona o prefixo do caminho para a URL

        res.json(imageFiles);
    });
});


// --- Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Crie uma pasta chamada "uploads" na raiz do projeto para salvar as imagens.');
});