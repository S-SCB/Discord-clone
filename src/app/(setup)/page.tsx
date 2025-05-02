import React from "react";
import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-madal";

/**
 * Setup page that's shown when a user first signs in
 * Redirects to their server if they're already a member of one
 * Otherwise shows the initial modal to create a server
 */
export default async function SetupPage() {
  try {
    // Get or create the user's profile
    const profile = await initialProfile();
    
    // Find the first server the user is a member of
    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id 
          }
        }
      }
    });

    // If the user is already a member of a server, redirect to it
    if (server) {
      return redirect(`/servers/${server.id}`);
    }

    // Otherwise, show the initial modal to create a server
    return <InitialModal />;
  } catch (error) {
    console.error("Error in SetupPage:", error);
    // Return an error component or redirect to an error page
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">Something went wrong. Please try again later.</p>
      </div>
    );
  }
}
