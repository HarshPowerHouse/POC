using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace POCAutoNumber.Plugin
{
    public class AutoNumber : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            try
            {
                IPluginExecutionContext context = (Microsoft.Xrm.Sdk.IPluginExecutionContext)serviceProvider.GetService(typeof(Microsoft.Xrm.Sdk.IPluginExecutionContext));
                IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);
                ITracingService tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {
                    if (context.MessageName.ToLower() != "create" && context.Stage != 20)
                    {
                        return;
                    }

                    Entity TargetEnt = context.InputParameters["Target"] as Entity;
                    Entity AutoNumber = new Entity("poc_configuration");
                    StringBuilder AutNumber = new StringBuilder();
                    string prefix, suffix, separator, currentNumber;

                    QueryExpression qeAutoNumber = new QueryExpression()
                    {
                        EntityName = "poc_configuration",
                        ColumnSet = new ColumnSet(true)
                    };
                    EntityCollection ecConfig = service.RetrieveMultiple(qeAutoNumber);

                    if (ecConfig.Entities.Count == 0)
                    {
                        return;
                    }

                    foreach (Entity ent in ecConfig.Entities)
                    {
                        if (ent.Attributes["poc_name"].ToString() == "AutoNumberPOC")
                        {
                            prefix = ent.GetAttributeValue<string>("poc_prefix");
                            suffix = ent.GetAttributeValue<string>("poc_suffix");
                            currentNumber = ent.GetAttributeValue<string>("poc_currentnumber");
                            separator = ent.GetAttributeValue<string>("poc_separator");

                            int tempCurrent = int.Parse(currentNumber);
                            tempCurrent++;
                            currentNumber = tempCurrent.ToString("0000");

                            AutoNumber.Id = ent.Id;
                            AutoNumber["poc_currentnumber"] = currentNumber;
                            service.Update(AutoNumber);

                            AutNumber.Append($"{prefix}{separator}{suffix}{separator}{currentNumber}");
                            break;
                        }
                    }

                    TargetEnt["poc_autonumber"] = AutNumber.ToString();
                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }

        }
    }
}
