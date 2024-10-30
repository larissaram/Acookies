const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const app = express();
const port = 1010;

app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//cookizin
app.use(
    session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }, // 1 minute
}));

//midlle
function autenticar(req, res, next) {
    console.log('Middleware de autenticação - Sessão:', req.session); // Verificar conteúdo da sessão'
    if (req.session.autenticado) {
        next();
    } else {
        res.redirect('/login');
    }
};

const validUsers = [
    { username: 'Giovane', password: 'professor' },
    { username: 'Larissa', password: 'aluna' },
    { username: 'Rhayanna', password: 'aluna2' },
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log("Dados Recebidos:", req.body);

    const user = validUsers.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = { username };
        req.session.autenticado = true;

        console.log("Sessão apos autenticar:", req.session);
        res.redirect('/protegida');

    } else {
        res.send('Usuário ou senha inválidos.');
    }
});

app.get('/login', (req, res) => {
    res.send(`
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Login</h1>
                <form method="POST" action="/login">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required><br>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required><br>
                    <input type="submit" value="Login">
                </form>
            </div>
        </body>
        </html>
    `);
});


app.get('/logout', (req, res) => {
    res.send(`
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/style.css">
        </head>
        <body>
            <form method="POST" action="/logout">
                <button type="submit" class="bn632-hover bn28">Logout</button>
            </form>
        </body>
        </html>
            `);
});

app.post('/logout', (req, res) => {
    req.session.destroy(function(err) {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.get('/protegida', (req, res) => {
    if (req.session.user && req.session.user.username) {
        res.send(`
<html>
            <head>
                <link rel="stylesheet" type="text/css" href="/style.css">
            </head>
            <body>
                <div class="protected-container">
                    <h1>Bem-vindo, ${req.session.user.username}!</h1>
                    <p>Esta é a área protegida do sistema. Aproveite seu acesso!</p>
                    <a href="/logout"><button class="bn632-hover bn28">Logout</button></a>                </div>
            </body>
            </html>            `);
    } else {
        res.send('Usuário não autenticado.');
    }
});

app.listen(port, () => console.log(`rodii ${port}`));

//depois de quase chorar achei the problem 
