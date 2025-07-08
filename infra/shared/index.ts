import * as containerregistry from "@pulumi/azure-native/containerregistry";
import * as resources from "@pulumi/azure-native/resources";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const location = config.require("location");

const resourceGroup = new resources.ResourceGroup("resourceGroup", {
    resourceGroupName: "rg-shared",
});

const acr = new containerregistry.Registry("sharedAcr", {
    registryName: "pulumiexampleacr",
    resourceGroupName: resourceGroup.name,
    sku: { name: "Basic" },
    adminUserEnabled: true,
});

const credentials = pulumi.all([acr.name, resourceGroup.name]).apply(([name, rg]) =>
    containerregistry.listRegistryCredentials({ 
        registryName: name, 
        resourceGroupName: rg 
    })
);
export const acrLoginServer = acr.loginServer;
export const acrUsername = credentials.apply(c => c.username!);
export const acrPassword = credentials.apply(c => c.passwords![0].value!);