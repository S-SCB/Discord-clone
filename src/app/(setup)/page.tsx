import React from "react";
import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-madal";

export default async function SetupPage() {
  const profile = await initialProfile();
  console.log(profile);

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {

          profileId: profile.id 
        }
      }
    }
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <InitialModal />;

}
