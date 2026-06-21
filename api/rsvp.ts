import { neon } from "@neondatabase/serverless";

export const config = {
  runtime: "edge",
};

interface RSVPRow {
  id?: number;
  name: string;
  email: string;
  attending: boolean;
  preWedding: boolean;
  message: string;
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
      const name = url.searchParams.get("name");
      const email = url.searchParams.get("email");

      if (!name) {
        return new Response(
          JSON.stringify({ error: "Name parameter is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      let result;
      if (email) {
        result = await sql`
          SELECT id, name, email, attending, pre_wedding, message
          FROM rsvps
          WHERE name = ${name} AND email = ${email}
          ORDER BY created_at DESC
        `;
      } else {
        result = await sql`
          SELECT id, name, email, attending, pre_wedding, message
          FROM rsvps
          WHERE name = ${name}
          ORDER BY created_at DESC
        `;
      }

      return new Response(
        JSON.stringify({ rsvps: result }),
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
    const { rows }: { rows: RSVPRow[] } = body;

    if (!rows || rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one row is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    for (const row of rows) {
      if (!row.name || !row.email) {
        return new Response(
          JSON.stringify({ error: "Name and email are required for each row" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (row.id) {
        await sql`
          UPDATE rsvps
          SET email = ${row.email}, attending = ${row.attending}, pre_wedding = ${row.preWedding}, message = ${row.message ?? ""}
          WHERE id = ${row.id}
        `;
      } else {
        await sql`
          INSERT INTO rsvps (name, email, attending, pre_wedding, message)
          VALUES (${row.name}, ${row.email}, ${row.attending}, ${row.preWedding ?? false}, ${row.message ?? ""})
        `;
      }
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
