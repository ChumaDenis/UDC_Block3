using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using System.Collections;

namespace UDC_block3
{
    public class SaveReport : IPlugin
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
                Entity report = (Entity)context.InputParameters["Target"];

                try
                {
                    ConditionExpression condition1 = new ConditionExpression();
                    condition1.AttributeName = "crfe2_pickupreport";
                    condition1.Operator = ConditionOperator.Equal;
                    condition1.Values.Add(report.Id);
                    ConditionExpression condition2 = new ConditionExpression();
                    condition1.AttributeName = "crfe2_returnreport";
                    condition1.Operator = ConditionOperator.Equal;
                    condition1.Values.Add(report.Id);

                    FilterExpression filter1 = new FilterExpression();
                    filter1.FilterOperator = LogicalOperator.Or;
                    filter1.Conditions.Add(condition1);
                    filter1.Conditions.Add(condition2);
                    QueryExpression query = new QueryExpression("crfe2_rent");
                    query.Criteria.AddFilter(filter1);
                    EntityCollection result1 = service.RetrieveMultiple(query);
                    if (result1.Entities.Count == 0)
                        return;
                    Entity rent = result1.Entities[0];
                    if ((int)report.Attributes["crfe2_type"] == 0)
                    {
                        report.Attributes.Add("crfe2_date", rent.Attributes["crfe2_actualpickup"]);
                    }
                    else if((int)report.Attributes["crfe2_type"] == 1)
                    {
                        report.Attributes.Add("crfe2_date",  rent.Attributes["crfe2_actualreturn"]);
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
