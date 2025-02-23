// pages/extractions.js
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CloudDownload, FileIcon, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getApi } from "@/lib/services/apiService";
import { Store } from "@/app/store/store";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from "react-icons/fa";
import Pagination from "@/components/commonComponents/paginationComponent";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function Extractions() {

  const [searchTerm, setSearchTerm] = useState("");
  const [triageOpen, setTriageOpen] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [rfpData, setRfpData]: any = useState<[]>([]); // Ensure it's always an array
  const [loading, setLoading] = useState(true);
  const userData = Store((state: any) => state.users);
  const router = useRouter();

  const getFileIcon = (fileName: any) => {
    if (!fileName) return <FaFileAlt className="text-gray-500 w-5 h-5" />; // Default icon

    const extension = fileName.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return (
          <>
            <FaFilePdf className="text-red-500 w-5 h-5" />pdf
          </>
        )
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-500 w-5 h-5" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="text-green-500 w-5 h-5" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage className="text-yellow-500 w-5 h-5" />;
      default:
        return <FaFileAlt className="text-gray-500 w-5 h-5" />; // Default icon
    }
  };

  // Handle search input change with validation
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 50) {
      toast({
        title: "Search",
        description: "Search term cannot exceed 50 characters.",
        variant: "error",
        duration: 1000
      });
    } else {
      setSearchTerm(value);
    }
  };

  // Fetch the list of RFPs with the search term
  const getRfpList = useCallback(async () => {
    setLoading(true);
    try {
      // API request for the list of RFPs with search filter (if any)
      const res = await getApi(
        `api/extraction-list/?name=${searchTerm}&page=${page}&page_size=${itemsPerPage}`,
        userData?.data?.access_token
      );
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      const data = await res.json();
      console.log("RFP list data:", data.results.data);
      setRfpData(data.results.data || []); // Ensure we always get an array
      setTotalItems(data.count)
    } catch (e) {
      console.error("Error fetching RFP list:", e);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, page, searchTerm, userData?.data?.access_token]);

  // useEffect to call API on mount and when search term changes
  useEffect(() => {
    if (userData?.data?.access_token) {
      getRfpList();
    }
  }, [getRfpList]);

  // Toggle the triage row
  const toggleTriage = (id: any) => {
    setTriageOpen(triageOpen === id ? null : id); // Toggle the row
  };

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-xl">EXTRACTIONS</h2>

        <div className="w-full">
          <Card>
            <CardHeader className="p-4 border-b border-gray-600 flex justify-between items-start">
              <h2 className="text-lg font-medium">Extractions</h2>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search Documents..."
                  className="pl-10 border border-gray-600 "
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse">
                  <thead className="">
                    <tr>
                      <th className="p-3 text-left text-gray-400">#</th>
                      <th className="p-3 text-left text-gray-400">Type</th>
                      <th className="p-3 text-left text-gray-400">Name</th>
                      <th className="p-3 text-left text-gray-400">Size</th>
                      <th className="p-3 text-left text-gray-400">Date</th>
                      <th className="p-3 text-left text-gray-400">Download</th>
                      {/* <th className="p-3 text-center text-gray-400">Actions</th> */}
                      <th className="p-3 text-center text-gray-400">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : rfpData.length > 0 ? (
                      rfpData.map((item: any, index: any) => (
                        <React.Fragment key={item.id}>
                          {/* Main Row */}
                          <tr className="border-b border-gray-700 hover:bg-gray-200 hover:dark:bg-gray-700">
                            <td className="p-3">{(page - 1) * itemsPerPage + index + 1}</td>
                            <td className="p-3">
                              <span className="flex items-center gap-2">
                                {getFileIcon(item.file_name)}
                              </span>
                            </td>
                            <td className="p-3 truncate">{item.org_file_name || "N/A"}</td>
                            <td className="p-3 text-blue-400">{item.file_size ? `${item.file_size} KB` : "N/A"}</td>
                            <td className="p-3">{item.date || "N/A"}</td>
                            <td className="p-3">
                              <a
                                href={`https://generativestorageazure.blob.core.windows.net/rfpdata/${item.file_name}`} // Replace with actual file URL
                                target="_blank"
                                rel="noopener noreferrer"
                                download // Ensures download behavior
                                className="bg-transparent text-blue-400 hover:underline flex items-center"
                              >
                                <CloudDownload className="inline w-5 h-5 mr-2" />
                                Download
                              </a>
                            </td>

                            <td className="p-3 text-center">
                              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                onClick={() => router.push(`/rfp-list/${item.id}`)} // Navigate to details page
                              >
                                View Details
                              </button>
                            </td>
                          </tr>

                          {/* Triage Row */}
                          {triageOpen === item.id && item.triage && (
                            <tr className="border-b border-gray-700 bg-gray-900">
                              <td></td>
                              <td colSpan={6} className="p-3 text-gray-400">
                                <div className="flex items-center gap-4">
                                  <span className="text-blue-400">Triage:</span>
                                  <span>{item.triage}</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center">
                            <FileText className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="font-medium">Sorry! No Document Found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
                <Pagination
                  currentPage={page}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  setPage={setPage}
                  setItemsPerPage={setItemsPerPage}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
