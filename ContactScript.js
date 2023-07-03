function DisplayHelloWorld(executionContext) {
    var formContext = executionContext.getFormContext()
    console.log("Hello ");
    var firstName = formContext.getAttribute("firstname").getValue();
    alert("Hello " + firstName);
    
}