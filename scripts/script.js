/**
 * Function to check if inputs are valid
 */
function validListeners(inputField, category) {
  inputField.addEventListener("input", function (event) {
    // get the value of the input field
    const value = event.target.value;
    const isNumber = /^[0-9]*$/.test(value);

    // check if input is a grade, less than 100, and greater than 65
    // const isValidGrade =
    //   isNumber && parseInt(value, 10) >= 65 && parseInt(value, 10) <= 100;

    // check if it a grade and a valid one
    if ((category === "subject" || category === "units") && !isNumber) {
      displayError();
      // consume last inputted character
      event.target.value = value.slice(0, -1);
    }
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
  inputField.style.border = "2px solid red";

  // revert if input is valid and error message is displayed
  setTimeout(() => {
    // insert heart emoji to the error message
    errorMessage.textContent = "🙂🙂🙂";
    inputField.style.border = ""; // revert to default border
  }, 3000);
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
});
