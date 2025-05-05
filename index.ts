import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";

const config = new pulumi.Config();
const environment = config.require("env");
const storageAccountTier = config.require("storageAccountTier");

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("resourceGroup", {
    resourceGroupName: `rg-${environment}`,
});

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("sa", {
    accountName: `sapulumitest${environment}`,
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storageAccountTier,
    },
    kind: storage.Kind.StorageV2,
});