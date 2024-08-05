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
      // document.querySelector(".instruction").innerHTML = "Error: Invalid Grade";
    }
  });
} // end of validListeners

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

document.addEventListener("DOMContentLoaded", function () {
  // attach the listeners
  addListenerToInputField("gwa-form", "subject", "units");
});
