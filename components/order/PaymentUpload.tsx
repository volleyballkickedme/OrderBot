import { useRef } from "react";

interface PaymentUploadProps {
  file: File | null;
  preview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function PaymentUpload({ file, preview, onFileChange, onClear }: PaymentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClear();
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-semibold text-amber-900 mb-1">Payment Proof</h2>
      <p className="text-stone-500 text-sm mb-4">
        Please transfer the total amount via PayNow/Bank Transfer to Yvonne Ong (9783 7335), then upload your
        screenshot below.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.heic"
        onChange={onFileChange}
        className="hidden"
      />

      {!file ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-amber-300 rounded-xl py-8 flex flex-col items-center gap-2 text-amber-700 hover:bg-amber-50 active:bg-amber-100 transition-colors"
        >
          <span className="text-3xl">📎</span>
          <span className="font-medium">Tap to upload screenshot</span>
          <span className="text-xs text-stone-400">JPG, PNG, HEIC accepted</span>
        </button>
      ) : (
        <div className="flex items-center gap-4">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Payment proof preview"
              className="w-20 h-20 object-cover rounded-lg border border-stone-200"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-700 truncate">{file.name}</p>
            <p className="text-xs text-green-600 mt-0.5">✓ Upload ready</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-stone-400 hover:text-stone-600 text-xl"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
