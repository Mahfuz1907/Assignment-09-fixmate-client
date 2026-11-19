import { useSession } from "@/lib/auth-client";

export const GettingSessionFromClient = () => {
  const { data: session } = useSession();
  return session;
};
