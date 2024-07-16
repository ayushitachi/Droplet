import express from "express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import cors from "cors";
import { KubeConfig, AppsV1Api, CoreV1Api, NetworkingV1Api } from "@kubernetes/client-node";
import {s3 , copyS3Folder} from "./aws"

const app = express();
app.use(express.json());
app.use(cors());

const kubeconfig = new KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);

// Updated utility function to handle multi-document YAML files
const readAndParseKubeYaml = (filePath: string, replId: string): Array<any> => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
        let docString = doc.toString();
        const regex = new RegExp(`service_name`, 'g');
        docString = docString.replace(regex, replId);
        console.log(docString);
        return yaml.parse(docString);
    });
    return docs;
};

async function deploymentExists(namespace: string, deploymentName: string): Promise<boolean> {
  try {
    const response = await appsV1Api.listNamespacedDeployment(namespace);
    const deployments = response.body.items;
    
    return deployments.some((deployment)  => 
      deployment !== undefined && deployment.metadata !== undefined && deployment.metadata.name === deploymentName
    );
  } catch (error) {
    console.error('Error checking deployment:', error);
    return false;
  }
}

app.post("/start", async (req, res) => {
    const { userId, replId } = req.body; // Assume a unique identifier for each user
    const namespace = "default"; // Assuming a default namespace, adjust as needed
    const depExist = await deploymentExists(namespace,replId) ;
    console.log(depExist, "Ayush deptest")
    if(depExist) return res.status(200).send({ message: "Resources created successfully" });

    try {
        const kubeManifests = readAndParseKubeYaml(path.join(__dirname, "../service.yaml"), replId);
        for (const manifest of kubeManifests) {
            switch (manifest.kind) {
                case "Deployment":
                    await appsV1Api.createNamespacedDeployment(namespace, manifest);
                    break;
                case "Service":
                    await coreV1Api.createNamespacedService(namespace, manifest);
                    break;
                case "Ingress":
                    await networkingV1Api.createNamespacedIngress(namespace, manifest);
                    break;
                default:
                    console.log(`Unsupported kind: ${manifest.kind}`);
            }
        }
        res.status(200).send({ message: "Resources created successfully" });
    } catch (error) {
        console.error("Failed to create resources", error);
        res.status(500).send({ message: "Failed to create resources" });
    }
});

    app.post("/project", async (req, res) => {
        // Hit a database to ensure this slug isn't taken already
        const { replId, language } = req.body;

        if (!replId) {
            res.status(400).send("Bad request");
            return;
        }
        // console.log(language , replId , "ayush")

        const listedObjects = await s3.listObjectsV2({
            Bucket: process.env.S3_BUCKET ?? "",
            Prefix: `code/${replId}`,
        }).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            await copyS3Folder(`base/${language}`, `code/${replId}`);
        }
        res.send("Project created");
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
