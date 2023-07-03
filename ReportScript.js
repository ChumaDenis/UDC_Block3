var Sdk = window.Sdk || {};

(function () {
    this.createPickupButtonClick = function (){
        

        //var entityName = "crfe2_cartransferreport"; // Logical name of the Pickup Report entity

        //var parameters = {};
        //parameters["crfe2_rentids"] = parent.Xrm.Page.data.entity.getId(); // Set the parent customer lookup field
        //console.log("createPickupButtonClick");

        //parent.Xrm.Utility.openQuickCreate(entityName, null, parameters).then(
        //    function (entityReference) {
        //        // Callback function after the Quick Create form is closed
        //        if (entityReference !== null) {
        //            console.log("createPickupButtonClickTrue");
        //            // A new record was created and the user clicked Save
        //            var pickupReportLookup = [{
        //                id: entityReference.id,
        //                entityType: entityReference.entityType,
        //                name: entityReference.name
        //            }];
        //            parent.Xrm.Page.getAttribute("crfe2_pickupreport").setValue(pickupReportLookup);
        //        } else {
        //            // The user closed the Quick Create form without saving a new record
        //        }
        //    },
        //    function (error) {
        //        console.log("createPickupButtonClickFalse");
        //        console.log(error.message);
        //    }
        //);



        var thisAccount = {
            entityType: "account",
            id: Xrm.Page.data.entity.getId()
        };
        var callback = function (obj) {
            console.log("Created new " + obj.savedEntityReference.entityType + " named '" + obj.savedEntityReference.name + "' with id:" +
                obj.savedEntityReference.id);
        }
        var setName = { firstname: "Contact Name for " + Xrm.Page.getAttribute("name").getValue() };
        Xrm.Utility.openQuickCreate("contact", thisAccount, setName).then(callback, function (error) {
            console.log(error.message);
        });


    }
        
    

}).call(Sdk);