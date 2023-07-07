// Obtener el nombre de usuario del almacenamiento local
var nombreUsuario = localStorage.getItem('nombreUsuario');
  
// Mostrar el nombre de usuario en el lugar deseado
document.getElementById('nombreUsuario').textContent = nombreUsuario;
document.addEventListener("DOMContentLoaded", function() {
  const boxes = document.getElementsByClassName("box");

  // Recuperar el estado de los colores almacenados en el almacenamiento local
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const color = localStorage.getItem(`box${i}`);
    if (color === "red") {
      box.classList.add("red");
      box.setAttribute("data-color", "red");
      const storedData = getColorState(i);
      if (storedData) {
        box.setAttribute("data-name", storedData.name);
        box.setAttribute("data-plate", storedData.plate);
        box.setAttribute("data-number", storedData.number);
        box.setAttribute("data-apartment", storedData.apartment);
        box.setAttribute("data-arrival-time", storedData.arrivalTime);
        box.setAttribute("data-departure-time", storedData.departureTime);
      }
    } else {
      box.classList.add("green");
      box.setAttribute("data-color", "green");
    }
  }

  // Cambiar de color al hacer clic en un cuadro
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    box.addEventListener("click", function() {
      if (box.getAttribute("data-color") === "red") {
        showConfirmationDialog(i); // Ventana emergente para cambiar de rojo a verde
      } else {
        showInputDialog(i); // Ventana emergente para cambiar de verde a rojo
      }
    });
  }

  function showInputDialog(index) {
    Swal.fire({
      title: "Ingrese los datos",
      html:
        '<input id="name" class="swal2-input" placeholder="Nombre">' +
        '<input id="plate" class="swal2-input" placeholder="Placa">' +
        '<input id="number" class="swal2-input" placeholder="Numero">' +
        '<input id="apartment" class="swal2-input" placeholder="Apartamento">' +
        '<input id="arrival-time" class="swal2-input" placeholder="Hora de llegada">' +
        '<input id="departure-time" class="swal2-input" placeholder="Hora de salida">',
      showCancelButton: true,
      confirmButtonText: "Listo",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const name = document.getElementById("name").value;
        const plate = document.getElementById("plate").value;
        const number = document.getElementById("number").value;
        const apartment = document.getElementById("apartment").value;
        const arrivalTime = document.getElementById("arrival-time").value;
        const departureTime = document.getElementById("departure-time").value;

        if (!name || !plate || !number || !apartment || !arrivalTime || !departureTime) {
          Swal.showValidationMessage("Por favor, complete todos los campos");
        }

        return { name, plate, number, apartment, arrivalTime, departureTime };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        changeBoxColor(index);
        const { name, plate, number, apartment, arrivalTime, departureTime } = result.value;
        saveColorState(index, "red", name, plate, number, apartment, arrivalTime, departureTime);
        box.setAttribute("data-name", name);
        box.setAttribute("data-plate", plate);
        box.setAttribute("data-number", number);
        box.setAttribute("data-apartment", apartment);
        box.setAttribute("data-arrival-time", arrivalTime);
        box.setAttribute("data-departure-time", departureTime);
      }
    });
  }

  function showConfirmationDialog(index) {
    const storedData = getColorState(index);
    Swal.fire({
      title: "Confirmar borrado de parqueadero",
      html: `Nombre: ${storedData.name}<br>Placa: ${storedData.plate}<br>Numero: ${storedData.number}<br>Apartamento: ${storedData.apartment}<br>Hora de llegada: ${storedData.arrivalTime}<br>Hora de salida: ${storedData.departureTime}`,
      showCancelButton: true,
      cancelButtonText: '<i class="fas fa-times"></i>',
      cancelButtonAriaLabel: "Cancelar",
      confirmButtonText: "Borrar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 3000); // Esperar 3 segundos antes de borrar los datos
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
      showClass: {
        popup: "animate_animated animate_fadeInDown"
      },
      hideClass: {
        popup: "animate_animated animate_fadeOutUp"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        removeColorState(index);
        changeBoxColor(index);
        Swal.fire({
          title: "Datos borrados",
          icon: "success"
        });
      }
    });
  }
  
  function changeBoxColor(index) {
    const box = boxes[index];
    if (box.getAttribute("data-color") === "red") {
      box.classList.remove("red");
      box.classList.add("green");
      box.setAttribute("data-color", "green");
    } else {
      box.classList.remove("green");
      box.classList.add("red");
      box.setAttribute("data-color", "red");
    }
  }

  function saveColorState(index, color, name, plate, number, apartment, arrivalTime, departureTime) {
    localStorage.setItem(`box${index}`, color);
    localStorage.setItem(`box${index}_name`, name);
    localStorage.setItem(`box${index}_plate`, plate);
    localStorage.setItem(`box${index}_number`, number);
    localStorage.setItem(`box${index}_apartment`, apartment);
    localStorage.setItem(`box${index}_arrival_time`, arrivalTime);
    localStorage.setItem(`box${index}_departure_time`, departureTime);
  }

  function removeColorState(index) {
    localStorage.removeItem(`box${index}`);
    localStorage.removeItem(`box${index}_name`);
    localStorage.removeItem(`box${index}_plate`);
    localStorage.removeItem(`box${index}_number`);
    localStorage.removeItem(`box${index}_apartment`);
    localStorage.removeItem(`box${index}_arrival_time`);
    localStorage.removeItem(`box${index}_departure_time`);
  }

  function getColorState(index) {
    const color = localStorage.getItem(`box${index}`);
    if (color === "red") {
      const name = localStorage.getItem(`box${index}_name`);
      const plate = localStorage.getItem(`box${index}_plate`);
      const number = localStorage.getItem(`box${index}_number`);
      const apartment = localStorage.getItem(`box${index}_apartment`);
      const arrivalTime = localStorage.getItem(`box${index}_arrival_time`);
      const departureTime = localStorage.getItem(`box${index}_departure_time`);
      return { name, plate, number, apartment, arrivalTime, departureTime };
    }
    return null;
  }
});

  
  
  
  //Ejecutar función en el evento click
  document.getElementById("btn_open").addEventListener("click", open_close_menu);
  
  //Declaramos variables
  var side_menu = document.getElementById("menu_side");
  var btn_open = document.getElementById("btn_open");
  var body = document.getElementById("body");
  
  //Evento para mostrar y ocultar menú
      function open_close_menu(){
          body.classList.toggle("body_move");
          side_menu.classList.toggle("menu__side_move");
      }
  
  //Si el ancho de la página es menor a 760px, ocultará el menú al recargar la página
  
  if (window.innerWidth < 760){
  
      body.classList.add("body_move");
      side_menu.classList.add("menu__side_move");
  }
  
  //Haciendo el menú responsive(adaptable)
  
  window.addEventListener("resize", function(){
  
      if (window.innerWidth > 760){
  
          body.classList.remove("body_move");
          side_menu.classList.remove("menu__side_move");
      }
  
      if (window.innerWidth < 760){
  
          body.classList.add("body_move");
          side_menu.classList.add("menu__side_move");
      }
  
  });
  setInterval(() => { 
      let fecha = new Date();
      const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const dias = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
      const mes = meses[fecha.getMonth()];
      const dia = dias[fecha.getDay()];
      const diaN = fecha.getDate();
      const horas = (String(fecha.getHours()).length == 2) ? fecha.getHours() : `0${fecha.getHours()}`;
      const minutos = (String(fecha.getMinutes()).length == 2) ? fecha.getMinutes() : `0${fecha.getMinutes()}`;
      const segundos = (String(fecha.getSeconds()).length == 2) ? fecha.getSeconds() : `0${fecha.getSeconds()}`;
  
  
      document.getElementById('dia').innerHTML = dia;
      document.getElementById('mes').innerHTML = `${diaN} ${mes}`;
      document.querySelector('#hora p:nth-child(1)').innerHTML = horas;
      document.querySelector('#hora p:nth-child(2)').innerHTML = minutos;
      document.querySelector('#hora p:nth-child(3)').innerHTML = segundos;
  }, 1000);
  const addBtnTop = document.getElementById('addBtnTop');
  const removeBtnTop = document.getElementById('removeBtnTop');
  const gridTop = document.querySelector('.grid-top');
  const addBtnBottom = document.getElementById('addBtnBottom');
  const removeBtnBottom = document.getElementById('removeBtnBottom');
  const gridBottom = document.querySelector('.grid-bottom');
  
  let countTop = 0;
  let countBottom = 0;
  
  addBtnTop.addEventListener('click', () => {
    const item = document.createElement('div');
    item.classList.add('grid-item');
    item.textContent = ++countTop;
    gridTop.appendChild(item);
  });
  
  removeBtnTop.addEventListener('click', () => {
    const items = document.querySelectorAll('.grid-top .grid-item');
    if (items.length > 0) {
      items[items.length - 1].remove();
      countTop--;
    }
  });
  
  addBtnBottom.addEventListener('click', () => {
    const item = document.createElement('div');
    item.classList.add('grid-item');
    item.textContent = ++countBottom;
    gridBottom.appendChild(item);
  });
  
  removeBtnBottom.addEventListener('click', () => {
    const items = document.querySelectorAll('.grid-bottom .grid-item');
    if (items.length > 0) {
      items[items.length - 1].remove();
      countBottom--;
    }
  });