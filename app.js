var update = (function(text) {
    function getWrappedText(context, text, maxWidth) {
        var ret = [];
        var words = text.split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n];
            var metrics = context.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ret.push(line.slice(0, -1));
                line = words[n];
            } else {
                line = testLine;
            }

            line += ' ';
        }
        
        if (line.length > 1) { 
            ret.push(line);
        }

        return ret;
    }

    function canFillWrappedText(context, wrappedText, maxHeight, lineHeight) {
        return (lineHeight * wrappedText.length) <= maxHeight;
    }

    function fillWrappedText(context, wrappedText, maxWidth, maxHeight, lineHeight) {
        var textHeight = Math.floor(wrappedText.length / 2) * lineHeight;
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
    context.font = "20px Arial";
    var wrappedText = getWrappedText(context, text, width);
    if (!canFillWrappedText(context, wrappedText, height, 25)) {
        context.fillText('ERROR', width/2, height/2);
    } else {
        fillWrappedText(context, wrappedText, width, height, 25);
    }
});

update();
