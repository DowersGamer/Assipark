function guardar() {
  const form = document.getElementById("myForm"); 
      nombre = document.getElementById("name").value.trim();
      apellido = document.getElementById("last").value.trim();
      email = document.getElementById("email").value.trim();
      Danos_tus_inquietudes = document.getElementById("contat").value.trim();
  

  if (
    nombre === "" ||
    apellido === "" ||
    email === "" 
  ) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  db.collection("Contactanos")
    .add({
      nombre: nombre,
      apellido: apellido,
      email: email,
      Danos_tus_inquietudes: Danos_tus_inquietudes,
    })
    .then((docRef) => {
      alert("Registro exitoso");
      form.reset();
    })
  
}


function iniciarSesion() {
  // Obtener los valores ingresados por el usuario
  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("password").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  let rol;

  // Iniciar sesión con Firebase Authentication
  firebase.auth().signInWithEmailAndPassword(email, contraseña)
    .then((userCredential) => {
      const user = userCredential.user;

      obtenerRolUsuario(user.uid)
        .then((usuarioRol) => {
          rol = usuarioRol;

          // Guardar el nombre de usuario en el almacenamiento local
          localStorage.setItem("nombreUsuario", nombre);

          return db.collection("Usuarios").doc(user.uid).set({
            email: email,
            contraseña: contraseña,
            nombre: nombre,
            rol: rol
          });
        })
        .then(() => {
          console.log("Datos adicionales guardados en Firestore");

          // Redireccionar al usuario a la página deseada
          if (rol === "administrador") {
            window.location.href = "/paginas.html/Administrador.html";
          } else if (rol === "guarda") {
            window.location.href = "/paginas.html/Guarda.html";
          } else {
            window.location.href = "/paginas.html/Usuario.html";
          }
        })
        .catch((error) => {
          console.error("Error al guardar los datos adicionales en Firestore:", error);
          alert("Ocurrió un error al guardar los datos adicionales en Firestore. Por favor, inténtalo de nuevo.");
        });
    })
    .catch((error) => {
      alert("Credenciales incorrectas: " + obtenerMensajeError(error));
    });
}
function obtenerRolUsuario(userId) {
  return db.collection("Usuarios").doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        return data.rol;
      } else {
        return "usuario"; // El documento no existe
      }
    })
    .catch((error) => {
      console.error("Error al obtener el rol del usuario:", error);
      throw error;
    });
}
  //parametros del ojo de ver contraseña 
  function togglePasswordVisibility() {
  
    const passwordInput = document.getElementById("password");
  
    if (passwordInput.type === "password")
  
     {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }


// Función para restablecer la contraseña
function resetPassword() {
  // Obtener el valor del correo electrónico ingresado por el usuario
  const email = document.getElementById("email").value.trim();

  // Validar que el campo de correo electrónico esté completo
  if (email === "") {
    alert("Por favor, ingresa tu correo electrónico.");
    return;
  }

  // Enviar correo electrónico para restablecer la contraseña utilizando Firebase Authentication
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      // Mostrar una alerta cuando el correo electrónico se ha enviado correctamente
      alert("Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.");
    })
    .catch((error) => {
      // Mostrar una alerta si ocurre un error al enviar el correo electrónico de restablecimiento de contraseña
      alert("Ha ocurrido un error al enviar el correo electrónico de restablecimiento de contraseña: " + obtenerMensajeError(error));
    });
}

// Función para obtener el mensaje de error correspondiente al código de error proporcionado
function obtenerMensajeError(error) {
  const mensajes = {
    "auth/email-already-in-use": "El correo electrónico ya está en uso.",
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/weak-password": "La contraseña es débil. Debe tener al menos 6 caracteres.",
    "auth/user-not-found": "El usuario no fue encontrado.",
    "auth/wrong-password": "Contraseña incorrecta."
  };

  // Obtener el mensaje de error correspondiente al código de error proporcionado
  return mensajes[error.code] || "Ocurrió un error desconocido.";
}

// Cerrar sesión y redirigir a la página de inicio de sesión
function cerrarSesion() {
  firebase.auth().signOut().then(() => {
    // Cerrar sesión exitosa

    // Utilizar history.replaceState para reemplazar la URL actual con la URL de inicio de sesión
    history.replaceState(null, "", "login.html");

    // Redirigir a la página de inicio de sesión
    window.location.href = "login.html";
  }).catch((error) => {
    // Error al cerrar sesión
    alert("Error al cerrar sesión: " + error.message);
  });
}


// Bloquear las acciones de retroceso y avance después de cerrar sesión
  history.pushState(null, document.title, location.href);
  window.addEventListener('popstate', function(event) {
  history.pushState(null, document.title, location.href);
});
