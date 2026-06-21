import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export function RSVP() {
  const [attending, setAttending] = useState("yes");
  const [preWedding, setPreWedding] = useState("yes");
  const [nameInput, setNameInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [extraMembers, setExtraMembers] = useState<string[]>([]);
  const [checkedMembers, setCheckedMembers] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [existingRsvps, setExistingRsvps] = useState<
    Array<{
      id: number;
      name: string;
      email: string;
      attending: boolean;
      pre_wedding: boolean;
      message: string;
    }>
  >([]);
  const [mainMessage, setMainMessage] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

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
      const others = all.filter(
        (m) => m.toLowerCase() !== value.trim().toLowerCase(),
      );
      setExtraMembers(others);
      setCheckedMembers(others);
    } else {
      setSelectedGroup("");
      setExtraMembers([]);
      setCheckedMembers([]);
    }
  }, []);

  const lookupRsvp = useCallback(async (name: string) => {
    try {
      const res = await fetch(`/api/rsvp?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (data.rsvps && data.rsvps.length > 0) {
        setExistingRsvps(data.rsvps);
        const main = data.rsvps.find(
          (r: { name: string }) =>
            r.name.toLowerCase() === name.trim().toLowerCase(),
        );
        if (main) {
          setAttending(main.attending ? "yes" : "no");
          setPreWedding(main.pre_wedding ? "yes" : "no");
          setMainMessage(main.message ?? "");
        }
      }
    } catch {
      // silent — allow normal submission
    }
  }, []);

  const handleSelect = useCallback(
    (name: string) => {
      setNameInput(name);
      resolveName(name);
      lookupRsvp(name);
      setOpen(false);
    },
    [resolveName, lookupRsvp],
  );

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

  function toggleMember(name: string) {
    setCheckedMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name],
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const mainEmail = emailInput;
    const names = [nameInput, ...(attending === "yes" ? checkedMembers : [])];

    const rows = names.map((n) => {
      const existing = existingRsvps.find(
        (r) => r.name.toLowerCase() === n.trim().toLowerCase(),
      );
      const owns = existing && existing.email === mainEmail;
      return {
        id: owns ? existing.id : undefined,
        name: n,
        email: mainEmail,
        attending: attending === "yes",
        preWedding: preWedding === "yes",
        message: n === nameInput ? mainMessage : "",
      };
    });

    const payload = { rows };

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
      setNameInput("");
      setSelectedGroup("");
      setExtraMembers([]);
      setCheckedMembers([]);
      setExistingRsvps([]);
      setMainMessage("");
      setEmailInput("");
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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                      value={nameInput}
                      autoComplete="off"
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

            {selectedGroup &&
              extraMembers.length > 0 &&
              attending === "yes" && (
                <div className="grid gap-3">
                  <Label>Additional guests</Label>
                  <div className="grid gap-2">
                    {extraMembers.map((name) => (
                      <Label
                        key={name}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition hover:border-hibiscus has-[[data-state=checked]]:border-hibiscus"
                      >
                        <Checkbox
                          checked={checkedMembers.includes(name)}
                          onCheckedChange={() => toggleMember(name)}
                        />
                        {name}
                      </Label>
                    ))}
                  </div>
                </div>
              )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label>Will you be attending the wedding?</Label>
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

            <div className="grid gap-3">
              <Label>Will you be joining us at the pre-wedding event?</Label>
              <RadioGroup
                name="preWedding"
                value={preWedding}
                onValueChange={setPreWedding}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="pre-yes"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition hover:border-hibiscus has-[[data-state=checked]]:border-hibiscus has-[[data-state=checked]]:bg-accent/30"
                >
                  <RadioGroupItem value="yes" id="pre-yes" />
                  Joyfully accepts
                </Label>
                <Label
                  htmlFor="pre-no"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition hover:border-hibiscus has-[[data-state=checked]]:border-hibiscus has-[[data-state=checked]]:bg-accent/30"
                >
                  <RadioGroupItem value="no" id="pre-no" />
                  Regretfully declines
                </Label>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message for the couple (optional)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="A note, a song request, dietary needs..."
                rows={4}
                value={mainMessage}
                onChange={(e) => setMainMessage(e.target.value)}
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
