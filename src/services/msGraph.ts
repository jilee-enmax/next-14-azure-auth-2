"use server";

import { Client } from "@microsoft/microsoft-graph-client";

const initializeGraphClient = (accessToken: string) => {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
};

export async function getUserDetails(accessToken: string) {
  try {
    const client = initializeGraphClient(accessToken);

    // Request additional fields: account status, password policies, mobile phone, and id (oid)
    const userDetails = await client
      .api("/me")
      .select("displayName,mail,userPrincipalName,lastPasswordChangeDateTime,accountEnabled,mobilePhone,passwordPolicies,id")
      .get();

    return userDetails;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}
