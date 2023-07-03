var Sdk = window.Sdk || {};

(function () {
    this.OnLoad = function (executionContext) {
        var formContext = executionContext.getFormContext();
        //console.log(formContext.getControl("price"));

        formContext.getControl("crfe2_price").setDisabled(true);
    }

    this.onLoadForm = function (executionContext){
        Xrm.Page.getAttribute("crfe2_carclass").addOnChange(calculatePriceOnChange);
        Xrm.Page.getAttribute("crfe2_reservedpickup").addOnChange(calculatePriceOnChange);
        Xrm.Page.getAttribute("crfe2_reservedhandover").addOnChange(calculatePriceOnChange);
        Xrm.Page.getAttribute("crfe2_pickuplocation").addOnChange(calculatePriceOnChange);
        Xrm.Page.getAttribute("crfe2_returnlocation").addOnChange(calculatePriceOnChange);

        
    }
    function calculatePriceOnChange() {
        var carClass = Xrm.Page.getAttribute("crfe2_carclass").getValue();
        var carClassPrice;
        if (carClass != null)
            Xrm.WebApi.retrieveRecord("crfe2_carcl", carClass[0]["id"], "?$select=crfe2_price").then(
                function success(result) {
                    console.log(result)
                    carClassPrice = result["crfe2_price"];
                    var startDate = Xrm.Page.getAttribute("crfe2_reservedpickup").getValue();
                    var endDate = Xrm.Page.getAttribute("crfe2_reservedhandover").getValue();
                    var pickupLocation = Xrm.Page.getAttribute("crfe2_pickuplocation").getValue();
                    var returnLocation = Xrm.Page.getAttribute("crfe2_returnlocation").getValue();
                    var priceField = Xrm.Page.getAttribute("crfe2_price");

                    if (carClassPrice != null && startDate != null && endDate != null && priceField != null) {
                        var differenceInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                        var price = carClassPrice * differenceInDays + 100;

                        if (pickupLocation != 2) {
                            price += 100;
                        }

                        if (returnLocation != 2) {
                            price += 100;
                        }

                        priceField.setValue(price);
                    }
                },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );
        
    }

}).call(Sdk);