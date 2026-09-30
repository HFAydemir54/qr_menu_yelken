import { publicClient } from "@/lib/supabase";

/**
 * Supabase ücretsiz planı 7 gün istek almayan projeyi duraklatır.
 * Vercel Cron bu route'u günde bir çağırır (bkz. vercel.json).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { error } = await publicClient().from("categories").select("id").limit(1);
  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true, at: new Date().toISOString() });
}
