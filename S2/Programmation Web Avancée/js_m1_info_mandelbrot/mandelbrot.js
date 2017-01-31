var Mandelbrot = {
    limit: 50,
    xmin: -2,
    xmax: 2,
    ymin: -2,
    ymax: 2
};

Mandelbrot.inSet = function (cx, cy) {
    var x = 0, y = 0;
    var tempx = 0;
    var i = 0;
    while (x * x + y * y <= 4 && i < Mandelbrot.limit) {
        tempx = x * x - y * y + cx;
        y = 2 * tempx * y + cy;
        x = tempx;
        i++;
    }
    return i;
};