// // components/SearchDropdown.tsx
// import React, { useCallback, useEffect, useState } from "react";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// // import { getApi } from "@/lib/services/apiService";
// import { Store } from "@/app/store/themeStore";
// import { useRouter } from "next/navigation";
// // import { toast } from "@/hooks/use-toast";

// export default function SearchDropdown() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   interface RfpData {
//     id: number;
//     org_file_name: string;
//     file_name: string;
//     // Add other necessary fields
//   }

//   const [results, setResults] = useState<RfpData[]>([]);
//   const userData = Store((state: any) => state.users);

//   // Add proper type for debounced function
//   type DebouncedFunction<T extends (...args: any[]) => any> = {
//     (...args: Parameters<T>): void;
//     cancel: () => void;
//   };

//   function debounce<T extends (...args: any[]) => void>(
//     func: T,
//     wait: number
//   ): DebouncedFunction<T> {
//     let timeout: NodeJS.Timeout | null = null;

//     const debounced = (...args: Parameters<T>) => {
//       if (timeout) clearTimeout(timeout);
//       timeout = setTimeout(() => func(...args), wait);
//     };

//     debounced.cancel = () => {
//       if (timeout) {
//         clearTimeout(timeout);
//         timeout = null;
//       }
//     };

//     return debounced;
//   }
//   // Debounce search input
//   // const debouncedSearch = useCallback(
//   //   debounce(async (searchValue: string) => {
//   //     if (searchValue.length === 0) {
//   //       setResults([]);
//   //       return;
//   //     }

//   //     setLoading(true);
//   //     try {
//   //       const res = await getApi(
//   //         `api/extraction-list/?name=${searchValue}`,
//   //         userData?.data?.access_token
//   //       );

//   //       if (res.ok) {
//   //         const data = await res.json();
//   //         setResults(data.results.data || []);
//   //         setIsOpen(true);
//   //       }
//   //     } catch (error) {
//   //       console.error("Search error:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }, 300),
//   //   [userData?.data?.access_token]
//   // );

//   useEffect(() => {
//     debouncedSearch(searchTerm);
//     return () => debouncedSearch.cancel();
//   }, [searchTerm, debouncedSearch]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     if (value.length > 50) {
//       toast({
//         title: "Search",
//         description: "Search term cannot exceed 50 characters.",
//         variant: "error",
//         duration: 1000
//       });
//       return;
//     }
//     setSearchTerm(value);
//   };

//   return (
//     <div className="relative ml-5 w-full max-w-md">
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//         <Input
//           placeholder="Search"
//           className="pl-10 pr-4 py-2 w-full"
//           value={searchTerm}
//           onChange={handleInputChange}
//           onFocus={() => setIsOpen(true)}
//           onBlur={() => setTimeout(() => setIsOpen(false), 200)}
//         />
//       </div>

//       {isOpen && (
//         <div className="absolute z-10 w-full mt-2  border border-gray-600 bg-gray-800 shadow-lg max-h-60 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-center text-gray-400">Loading...</div>
//           ) : results.length > 0 ? (
//             results.map((item) => (
//               <div
//                 key={item.id}
//                 className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors"
//                 onMouseDown={() => {
//                   router.push("/rfp-list")
//                   // Handle item selection
//                   console.log("Selected:", item);
//                   setIsOpen(false);
//                 }}
//               >
//                 <div className="font-medium text-gray-100 truncate">
//                   {item.org_file_name || item.file_name}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-4 text-center text-gray-400">
//               No documents found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // Debounce utility function
// function debounce<T extends (...args: any[]) => void>(
//   func: T,
//   wait: number
// ): (...args: Parameters<T>) => void {
//   let timeout: NodeJS.Timeout;
//   return (...args: Parameters<T>) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// }