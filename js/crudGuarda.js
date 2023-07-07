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

  // Obtiene referencias a elementos del DOM necesarios para la manipulación del contenido y la interacción con el usuario.
  const openModal = document.getElementById('openRegister');
  const modal = document.getElementById('modal');
  
  const updateModal = document.getElementById('modal-update');
  const updateForm = document.getElementById('update-form');
  const closeUpdateModal = document.getElementById('closeUpdateModal');
  
  const closeModal = document.getElementById('closeRegisterModal');
  const registerForm = document.getElementById('register-form');
  
  const studentsTable = document.getElementById('studentsTable');
  const studentCollection = firebase.firestore().collection('Residentes');
  
  // Función que muestra u oculta el modal de registro
  const showRegisterModal = () => {
    modal.classList.toggle('is-active');
  }
  
  // Agrega escuchadores de eventos a los botones de apertura y cierre del modal de registro
  openModal.addEventListener('click', showRegisterModal);
  closeModal.addEventListener('click', showRegisterModal);
  
  // Función que elimina un estudiante de la base de datos
  const deleteStudent = (uid) => {
    studentCollection.doc(uid).delete();
  }
  
  // Función que muestra u oculta el modal de actualización
  const showUpdateModal = () => {
    updateModal.classList.toggle('is-active');
  }
  
  // Agrega un escuchador de eventos al botón de cierre del modal de actualización
  closeUpdateModal.addEventListener('click', showUpdateModal);
  
  // Agrega un escuchador de eventos al evento 'DOMContentLoaded'
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
  
    // Escucha el evento de clic en el botón de búsqueda
    searchButton.addEventListener('click', performSearch);
  
    // Escucha el evento de presionar la tecla "Enter" en el campo de búsqueda
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        performSearch();
      }
    });
  
    // Función de búsqueda
    function performSearch() {
      const query = searchInput.value.trim().toLowerCase();
      const students = Array.from(studentsTable.querySelectorAll('tr'));
  
      // Itera sobre los estudiantes y filtra aquellos que coinciden con la consulta de búsqueda
      students.forEach((student) => {
        let found = false;
        const fields = student.querySelectorAll('td');
        fields.forEach((field) => {
          const fieldValue = field.textContent.toLowerCase();
          if (fieldValue.includes(query)) {
            found = true;
          }
        });
  
        // Muestra u oculta los estudiantes según los resultados de búsqueda
        if (found) {
          student.style.display = 'table-row';
        } else {
          student.style.display = 'none';
        }
      });
    }
  
  });
  
  // Agrega un escuchador de eventos al evento 'DOMContentLoaded'
  document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const closeRegisterModalButton = document.getElementById('closeRegisterModal');
  
    // Agrega un escuchador de eventos al evento de envío del formulario de registro
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      // Obtiene los valores del formulario de registro
      const Documento_de_identidad = registerForm['Cedula'].value;
      const Nombre = registerForm['Nombre'].value;
      const Apellido = registerForm['Apellido'].value;
      const Telefono = registerForm['cel'].value;
      const Celular = registerForm['Celular'].value;
      const Correo_Electronico = registerForm['email'].value;
  
      // Crea un documento para el Residente en la colección de Residentes y lo guarda en la base de datos
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
        // Limpia el formulario y cierra el modal de registro después de guardar los datos
        registerForm.reset();
        showRegisterModal();
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
  
  // Función que muestra el modal de actualización y carga los datos del Residentes seleccionado para su edición
  const updateStudent = (uid) => {
    showUpdateModal();
    studentCollection.doc(uid).get().then((doc) => {
      const data = doc.data();
      updateForm['update-uid'].value = uid;
      updateForm['Cedula'].value = data.Documento_de_identidad;
      updateForm['Nombre'].value = data.Nombre;
      updateForm['Apellido'].value = data.Apellido;
      updateForm['cel'].value = data.Telefono;
      updateForm['Celular'].value = data.Celular;
      updateForm['email'].value = data.Correo_Electronico;
    });
  };
  
  // Agrega un escuchador de eventos al evento de envío del formulario de actualización
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // Obtiene los valores del formulario de actualización
    const uid = updateForm['update-uid'].value;
    const updatedDocumento_de_identidad = updateForm['Cedula'].value;
    const updatedNombre = updateForm['Nombre'].value;
    const updatedApellido = updateForm['Apellido'].value;
    const updatedTelefono = updateForm['cel'].value;
    const updatedCelular = updateForm['Celular'].value;
    const updatedCorreo_Electronico = updateForm['email'].value;
  
    // Actualiza los datos del Residentes en la base de datos
    studentCollection.doc(uid).update({
      Documento_de_identidad: updatedDocumento_de_identidad,
      Nombre: updatedNombre,
      Apellido: updatedApellido,
      Telefono: updatedTelefono,
      Celular: updatedCelular,
      Correo_Electronico: updatedCorreo_Electronico,
    })
    .then(() => {
      // Carga nuevamente los Residentes y cierra el modal de actualización después de actualizar los datos
      loadStudents();
      showUpdateModal();
    }).catch((error) => {
      console.error(error);
    });
  });
  
  // Función que carga los Residentes desde la base de datos y los muestra en la tabla
  const loadStudents = () => {
    studentCollection.onSnapshot((snapshot) => {
      studentsTable.innerHTML = '';
      snapshot.forEach((doc) => {
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
      });
  
      // Agrega escuchadores de eventos a los botones de actualización y eliminación de cada Residentes
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
    });
  }
  
  // Carga los estudiantes al cargar la página
  window.addEventListener('DOMContentLoaded', loadStudents);
  