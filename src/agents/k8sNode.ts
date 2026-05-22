import type { IncidentState } from "../types/incident";

import {
    getPods,
    getEvents,
} from "../k8s/tools";

export async function k8sInspectionNode(state: IncidentState) {
   
    console.log(state)
    const pods = await getPods(state.namespace);

    const events = await getEvents(state.namespace);

    return {
        clusterContext: {
            pods,
            events,
        },
    };
}