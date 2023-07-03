var Sdk = window.Sdk || {};

(function () {
    var filter;
    this.formUpdate = function (executionContext) {
        var formContext = executionContext.getFormContext();
        ChangeDamageRequiment(formContext);
    }

    function ChangeDamageRequiment(formContext) {
        var damage = formContext.getAttribute("crfe2_damages").getValue();

        if (damage != null&&damage==true) {
            formContext.getAttribute("crfe2_damagedescription").setRequiredLevel("required")
        }
        else {
            formContext.getAttribute("crfe2_damagedescription").setRequiredLevel("none")
        }
    }

}).call(Sdk);