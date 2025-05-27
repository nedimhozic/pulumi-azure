import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as keyvault from "@pulumi/azure-native/keyvault";

const config = new pulumi.Config();
const environment = config.require("env");
const storageAccountTier = config.require("storageAccountTier");
const tenantId = config.require("tenantId");

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

const keyVault = new keyvault.Vault("keyVault", {
    properties: {
        enableRbacAuthorization: true,
        enableSoftDelete: true,
        enabledForDeployment: false,
        enabledForDiskEncryption: false,
        enabledForTemplateDeployment: false,
        networkAcls: {
            bypass: keyvault.NetworkRuleBypassOptions.None,
            defaultAction: keyvault.NetworkRuleAction.Allow,
        },
        publicNetworkAccess: "Enabled",
        sku: {
            family: keyvault.SkuFamily.A,
            name: keyvault.SkuName["Standard"],
        },
        softDeleteRetentionInDays: 90,
        tenantId,
    },
    resourceGroupName: resourceGroup.name,
    vaultName: `kv-pulumi-test-${environment}`
}, {
    protect: true,
});