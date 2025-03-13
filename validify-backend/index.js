const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // Replace with your actual MySQL root password
  database: 'validify_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// POST endpoint to insert employee data
app.post('/api/employees', (req, res) => {
  const { name, employeeId, email, phoneNumber, department, dateOfJoining, role } = req.body;
  console.log('Received data:', req.body);

  // Format dateOfJoining to YYYY-MM-DD
  const formattedDate = new Date(dateOfJoining).toISOString().split('T')[0];

  const query = 'INSERT INTO employees (name, employee_id, email, phone_number, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, employeeId, email, phoneNumber, department, formattedDate, role], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to add employee', details: err.message });
    }
    console.log('Data inserted:', result);
    res.status(200).json({ message: 'Employee added successfully', id: result.insertId });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));