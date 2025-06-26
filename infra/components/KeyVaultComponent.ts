import * as pulumi from "@pulumi/pulumi";
import * as keyvault from "@pulumi/azure-native/keyvault";

const config = new pulumi.Config();
const tenantId = config.require("tenantId");

interface KeyVaultComponentArgs {
    resourceGroupName: pulumi.Input<string>;
    vaultName: pulumi.Input<string>;
    secrets?: { [key: string]: pulumi.Input<string> };
}

export class KeyVaultComponent extends pulumi.ComponentResource {

    constructor(name: string, args: KeyVaultComponentArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:component:KeyVaultComponent", name, {}, opts);

        const kv = new keyvault.Vault(name, {
            vaultName: args.vaultName,
            resourceGroupName: args.resourceGroupName,
            properties: {
                tenantId,
                enableRbacAuthorization: true,
                enableSoftDelete: true,
                enabledForDeployment: false,
                enabledForDiskEncryption: false,
                enabledForTemplateDeployment: false,
                networkAcls: {
                    bypass: keyvault.NetworkRuleBypassOptions.None,
                    defaultAction: keyvault.NetworkRuleAction.Allow,
                },
                publicNetworkAccess: keyvault.PublicNetworkAccess.Enabled,
                sku: {
                    family: keyvault.SkuFamily.A,
                    name: keyvault.SkuName.Standard,
                },
                softDeleteRetentionInDays: 90,
            },
        }, {
            parent: this,
            protect: true,
        });

        if (args.secrets) {
            Object.entries(args.secrets).forEach(([secretName, value]) => {
                new keyvault.Secret(secretName, {
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