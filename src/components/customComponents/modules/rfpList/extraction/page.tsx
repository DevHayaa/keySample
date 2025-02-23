"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js App Router
import Navbar from "@/components/commonComponents/navbar";
import { AppSidebar } from "@/components/commonComponents/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/commonComponents/CustomFooter";
import { getApi } from "@/lib/services/apiService";
import { Store } from "@/app/store/store";
import { FaFilePdf } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import CollapsibleText from "@/components/commonComponents/collapsibleText";
import ReactMarkdown from "react-markdown";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { CloudDownload, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RfpDetailsPage() {
  const router = useRouter();
  const { id } = useParams(); // Extract RFP ID from URL
  const userData = Store((state: any) => state.users);

  const [documentData, setDocumentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const activeTab = documentData?.org_file_name || ""; // Define the activeTab variable

  useEffect(() => {
    if (id && userData?.data?.access_token) {
      fetchDocumentDetails();
    }
  }, [id, userData?.data?.access_token]);

  const fetchDocumentDetails = async () => {
    setLoading(true);
    try {
      const res = await getApi(
        `api/extraction-list/?id=${id}`, // Fetch only data for selected RFP
        userData?.data?.access_token
      );
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      const data = await res.json();
      const filteredData =
        data.results?.data?.find((doc: any) => doc.id === Number(id)) || null;
      setDocumentData(filteredData);
    } catch (e) {
      console.error("Error fetching document details:", e);
    } finally {
      setLoading(false);
    }
  };


  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Extracted Information", 14, 20);
    
    if (documentData?.prompt_answers?.length > 0) {
      const tableData = documentData.prompt_answers.map((item: any, index: number) => [
        index + 1,
        item.title,
        item.message,
      ]);

      autoTable(doc, {
        head: [["#", "Title", "Data"]],
        body: tableData,
        startY: 30,
      });
    } else {
      doc.text("No extracted data available.", 14, 40);
    }

    doc.save(`${documentData?.file_name || "extracted_information"}.pdf`);
  };

  return (
    <div className="p-6 overflow-auto">
      {/* Breadcrumbs */}
      <Breadcrumb className="py-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link className="font-semibold text-xl" href="/rfp-list">
              Extractions
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-xl">
              {activeTab}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : documentData ? (
        <div className="space-y-6">
          {/* Card 1: PDF Information */}
          <Card className="p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
            <FileText className="text-red-500 w-16 h-16 mb-2" />
            <h2 className="text-xl font-semibold text-white">
              {documentData.org_file_name}
            </h2>
            <p className="text-gray-400 mt-2">
              <strong>Size:</strong> {documentData.file_size} KB{" "}
              <strong>Pages:</strong> {documentData.pages}
            </p>

            <a
              href={`https://generativestorageazure.blob.core.windows.net/rfpdata/${documentData.file_name}`}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="bg-transparent text-blue-400 hover:underline flex items-center mt-4"
            >
              <CloudDownload className="inline w-5 h-5 mr-2" />
              Download Pdf
            </a>
          </Card>

          {/* Card 2: Extracted Information Table */}
          <Card className="p-6 rounded-lg shadow-lg">
            <div className="flex justify-end">
              <button onClick={handleExportToPDF} className="bg-blue-500 text-white px-3 py-1 rounded-md ">
                Export PDF
              </button>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Extracted Information

            </h3>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border dark:border-gray-300">
                <thead className="">
                  <tr className="border-b dark:border-gray-300">
                    <th className="py-2 px-4 border-r dark:border-gray-300">#</th>
                    <th className="py-2 px-4 border-r dark:border-gray-300">Title</th>
                    <th className="py-2 px-4 border-r dark:border-gray-300">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {documentData.prompt_answers?.length > 0 ? (
                    documentData.prompt_answers.map(
                      (item: any, index: number) => (
                        <tr
                          key={item.id}
                          className={`border-b dark:border-gray-300 ${index % 2 === 0 ? "" : ""
                            }`}
                        >
                          <td className="py-2 px-4 border-r font-medium  dark:border-gray-300">{index + 1}</td>
                          <td className="py-2 px-4 border-r font-medium  dark:border-gray-300">{item.title}</td>
                          <td className="py-2 px-4 border-r font-medium  dark:border-gray-300">
                            <div className="prose prose-sm max-w-none">
                              {item.message.length > 300 ? (
                                <CollapsibleText text={item.message} />
                              ) : (
                                <ReactMarkdown>{item.message}</ReactMarkdown>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        No extracted data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <p className="text-red-500 text-center">No document found for this ID.</p>
      )}
    </div>
  );
}
