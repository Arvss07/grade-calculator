/**
 * Function to check if inputs are valid
 */
function validListeners(inputField, category) {
  inputField.addEventListener("input", function (event) {
    // get the value of the input field
    const value = event.target.value;
    const isNumber = /^[0-9]*\.?[0-9]*$/.test(value);

    // check if it a grade and a valid one
    if ((category === "subject" || category === "units") && !isNumber) {
      displayError();
      // consume last inputted character
      event.target.value = value.slice(0, -1);
    }

    // Blur event listener for final validation
    inputField.addEventListener("blur", function (event) {
      const value = parseFloat(event.target.value);
      const isValidGrade = !isNaN(value) && value >= 65 && value <= 100;

      if (category === "subject" && !isValidGrade) {
        displayError();
        event.target.value = "";
      }
    });
  });
} // end of validListeners

/** Function to display the error on the instruction <p> */
function displayError() {
  const errorMessage = document.querySelector(".error-message");
  if (!errorMessage) return;
  errorMessage.textContent = "Please enter a valid number";
  errorMessage.style.color = "red";

  // change input border to red
  const inputField = event.target;
  inputField.style.border = "1px solid red";
  inputField.style.animation = "myAnim .5s ease 0s 1 normal forwards";

  // revert if input is valid and error message is displayed
  setTimeout(() => {
    // insert heart emoji to the error message
    errorMessage.textContent = "🙂🙂🙂";
    inputField.style.border = ""; // revert to default border
    inputField.style.animation = ""; // remove animation
  }, 1000);
} // end of displayError

/**
 * Function to attach event listener to the input fields in the form
 */
function addListenerToInputField(formID, gradePrefix, unitsPrefix) {
  const htmlForm = document.getElementById(formID);
  if (!htmlForm) return;

  // attach listener to subject grades
  const grade = htmlForm.querySelectorAll(`input[id^=${gradePrefix}]`);
  grade.forEach((inputField) => validListeners(inputField, "subject"));

  // attach listener to subject grades
  const unit = htmlForm.querySelectorAll(`input[id^=${unitsPrefix}]`);
  unit.forEach((inputField) => validListeners(inputField, "units"));
} // end of addListenerToInputField

/** Function to Add additional subjects */
function addSubject(formId) {
  const htmlForm = document.getElementById(formId);
  if (!htmlForm) return; // exit if form is not found

  // get all the table properties
  const table = htmlForm.querySelector("table tbody");
  const rowCount = table.rows.length; // use to create unique id for each input field
  const newRow = table.insertRow(rowCount);

  // create new cells and its corresponding input fields with unique id
  // column 1: subject
  const subjectCell = newRow.insertCell(0);
  subjectCell.textContent = `Subject ${rowCount + 1}:`;

  // column 2: grade
  const gradeCell = newRow.insertCell(1);
  const gradeInput = document.createElement("input");
  gradeInput.type = "text";
  gradeInput.placeholder = "Grade";
  gradeInput.inputMode = "numeric";
  gradeInput.pattern = "[0-9]*";
  gradeInput.id = `subject${rowCount + 1}`; // unique id
  gradeInput.name = `subject${rowCount + 1}`; // unique name
  gradeCell.appendChild(gradeInput);

  // column 3: units
  const unitsCell = newRow.insertCell(2);
  const unitsInput = document.createElement("input");
  unitsInput.type = "text";
  unitsInput.placeholder = "Units";
  unitsInput.inputMode = "numeric";
  unitsInput.pattern = "[0-9]*";
  unitsInput.id = `units${rowCount + 1}`; // unique id
  unitsInput.name = `units${rowCount + 1}`; // unique name
  unitsCell.appendChild(unitsInput);

  // add listener to the new input fields
  validListeners(gradeInput, "subject");
  validListeners(unitsInput, "units");
} // end of addSubject

/** Function to remove unused rows */
/** Function to remove all rows without a value in grade or unit input fields */
function removeEmptyRows(formID) {
  const htmlForm = document.getElementById(formID);
  if (!htmlForm) return; // exit if form is not found

  const table = htmlForm.querySelector("table tbody");
  const rows = table.rows;

  for (let i = rows.length - 1; i >= 0; i--) {
    const gradeInput = rows[i].querySelector("input[id^=subject]");
    const unitInput = rows[i].querySelector("input[id^=units]");

    if (!gradeInput.value || !unitInput.value) {
      table.deleteRow(i);
    }
  }
} // end of removeEmptyRows

/** Function to calculate GWA */
function calculateGWA(formID) {
  const htmlForm = document.getElementById(formID);
  if (!htmlForm) return; // exit if form is not found

  // remove empty rows
  removeEmptyRows(formID);
  // get grade inputs from the form
  const gradeInputs = htmlForm.querySelectorAll("input[id^=subject]");
  // get unit inputs from the form
  const unitInputs = htmlForm.querySelectorAll("input[id^=units]");

  // intialize totalUnits and weightedTotalGrade
  let totalUnits = 0;
  let weightedTotalGrade = 0;

  // loop through each row
  gradeInputs.forEach((gradeInput, index) => {
    const grade = parseInt(gradeInput.value, 10); // convert to integer
    const unit = parseInt(unitInputs[index].value, 10);

    // check if grade is a number
    if (!isNaN(grade) && !isNaN(unit)) {
      // calculate the weighted grade
      totalUnits += unit;
      weightedTotalGrade += grade * unit;
    }

    if (totalUnits > 0) {
      // calculate gwa
      const gwa = weightedTotalGrade / totalUnits;
      // display the gwa with 4 decimal places
      document.getElementById("gwa-result").textContent = gwa.toFixed(4);
    } else {
      // display error message
      document.getElementById("gwa-result").textContent =
        "Enter your grades and units";
    }
  });
} // end of calculateGWA

/** Reset Form to Default */
function resetForm(formID) {
  const htmlForm = document.getElementById(formID);
  if (!htmlForm) return; // exit if form is not found

  // get grade inputs from the form
  const gradeInputs = htmlForm.querySelectorAll("input[id^=subject]");
  // get unit inputs from the form
  const unitInputs = htmlForm.querySelectorAll("input[id^=units]");

  // loop through each row
  gradeInputs.forEach((gradeInput, index) => {
    gradeInput.value = "";
    unitInputs[index].value = "";
  });

  // retain the first and second row only
  const table = htmlForm.querySelector("table tbody");
  const rows = table.rows;
  for (let i = rows.length - 1; i >= 2; i--) {
    table.deleteRow(i);
  }

  // reset the gwa result
  document.getElementById("gwa-result").textContent = "";
} // end of resetForm

/*
 * Add the listener to the html itself
 */
document.addEventListener("DOMContentLoaded", function () {
  // attach the listeners
  addListenerToInputField("gwa-form", "subject", "units");

  // attach listener to the add button
  document
    .getElementById("add-subject-btn")
    .addEventListener("click", function () {
      addSubject("gwa-form");
    });

  // attach listener to the calculate button
  document
    .getElementById("calculate-btn")
    .addEventListener("click", function () {
      calculateGWA("gwa-form");
    });

  // attach listener to the reset button
  document.getElementById("reset-btn").addEventListener("click", function () {
    resetForm("gwa-form");
  });
});
