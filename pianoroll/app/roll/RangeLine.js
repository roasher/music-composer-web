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

        RangeLine.prototype.draw = function (context, firstLineTop, secondLineTop, right, legendLeft) {
            context.beginPath();
            context.fillStyle = "black";

            context.moveTo(0, firstLineTop);
            context.lineTo(right, firstLineTop);

            context.moveTo(0, secondLineTop);
            context.lineTo(right, secondLineTop);

            context.strokeStyle = this.color;
            context.font = "20px Arial";
            context.stroke();

            context.fillStyle = Colors[this.id];
            context.fillText(this.id, legendLeft, firstLineTop);
            context.fillText(this.id, legendLeft, secondLineTop);
        };

        return RangeLine;
    }
);