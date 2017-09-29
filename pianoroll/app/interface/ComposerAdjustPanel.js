define(["./NoteSelector"],
    function (NoteSelector) {
        var composerAdjustPanel = function (container) {
            this._composerAdjustPanel = document.createElement("div");
            this._composerAdjustPanel.id = "composerAdjustPanel";
            container.appendChild(this._composerAdjustPanel);
            this.selectVoice1 = new NoteSelector(this._composerAdjustPanel, "selectVoice1");
            // this.selectVoice2 = new NoteSelector(this._composerAdjustPanel, "selectVoice2");
            // this.selectVoice3 = new NoteSelector(this._composerAdjustPanel, "selectVoice3");
            // this.selectVoice4 = new NoteSelector(this._composerAdjustPanel, "selectVoice4");
        };

        return composerAdjustPanel;
    });