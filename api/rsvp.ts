import { neon } from "@neondatabase/serverless";

export const config = {
  runtime: "edge",
};

interface RSVPRow {
  id?: number;
  eventType: string;
  groupKey: string;
  email: string;
  message: string;
  responses: string;
}

export default async function handler(req: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(
      JSON.stringify({ error: "Database not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const sql = neon(databaseUrl);

  if (req.method === "GET") {
    try {
      const url = new URL(req.url);
      const groupKey = url.searchParams.get("groupKey");
      const eventType = url.searchParams.get("eventType");

      if (!groupKey || !eventType) {
        return new Response(
          JSON.stringify({ error: "groupKey and eventType are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await sql`
        SELECT id, event_type, group_key, email, message, responses
        FROM rsvps
        WHERE group_key = ${groupKey} AND event_type = ${eventType}
        ORDER BY created_at DESC
        LIMIT 1
      `;

      return new Response(
        JSON.stringify({ rsvp: result.length > 0 ? result[0] : null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("RSVP lookup error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to look up RSVP" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const text = await req.text();
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Empty request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = JSON.parse(text);
    const { row }: { row: RSVPRow } = body;

    if (!row || !row.groupKey || !row.email || !row.eventType) {
      return new Response(
        JSON.stringify({ error: "Group key, email, and event type are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (row.id) {
      await sql`
        UPDATE rsvps
        SET email = ${row.email}, message = ${row.message ?? ""}, responses = ${row.responses ?? "[]"}
        WHERE id = ${row.id}
      `;
    } else {
      await sql`
        INSERT INTO rsvps (event_type, group_key, email, message, responses)
        VALUES (${row.eventType}, ${row.groupKey}, ${row.email}, ${row.message ?? ""}, ${row.responses ?? "[]"})
      `;
    }

    return new Response(
      JSON.stringify({ success: true, message: "RSVP received" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("RSVP error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save RSVP" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
