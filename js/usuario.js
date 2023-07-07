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
        }
      } else {
        box.classList.add("green");
        box.setAttribute("data-color", "green");
      }
    }
  
    // Mostrar mensaje al hacer clic en un cuadro
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      box.addEventListener("click", function() {
        const color = box.getAttribute("data-color");
        if (color === "green") {
          Swal.fire({
            title: "Parqueadero vacío",
            icon: "info",
            text: "Este parqueadero está vacío."
          });
        } else {
          Swal.fire({
            title: "Este parqueadero está ocupado",
            icon: "info"
          });
        }
      });
    }
  
    function saveColorState(index, color, name, plate, number) {
      localStorage.setItem(`box${index}`, color);
      localStorage.setItem(`box${index}_name`, name);
      localStorage.setItem(`box${index}_plate`, plate);
      localStorage.setItem(`box${index}_number`, number);
    }
  
    function removeColorState(index) {
      localStorage.removeItem(`box${index}`);
      localStorage.removeItem(`box${index}_name`);
      localStorage.removeItem(`box${index}_plate`);
      localStorage.removeItem(`box${index}_number`);
    }
  
    function getColorState(index) {
      const color = localStorage.getItem(`box${index}`);
      if (color === "red") {
        const name = localStorage.getItem(`box${index}_name`);
        const plate = localStorage.getItem(`box${index}_plate`);
        const number = localStorage.getItem(`box${index}_number`);
        return { name, plate, number };
      }
      return null;
    }
  });
  