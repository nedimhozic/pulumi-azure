import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";

import { KeyVaultComponent } from "./components/KeyVaultComponent";

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

// Create a Key Vault using the KeyVaultComponent
const keyVaultComponent = new KeyVaultComponent("keyVault", {
    resourceGroupName: resourceGroup.name,
    vaultName: `kv-pulumi-test2-${environment}`,
    secrets: {
    "dbPassword": "supersecret",
    "apiKey": "abcdef123",
  },
});