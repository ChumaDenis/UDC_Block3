var Sdk = window.Sdk || {};

(function () {
    var filter;
    this.formOnLoad = function (executionContext) {
        var formContext = executionContext.getFormContext();

        ChangeFilterLookup(formContext);
        CarFieldObligatory(formContext);
    }
    this.onSave = function (executionContext) {
        var formContext = executionContext.getFormContext();


    }

    this.formUpdate = function (executionContext) {
        var formContext = executionContext.getFormContext();
        ChangeFilterLookup(formContext);
        CarFieldObligatory(formContext);
    }

    this.checkCarPaid = function (executionContext){
        var formContext = executionContext.getFormContext();
        var Status = formContext.getAttribute("crfe2_status").getValue();
        var Paid = formContext.getAttribute("crfe2_paid").getValue();
        if (Status != null) {
            if (Status[0]["name"] == "Renting" && Paid == false) {
                Xrm.Page.ui.setFormNotification("Car rent is not yet paid.Car cannot be rented", "ERROR", "StatusError");
            }
            else
                Xrm.Page.ui.clearFormNotification("StatusError");
        }
        else {
            Xrm.Page.ui.clearFormNotification("StatusError");
        }
       

    }

    function ChangeFilterLookup(formContext) {
        var Status = formContext.getAttribute("crfe2_status").getValue();
        if (Status == null) {
            filter = "<filter type='and'><filter type='or'><condition attribute='name' operator='eq' value='Created' /><condition attribute='name' operator='eq' value='Confirmed' /><condition attribute='name' operator='eq' value='Renting' /></filter></filter>"
        }
        else if (Status[0]["name"] == "Created") {
            filter = "<filter type='and'><filter type='or'><condition attribute='name' operator='eq' value='Confirmed'/><condition attribute='name' operator='eq' value='Renting'/><condition attribute='name' operator='eq' value='Canceled'/></filter></filter>"
        }
        else if (Status[0]["name"] == "Confirmed") {
            filter = "<filter type='and'><filter type='or'><condition attribute='name' operator='eq' value='Renting'/><condition attribute='name' operator='eq' value='Canceled'/></filter></filter>"
        }
        else if (Status[0]["name"] == "Renting") {
            filter = "<filter type='and'><condition attribute='name' operator='eq' value='Returned'/></filter>";
        }
        Xrm.Page.getControl("crfe2_status").addPreSearch(FilterLookup);
    }
    function CarFieldObligatory(formContext) {
        if (formContext.getAttribute("crfe2_status").getValue() != null) {
            var Status = formContext.getAttribute("crfe2_status").getValue()[0]["name"];
            if (Status == "Confirmed" || Status == "Renting" || Status == "Returned") {
                formContext.getAttribute("crfe2_car").setRequiredLevel("required")
            }
            else {
                formContext.getAttribute("crfe2_car").setRequiredLevel("none")
            }
        }
        else {
            formContext.getAttribute("crfe2_car").setRequiredLevel("none")
        }
        
    }
    function FilterLookup() {
        Xrm.Page.getControl("crfe2_status").addCustomFilter(filter, "bookingstatus");
    }
}).call(Sdk);