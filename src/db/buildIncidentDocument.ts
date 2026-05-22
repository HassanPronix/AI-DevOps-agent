type BuildIncidentDocumentInput = {
    service?: string;
    logs?: string;
    hypotheses?: string[];
    fixPlan?: string[];
};

export function buildIncidentDocument(data: BuildIncidentDocumentInput) {
    return `
            SERVICE:
            ${data.service || "unknown"}
            
            RAW LOGS:
            ${data.logs || ""}
            
            ROOT CAUSE HYPOTHESES:
            ${data.hypotheses?.join("\n") || ""}
            
            FIX PLAN:
            ${data.fixPlan?.join("\n") || ""}
            `;
}