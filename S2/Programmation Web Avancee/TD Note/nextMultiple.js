var nextMultiple = function (n, m) {

    //code naif, on pourrait faire plus direct…

    while (n % m != 0) {
        n = n + 1;
    }
    return n;
};


window.addEventListener("load", function () {

    var button = document.getElementById("button");
    var result = document.getElementById("result");
    var input1 = document.getElementById("n1");
    var input2 = document.getElementById("n2");

    button.addEventListener("click", function () {

        var n = nextMultiple(parseInt(input1.value), parseInt(input2.value));

        result.innerHTML = n;
    });

});