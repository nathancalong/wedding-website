import { neon } from "@neondatabase/serverless";

export const config = {
  runtime: "edge",
};

interface RSVPRequest {
  name: string;
  email: string;
  attending: boolean;
  guests: number;
  message: string;
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = neon(databaseUrl);

    const body: RSVPRequest = await req.json();

    const { name, email, attending, guests, message } = body;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await sql`
      INSERT INTO rsvps (name, email, attending, guests, message)
      VALUES (${name}, ${email}, ${attending}, ${guests ?? 1}, ${message ?? ""})
    `;

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