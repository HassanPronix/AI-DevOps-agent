import crypto from "crypto";

import { embeddings } from "./embeddings";

import { getIncidentCollection }
    from "./incidentCollection";

import { buildIncidentDocument }
    from "./buildIncidentDocument";

type StoreIncidentInput = {
    logs?: string;
    service?: string;
    hypotheses?: string[];
    fixPlan?: string[];
};

export async function storeIncident(
    data: StoreIncidentInput
) {
    const collection =
        await getIncidentCollection();

    const document =
        buildIncidentDocument(data);

    const embedding =
        await embeddings.embedQuery(document);

    await collection.add({
        ids: [crypto.randomUUID()],

        embeddings: [embedding],

        documents: [document],

        metadatas: [
            {
                service: data.service || "unknown",
            },
        ],
    });
}