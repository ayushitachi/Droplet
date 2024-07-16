import * as k8s from '@kubernetes/client-node';

export async function deleteResources(name: string, namespace: string = 'default'): Promise<void> {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);
  const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
  const networkingV1Api = kc.makeApiClient(k8s.NetworkingV1Api);

  try {
    await coreV1Api.deleteNamespacedService(name, namespace);
    await networkingV1Api.deleteNamespacedIngress(name, namespace);
    await appsV1Api.deleteNamespacedDeployment(name, namespace);
    console.log(`Successfully deleted deployment, service, and ingress named "${name}"`);
  } catch (error) {
    console.error('Error deleting resources:', error);
    throw error; // Re-throw the error for the caller to handle if needed
  }
}