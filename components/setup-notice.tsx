export function SetupNotice() {
  return (
    <div
      role="status"
      className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
    >
      <p className="font-semibold">Supabase isn&apos;t connected yet.</p>
      <p className="mt-1">
        Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
        <code>.env.local</code>, then restart the dev server. The static wall
        below still works.
      </p>
    </div>
  );
}
