export function canonicalizeCompanyKey(input: {
  name: string;
  address1?: string | null;
  zip?: string | null;
}) {
  const norm = (s?: string | null) =>
    (s ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\b(llc|inc|ltd|co|company|corp|corporation)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const name = norm(input.name);
  const addr = norm(input.address1 ?? undefined);
  const zip = (input.zip ?? "").trim();
  return `${name}|${addr}|${zip}`.slice(0, 250);
}
