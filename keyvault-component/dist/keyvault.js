"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyVaultComponent = void 0;
const pulumi = require("@pulumi/pulumi");
const azure = require("@pulumi/azure-native");
class KeyVaultComponent extends pulumi.ComponentResource {
    constructor(name, args, opts) {
        super("custom:component:KeyVaultComponent", name, {}, opts);
        const kv = new azure.keyvault.Vault(name, {
            vaultName: args.vaultName,
            resourceGroupName: args.resourceGroupName,
            properties: {
                tenantId: args.tenantId,
                enableRbacAuthorization: true,
                enableSoftDelete: true,
                enabledForDeployment: false,
                enabledForDiskEncryption: false,
                enabledForTemplateDeployment: false,
                networkAcls: {
                    bypass: azure.keyvault.NetworkRuleBypassOptions.None,
                    defaultAction: azure.keyvault.NetworkRuleAction.Allow,
                },
                publicNetworkAccess: azure.keyvault.PublicNetworkAccess.Enabled,
                sku: {
                    family: azure.keyvault.SkuFamily.A,
                    name: azure.keyvault.SkuName.Standard,
                },
                softDeleteRetentionInDays: 90,
            },
        }, {
            parent: this,
            protect: true,
        });
        if (args.secrets) {
            Object.entries(args.secrets).forEach(([secretName, value]) => {
                new azure.keyvault.Secret(secretName, {
                    vaultName: kv.name,
                    resourceGroupName: args.resourceGroupName,
                    properties: {
                        value,
                    },
                }, {
                    parent: this
                });
            });
        }
        this.registerOutputs();
    }
}
exports.KeyVaultComponent = KeyVaultComponent;
//# sourceMappingURL=keyvault.js.map