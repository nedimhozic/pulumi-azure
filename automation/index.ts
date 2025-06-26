import { LocalProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
import * as upath from "upath";

const run = async () => {
    console.info("initializing local workspace with dev environment");
    const args: LocalProgramArgs = {
        stackName: "dev",
        workDir: upath.joinSafe(__dirname, "..", "infra"),
    };

    // create (or select if one already exists) a stack that uses our local program
    const stack = await LocalWorkspace.createOrSelectStack(args);
    console.info("successfully initialized stack");

    console.info("setting up config");
    await stack.setConfig("azure-native:location", { value: "westeurope" });
    console.info("config set");

    console.info("refreshing stack...");
    await stack.refresh({ onOutput: console.info });
    console.info("refresh complete");

    console.info("updating stack...");
    const upRes = await stack.up({ onOutput: console.info });
    console.log(`update summary: \n${JSON.stringify(upRes.summary.resourceChanges, null, 4)}`);
};

run();
