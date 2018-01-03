define(["data/Colors"],
    function (Colors) {

        var RangeLine = function (rangeLine) {

            this.id = rangeLine.voice.id;
            this.color = Colors[rangeLine.partNumber];

            // first note
            this.lowerNote = rangeLine.lastSavedRange.lowerNote;
            // second note
            this.upperNote = rangeLine.lastSavedRange.upperNote;

        };

        RangeLine.prototype.draw = function (context, coordinateOfLegend, right, displayOptions) {
            context.beginPath();
            context.fillStyle = "black";

            var top1 =  displayOptions.max - this.lowerNote;
            top1 *=  displayOptions.noteHeight - 2;
            top1 = top1 * 2;

            var top2 =  displayOptions.max - this.upperNote;
            top2 *=  displayOptions.noteHeight - 2;
            top2 = top2 * 2;

            context.moveTo(0, top1);
            context.lineTo(right, top1);

            context.moveTo(0, top2);
            context.lineTo(right, top2);

            context.strokeStyle = this.color;
            context.font = "20px Arial";
            context.stroke();

            context.fillStyle = Colors[this.id];
            context.fillText(this.id, coordinateOfLegend, top1);
            context.fillText(this.id, coordinateOfLegend, top2);
        };

        return RangeLine;
    }
);