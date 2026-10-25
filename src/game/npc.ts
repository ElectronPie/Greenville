// src/game/NPC.ts
export interface INPCData {
    smallImage: string;
    closeUpImage: string;
    diagnosis: string;
    dialogue: string[];
}

export class NPC {
    constructor(
        public id: string, // Ключ из JSON (например, "doctor")
        public data: INPCData
    ) {}
}