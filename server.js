const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// DB CONNECTION
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.log("DB ERROR:", err);
  } else {
    console.log("DB Connected Successfully");
  }
});

// =======================
// GET ALL PATIENTS
// =======================
app.get('/patients', (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});


// =======================
// ADD PATIENT
// =======================
app.post('/add-patient', (req, res) => {

  const { patient_name, age, disease, doctor_name, admit_date } = req.body;

  const sql = `
    INSERT INTO patients (patient_name, age, disease, doctor_name, admit_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [patient_name, age, disease, doctor_name, admit_date],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Patient added successfully",
        id: result.insertId
      });
    }
  );
});


// =======================
// UPDATE PATIENT
// =======================
app.put('/patients/:id', (req, res) => {

  const id = Number(req.params.id);

  console.log("UPDATE ID:", id);
  console.log("DATA:", req.body);

  const sql = `
    UPDATE patients 
    SET patient_name=?, age=?, disease=?, doctor_name=?, admit_date=?
    WHERE id=?
  `;

  db.query(sql,
    [
      req.body.patient_name,
      req.body.age,
      req.body.disease,
      req.body.doctor_name,
      req.body.admit_date,
      id
    ],
    (err, result) => {

      if (err) {
        console.log("UPDATE ERROR:", err);
        return res.status(500).json(err);
      }

      console.log("UPDATED ROWS:", result.affectedRows);

      res.json({
        message: "Updated successfully",
        affectedRows: result.affectedRows
      });
    }
  );
});
// =======================
// DELETE PATIENT
// =======================
app.delete('/patients/:id', (req, res) => {

  const id = Number(req.params.id);

  console.log("DELETE ID:", id);

  db.query(
    "DELETE FROM patients WHERE id=?",
    [id],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      console.log("DELETED ROWS:", result.affectedRows);

      res.json({
        message: "Deleted successfully",
        affectedRows: result.affectedRows
      });
    }
  );
});


// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});