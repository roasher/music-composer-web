define(["data/Colors"],
    function (Colors) {

        var RangeLine = function (rangeLine, displayOptions) {

            this.id = rangeLine.voice.id;
            this.color = Colors[rangeLine.partNumber];

            // first note
            this.lowerNote = rangeLine.lastSavedRange.lowerNote;
            var top1 =  (displayOptions.max - displayOptions.min) * (1 - (this.lowerNote - displayOptions.min) / (displayOptions.max - displayOptions.min));
            top1 *=  displayOptions.noteHeight - 2;
            this.top1 = top1 * 2;

            // second note
            this.upperNote = rangeLine.lastSavedRange.upperNote;
            var top2 =  (displayOptions.max - displayOptions.min) * (1 - (this.upperNote - displayOptions.min) / (displayOptions.max - displayOptions.min));
            top2 *=  displayOptions.noteHeight - 2;
            this.top2 = top2 * 2;
        };

        RangeLine.prototype.draw = function (context, coordinateOfLegend, right) {
            context.beginPath();
            context.fillStyle = "black";


            context.moveTo(0, this.top1);
            context.lineTo(right, this.top1);

            context.moveTo(0, this.top2);
            context.lineTo(right, this.top2);

            context.strokeStyle = this.color;
            context.font = "20px Arial";
            context.stroke();

            context.fillStyle = Colors[this.id];
            context.fillText(this.id, coordinateOfLegend, this.top1);
            context.fillText(this.id, coordinateOfLegend, this.top2);
        };

        return RangeLine;
    }
);