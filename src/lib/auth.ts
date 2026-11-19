import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("fixmate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true,
      },
      phone: {
        type: "string",
        input: false,
      },
      area: {
        type: "string",
        input: false,
      },
      bio: {
        type: "string",
        input: false,
      },
    },
  },
});
