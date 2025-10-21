import { onCall } from 'firebase-functions/v2/https';
import { loanAffordabilityFlow } from './index';

// This is the only export that Firebase will analyze.
export const loanAffordability = onCall(
  { region: 'us-central1' },
  async (request) => {
    // The core logic is initialized and called from the other file.
    return await loanAffordabilityFlow(request.data);
  }
);
