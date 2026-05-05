interface SuccessScreenProps {
  name: string;
}

export function SuccessScreen({ name }: SuccessScreenProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-amber-50">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🍞</div>
        <h1 className="text-2xl font-bold text-amber-900 mb-2">Order Received!</h1>
        <p className="text-stone-600">
          Thank you, <strong>{name}</strong>! Your order has been sent. We&apos;ll be in
          touch soon.
        </p>
      </div>
    </main>
  );
}
