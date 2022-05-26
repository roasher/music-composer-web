define([],
    function () {
        var keySelector = function (container, id, defaultKey) {
            this.keys = [
                "C_MAJOR",
                "G_MAJOR",
                "D_MAJOR",
                "A_MAJOR",
                "E_MAJOR",
                "B_MAJOR",
                "F_SHARP_MAJOR",
                "C_SHARP_MAJOR",
                "F_MAJOR",
                "B_FLAT_MAJOR",
                "E_FLAT_MAJOR",
                "A_FLAT_MAJOR",
                "D_FLAT_MAJOR",
                "G_FLAT_MAJOR",
                "C_FLAT_MAJOR",
            ];

            this.key = document.createElement("select");
            this.key.id = id;

            container.appendChild(this.key);
            for (let keyNumber = 0; keyNumber < this.keys.length; keyNumber++) {
                let option = document.createElement("option");
                option.value = this.keys[keyNumber];
                option.text = this.keys[keyNumber];
                if (option.value === defaultKey) {
                    option.selected = true;
                }
                this.key.appendChild(option);
            }
        };

        keySelector.prototype.getSelectedValue = function () {
            return this.key.value;
        };

        return keySelector;
    });