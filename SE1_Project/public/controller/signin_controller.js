import { createNewUser } from "./firebase_auth.js";

export async function onClickCreateUser(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the modal element
    const createUserModal = document.getElementById('createUserModal');

    // Initialize the modal
    const modal = new bootstrap.Modal(createUserModal);

    // Show the modal
    modal.show();

    // Attach submit event listener to the form inside the modal
    const form = createUserModal.querySelector('form');
    form.onsubmit = async (event) => {
        event.preventDefault(); // Prevent the form's default submission

        const email = form.querySelector('#new-user-email').value;
        const password = form.querySelector('#new-user-password').value;

        try {
            await createNewUser(email, password);
            alert('User account created successfully!');
            modal.hide();

            // Ensure the body styles are reset
            resetBodyStyles();
        } catch (error) {
            alert('Error creating user: ' + error.message);
        }
    };

    // Handle modal hidden event
    createUserModal.addEventListener('hidden.bs.modal', () => {
        resetBodyStyles();
    });

    // Ensure "X" button triggers the same behavior
    const closeButton = createUserModal.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        modal.hide();
        resetBodyStyles();
    });
}

// Utility function to reset body styles
function resetBodyStyles() {
    // Remove Bootstrap's overflow: hidden and padding styles
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Clean up any lingering modal-open class
    document.body.classList.remove('modal-open');
}


