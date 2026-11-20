import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

// Dev mode e hot reload e jate bar bar notun connection na khule
const globalForMongo = globalThis;
const client =
  globalForMongo._mongoClient ?? new MongoClient(process.env.MONGODB_URI);
if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}
const db = client.db(process.env.DB_NAME || "fixmate");

const ALLOWED_SIGNUP_ROLES = ["customer", "technician"];

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL].filter(Boolean),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, defaultValue: "" },
      area: { type: "string", required: false, defaultValue: "" },
      bio: { type: "string", required: false, defaultValue: "" },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Requirement: admin sign up kora jabe na. 'customer' ba 'technician' chhara kichu hole 'customer' save hobe.
        before: async (user) => ({
          data: {
            ...user,
            role: ALLOWED_SIGNUP_ROLES.includes(user.role) ? user.role : "customer",
          },
        }),
      },
      update: {
        // Keu profile update kore nijer role bodlate parbe na.
        // Role shudhu admin API (Express) diye bodlabe.
        before: async (data) => {
          const { role, ...rest } = data;
          return { data: rest };
        },
      },
    },
  },

  plugins: [ jwt(),nextCookies()],
});