import { chroma } from "./chroma";

export async function getIncidentCollection() {
    
    return await chroma.getOrCreateCollection({
        name: "incident-memory",
    });
}