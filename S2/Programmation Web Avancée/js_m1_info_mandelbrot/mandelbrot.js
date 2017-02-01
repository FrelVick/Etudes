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
    //if (Math.sqrt((cx-0.25)*(cx-0.25)+cy*cy) <= (0.5 - 0.5*Math.atan2(cy,cx-0.25))) return Mandelbrot.limit;
    while (x * x + y * y <= 4 && i < Mandelbrot.limit) {
        tempx = x * x - y * y + cx;
        y = 2 * x * y + cy;
        x = tempx;
        i++;
    }
    return i;
};

Mandelbrot.draw = function (x, y, xm, ym) {
    x = x || 0;
    y = y || 0;
    var field = document.getElementById("cvn");
    xm = xm || field.width;
    ym = ym || field.height;
    //field.width = window.innerWidth;
    //field.height = window.innerHeight;
    var ctx = field.getContext("2d");
    var id = ctx.createImageData(1, 1);
    var d = id.data, color;
    d[3] = 255;
    for (var tx = x; tx < xm; tx++) {
        for (var ty = y; ty < ym; ty++) {
            color = Mandelbrot.inSet(tx * (Mandelbrot.xmax - Mandelbrot.xmin) / field.width + Mandelbrot.xmin, Mandelbrot.ymax - ty * (Mandelbrot.ymax - Mandelbrot.ymin) / field.height) * 255 / Mandelbrot.limit | 0;
            d[0] = color;
            d[1] = color;
            d[2] = color;
            ctx.putImageData(id, tx, ty);
        }
    }
    console.log("done");
};

Mandelbrot.movex = function (dx) {
    var field = document.getElementById("cvn");
    var ctx = field.getContext("2d");
    var oldmald = ctx.getImageData((Math.abs(dx) - dx) >> 1, 0, field.width - Math.abs(dx), field.height);
    ctx.putImageData(oldmald, ((Math.abs(dx) + dx) >> 1), 0);
    var deltax = dx * (Mandelbrot.xmin - Mandelbrot.xmax) / field.width;
    Mandelbrot.xmin += deltax;
    Mandelbrot.xmax += deltax;
    if (dx < 0) {
        Mandelbrot.draw(field.width - dx);
    } else Mandelbrot.draw(0, 0, dx);
};

Mandelbrot.upscale = function () {
    var deltax = (Mandelbrot.xmax - Mandelbrot.xmin) * 0.05;
    var deltay = (Mandelbrot.ymax - Mandelbrot.ymin) * 0.05;
    Mandelbrot.xmin += deltax;
    Mandelbrot.xmax -= deltax;
    Mandelbrot.ymin += deltay;
    Mandelbrot.ymax -= deltay;
    Mandelbrot.draw()
};

document.onkeydown = function (eventObject) {
    var e = window.event || eventObject, K = e.keyCode;
    if (K == 37) Mandelbrot.movex(-10);
    else if (K == 39) Mandelbrot.movex(10);
};
window.onload = function () {
    Mandelbrot.draw();
};