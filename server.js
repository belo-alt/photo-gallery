const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'photoGalleryDB';
const client = new MongoClient(mongoUrl);

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('photo'), async (req, res) => {
    const description = req.body.description;
    const photoPath = `/uploads/${req.file.filename}`;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('photos');

        await collection.insertOne({ description, url: photoPath });

        res.status(200).send('Upload bem-sucedido');
    } catch (error) {
        res.status(500).send('Erro no servidor');
    }
});

app.get('/photos', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('photos');

        const photos = await collection.find({}).toArray();
        res.json(photos);
    } catch (error) {
        res.status(500).send('Erro no servidor');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
