var Sdk = window.Sdk || {};
(
    function () {
        this.formOnLoad = function (executionContext) {

        }

        this.PhoneOnChange = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var phoneNumber = formContext.getAttribute("telephone1").getValue();

            var expression = new RegExp("^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$");
            if (expression.test(phoneNumber)) {
                alert("enter phone is us format");
            }
        }
    }
).call(Sdk)