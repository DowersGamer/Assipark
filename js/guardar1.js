function guardar() {
  const form = document.getElementById("signupForm");
  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("password").value.trim();
  const rol = document.getElementById("rol").value;

  // Validar que todos los campos estén completos
  if (email === "" || contraseña === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Crear un nuevo usuario en Firebase Authentication
  firebase.auth().createUserWithEmailAndPassword(email, contraseña)
    .then((userCredential) => {
      // El usuario se creó exitosamente en Firebase Authentication
      const userId = userCredential.user.uid;

      // Guardar los datos adicionales en Firestore con el rol seleccionado
      db.collection("Usuarios").doc(userId).set({
        email: email,
        rol: rol
      })
        .then(() => {
          alert("Registro exitoso");
          form.reset();
          window.location.href = "login.html"; // Redireccionar al login
        })
        .catch((error) => {
          alert("Error al guardar los datos adicionales: " + obtenerMensajeError(error));
        });
    })
    .catch((error) => {
      alert("Error al crear el usuario: " + obtenerMensajeError(error));
    });
}


  
function iniciarSesion() {
  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("password").value.trim();

  firebase.auth().signInWithEmailAndPassword(email, contraseña)
    .then((userCredential) => {
      // Autenticación exitosa
      const user = userCredential.user;

      // Obtener información adicional del usuario desde Firestore
      db.collection("Usuarios").doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();

            // Redireccionar según el rol del usuario
            if (userData.rol === "administrador") {
              window.location.href = "/paginas.html/admin.html";
            } else if (userData.rol === "guarda") {
              window.location.href = "/paginas.html/guarda.html";
            } else if (userData.rol === "usuario") {
              window.location.href = "/paginas.html/park.html";
            } else {
              window.location.href = "/paginas.html/park.html";
            }

          } else {
            // El documento de usuario no existe
            alert("Error: Documento de usuario no encontrado");
          }
        })
        .catch((error) => {
          alert("Error al obtener datos adicionales del usuario: " + obtenerMensajeError(error));
        });
    })
    .catch((error) => {
      alert("Credenciales incorrectas: " + obtenerMensajeError(error));
    });
}

  function resetPassword() {
    const email = document.getElementById("email").value.trim();
  
    // Validar que el campo de correo electrónico esté completo
    if (email === "") {
      alert("Por favor, ingresa tu correo electrónico.");
      return;
    }
  
    // Enviar correo electrónico para restablecer la contraseña utilizando Firebase Authentication
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert("Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.");
      })
      .catch((error) => {
        alert("Ha ocurrido un error al enviar el correo electrónico de restablecimiento de contraseña: " + obtenerMensajeError(error));
      });
  }
  
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
  
  function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
  
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }
  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userId = user.uid;
      verificarRolUsuarios(userId)
        .then((isAdmin) => {
          if (isAdmin) {
            window.location.href = "/paginas.html/Registro.html";
          } else {
            alert("No tienes permiso para acceder a la página de registro.");
          }
        })
        .catch((error) => {
          console.error("Error al verificar el rol del usuario:", error);
        });
    } else {
      // No hay usuario autenticado
    }
  });
  
  