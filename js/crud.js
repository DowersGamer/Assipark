const firebaseConfig = {
  apiKey: "AIzaSyBWHKTOLbzW7MY9vfFno_lZR9zCrkDkjuI",
  authDomain: "login-48823.firebaseapp.com",
  databaseURL: "https://login-48823-default-rtdb.firebaseio.com",
  projectId: "login-48823",
  storageBucket: "login-48823.appspot.com",
  messagingSenderId: "75889358980",
  appId: "1:75889358980:web:8c56f3e938e46f321dead1"
};

firebase.initializeApp(firebaseConfig);

// Obtener el nombre de usuario del almacenamiento local
var nombreUsuario = localStorage.getItem('nombreUsuario');
  
// Mostrar el nombre de usuario en el lugar deseado
document.getElementById('nombreUsuario').textContent = nombreUsuario;

// Obtener referencias a los elementos del DOM
const openModal = document.getElementById('openRegister');
const modal = document.getElementById('modal');

const updateModal = document.getElementById('modal-update');
const updateForm = document.getElementById('update-form');
const closeUpdateModal = document.getElementById('closeUpdateModal');

const closeModal = document.getElementById('closeRegisterModal');
const registerForm = document.getElementById('register-form');

const studentsTable = document.getElementById('studentsTable');
const studentCollection = firebase.firestore().collection('Residentes');

const pageSize = 5; // Número de elementos por página
let currentPage = 1; // Página actual

// Función para mostrar el modal de registro
const showRegisterModal = () => {
  modal.classList.toggle('is-active');
};

// Evento de clic en el botón de apertura del modal de registro
openModal.addEventListener('click', showRegisterModal);

// Evento de clic en el botón de cierre del modal de registro
closeModal.addEventListener('click', showRegisterModal);

// Función para eliminar un estudiante
const deleteStudent = (uid) => {
  studentCollection.doc(uid).delete();
};

// Función para mostrar el modal de actualización
const showUpdateModal = () => {
  updateModal.classList.toggle('is-active');
};

// Evento de clic en el botón de cierre del modal de actualización
closeUpdateModal.addEventListener('click', showUpdateModal);

// Evento de carga del contenido DOM
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  // Evento de clic en el botón de búsqueda
  searchButton.addEventListener('click', performSearch);

  // Evento de pulsación de tecla en el campo de entrada de búsqueda
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      performSearch();
    }
  });

  // Función para realizar la búsqueda
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const students = Array.from(studentsTable.querySelectorAll('tr'));

    students.forEach((student) => {
      let found = false;
      const fields = student.querySelectorAll('td');
      fields.forEach((field) => {
        const fieldValue = field.textContent.toLowerCase();
        if (fieldValue.includes(query)) {
          found = true;
        }
      });

      if (found) {
        student.style.display = 'table-row';
      } else {
        student.style.display = 'none';
      }
    });
  }

});

// Evento de carga del contenido DOM
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('register-form');
  const closeRegisterModalButton = document.getElementById('closeRegisterModal');

  // Evento de envío del formulario de registro
  registerForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtención de los valores del formulario de registro
    const Documento_de_identidad = registerForm['Cedula'].value;
    const Nombre = registerForm['Nombre'].value;
    const Apellido = registerForm['Apellido'].value;
    const Telefono = registerForm['cel'].value;
    const Celular = registerForm['Celular'].value;
    const Correo_Electronico = registerForm['email'].value;

    // Creación de un nuevo documento de estudiante en Firestore
    const registerStudent = studentCollection.doc();
    const uid = registerStudent.id;
    registerStudent.set({
      Uid: uid,
      Documento_de_identidad: Documento_de_identidad,
      Nombre: Nombre,
      Apellido: Apellido,
      Telefono: Telefono,
      Celular: Celular,
      Correo_Electronico: Correo_Electronico,
    }).then(() => {
      registerForm.reset();
      showRegisterModal();
          loadStudents(); // Actualizar la tabla de Residentes

    }).catch((error) => {
      console.error(error);
    });
  });

 
    // Agrega un escuchador de eventos al botón de cierre del modal de registro
    closeRegisterModalButton.addEventListener('click', function() {
      // Limpia el formulario al cerrar el modal
      registerForm.reset();
    });
  });
  
