"use client";

import { UploadCloud, Download, Loader2 } from "lucide-react"; // Import Lucide React icons
import { useRef, useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { postWithFile } from "@/lib/services/apiService";
import { Store } from "@/app/store/store";
import { apiURL } from "@/lib/utils";

export default function ProBid() {
  const userData = Store((state: any) => state.users);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [statementOfWork, setStatementOfWork] = useState<any | null>(null);
  const [isDragging, setIsDragging] = useState(false);


  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setExtractedData([]);
    setProgress(0);

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        setFile(null);
      } else if (selectedFile.size > 15 * 1024 * 1024) {
        setError("File size must be less than 15 MB.");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
        await handleUpload(selectedFile);
      }
    }
  };

  const handleUpload = async (selectedFile: File) => {
    setLoading(true);
    setProgress(0);

    // Simulating progress bar using an interval
    let interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev)); // Max out at 90% until upload completes
    }, 1000);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setError("");

      console.log("Uploading file...");
      const uploadResponse = await postWithFile(
        "api/pro-bid/",
        formData,
        userData?.data?.access_token
      );

      if (!uploadResponse.ok) throw new Error("Upload failed");
      const uploadResult = await uploadResponse.json();

      clearInterval(interval); // Stop the progress bar update
      setProgress(100); // Set to 100% once upload is complete
      setTimeout(() => setLoading(false), 500); // Hide loader after short delay
      setExtractedData(uploadResult.tables);
      setFileUrl(uploadResult.file_url);
      setStatementOfWork(uploadResult.statement_of_work?.statement_of_work); // Extract SOW


      console.log("Upload Success:", uploadResult);
    } catch (err) {
      clearInterval(interval); // Stop progress updates if error occurs
      console.error("API Error:", err);
      setError("Failed to upload PDF. Please try again.");
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(`${apiURL}${fileUrl.replace("/", "")}`, "_blank");
    }
  };

  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
};

const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
};

const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    handleFileChange({ target: { files: [droppedFile] } } as any);
};


  return (
    <div className="px-6 h-screen overflow-auto">
      <div className="text-card-foreground items-center">
        <div className="items-center gap-4">
          <div className="w-full mt-4">
            <h2 className="font-semibold text-xl">Pro-Bid Step 1</h2>
            <p className="text-sm">
              Automatically extracts key tables from client hiring requirements, including Technical Evaluation, Financial Evaluation, Corporate Mandatories, and the Statement of Work.
            </p>
            <Card className="mt-2">
              {/* Upload Section */}
              <CardHeader
                className={`flex flex-col items-center p-4 ${isDragging ? 'bg-blue-100' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <UploadCloud className="w-16 h-16 text-gray-400 mb-6" />

                <input
                  type="file"
                  id="resumeFile"
                  name="resumeFile"
                  ref={fileInputRef}
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer" onClick={handleButtonClick} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload File"
                  )}
                </Button>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {!error && file && (
                  <p className="text-xs mt-2">File ready for upload: {file.name}</p>
                )}
              </CardHeader>

              <CardContent>
                {/* Progress Bar */}
                {loading && (
                  <div className="mt-4 w-full">
                    <p className="text-sm text-gray-500 mb-2">Processing... {progress}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}


                {/* Download Button */}
                {fileUrl && (
                  <div className="flex justify-end mt-6">
                    {/* <Button onClick={handleDownload} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Extracted File
                    </Button> */}
                    <button onClick={handleDownload} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                      Export Word
                    </button>
                  </div>
                )}

                {/* Render Extracted Data as Tables */}
                {extractedData.length > 0 && (
                  <div className="mt-6 ">
                    {/* Statement of Work Display */}
                {statementOfWork && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">Statement of Work:</h2>
                    <p className="text-sm"><strong>Title:</strong> {statementOfWork.Title}</p>
                    <p className="text-sm"><strong>Objective:</strong> {statementOfWork.Objective}</p>
                    <p className="text-sm"><strong>Background:</strong> {statementOfWork.Background}</p>
                    <p className="text-sm"><strong>Scope of Work:</strong> {statementOfWork["Scope of work"]}</p>
                    <p className="text-sm"><strong>Work Location:</strong> {statementOfWork["work location"]}</p>
                    <p className="text-sm"><strong>Tasks and Deliverables:</strong> {statementOfWork["Tasks and Deliverables"]}</p>
                  </div>
                )}
                    {/* <h2 className="text-lg font-semibold mb-4 mt-4">Extracted Tables:</h2> 
                    {extractedData.map((table, tableIndex) => (
                      <div key={tableIndex} className="mb-8">
                        <h3 className="text-md font-semibold mb-2">
                          Table {tableIndex + 1}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-300">
                            <thead>
                              <tr className="border-b border-gray-300 ">
                                <th className="py-2 px-4 border-r border-gray-300 text-left">Index</th>
                                {Object.keys(table.table_data[0] || {}).map((header, index) => (
                                  <th key={index} className="py-2 px-4 border-r border-gray-300 text-left">
                                    {header || `Column ${index + 1}`}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.table_data.map((row: any, rowIndex: number) => (
                                <tr key={rowIndex} className="border-b border-gray-300">
                                  <td className="py-2 px-4 border-r border-gray-300">{rowIndex + 1}</td>
                                  {Object.values(row).map((cell, cellIndex) => (
                                    <td key={cellIndex} className="py-2 px-4 border-r border-gray-300">
                                      {cell !== null ? String(cell) : ""}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}*/}
                  </div>
                
                )}
                <div className="border-t border-gray-300 mt-6"></div>
                <div className="mt-6 p-6 rounded-lg">
                  <h2 className="text-sm font-semibold mb-2">Note</h2>
                  <p className="text-sm">
                    Please ensure that your document is in PDF format and the maximum document size is 15 MB.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
