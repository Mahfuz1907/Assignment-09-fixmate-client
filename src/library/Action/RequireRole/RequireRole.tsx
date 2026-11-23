import { GettingSessionFromServer } from "@/library/GettingSessions/GetSessionServer";
import { redirect } from "next/navigation";

export const RequireRole = async (role: string) => {
  const session = await GettingSessionFromServer();
  if (!session || session?.user?.role !== role) {
    redirect("/unauthorized");
  }
};