// Función para actualizar un Residentes
const updateStudent = (uid) => {
  showUpdateModal();
  studentCollection.doc(uid).get().then((doc) => {
    const data = doc.data();
    // Establecer los valores del formulario de actualización con los datos del estudiante
    updateForm['update-uid'].value = uid;
    updateForm['Cedula'].value = data.Documento_de_identidad;
    updateForm['Nombre'].value = data.Nombre;
    updateForm['Apellido'].value = data.Apellido;
    updateForm['cel'].value = data.Telefono;
    updateForm['Celular'].value = data.Celular;
    updateForm['email'].value = data.Correo_Electronico;
  });
};

// Evento de envío del formulario de actualización
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtención de los valores del formulario de actualización
  const uid = updateForm['update-uid'].value;
  const updatedDocumento_de_identidad = updateForm['Cedula'].value;
  const updatedNombre = updateForm['Nombre'].value;
  const updatedApellido = updateForm['Apellido'].value;
  const updatedTelefono = updateForm['cel'].value;
  const updatedCelular = updateForm['Celular'].value;
  const updatedCorreo_Electronico = updateForm['email'].value;

  // Actualización del estudiante en Firestore
  studentCollection.doc(uid).update({
    Documento_de_identidad: updatedDocumento_de_identidad,
    Nombre: updatedNombre,
    Apellido: updatedApellido,
    Telefono: updatedTelefono,
    Celular: updatedCelular,
    Correo_Electronico: updatedCorreo_Electronico,
  })
  .then(() => {
    loadStudents();
    showUpdateModal();
  }).catch((error) => {
    console.error(error);
  });
});

const maxVisiblePages = 3; // Número máximo de botones de paginación visibles a la vez

// Función para cargar los Residentes
const loadStudents = () => {
  studentCollection.get().then((snapshot) => {
    const totalStudents = snapshot.size;
    const totalPages = Math.ceil(totalStudents / pageSize);

    // Verificar y ajustar la página actual si es necesario
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    studentsTable.innerHTML = '';

    const paginationInfo = document.getElementById('pagination-info');
    paginationInfo.textContent = `Registro ${currentPage} de ${totalPages}`;


    let index = 0;
    snapshot.forEach((doc) => {
      if (index >= startIndex && index < endIndex) {
        let studentData = doc.data();
        studentsTable.innerHTML += `
          <tr>
            <td>${studentData.Documento_de_identidad}</td>
            <td>${studentData.Nombre}</td>
            <td>${studentData.Apellido}</td>
            <td>${studentData.Telefono}</td>
            <td>${studentData.Celular}</td>
            <td>${studentData.Correo_Electronico}</td>
            <td>
              <button class="button is-warning" data-id="${doc.id}">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="button is-danger" data-id="${doc.id}">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }
      index++;
    });

    // Obtener los botones de actualización y eliminar
    const updateButtons = document.querySelectorAll('.is-warning');
    updateButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const uid = e.target.dataset.id;
        updateStudent(uid);
      });
    });

    const deleteButtons = document.querySelectorAll('.is-danger');
    deleteButtons.forEach((button) => {
      button.addEventListener('mousedown', (e) => {
        const uid = e.target.dataset.id;
        deleteStudent(uid);
      });
    });
    

    // Generar los botones de paginación
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const visiblePages = Math.min(totalPages, maxVisiblePages);
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.classList.add('pagination-link');
      if (i === currentPage) {
        pageButton.classList.add('is-current');
      }
      pageButton.textContent = i;

      pageButton.addEventListener('click', () => {
        currentPage = i;
        loadStudents();
      });

      pagination.appendChild(pageButton);
    }

    // Generar la entrada de página y el botón de ir a la siguiente pagina
    const pageInput = document.createElement('input');
    pageInput.classList.add('input', 'pagination-input');
    pageInput.type = 'number';
    pageInput.min = 1;
    pageInput.max = totalPages;
    pageInput.value = currentPage;

    const goToButton = document.createElement('button');
    goToButton.classList.add('button', 'pagination-link');
    goToButton.textContent = 'Go';
    goToButton.addEventListener('click', () => {
      const inputPage = parseInt(pageInput.value, 10);
      if (inputPage >= 1 && inputPage <= totalPages) {
        currentPage = inputPage;
        loadStudents();
      }
    });

    pagination.appendChild(pageInput);
    pagination.appendChild(goToButton);

    // Mostrar el total de registros
    const totalStudentsComment = document.getElementById('total-students-comment');
    totalStudentsComment.textContent = `Total de registros: ${totalStudents}`;
  });
};


// Cargar los Residentes cuando el contenido del DOM se haya cargado
window.addEventListener('DOMContentLoaded', loadStudents);
