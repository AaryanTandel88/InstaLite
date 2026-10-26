
const express = require('express');
const { prisma } = require('./db');
const app = express();

const usersRouter = require('./routes/users.routes');
app.use('/users', usersRouter);

app.use(express.json());

app.get('/health', (req,res) => {
    res.status(200).json({ status: 'OK' });
});


async function testConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed');
        console.error(error);
    }
}

testConnection();




app.listen(3000, () => {
    console.log('Server started on port 3000');
});




