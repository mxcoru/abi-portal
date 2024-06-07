"use server";

import * as featurehub from "featurehub-javascript-node-sdk";
import { AppFeatures } from "./config/feature";
import { UserRole } from "@prisma/client";

const FeatureHubConfig = new featurehub.EdgeFeatureHubConfig(
  process.env.FEATUREHUB_URL as string,
  process.env.FEATUREHUB_API_KEY as string
).init();

export const IsFeatureEnabled = async (
  featureName: AppFeatures,
  user: { id: string; role: UserRole } | null = null
) => {
  const fhContext = FeatureHubConfig.newContext();

  if (!user) {
    return fhContext.feature(featureName).enabled;
  }

  let ctx = await fhContext
    .userKey(user.id)
    .attributeValue("role", user.role)
    .build();

  return ctx.feature(featureName).enabled;
};
