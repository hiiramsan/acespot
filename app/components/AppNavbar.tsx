import { createClient } from "@/app/utils/supabase/server";
import { AppNavbarClient } from "./AppNavbarClient";
import { getUser } from "../utils/user";

export default async function AppNavbar() {
  const user = await getUser()
  return <AppNavbarClient user={user} />
}