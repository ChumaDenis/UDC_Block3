var Sdk = window.Sdk || {};

(function () {
    var filter;
    this.formUpdate = function (executionContext) {
        var formContext = executionContext.getFormContext();
        ChangeFilterLookup(formContext);
    }

    function ChangeFilterLookup(formContext) {
        var carClass = formContext.getAttribute("crfe2_carclass").getValue();

        console.log(carClass);
        if (carClass != null) {
            Xrm.Page.getControl("crfe2_car").setDisabled(false);
            filter = "<filter type='and'><condition attribute='crfe2_carclass' operator='eq' value='" + carClass[0]["id"] + "' uiname='" + carClass[0]["name"] + "' uitype='crfe2_carcl' /></filter>"

            Xrm.Page.getControl("crfe2_car").addPreSearch(FilterLookup);

        }
        else {
            Xrm.Page.getControl("crfe2_car").setDisabled(true);
        }
    }
    
    function FilterLookup() {
        Xrm.Page.getControl("crfe2_car").addCustomFilter(filter, "crfe2_car");
    }
}).call(Sdk);