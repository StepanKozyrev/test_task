import express from 'express';
import bodyParser from 'body-parser';
import prBitoc from './bitcoin/price.js';
import pool from './db.js';

const app = express();
const port = 3000;
pool.connect().then(() => console.log("DB connect")).catch((err) => console.log('DB error', err));

let dirname = '/VS_Project/Project'

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/register', (req, res) => {
    res.sendFile(dirname +'/registration.html');
});

app.get('/login', (req, res) => {
    res.sendFile(dirname +'/login.html');
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    function checkExistingUser(username, password) {
        pool.query("SELECT * FROM person WHERE name = $1", [username], (err, result) => {
            if (!err) {
                if (result.rows.length > 0) {
                    console.error('User with this username already exists');
                    res.render('registration', { error: 'Invalid username or password' });
                } else {
                    registration(username,password);
                }
            } else {
                console.error('Error executing query', err);
                res.status(500).send('Registration failed');
            }
        });
    }
    
    function registration(username, password){
        pool.query("INSERT INTO person (name, pass) VALUES ($1, $2)", [username,password],(err, result) => {
            if (!err) {
                console.error('Succes register');
                res.redirect('/login');
            } else {
                console.log(err);
            }
        });
    };
    
    checkExistingUser(username, password);
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    function authenticateUser(username, password) {
        pool.query("SELECT * FROM person WHERE name = $1 AND pass = $2", [username, password], (err, result) => {
            if (!err) {
                if (result.rows.length > 0) {
                    console.log('User logged in successfully');
                    app.get('/login/bit', (req, res) => {
                        pool.query("SELECT bitprice FROM price ORDER BY id DESC LIMIT 1", (error, result) => {
                            if (error) {
                              console.error('Ошибка выполнения запроса:', error);
                              res.status(500).send('Internal Server Error');
                              return;
                            }
                        
                            const bitprice = result.rows[0].bitprice;
                            console.log(bitprice);
                            res.render('bit', { bitprice }); 
                          });
                    });
                    app.get('/login/getLatestBitPrice', (req, res) => {
                        pool.query("SELECT bitprice FROM price ORDER BY id DESC LIMIT 1", (error, result) => {
                            if (error) {
                              console.error('Ошибка выполнения запроса:', error);
                              res.status(500).send('Internal Server Error');
                              return;
                            }
                        
                            const bitprice = result.rows[0].bitprice;
                            res.send(bitprice.toString());
                        });
                    });
                    res.redirect('/login/bit');
                } else {
                    console.error('Invalid username or password');
                    res.render('login', { error: 'Invalid username or password' }); 
                }
            } else {
                console.error('Error executing query', err);
                res.render('login', { error: 'Login failed' }); 
            }
        });
    }

    authenticateUser(username, password);
});

app.listen(port, () => {
    console.log(`Server is running ${port}`);
});