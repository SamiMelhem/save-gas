import { query } from "./_generated/server";

// Simple query to check if the server is running
export const ping = query({
  args: {},
  handler: async () => {
    return "pong";
  },
});
