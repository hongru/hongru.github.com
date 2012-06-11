$.NS('FiPhoto.fx', function () {
    var downloadMime = 'image/octet-stream';
    this.normal = function () {
        var canvas = FiPhoto.canvas,
            image = FiPhoto.image;
        function imgLoadCallback () {
            var texture = canvas.texture(image);
            canvas.draw(texture).brightnessContrast(0, 0).update();

            FiPhoto.$con.parent().height(FiPhoto.$con.height());
            //FiPhoto.$con.hide();
            $('#step1Source').empty().append(canvas);
            $('#step1Source').show();
            
            FiPhoto.setHref();

            $(FiPhoto.canvas).animate({opacity: 1});
        }
        if (image.complete) { 
            setTimeout(imgLoadCallback, 0)
            return;
        }
        $(image).load(imgLoadCallback)

    };
    this.amaro = function () {
        var canvas = FiPhoto.canvas,
            image = FiPhoto.image;
        function imgLoadCallback() {
            var texture = canvas.texture(image);
            canvas.draw(texture).brightnessContrast(0, 0.15).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).sepia(0.4).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).vignette(0.2, 0.4).update();

            //FiPhoto.$con.hide();
            $('#step1Source').empty().append(canvas);
            $('#step1Source').show();
            
            FiPhoto.setHref();
        }
        if (image.complete) {
            setTimeout(imgLoadCallback, 0)
            return;
        }
        $(image).load(imgLoadCallback)

    };
    this.rise = function () {
        var canvas = FiPhoto.canvas,
            image = FiPhoto.image;
        function imgLoadCallback() {
            var texture = canvas.texture(image);
            canvas.draw(texture).brightnessContrast(0.05, 0.3).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).hueSaturation(-0.02, 0.3).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).sepia(0.6).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).vignette(0.12, 0.4).update();

            //FiPhoto.$con.hide();
            $('#step1Source').empty().append(canvas);
            $('#step1Source').show();
            
            FiPhoto.setHref();
        }    
        if (image.complete) {
            setTimeout(imgLoadCallback, 0)
            return;
        }
        $(image).load(imgLoadCallback)
    };
    this.hudson = function () {
        var canvas = FiPhoto.canvas,
            image = FiPhoto.image;
        function imgLoadCallback() {
            var texture = canvas.texture(image);
            canvas.draw(texture).brightnessContrast(0.15, 0.15).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).hueSaturation(0, 0.15).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).vignette(0.2, 0.5).update();

            //FiPhoto.$con.hide();
            $('#step1Source').empty().append(canvas);
            $('#step1Source').show();
            
            FiPhoto.setHref();
        }    
        if (image.complete) {
            setTimeout(imgLoadCallback, 0)
            return;
        }
        $(image).load(imgLoadCallback)
    }
    this.xpoll = function () {
        var canvas = FiPhoto.canvas,
            image = FiPhoto.image;
        function imgLoadCallback() {
            var texture = canvas.texture(image);
            canvas.draw(texture).brightnessContrast(0, 0.25).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).hueSaturation(0, 0.2).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).vignette(0, 0.5).update();

            //FiPhoto.$con.hide();
            $('#step1Source').empty().append(canvas);
            $('#step1Source').show();
            
            FiPhoto.setHref();
        }    
        if (image.complete) {
            setTimeout(imgLoadCallback, 0)
            return;
        }
        $(image).load(imgLoadCallback)
    }
    this.sierra = function () {
        var canvas = FiPhoto.canvas,
            image = FiPhoto.image;
        function imgLoadCallback() {
            var texture = canvas.texture(image);
            canvas.draw(texture).brightnessContrast(0, 0.25).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).hueSaturation(0, 0.2).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).sepia(0.4).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).vignette(0, 0.5).update();

            //FiPhoto.$con.hide();
            $('#step1Source').empty().append(canvas);
            $('#step1Source').show();
            
            FiPhoto.setHref();
        }    
        if (image.complete) {
            setTimeout(imgLoadCallback, 0)
            return;
        }
        $(image).load(imgLoadCallback)
    }
    this.inkwell = function () {
        var canvas = FiPhoto.canvas,
            image = FiPhoto.image;
        function imgLoadCallback() {
            var texture = canvas.texture(image);
            canvas.draw(texture).brightnessContrast(0.05, 0.2).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).hueSaturation(0, -1).update();
            texture = canvas.texture(canvas);
            canvas.draw(texture).vignette(0.15, 0.5).update();

            //FiPhoto.$con.hide();
            $('#step1Source').empty().append(canvas); //alert(1);console.log(canvas);
            $('#step1Source').show();
            
            FiPhoto.setHref();
        }    
        if (image.complete) {
            setTimeout(imgLoadCallback, 0)
            return;
        }
        $(image).load(imgLoadCallback)
    }

});

