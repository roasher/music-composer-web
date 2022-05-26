define(["./BachRangeSelector", "./KeySelector"],
    function (BachRangeSelector, KeySelector) {
        let composerAdjustPanel = function (container) {
            this._composerAdjustPanel = document.createElement("div");
            this._composerAdjustPanel.id = "composerAdjustPanel";
            container.appendChild(this._composerAdjustPanel);

            this.selectKey = new KeySelector(this._composerAdjustPanel, "keySelector", "C_MAJOR");
            this.selectKey.key.addEventListener("change", this.setKey.bind(this));

            this.bachRangeSelector = new BachRangeSelector(this._composerAdjustPanel, "bachRangeSelector");

            // callbacks
            this.doOnKeyChange = function () {};
        };

        composerAdjustPanel.prototype._confirmAdjustment = function () {
            this.bachRangeSelector.saveSelectedRange();
            this.bachRangeSelector.doOnRangeChange(this.bachRangeSelector.getRanges());
            this.doOnKeyChange(this.getKey());
        };

        composerAdjustPanel.prototype.setKey = function () {
            this.doOnKeyChange(this.getKey());
        };

        composerAdjustPanel.prototype.getKey = function () {
            return this.selectKey.getSelectedValue();
        };

        return composerAdjustPanel;
    });