$(document).ready(function() {
    var loading = $("#loading")
    loading.hide();
    var predictionMsg = $("#predictionMessage")
    var predictionPerc = $("#predictionPercentage")
    var card = $("#specialCard")

    function validInputs() {
        size = parseInt($('#InputSize').val())
        if (!((size >= 1) && (size <= 7))) {
            return false
        }

        distance = parseInt($("#InputDistance").val())
        if (!((distance >= 10) && (distance <= 190))) {
            return false
        }

        desibel = parseInt($("#InputDesibel").val())
        if (!((desibel >= 72) && (desibel <= 113))) {
            return false
        }

        airflow = parseFloat($("#InputAirflow").val())
        if (!((airflow >= 0) && (airflow <= 17))) {
            return false
        }

        frequency = parseInt($("#InputFrequency").val())
        if (!((frequency >= 1) && (frequency <= 75))) {
            return false
        }

        return true
    }   

    function hideMessages() {
        predictionMsg.hide();
        predictionPerc.hide();

        predictionMsg.removeClass("text-success")
        predictionMsg.removeClass("text-warning")
    }
    hideMessages();

    function changeButton(selector, state, opacity) {
        button = $(selector)
        button.prop('disabled', state);
        button.css('opacity', opacity);
    }

    changeButton("#reset", true, '0.7');

    $("#reset").click(function() {
        loading.hide();
        changeButton("#reset", true, '0.7');

        $('#InputSize').val("1")
        $("#InputFuel").val("gasoline")
        $("#InputDistance").val("10")
        $("#InputDesibel").val("72")     
        $("#InputAirflow").val("0")
        $("#InputFrequency").val("1")

        hideMessages()
        document.body.className = "baseColor";

        card.removeClass("nonExtinctionColor")
        card.removeClass("extinctionColor")
        card.addClass("baseColor")
    });

    $("#predict").click(function() {
        loading.show();
        changeButton("#reset", false, '1');
        changeButton("#predict", true, '0.7');

        areValids = validInputs()
        if (areValids) {
            var URL = "https://acousticextinguisherfireapi.herokuapp.com/predict";

            var data = {
                size: parseInt($('#InputSize').val()),
                fuel: $("#InputFuel").val(),
                distance: parseInt($("#InputDistance").val()),
                desibel: parseInt($("#InputDesibel").val()),
                airflow: parseFloat($("#InputAirflow").val()),
                frequency: parseInt($("#InputFrequency").val())
            };
    
            $.ajax({
                type: 'POST',
                url: URL,
                data: JSON.stringify(data),
                dataType: 'json',           
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json',
                },
                success: function (result) {
                    loading.hide();
                    changeButton("#predict", false, '1');
                    displayMessage(result);
                },
                
                error: function (xhr, status) {
                    alert("error");
                    changeButton("#predict", false, '1');
                    loading.hide();
                },
                async:true
            })   
        } else {
            alert("Invalid inputs")
            loading.hide();
            changeButton("#predict", false, '1');
        }       
    });

    function displayMessage(result) {
        predictionMsg.text("Prediction: " + result.prediction_status);
        predictionPerc.text("Probability: " + result.probability_percentage);

        predictionMsg.show();
        predictionPerc.show();

        resultPred = parseInt(result.prediction)
        if (resultPred == 0) {
            document.body.className = "nonExtinctionColor";
            card.removeClass("extinctionColor")
            card.addClass("nonExtinctionColor")
        } else if (resultPred == 1) {
            document.body.className = "extinctionColor";
            card.removeClass("nonExtinctionColor")
            card.addClass("extinctionColor")
        } else {
            document.body.className = "baseColor";
            card.addClass("baseColor")
        }
    }
});
