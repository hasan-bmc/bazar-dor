
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e2e9e3] bg-[#fbfdfb]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-5 text-[11px] leading-5 text-gray-600 sm:flex-row sm:items-center sm:px-8 sm:py-5">
        <p>
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="sm:text-right">
          সকল দাম সহায়ক; বাজার অবস্থা ওর উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
