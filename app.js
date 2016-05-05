var update = (function(text) {
    function getWrappedText(context, text, maxWidth) {
        var ret = [];
        var words = text.split(' ');
        var line = '';

        // This function needs a refactor.
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n];
            var metrics = context.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ret.push(line.slice(0, -1).trim());
                line = words[n];
            } else {
                line = testLine;
            }

            line += ' ';
        }

        if (line.length > 1) {
            ret.push(line.trim());
        }

        return ret;
    }

    function canFillWrappedText(context, wrappedText, maxHeight, maxWidth, lineHeight) {
        // in case we have a one-word line, larger than the available width
        for (text of wrappedText) {
            var metrics = context.measureText(text);
            if (metrics.width > maxWidth) {
                return false;
            }
        }

        return (lineHeight * (wrappedText.length + 1)) <= maxHeight;
    }

    function fillWrappedText(context, wrappedText, maxWidth, maxHeight, lineHeight) {
        var margin = 0.5; // half the lineHeight
        var textHeight = (Math.floor(wrappedText.length / 2) - margin) * lineHeight;
        var y = (maxHeight / 2) - textHeight;
        for (var n = 0; n < wrappedText.length; n++) {
            context.fillText(wrappedText[n], maxWidth/2, y + lineHeight * n);
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

    var size = 8;
    while (size < 40) {
        context.font = size + "px Arial";
        var wrappedText = getWrappedText(context, text, width);
        if (!canFillWrappedText(context, wrappedText, height, width, 25)) {
            size--;
            break;
        }

        size++;
    }

    fillWrappedText(context, wrappedText, width, height, 25);
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

