import { createNewUser } from "./firebase_auth.js";

export async function onClickCreateUser(e) {
  e.preventDefault();

  const createUserModal = document.getElementById('createUserModal');
  const modal = new bootstrap.Modal(createUserModal);
  modal.show();

  const form = createUserModal.querySelector('form');
  form.onsubmit = async (event) => {
    event.preventDefault();

    const email = form.querySelector('#new-user-email').value;
    const password = form.querySelector('#new-user-password').value;
    const displayName = form.querySelector('#new-user-displayname').value;

    try {
      await createNewUser(email, password, displayName);
      alert('User account created successfully!');
      modal.hide();
      resetBodyStyles();
    } catch (error) {
      alert('Error creating user: ' + error.message);
    }
  };

  createUserModal.addEventListener('hidden.bs.modal', resetBodyStyles);

  const closeButton = createUserModal.querySelector('.btn-close');
  closeButton.addEventListener('click', () => {
    modal.hide();
    resetBodyStyles();
  });
}

function resetBodyStyles() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.body.classList.remove('modal-open');
}
