interface PageProps {
  text: string;
}

export default function Page({ text }: PageProps) {
    return (
      <div className="w-[928px] p-6 h-full shadow-xl rounded-md p-6 text-lg leading-relaxed border border-gray-300 dark:border-gray-700 transition-all duration-500">
        {text}
      </div>
    );
  }
  