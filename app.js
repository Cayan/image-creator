
var update = (function(text) {
    const FONT_SIZE = 32;
    const MARGIN_WIDTH = 300;
    const MARGIN_HEIGHT = 50;

    function checkTextWidth(context, text, maxWidth) {
        var metrics = context.measureText(text);
        return (metrics.width + MARGIN_WIDTH < maxWidth);
    }

    function getWrappedText(context, text, maxWidth) {
        var ret = [];
        var words = text.trim().split(' ');
        var line = [];

        // This function needs a refactor.
        for (var n = 0; n < words.length; n++) {
            var testLine = line;
            testLine.push(words[n]);

            if (n == 0) {
                line = testLine;
                continue;
            }

            if (!checkTextWidth(context, testLine.join(' '), maxWidth)) {
                ret.push(line.join(' '));
                line = [];
            } else {
                line = testLine;
            }
        }

        ret.push(line.join(' '));
        return ret;
    }

    function getTextHeight(context, text) {
        var div = document.createElement("div");
            div.innerHTML = text;
            div.style.position = 'absolute';
            div.style.top  = '-9999px';
            div.style.left = '-9999px';
            div.style.fontSize = FONT_SIZE + 'pt';

        document.body.appendChild(div);
        var height = div.offsetHeight;
        document.body.removeChild(div);

        return height;
    }

    function fillWrappedText(context, wrappedText, maxWidth, maxHeight) {
        var xCenter = maxWidth / 2;

        var totalHeight = 0;
        for (var n = 0; n < wrappedText.length; n++) {
            totalHeight += getTextHeight(context, wrappedText[n]);
        }

        var initialY = maxHeight - (2 * MARGIN_HEIGHT) - totalHeight;
        var accumulatedHeight = 0;
        for (var n = 0; n < wrappedText.length; n++) {
            var text = wrappedText[n];
            var textHeight = getTextHeight(context, text);

            var x = xCenter;
            var y = initialY + accumulatedHeight;
            context.fillText(text, x, y);

            accumulatedHeight += textHeight;
        }
    }

    var img = document.getElementById('base');
    var width = img.width;
    var height = img.height;

    var canvas = document.getElementById('canvas');
    canvas.width  = width;
    canvas.height = height;

    var context = canvas.getContext('2d');

    context.drawImage(img, 0, 0, width, height);
    if (!text) {
        return;
    }

    context.textAlign = 'center';
    context.font = FONT_SIZE + "px Arial";

    var wrappedText = getWrappedText(context, text, width);
    fillWrappedText(context, wrappedText, width, height);
});

window.onload = function() {
    update();
};

var save = function() {
    var canvas = document.getElementById('canvas');
    var dataURL = canvas.toDataURL();
    sendPost("save.php", {
        data: dataURL
    });
}

