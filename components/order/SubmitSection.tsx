interface SubmitSectionProps {
  canSubmit: boolean;
  submitting: boolean;
  error: string | null;
  validationHint: string | null;
}

export function SubmitSection({ canSubmit, submitting, error, validationHint }: SubmitSectionProps) {
  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-amber-700 text-white font-bold py-4 rounded-2xl text-lg shadow-sm disabled:opacity-40 active:bg-amber-800 transition-colors"
      >
        {submitting ? "Sending Order…" : "Submit Order"}
      </button>

      {validationHint && (
        <p className="text-center text-xs text-stone-400">{validationHint}</p>
      )}
    </>
  );
}
