// =====================================================
// ELEMENTS
// =====================================================

const addEmployeeButton = document.getElementById("add-employee-btn")
const addEmployeeModal = document.getElementById("add-employee-modal")
const addEmployeeForm = document.getElementById("add-employee-form")
const cancelAddEmployee = document.getElementById("cancel-add-employee")
const employeeTableBody = document.getElementById("employee-table-body")
const employeeError = document.getElementById("employee-error")

// =====================================================
// FILTER ELEMENTS
// =====================================================

const employeeSearch = document.getElementById("employee-search")
const departmentFilter = document.getElementById("filter-department")
const managerFilter = document.getElementById("filter-manager")

// =====================================================
// ADD EMPLOYEE MODAL
// =====================================================

addEmployeeButton.addEventListener("click", () => {
  addEmployeeModal.classList.remove("hidden")
})

// =====================================================
// CANCEL ADD EMPLOYEE
// =====================================================

cancelAddEmployee.addEventListener("click", () => {
  addEmployeeModal.classList.add("hidden")
  addEmployeeForm.reset()
  employeeError.textContent = ""
})

// =====================================================
// ADD EMPLOYEE
// =====================================================

addEmployeeForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  employeeError.textContent = ""

  try {
    const formData = new FormData(addEmployeeForm)

    const response = await fetch(addEmployeeForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })

    const data = await response.json()

    console.log("ADD STATUS:", response.status)
    console.log("ADD DATA:", data)

    // Validation / error
    if (!response.ok) {
      if (data.errors) {
        employeeError.textContent = Object.values(data.errors)[0][0]
      } else {
        employeeError.textContent = data.message || "Something went wrong."
      }
      return
    }

    // Remove "no employees"
    const noEmployees = document.getElementById("no-employees")
    if (noEmployees) {
      noEmployees.remove()
    }

    // Add row
    addEmployeeToTable(data.employee)

    // Close modal
    addEmployeeModal.classList.add("hidden")
    addEmployeeForm.reset()

    // Re-apply filters
    filterEmployees()
  } catch (error) {
    console.error("ADD EMPLOYEE ERROR:", error)
  }
})

// =====================================================
// EDIT / DELETE BUTTONS (EVENT DELEGATION)
// =====================================================

employeeTableBody.addEventListener("click", async (event) => {
  // Edit
  if (event.target.classList.contains("edit-employee-btn")) {
    const id = event.target.getAttribute("data-id")

    try {
      const response = await fetch(`/admin/employees/${id}`, {
        headers: { Accept: "application/json" },
      })

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      populateEditForm(data.employee)

      const editModal = document.getElementById("edit-employee-modal")
      editModal.classList.remove("hidden")
    } catch (error) {
      console.error("GET EMPLOYEE ERROR:", error)
    }

    return
  }

  // Delete
  if (event.target.classList.contains("delete-employee-btn")) {
    const id = event.target.getAttribute("data-id")

    const deleteModal = document.getElementById("delete-employee-modal")
    const deleteForm = document.getElementById("delete-employee-form")
    const deleteName = document.getElementById("delete-employee-name")

    deleteForm.action = `/admin/employees/${id}`
    deleteForm.dataset.id = id

    deleteName.textContent = `${event.target.dataset.firstName || ""} ${event.target.dataset.lastName || ""}`.trim()

    deleteModal.classList.remove("hidden")

    return
  }
})

// =====================================================
// EDIT EMPLOYEE
// =====================================================

const editEmployeeModal = document.getElementById("edit-employee-modal")
const editEmployeeForm = document.getElementById("edit-employee-form")

editEmployeeForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  try {
    const formData = new FormData(editEmployeeForm)

    const response = await fetch(editEmployeeForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })

    const data = await response.json()

    console.log("EDIT STATUS:", response.status)
    console.log("EDIT DATA:", data)

    if (!response.ok) {
      console.error(data)
      return
    }

    // Update table row
    updateEmployeeRow(data.employee)

    // Close modal
    editEmployeeModal.classList.add("hidden")

    // Re-apply filters
    filterEmployees()
  } catch (error) {
    console.error("EDIT EMPLOYEE ERROR:", error)
  }
})

// =====================================================
// CANCEL EDIT
// =====================================================

document.getElementById("cancel-edit-employee").addEventListener("click", () => {
  editEmployeeModal.classList.add("hidden")
})

// =====================================================
// VIEW EMPLOYEE MODAL
// =====================================================

const viewEmployeeModal = document.getElementById("view-employee-modal")
const closeViewEmployee = document.getElementById("close-view-employee")

const viewEmployeeName = document.getElementById("view-employee-name")
const viewEmployeeAccount = document.getElementById("view-employee-account")
const viewEmployeeEmail = document.getElementById("view-employee-email")
const viewEmployeeRole = document.getElementById("view-employee-role")
const viewEmployeePosition = document.getElementById("view-employee-position")
const viewEmployeeDepartment = document.getElementById("view-employee-department")
const viewEmployeeManager = document.getElementById("view-employee-manager")
const viewEmployeeHireDate = document.getElementById("view-employee-hire-date")
const viewEmployeeStatus = document.getElementById("view-employee-status")

