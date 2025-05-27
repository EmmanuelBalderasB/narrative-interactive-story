function fadeToBlack(canvas, flag) {
    canvas.style.filter = 'brightness(0)';
    flag = true;
}

function fadeToNormal(canvas, flag) {
    canvas.style.filter = 'brightness(1)';
    flag = false;
}

export { fadeToBlack, fadeToNormal };