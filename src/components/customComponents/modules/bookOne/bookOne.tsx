import { useState } from "react";
import Page from "@/components/commonComponents/page";

const bookPages = [
  "Yeh ek kahani ka pehla safha hai...",
  "Yeh doosra safha hai, jo aur interesting hai...",
  "Aur yeh teesra safha hai, climax tak poch raha hai...",
  "Aakhri safha, kahani khatam!",
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < bookPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex overflow-auto flex-col items-center justify-center min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">📖 Virtual Book Reader</h1>
      <Page text={bookPages[currentPage]} />
      <div className="mt-4 flex space-x-4">
        <button 
          onClick={prevPage} 
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={currentPage === 0}
        >
          ⬅ Previous
        </button>
        <button 
          onClick={nextPage} 
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={currentPage === bookPages.length - 1}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