document.querySelectorAll(".view-employee-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const firstName = button.dataset.firstName
    const lastName = button.dataset.lastName
    const employeeId = button.dataset.id
    const email = button.dataset.email
    const role = button.dataset.role
    const status = button.dataset.status
    const position = button.dataset.position
    const department = button.dataset.department
    const manager = button.dataset.manager
    const hireDate = button.dataset.hireDate

    // Name
    viewEmployeeName.textContent = `${firstName} ${lastName}`

    // Account ID
    viewEmployeeAccount.textContent = `Employee record EMP-${String(employeeId).padStart(4, "0")}`

    // Email
    viewEmployeeEmail.textContent = email

    // Role (clean, capitalized)
    viewEmployeeRole.textContent = role.charAt(0).toUpperCase() + role.slice(1)

    // Position / Department / Manager / Hire Date
    viewEmployeePosition.textContent = position || "—"
    viewEmployeeDepartment.textContent = department || "—"
    viewEmployeeManager.textContent = manager || "None"
    viewEmployeeHireDate.textContent = hireDate || "N/A"

    // Status (clean, capitalized)
    viewEmployeeStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1)

    // Show modal
    viewEmployeeModal.classList.remove("hidden")
  })
})

// Close view modal
closeViewEmployee.addEventListener("click", () => {
  viewEmployeeModal.classList.add("hidden")
})

// =====================================================
// DELETE EMPLOYEE
// =====================================================

const deleteEmployeeModal = document.getElementById("delete-employee-modal")
const deleteEmployeeForm = document.getElementById("delete-employee-form")

deleteEmployeeForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  try {
    const id = deleteEmployeeForm.dataset.id
    const formData = new FormData(deleteEmployeeForm)

    const response = await fetch(deleteEmployeeForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })

    const data = await response.json()

    console.log("DELETE STATUS:", response.status)
    console.log("DELETE DATA:", data)

    if (!response.ok) {
      console.error(data)
      return
    }

    // Remove row
    const row = document.getElementById(`employee-row-${id}`)
    if (row) {
      row.remove()
    }

    // Close modal
    deleteEmployeeModal.classList.add("hidden")

    // Check if table is empty
    const remainingRows = employeeTableBody.querySelectorAll(
      "tr:not(#no-filter-results):not(#no-employees)",
    )

    if (remainingRows.length === 0) {
      employeeTableBody.innerHTML = `
        <tr id="no-employees">
          <td colspan="9" class="px-6 py-12 text-center text-sm text-gray-500">
            No employees yet.
          </td>
        </tr>
      `
    }
  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error)
  }
})

// =====================================================
// CANCEL DELETE
// =====================================================

document.getElementById("cancel-delete-employee").addEventListener("click", () => {
  deleteEmployeeModal.classList.add("hidden")
})

// =====================================================
// POPULATE EDIT FORM
// =====================================================

function populateEditForm(employee) {
  const form = document.getElementById("edit-employee-form")

  form.action = `/admin/employees/${employee.id}`
  form.elements["first_name"].value = employee.user.first_name
  form.elements["last_name"].value = employee.user.last_name
  form.elements["email"].value = employee.user.email
  form.elements["password"].value = ""
  form.elements["role"].value = employee.user.role
  form.elements["department_id"].value = employee.department_id
  form.elements["manager_id"].value = employee.manager_id ?? ""
  form.elements["position"].value = employee.position
  form.elements["hire_date"].value = employee.hire_date
    ? employee.hire_date.substring(0, 10)
    : ""
}

// =====================================================
// ADD EMPLOYEE TO TABLE
// =====================================================

