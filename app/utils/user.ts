import { getSession } from "./session"
import { createClient } from "./supabase/server"

export async function getUser() {
  const session = await getSession()
  if (!session) return null

  const supabase = await createClient()

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.id)
    .single()

  return user ?? null
}