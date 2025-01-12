app.post('/users', async (req, res) => {
    const users = req.body; // Expecting an array of user objects
    try {
        if (!Array.isArray(users)) {
            return res.status(400).json({ error: 'Data harus berupa array.' });
        }

        const multipleUser = await prisma.user.createMany({
            data: users, // Expecting an array of { name, email } objects
            skipDuplicates: true, // Optional: Skip if duplicates exist
        });

        res.status(201).send('Data banyak berhasil dibuat');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat data pengguna.' });
    }
});