using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace UDC_block3
{
    public class DuplicateCheck : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Obtain the execution context
            IPluginExecutionContext context = (IPluginExecutionContext)
              serviceProvider.GetService(typeof(IPluginExecutionContext));

            // Obtain the Organization service reference 


            // Obtain the Tracing service reference
            ITracingService tracingService =
              (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationServiceFactory serviceFactory =
            (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            if (context.InputParameters.Contains("Target") &&
                context.InputParameters["Target"] is Entity)
            {
                Entity contact = (Entity)context.InputParameters["Target"];
                
                try
                {
                    string email=string.Empty;
                    if(contact.Attributes.Contains("emailaddress1"))
                        email= contact.Attributes["emailaddress1"].ToString();

                    QueryExpression expression = new QueryExpression("contact");
                    expression.ColumnSet = new ColumnSet(new string[] { "emailaddress1" });
                    expression.Criteria.AddCondition("emailaddress1", ConditionOperator.Equal, email);

                    EntityCollection collection= service.RetrieveMultiple(expression);

                    if(collection.Entities.Count > 0)
                    {
                        throw new InvalidPluginExecutionException("Contactwith email already exist");
                    }
                }
                catch (FaultException<OrganizationServiceFault> ex)
                {
                    throw new InvalidPluginExecutionException("The following error occurred in MyPlugin.", ex);
                }
                catch (Exception ex)
                {
                    tracingService.Trace("MyPlugin: error: {0}", ex.ToString());
                    throw;
                }
            }

        }
    }
}
