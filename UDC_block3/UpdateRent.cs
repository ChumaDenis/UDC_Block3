using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace UDC_block3
{
    public class UpdateRent : IPlugin
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
                Entity rent = (Entity)context.InputParameters["Target"];

                try
                {
                    if (rent.Attributes.Contains("ownerid"))
                    {
                        var status = rent.GetAttributeValue<EntityReference>("crfe2_status").Name;
                        if (status == "Renting")
                        {
                            Guid ownerId = rent.GetAttributeValue<EntityReference>("ownerid").Id;

                            // Query for existing rent records in the "Renting" status for the same owner

                            ConditionExpression condition1 = new ConditionExpression();
                            condition1.AttributeName = "ownerid";
                            condition1.Operator = ConditionOperator.Equal;
                            condition1.Values.Add(ownerId.ToString());

                            FilterExpression filter1 = new FilterExpression();
                            filter1.Conditions.Add(condition1);

                            ConditionExpression condition2 = new ConditionExpression();
                            condition2.AttributeName = "crfe2_status";
                            condition2.Operator = ConditionOperator.Equal;
                            condition2.Values.Add(rent.GetAttributeValue<EntityReference>("crfe2_status"));

                            filter1.Conditions.Add(condition2);
                            QueryExpression query = new QueryExpression("crfe2_rent");
                            query.Criteria.AddFilter(filter1);

                            EntityCollection result1 = service.RetrieveMultiple(query);

                            var result2 = service.RetrieveMultiple(query);

                            
                            if (rent.GetAttributeValue<EntityReference>("crfe2_pickupreport") != null)
                            {
                                ConditionExpression condition3 = new ConditionExpression();
                                condition3.AttributeName = "crfe2_cartransferreportid";
                                condition3.Operator = ConditionOperator.Equal;
                                condition3.Values.Add(rent.GetAttributeValue<EntityReference>("crfe2_pickupreport").Id);
                                FilterExpression filter = new FilterExpression();
                                filter.Conditions.Add(condition1);
                                QueryExpression query1 = new QueryExpression("crfe2_cartransferreport");
                                query.Criteria.AddFilter(filter1);
                                EntityCollection result3 = service.RetrieveMultiple(query1);
                                if (result3.Entities.Count==0) 
                                    return;
                                Entity report= result3.Entities[0];
                                report.Attributes["crfe2_type"] = 0;
                                service.Update(report);
                            }
                            if(rent.GetAttributeValue<EntityReference>("crfe2_returnreport") != null)
                            {
                                ConditionExpression condition3 = new ConditionExpression();
                                condition3.AttributeName = "crfe2_cartransferreportid";
                                condition3.Operator = ConditionOperator.Equal;
                                condition3.Values.Add(rent.GetAttributeValue<EntityReference>("crfe2_pickupreport").Id);
                                FilterExpression filter = new FilterExpression();
                                filter.Conditions.Add(condition1);
                                QueryExpression query1 = new QueryExpression("crfe2_cartransferreport");
                                query.Criteria.AddFilter(filter1);
                                EntityCollection result3 = service.RetrieveMultiple(query1);
                                if (result3.Entities.Count == 0)
                                    return;
                                Entity report = result3.Entities[0];
                                report.Attributes["crfe2_type"] = 1;
                                service.Update(report);
                            }
                            

                            if (result2.Entities.Count >=10 )
                            {
                                throw new InvalidPluginExecutionException("You have reached the maximum limit of 10 rents in the 'Renting' status.");
                            }
                        }
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
