export function formatTimestamp(timestamp: string | number): string {
  if (!timestamp) return "Never Modified";

  // Handle ISO 8601 strings
  if (typeof timestamp === "string") {
    return new Date(timestamp).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";
  }

  // Handle UNIX timestamps (convert seconds to milliseconds)
  return new Date(timestamp * 1000).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";
}
