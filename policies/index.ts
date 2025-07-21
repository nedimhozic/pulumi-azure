import * as azure from "@pulumi/azure-native";
import { PolicyPack, validateResourceOfType } from "@pulumi/policy";

new PolicyPack("azure-typescript", {
    policies: [{
        name: "storage-container-no-public-read",
        description: "Prohibits setting the public permission on Azure Storage Blob Containers.",
        enforcementLevel: "mandatory",
        validateResource: validateResourceOfType(azure.storage.BlobContainer, (container, args, reportViolation) => {
            if (container.publicAccess === "Blob" || container.publicAccess === "Container") {
                reportViolation(
                    "Azure Storage Container must not have blob or container access set. " +
                    "Read more about read access here: " +
                    "https://docs.microsoft.com/en-us/azure/storage/blobs/storage-manage-access-to-resources");
            }
        }),
    },
    {
        name: "require-project-tag",
        description: "Enforces that all Azure resources have a 'Project' tag.",
        enforcementLevel: "mandatory",
        validateResource: (args, reportViolation) => {
            const tags = args.props.tags;
            
            if (!tags || typeof tags !== "object") {
                reportViolation(`Resource '${args.props.name || args.name || 'unnamed'}' of type '${args.type}' must have tags defined.`);
                return;
            }
            
            const hasProjectTag = Object.keys(tags).some(key => 
                key.toLowerCase() === "project"
            );
            
            if (!hasProjectTag) {
                reportViolation(
                    `Resource '${args.props.name || args.name || 'unnamed'}' of type '${args.type}' must have a 'Project' tag.`
                );
            }
        }
    }],
});
