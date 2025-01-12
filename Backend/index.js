const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

// cek status
app.get('/', (req, res) => {
    res.send(`Server berjalan di atas Express.js dengan PORT ${PORT}`);
});

// mengambil data
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pengguna.' });
    }
});

app.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id); // Parse the user id from the URL parameters

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId, // Specify the user id to search for
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user); // Return the found user
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// post api
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { name, email },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat pengguna.' });
        console.error(error);
    }
});

app.delete('/users/:id', async(req, res) => {
    try {
        const userId = parseInt(req.params.id);
        await prisma.user.delete({
            where: {
                id : userId
            },
        });
        res.send('data berhasil dihapus')
    } catch (error) {
        console.log(error)
    }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server sedang jalan di PORT ${PORT}`);
});

