const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mysql = require('mysql2');
const bodyParser = require("body-parser");
dotenv.config();
const app = express();

const SECRET_KEY = process.env.SECRET_KEY;
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL!');
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const [userExists] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: userExists.length + 1, name: name, email: email, password: hashedPassword };
        const [result] = await db.promise().query('INSERT INTO users( name, email, password) VALUES ( ?, ?, ?)', [
            name,
            email,
            hashedPassword,
        ]);
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, {
            expiresIn: "3h",
        })
        res.status(201).json({ message: "User registered successfully.", userId: result.insertId, token: token });
    }
    catch (error) {
        console.error("Error in /signup", error.message);
        res.status(500).json({ message: "Server error." });
    }
});

app.delete('/removeHabits/:id', async (req, res) => {
    const token = req.headers.authorization
    const habitId = req.params.id;
    if (!token) {
        return res.status(401).json({ message: "Access denied.No token provided" });
    }
    try {
        const [result] = await db.promise().query('Delete from HabitList  where habit_id=?', [habitId]);
        console.log(result);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Habit deleted successfully" });
        }
        else {
            res.status(400).json({ message: "Habit not found" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting Habit" });
    }
})
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        var user_id = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "user not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, users[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: users[0].id, email: users[0].email }, SECRET_KEY, {
            expiresIn: "1h",
        })
        res.status(200).json({ message: "signIn successFull", token });
    }
    catch (error) {
        console.error("Error in /signin", error.message);
        res.status(500).json({ message: "Server error." });
    }
});

app.post("/verify-token", (req, res) => {
    const { token } = req.body;
    try {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ isValid: false });
            }
            return res.json({ isValid: true });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'server error' });
    }
});

app.post("/addNewHabit", async (req, res) => {
    const token = req.headers.authorization
    const { name, dates } = req.body;
    console.log("requests", [name, dates]);
    if (!token) {
        return res.status(401).json({ message: "Access denied.No token provided" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded);
        const [dbResponse] = await db.promise().query('INSERT INTO HabitList(habit_name, dates, id) VALUES ( ?, ?, ?)', [
            name,
            JSON.stringify(dates),
            decoded.id
        ]);
        if (dbResponse.affectedRows > 0) {
            res.status(200).json({ message: `Habit added succesfully for USER ID:${decoded.id}` });
        }
        else {
            res.status(500).json({ message: `Failed to add Habit for USER ID:${decoded.id}` });
        }
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ message: "Invalid or expired token" });
    }
})

app.post("/updateHabit", async (req, res) => {
    const token = req.headers.authorization
    const { name, Dates } = req.body;
    console.log("Requests", [name, Dates]);
    if (!token) {
        return res.status(401).json({ message: "Access denied.No token provided" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user_id = decoded.id;
        const [dbResponse] = await db.promise().query('UPDATE HabitList SET dates= ?  where id=? AND habit_name=?', [Dates, user_id, name]);
        console.log(dbResponse);
        if (dbResponse) {
            res.status(200).json({ message: `Habit updated succesfully for USER ID:${decoded.id}` });
        }
        else {
            res.status(500).json({ message: `Failed to add Habit for USER ID:${decoded.id}` });
        }
    }
    catch (error) {
        console.error("Error", error);
    }

});

app.get("/getHabits", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Access denied.No token provided" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const [results] = await db.promise().query('select * from HabitList where id=?', [decoded.id]);
        res.json(results);
    }
    catch (err) {
        console.error("Error", err);
    }
})

app.get('/', (req, res) => {
    res.send('Hello from Express.js!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});