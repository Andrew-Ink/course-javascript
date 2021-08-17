/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';

const homeworkContainer = document.querySelector('#app');

let currentDiv;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
  if (currentDiv) {
    currentDiv.style.left = e.clientX - currentX + 'px';
    currentDiv.style.top = e.clientY - currentY + 'px';
  }
});

function random(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

export function createDiv() {
  const minSize = 30;
  const maxSize = 200;
  const maxColor = 0xffffff;
  const div = document.createElement('div');
  div.classList.add('draggable-div');
  div.style.height = random(minSize, maxSize) + 'px';
  div.style.width = random(minSize, maxSize) + 'px';
  div.style.backgroundColor = '#' + random(0, maxColor).toString(16);
  div.style.top = random(0, window.innerHeight) + 'px';
  div.style.left = random(0, window.innerWidth) + 'px';
  div.style.borderRadius = '6px';
  div.addEventListener('mousedown', (e) => {
    currentDiv = div;
    currentX = e.offsetX;
    currentY = e.offsetY;
  });
  div.addEventListener('mouseup', () => {
    currentDiv = false;
  });
  div.addEventListener('dragstart', () => false);
  return div;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const div = createDiv();
  homeworkContainer.appendChild(div);
});
