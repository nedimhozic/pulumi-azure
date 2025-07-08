import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as web from "@pulumi/azure-native/web";

import { KeyVaultComponent } from "@nedimhozic/pulumi-azure-keyvault";

const config = new pulumi.Config();
const environment = config.require("env");
const storageAccountTier = config.require("storageAccountTier");
const tenantId = config.require("tenantId");

const shared = new pulumi.StackReference("nedimhozic/shared/shared");
const acrLoginServer = shared.getOutput("acrLoginServer");
const acrUsername = shared.getOutput("acrUsername");
const acrPassword = shared.getOutput("acrPassword");

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
    tenantId,
    resourceGroupName: resourceGroup.name,
    vaultName: `kv-pulumi-test2-${environment}`,
    secrets: {
    "dbPassword": "supersecret",
    "apiKey": "abcdef123",
  },
});

// Create a simple App Service Plan
const plan = new web.AppServicePlan("appServicePlan", {
    resourceGroupName: resourceGroup.name,
    name: `asp-pulumitest-${environment}`,
    kind: "Linux",
    reserved: true,
    sku: {
        name: "B1",
        tier: "Basic",
    },
});

// Create a Web App that pulls from the shared ACR
const app = new web.WebApp("webApp", {
    resourceGroupName: resourceGroup.name,
    serverFarmId: plan.id,
    name: `webapp-pulumitest-${environment}`,
    siteConfig: {
        linuxFxVersion: acrLoginServer.apply(server => `DOCKER|${server}/myapp:latest`),
        appSettings: [
            { name: "DOCKER_REGISTRY_SERVER_URL", value: acrLoginServer },
            { name: "DOCKER_REGISTRY_SERVER_USERNAME", value: acrUsername },
            { name: "DOCKER_REGISTRY_SERVER_PASSWORD", value: acrPassword },
        ],
    },
});