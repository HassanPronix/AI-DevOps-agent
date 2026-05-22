import { embeddings } from "./embeddings";
import { getIncidentCollection } from "./incidentCollection";
import crypto from "crypto";

type StoreIncidentInput = {
    logs: string;
    service?: string;
    resolution?: string;
};

export async function storeIncident(data: StoreIncidentInput) {
    
    const collection = await getIncidentCollection();

    const embedding = await embeddings.embedQuery(data.logs);

    await collection.add({
        ids: [crypto.randomUUID()],
        embeddings: [embedding],
        documents: [data.logs],
        metadatas: [
            {
                service: data.service || "unknown",
                resolution: data.resolution || "",
            },
        ],
    });
}