function addEmployeeToTable(employee) {
  const user = employee.user
  const department = employee.department
  const manager = employee.manager

  const managerName = manager
    ? `${manager.user.first_name} ${manager.user.last_name}`
    : "None"

  const hireDate = employee.hire_date
    ? new Date(employee.hire_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A"

  employeeTableBody.insertAdjacentHTML(
    "beforeend",
    `
    <tr
      id="employee-row-${employee.id}"
      class="transition hover:bg-gray-50"
      data-department="${department.name}"
      data-manager="${managerName === "None" ? "" : managerName}"
    >
      <td class="whitespace-nowrap px-3 py-4 text-center font-mono text-xs text-gray-500">EMP-${String(employee.id).padStart(2, "0")}</td>
      <td class="px-3 py-4 text-center text-sm font-semibold text-gray-900">${user.first_name} ${user.last_name}</td>
      <td class="px-3 py-4 text-center text-sm text-gray-500 break-all">${user.email}</td>
      <td class="max-w-[160px] px-3 py-4 text-center text-sm text-gray-700">${employee.position}</td>
      <td class="px-3 py-4 text-center text-sm text-gray-700">${department.name}</td>
      <td class="px-3 py-4 text-center text-sm text-gray-700">${
        manager ? managerName : `<span class="text-gray-400">None</span>`
      }</td>

      <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-700">${hireDate}</td>

      <td class="whitespace-nowrap px-3 py-4 text-center">
        ${
          user.status === "active"
            ? `<span class="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">Active</span>`
            : `<span class="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">Inactive</span>`
        }
      </td>

      <td class="whitespace-nowrap px-3 py-4 text-center">
        <div class="flex items-center justify-center gap-2">
          <button
            type="button"
            class="edit-employee-btn rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300/60"
            data-id="${employee.id}"
          >Edit</button>

          <button
            type="button"
            class="delete-employee-btn rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
            data-id="${employee.id}"
            data-first-name="${user.first_name}"
            data-last-name="${user.last_name}"
          >Delete</button>
        </div>
      </td>
    </tr>
  `,
  )
}

// =====================================================
// UPDATE EMPLOYEE ROW
// =====================================================

function updateEmployeeRow(employee) {
  const row = document.getElementById(`employee-row-${employee.id}`)
  const user = employee.user
  const department = employee.department
  const manager = employee.manager

  const managerName = manager
    ? `${manager.user.first_name} ${manager.user.last_name}`
    : "None"

  const hireDate = employee.hire_date
    ? new Date(employee.hire_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A"

  // Update filter data
  row.dataset.department = department.name
  row.dataset.manager = manager
    ? `${manager.user.first_name} ${manager.user.last_name}`
    : ""

  // Update row HTML
  row.innerHTML = `
    <td class="whitespace-nowrap px-3 py-4 text-center font-mono text-xs text-gray-500">EMP-${String(employee.id).padStart(2, "0")}</td>
    <td class="px-3 py-4 text-center text-sm font-semibold text-gray-900">${user.first_name} ${user.last_name}</td>
    <td class="px-3 py-4 text-center text-sm text-gray-500 break-all">${user.email}</td>
    <td class="max-w-[160px] px-3 py-4 text-center text-sm text-gray-700">${employee.position}</td>
    <td class="px-3 py-4 text-center text-sm text-gray-700">${department.name}</td>
    <td class="px-3 py-4 text-center text-sm text-gray-700">${
      manager ? managerName : `<span class="text-gray-400">None</span>`
    }</td>

    <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-700">${hireDate}</td>

    <td class="whitespace-nowrap px-3 py-4 text-center">
      ${
        user.status === "active"
          ? `<span class="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">Active</span>`
          : `<span class="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">Inactive</span>`
      }
    </td>

    <td class="whitespace-nowrap px-3 py-4 text-center">
      <div class="flex items-center justify-center gap-2">
        <button
          type="button"
          class="edit-employee-btn rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300/60"
          data-id="${employee.id}"
        >Edit</button>

        <button
          type="button"
          class="delete-employee-btn rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          data-id="${employee.id}"
          data-first-name="${user.first_name}"
          data-last-name="${user.last_name}"
        >Delete</button>
      </div>
    </td>
  `
}

// =====================================================
// EMPLOYEE FILTERING
// =====================================================

function filterEmployees() {
  const searchValue = employeeSearch.value.toLowerCase().trim()
  const departmentValue = departmentFilter.value.toLowerCase().trim()
  const managerValue = managerFilter.value.toLowerCase().trim()

  const rows = employeeTableBody.querySelectorAll(
    "tr:not(#no-employees):not(#no-filter-results)",
  )

  let visibleRows = 0

  rows.forEach((row) => {
    // Search
    const rowText = row.textContent.toLowerCase()
    const matchesSearch = rowText.includes(searchValue)

    // Department
    const rowDepartment = (row.dataset.department || "").toLowerCase().trim()
    const matchesDepartment =
      departmentValue === "" || rowDepartment === departmentValue

    // Manager
    const rowManager = (row.dataset.manager || "").toLowerCase().trim()
    const matchesManager = managerValue === "" || rowManager === managerValue

    // Final result
    const shouldShow = matchesSearch && matchesDepartment && matchesManager

    if (shouldShow) {
      row.classList.remove("hidden")
      visibleRows++
    } else {
      row.classList.add("hidden")
    }
  })

  // No results message
  let noResults = document.getElementById("no-filter-results")

  if (visibleRows === 0 && rows.length > 0) {
    if (!noResults) {
      noResults = document.createElement("tr")
      noResults.id = "no-filter-results"
      noResults.innerHTML = `
        <td colspan="9" class="px-6 py-12 text-center text-sm text-gray-500">
          No employees match your filters.
        </td>
      `
      employeeTableBody.appendChild(noResults)
    }
  } else {
    if (noResults) {
      noResults.remove()
    }
  }
}

// =====================================================
// FILTER EVENT LISTENERS
// =====================================================

employeeSearch.addEventListener("input", filterEmployees)
departmentFilter.addEventListener("change", filterEmployees)
managerFilter.addEventListener("change", filterEmployees)
