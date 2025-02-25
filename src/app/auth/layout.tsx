interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">RICH CALENDAR</h1>
      <div className="w-full max-w-md flex-col rounded-xl border border-solid p-6 sm:px-10">{children}</div>
    </div>
  );
}
