define([],
    function () {
        var noteSelector = function (container, id) {
            var array = ["Volvo", "Saab", "Mercades", "Audi", "Volvo", "Saab", "Mercades", "Audi", "Volvo", "Saab", "Mercades", "Audi"];

            this.voice = document.createElement("select");
            this.voice.multiple = true;
            this.voice.id = id;
            container.appendChild(this.voice);
            for (var noteNumber = 0; noteNumber < array.length; noteNumber++) {
                var option = document.createElement("option");
                option.value = array[noteNumber];
                option.text = array[noteNumber];
                this.voice.appendChild(option);
            }
        };

        return noteSelector;
    });