var Sdk = window.Sdk || {};

(function () {
    var filter;
    this.datePickUpUpdate = function (executionContext) {
        
    }

    this.reservedPickupDateTimeOnChange = function () {
        var pickupDateTime = Xrm.Page.getAttribute("crfe2_reservedpickup").getValue();
        var returnDateTime = Xrm.Page.getAttribute("crfe2_reservedhandover").getValue();
        var currentDateTime = new Date();

        if (pickupDateTime < currentDateTime) {
            Xrm.Page.getControl("crfe2_reservedpickup").getAttribute().setValue(null);
            Xrm.Page.ui.setFormNotification("Reserved pickup date/time cannot be earlier than current date.", "ERROR", "pickupDateTimeError");
            return;
        }

        if (returnDateTime != null && returnDateTime < pickupDateTime) {
            Xrm.Page.getControl("crfe2_reservedpickup").getAttribute().setValue(null);
            Xrm.Page.ui.clearFormNotification("pickupDateTimeError");
        }
    }

    this.reservedReturnDateTimeOnChange = function () {
        var pickupDateTime = Xrm.Page.getAttribute("crfe2_reservedpickup").getValue();
        var returnDateTime = Xrm.Page.getAttribute("crfe2_reservedhandover").getValue();

        if (pickupDateTime != null && returnDateTime < pickupDateTime) {
            Xrm.Page.getControl("crfe2_reservedhandover").getAttribute().setValue(null);
            Xrm.Page.ui.setFormNotification("Reserved return date/time cannot be earlier than Reserved pickup date/time.", "ERROR", "returnDateTimeError");
        }
    }
}).call(Sdk);