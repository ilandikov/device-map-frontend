import { initializeGlobalsForJest } from 'approvals/lib/Providers/Jest/JestSetup';

export default async function globalSetup(): Promise<void> {
    initializeGlobalsForJest();
}
