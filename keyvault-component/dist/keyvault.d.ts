import * as pulumi from "@pulumi/pulumi";
interface KeyVaultComponentArgs {
    tenantId: pulumi.Input<string>;
    resourceGroupName: pulumi.Input<string>;
    vaultName: pulumi.Input<string>;
    secrets?: {
        [key: string]: pulumi.Input<string>;
    };
}
export declare class KeyVaultComponent extends pulumi.ComponentResource {
    constructor(name: string, args: KeyVaultComponentArgs, opts?: pulumi.ComponentResourceOptions);
}
export {};
//# sourceMappingURL=keyvault.d.ts.map