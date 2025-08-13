import Cerebras from "@cerebras/cerebras_cloud_sdk";

export const client = new Cerebras({
  apiKey: import.meta.env.VITE_CEREBRAS_API_KEY, // This is the default and can be omitted
});
