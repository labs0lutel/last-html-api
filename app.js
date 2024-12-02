document.getElementById('back').addEventListener('click', () => {
    window.history.back();
});

document.getElementById('forward').addEventListener('click', () => {
    window.history.forward();
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x = 0, y = 0, dx = 2, dy = 2, radius = 20;
let lastTime = 0;

function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // очищаем холст
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff5722';  
    ctx.fill();
    ctx.closePath();

    x += dx * deltaTime / 16; 
    y += dy * deltaTime / 16;

    if (x + radius > canvas.width || x - radius < 0) dx = -dx;
    if (y + radius > canvas.height || y - radius < 0) dy = -dy;

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate); 

const startWorkerButton = document.getElementById('startWorker');
const inputNumber = document.getElementById('inputNumber');
const resultText = document.getElementById('result');
const errorText = document.getElementById('error');

const worker = new Worker(URL.createObjectURL(new Blob([`
    onmessage = function(e) {
        const num = e.data;
        let result = 1;
        for (let i = 1; i <= num; i++) {
            result *= i;
        }
        postMessage(result);
    };
`], { type: 'application/javascript' })));

startWorkerButton.addEventListener('click', () => {
    const num = parseInt(inputNumber.value);
    resultText.textContent = '';
    errorText.textContent = '';

    if (isNaN(num) || num < 0) {
        errorText.textContent = 'Пожалуйста, введите положительное число';
    } else {
        worker.postMessage(num);
    }
});

worker.onmessage = function(e) {
    resultText.textContent = `Результат: ${e.data}`;
};

worker.onerror = function(error) {
    console.error('Ошибка в воркере: ', error);
};