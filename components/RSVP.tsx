import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RSVP() {
  const [attending, setAttending] = useState("yes");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      attending: formData.get("attending") === "yes",
      guests:
        attending === "yes"
          ? parseInt(formData.get("guests") as string) || 1
          : 0,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit");
      }

      toast.success("Thank you! Your RSVP has been received.", {
        description: "We can't wait to celebrate with you in Malaysia.",
      });
      e.currentTarget.reset();
      setAttending("yes");
      return;
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="rsvp" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">
            Will you join us?
          </p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">RSVP</h2>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
          <p className="mt-6 text-muted-foreground">
            Kindly respond by January, 2027.
          </p>
          <p className="mt-2 text-muted-foreground">
            We're so excited to celebrate with you.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-12 rounded-2xl border border-border bg-card p-8 md:p-10 shadow-xl shadow-primary/5"
        >
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="Your name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="grid gap-3">
              <Label>Will you be attending?</Label>
              <RadioGroup
                name="attending"
                value={attending}
                onValueChange={setAttending}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="yes"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition hover:border-hibiscus has-[[data-state=checked]]:border-hibiscus has-[[data-state=checked]]:bg-accent/30"
                >
                  <RadioGroupItem value="yes" id="yes" />
                  Joyfully accepts
                </Label>
                <Label
                  htmlFor="no"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition hover:border-hibiscus has-[[data-state=checked]]:border-hibiscus has-[[data-state=checked]]:bg-accent/30"
                >
                  <RadioGroupItem value="no" id="no" />
                  Regretfully declines
                </Label>
              </RadioGroup>
            </div>

            {attending === "yes" && (
              <div className="grid gap-2">
                <Label htmlFor="guests">
                  Number of guests (including yourself)
                </Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min={1}
                  max={4}
                  defaultValue={1}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="message">Message for the couple (optional)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="A note, a song request, dietary needs..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-hibiscus px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-hibiscus/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send RSVP"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
