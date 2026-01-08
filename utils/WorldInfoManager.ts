import worldBookData from '../data/worldBook.json';

interface WorldInfoEntry {
    key: string[];
    keysecondary: string[];
    content: string;
    constant: boolean;
    comment?: string;
    id?: string;
}

export class WorldInfoManager {
    private static entries: Record<string, WorldInfoEntry> = (worldBookData as any).entries;

    /**
     * Provides the combined context string for the LLM based on user input.
     * It includes:
     * 1. Constant entries (always on)
     * 2. Triggered entries (based on keyword matching)
     */
    static getCombinedContext(userInput: string): string {
        const activeContent: string[] = [];
        const triggeredNames: string[] = [];

        // Helper to check if input matches keywords
        const isTriggered = (entry: WorldInfoEntry, input: string): boolean => {
            // Check primary keys
            if (entry.key && entry.key.some(k => input.toLowerCase().includes(k.toLowerCase()))) {
                return true;
            }
            // Check secondary keys
            if (entry.keysecondary && entry.keysecondary.some(k => input.toLowerCase().includes(k.toLowerCase()))) {
                return true;
            }
            return false;
        };

        // Iterate through all entries
        Object.entries(this.entries).forEach(([id, entry]) => {
            // 1. Always include constant entries
            if (entry.constant) {
                // Skip adding the raw content string if it's purely metadata or empty, 
                // but usually we want to include it.
                // We add a header for clarity
                activeContent.push(`### World Info: ${entry.comment || id}\n${entry.content}`);
            }
            // 2. triggered entries
            else if (isTriggered(entry, userInput)) {
                activeContent.push(`### World Info: ${entry.comment || id} (Triggered)\n${entry.content}`);
                triggeredNames.push(entry.comment || id);
            }
        });

        if (triggeredNames.length > 0) {
            console.log(`[WorldInfo] Triggered entries: ${triggeredNames.join(', ')}`);
        }

        return activeContent.join('\n\n');
    }
}
