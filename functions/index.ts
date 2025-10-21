
import { onCall } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import * as path from "path";
// Set the project root so that the Next.js app can be found.
process.chdir(path.join(__dirname, ".."));

import { loanAffordabilityFlow } from "../src/ai/flows";

initializeApp();

export const loanAffordability = onCall(
  { region: "us-central1" },
  async (request) => {
    return await loanAffordabilityFlow(request.data);
  }
);
