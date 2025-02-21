const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senha',
  database: 'database',
  port: 3306
});

db.connect((err) => {
  if (err) console.log(`Não foi possivel conctar com o banco de dados: ${err}`);
  console.log('Conectado ao banco de dados da TechStore!');
});

app.use(express.static(path.join(__dirname, 'front')));
app.use('/img', express.static(path.join(__dirname,'img')));
app.use('/global', express.static(path.join(__dirname, 'global')));

app.post('/cadastrar', (req, res) => {
  const { nome, telefone, email, senha } = req.body;

  const sql = 'INSERT INTO usuario (nomeUsu, telefoneUsu, emailUsu, senhaUsu) VALUES (?, ?, ?, ?)';
  db.query(sql, [nome, telefone, email, senha], (err, result) => {
    if (err) {
      console.err;
      res.status(409).send(`Falha ao cadastrar: ${err}`);
    }
    res.send('Usuário cadastrado com sucesso!');
  });
});

app.post('/login', (req, res) => {
  
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM usuario WHERE emailUsu = ? AND senhaUsu = ?';
  db.query(sql, [email, senha], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send('Login bem-sucedido!');
    } else {
      res.status(401).send('Credenciais inválidas!');
    }
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
