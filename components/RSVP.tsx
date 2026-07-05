import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { guestGroups } from "@/data/guests";

const allNames = guestGroups.flatMap((group) =>
  group.split(", ").filter(Boolean),
);

const nameToGroup = Object.fromEntries(
  guestGroups.flatMap((group) =>
    group.split(", ").map((name) => [name.toLowerCase(), group]),
  ),
);

interface Member {
  name: string;
  attending: boolean;
}

interface RsvpFormProps {
  eventType: "wedding" | "pre-wedding";
}

function RsvpForm({ eventType }: RsvpFormProps) {
  const [nameInput, setNameInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [existingId, setExistingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isLoadingLookup, setIsLoadingLookup] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  const label = eventType === "wedding" ? "Wedding" : "Pre-wedding";
  const title = eventType === "wedding" ? "Wedding RSVP" : "Pre-wedding RSVP";

  const matches = useMemo(() => {
    if (!nameInput.trim()) return [];
    const lower = nameInput.trim().toLowerCase();
    return allNames.filter((name) => name.toLowerCase().includes(lower));
  }, [nameInput]);

  const resolveName = useCallback((value: string) => {
    const match = nameToGroup[value.trim().toLowerCase()];
    if (match) {
      setSelectedGroup(match);
      const all = match.split(", ").filter(Boolean);
      setMembers(all.map((name) => ({ name, attending: true })));
    } else {
      setSelectedGroup("");
      setMembers([]);
      setIsLoadingLookup(false);
    }
  }, []);

  const lookupRsvp = useCallback(
    async (group: string) => {
      setIsLoadingLookup(true);
      try {
        const res = await fetch(
          `/api/rsvp?groupKey=${encodeURIComponent(group)}&eventType=${eventType}`,
        );
        const data = await res.json();
        if (data.rsvp) {
          setExistingId(data.rsvp.id);
          setEmailInput(data.rsvp.email ?? "");
          setMessage(data.rsvp.message ?? "");
          try {
            const parsed = JSON.parse(data.rsvp.responses ?? "[]");
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMembers(parsed);
              setIsLoadingLookup(false);
              return;
            }
          } catch {
            // ignore malformed responses
          }
        }
      } catch {
        // silent
      }
      const all = group.split(", ").filter(Boolean);
      setMembers(all.map((name) => ({ name, attending: true })));
      setIsLoadingLookup(false);
    },
    [eventType],
  );

  const handleSelect = useCallback((name: string) => {
    setNameInput(name);
    const group = nameToGroup[name.trim().toLowerCase()];
    if (group) {
      setSelectedGroup(group);
      setMembers([]);
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      lookupRsvp(selectedGroup);
    }
  }, [selectedGroup, lookupRsvp]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [matches]);

  useEffect(() => {
    const el = listRef.current?.children[highlightedIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || matches.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < matches.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : matches.length - 1,
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(matches[highlightedIndex]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, matches, highlightedIndex, handleSelect],
  );

  function toggleAttending(name: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.name === name ? { ...m, attending: !m.attending } : m,
      ),
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const row = {
      id: existingId ?? undefined,
      eventType,
      groupKey: selectedGroup,
      email: emailInput,
      message,
      responses: JSON.stringify(members),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="inline-block text-center">
          <h3 className="text-3xl font-medium">{title}</h3>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>
        <p className="mt-4 text-md max-[400px]:text-sm text-muted-foreground font-muted-foreground">
          {eventType === "pre-wedding"
            ? "24 March 2027 · Location TBD · Kuala Lumpur"
            : "26 March 2027 · Botanica + Co · Kuala Lumpur"}
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-xl shadow-primary/5"
      >
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor={`name-${eventType}`}>Full Name</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    id={`name-${eventType}`}
                    name="name"
                    required
                    placeholder="Your name"
                    value={nameInput}
                    autoComplete="new-password"
                    data-1p-ignore
                    data-lpignore="true"
                    data-form-type="other"
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      resolveName(e.target.value);
                    }}
                    onFocus={() => {
                      if (nameInput.trim()) setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    className="pr-10"
                  />
                  <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                sideOffset={4}
                style={{ width: "var(--radix-popover-trigger-width)" }}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <ul ref={listRef} className="max-h-48 overflow-y-auto p-1">
                  {matches.length === 0 ? (
                    <li className="py-6 text-center text-sm text-muted-foreground">
                      No matching names
                    </li>
                  ) : (
                    matches.map((name, i) => (
                      <li
                        key={name}
                        role="option"
                        aria-selected={highlightedIndex === i}
                        data-index={i}
                        onClick={() => handleSelect(name)}
                        onMouseEnter={() => setHighlightedIndex(i)}
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition",
                          highlightedIndex === i
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            nameInput.toLowerCase() === name.toLowerCase()
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {name}
                      </li>
                    ))
                  )}
                </ul>
              </PopoverContent>
            </Popover>
          </div>

          {selectedGroup && isLoadingLookup && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-hibiscus" />
            </div>
          )}

          {selectedGroup && !isLoadingLookup && (
            <>
              <div className="grid gap-2">
                <Label htmlFor={`email-${eventType}`}>Email</Label>
                <Input
                  id={`email-${eventType}`}
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label>Who's attending the {label.toLowerCase()}?</Label>
                <div className="grid gap-2">
                  {members.map((member) => (
                    <Label
                      key={member.name}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition hover:border-hibiscus has-[[data-state=checked]]:border-hibiscus"
                    >
                      <Checkbox
                        checked={member.attending}
                        onCheckedChange={() => toggleAttending(member.name)}
                      />
                      {member.name}
                    </Label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`message-${eventType}`}>
                  Message for the couple (optional)
                </Label>
                <Textarea
                  id={`message-${eventType}`}
                  name="message"
                  placeholder="A message, song request, or anything else..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isLoadingLookup}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-hibiscus px-8 py-3 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-hibiscus/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {submitted
              ? "RSVP submitted!"
              : isSubmitting
                ? "Sending..."
                : error
                  ? "Error submitting RSVP"
                  : `RSVP for the ${label}`}
          </button>
          {error && (
            <p className="mt-2 text-center text-sm text-red-500">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
}

export function RSVP() {
  return (
    <section id="rsvp" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">
            Will you join us?
          </p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">RSVP</h2>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
          <p className="mt-6 text-xl text-muted-foreground">
            Kindly RSVP by <span className="font-bold">1st December, 2026</span>
            .
          </p>
          <p className="mt-8 text-muted-foreground">
            We're so excited to celebrate with you.
          </p>

          <p className="mt-8 text-muted-foreground">
            If you're unsure about your attendance to the pre-wedding event,
            please still submit your RSVP for the wedding. This would help us in
            planning for our special day.
          </p>
        </div>

        <div className="mt-12 grid gap-10">
          <RsvpForm eventType="pre-wedding" />
          <RsvpForm eventType="wedding" />
        </div>
      </div>
    </section>
  );
}
