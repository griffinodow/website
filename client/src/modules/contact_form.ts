/**
 * The form and the sections of its various stages.
 */
const card = document.getElementById("form-card");
const sectionInput = document.getElementById("input");
const sectionSync = document.getElementById("sync");
const sectionSuccess = document.getElementById("success");
const sectionError = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const form = document.getElementById("form") as HTMLFormElement;

/**
 * Initializes the contact form.
 */
export const initContactForm = () => {
  form.addEventListener(
    "submit",
    async (event) => await handleFormSubmit(event)
  );
};

/**
 * Handles the form submit event.
 * @param event - Form Submit Event.
 */
const handleFormSubmit = async (event: Event): Promise<void> => {
  try {
    event.preventDefault();
    if (!form.reportValidity()) return;
    sectionInput.classList.add("hidden");
    sectionSync.classList.remove("hidden");
    const formData: FormData = new FormData(form);
    const response = await sendEmail(
      formData.get("email") as string,
      formData.get("message") as string
    );
    if (response.errors?.length > 0) {
      throw new Error("There was a problem communicating with the server");
    }
    sectionSync.classList.add("hidden");
    sectionSuccess.classList.remove("hidden");
    card.classList.add("success");
    form.reset();
  } catch (error) {
    handleError(error.message);
  }
};

/**
 * Displays an error when encountered.
 * @param message - The error message.
 */
const handleError = (message: string) => {
  if (!message) message = "Something went wrong";
  sectionInput.classList.add("hidden");
  sectionSync.classList.add("hidden");
  sectionError.classList.remove("hidden");
  errorMessage.textContent = message;
};

/**
 * This method sends a request to the API to send an email
 * @param address - The email address of the recipient
 * @param message - The message to include with the email
 * @returns Email address on successful request
 */
const sendEmail = async (address: string, message: string): Promise<any> => {
  const response = await fetch("https://api.griffindow.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      address,
      message,
    }),
  });
  return response.json();
};
