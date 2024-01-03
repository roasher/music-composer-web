define([],
    function () {
        var keySelector = function (container, id, defaultKey) {
            this.keys = [
                ["C", "C_MAJOR"],
                ["G", "G_MAJOR"],
                ["D", "D_MAJOR"],
                ["A", "A_MAJOR"],
                ["E", "E_MAJOR"],
                ["B", "B_MAJOR"],
                ["F#", "F_SHARP_MAJOR"],
                ["C#", "C_SHARP_MAJOR"],
                ["F", "F_MAJOR"],
                ["Bb", "B_FLAT_MAJOR"],
                ["Eb", "E_FLAT_MAJOR"],
                ["Ab", "A_FLAT_MAJOR"],
                ["Db", "D_FLAT_MAJOR"],
                ["Gb", "G_FLAT_MAJOR"],
                ["Cb", "C_FLAT_MAJOR"],
            ];

            this.key = document.createElement("select");
            this.key.id = id;

            container.appendChild(this.key);
            for (let keyNumber = 0; keyNumber < this.keys.length; keyNumber++) {
                let option = document.createElement("option");
                option.value = this.keys[keyNumber][1];
                option.text = this.keys[keyNumber][0];
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