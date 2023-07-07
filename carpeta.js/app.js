
setInterval(() => { ss
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
