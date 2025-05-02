"use server";

import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
ababababababa
/**
 * Gets or creates a profile for the current authenticated user
 * Redirects to sign-in if no user is authenticated
 */
export const initialProfile = async () => {
  const { redirectToSignIn } = await auth();
  const user = await currentUser();
 
  if (!user) {
    // Redirect to sign-in if user is not authenticated
    return redirectToSignIn();
  }

  try {
    // Try to find an existing profile for the user
    const profile = await db.profile.findUnique({
      where: {
        userId: user.id
      }
    });

    // Return existing profile if found
    if (profile) return profile;

    // Create user's display name
    const name = user.firstName
      ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
      : user.id;
    
    // Create a new profile if one doesn't exist
    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress || ""
      }
    });

    return newProfile;
  } catch (error) {
    console.error("Error in initialProfile:", error);
    throw new Error("Failed to initialize user profile");
  }
};
