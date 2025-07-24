const drugForm = document.getElementById("drugForm");
const drugTableBody = document.querySelector("#drugTable tbody");
const drugSearch = document.getElementById("drugSearch");
const filterStatus = document.getElementById("filterStatus");
const filterType = document.getElementById("filterType");
const submitButton = drugForm.querySelector("button[type='submit']");

let drugs = JSON.parse(localStorage.getItem("drugs")) || [];
let editIndex = null; // Track which drug is being edited

drugForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("drugName").value.trim();
  const quantity = document.getElementById("quantity").value;
  const type = document.getElementById("type").value;
  const status = document.getElementById("status").value;

  if (!name || !quantity || !type || !status) return;

  if (editIndex === null) {
    // Add mode
    drugs.push({ name, quantity, type, status });
  } else {
    // Edit mode
    drugs[editIndex] = { name, quantity, type, status };
    editIndex = null;
    submitButton.textContent = "Add Drug";
  }

  localStorage.setItem("drugs", JSON.stringify(drugs));
  drugForm.reset();
  renderTable();
});

function renderTable() {
  const searchTerm = drugSearch.value.toLowerCase();
  const statusFilter = filterStatus.value;
  const typeFilter = filterType.value;

  const filteredDrugs = drugs.filter((drug) => {
    return (
      drug.name.toLowerCase().includes(searchTerm) &&
      (statusFilter === "" || drug.status === statusFilter) &&
      (typeFilter === "" || drug.type === typeFilter)
    );
  });

  drugTableBody.innerHTML = "";

  if (filteredDrugs.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5">No drugs found</td>`;
    drugTableBody.appendChild(row);
    return;
  }

  filteredDrugs.forEach((drug, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${drug.name}</td>
      <td>${drug.quantity}</td>
      <td>${drug.type}</td>
      <td>${drug.status}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;

    drugTableBody.appendChild(row);
  });

  // Delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      drugs.splice(index, 1);
      localStorage.setItem("drugs", JSON.stringify(drugs));
      renderTable();
    });
  });

  // Edit buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      const drug = drugs[index];

      document.getElementById("drugName").value = drug.name;
      document.getElementById("quantity").value = drug.quantity;
      document.getElementById("type").value = drug.type;
      document.getElementById("status").value = drug.status;

      editIndex = index;
      submitButton.textContent = "Update Drug";
    });
  });
}

// Filter listeners
drugSearch.addEventListener("input", renderTable);
filterStatus.addEventListener("change", renderTable);
filterType.addEventListener("change", renderTable);

// Initial render
renderTable();
