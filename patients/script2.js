const patientForm = document.getElementById("patientForm");
const recordsTable = document.getElementById("recordsTable").querySelector("tbody");
const searchInput = document.getElementById("searchInput");

let patients = JSON.parse(localStorage.getItem("patients")) || [];
let editingId = null; // track currently editing patient

// Load patients on page load
window.addEventListener("DOMContentLoaded", () => {
  loadPatients();
});

// Handle form submission
patientForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value;
  const condition = document.getElementById("condition").value.trim();

  if (!name || !age || !gender || !condition) {
    alert("Please fill in all fields.");
    return;
  }

  if (editingId) {
    // Update existing record
    patients = patients.map(p => 
      p.id === editingId ? { id: editingId, name, age, gender, condition } : p
    );
    editingId = null;
  } else {
    // Add new record
    const newPatient = {
      id: Date.now(),
      name,
      age,
      gender,
      condition
    };
    patients.push(newPatient);
  }

  localStorage.setItem("patients", JSON.stringify(patients));
  patientForm.reset();
  loadPatients();
});

// Add all patients to table
function loadPatients(filter = "") {
  recordsTable.innerHTML = "";

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(addPatientToTable);
}

// Create and insert a row in the table
function addPatientToTable(patient) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${patient.name}</td>
    <td>${patient.age}</td>
    <td>${patient.gender}</td>
    <td>${patient.condition}</td>
    <td>
      <button onclick="editPatient(${patient.id})">Edit</button>
      <button onclick="deletePatient(${patient.id})">Delete</button>
    </td>
  `;

  recordsTable.appendChild(row);
}

// Delete by ID
function deletePatient(id) {
  if (!confirm("Are you sure you want to delete this patient?")) return;
  patients = patients.filter(p => p.id !== id);
  localStorage.setItem("patients", JSON.stringify(patients));
  loadPatients(searchInput.value);
}

// Edit a patient
function editPatient(id) {
  const patient = patients.find(p => p.id === id);
  if (!patient) return;

  document.getElementById("name").value = patient.name;
  document.getElementById("age").value = patient.age;
  document.getElementById("gender").value = patient.gender;
  document.getElementById("condition").value = patient.condition;

  editingId = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter on keyup
searchInput.addEventListener("input", () => {
  loadPatients(searchInput.value);
});

// Export (print)
function exportPatients() {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Exported Patient Records</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2>Patient Records</h2>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            ${patients.map(p => `
              <tr>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.condition}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
