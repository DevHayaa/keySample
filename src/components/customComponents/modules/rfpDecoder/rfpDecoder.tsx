"use client";

import { UploadCloud, Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { postWithFile, postApi } from "@/lib/services/apiService";
import { Store } from "@/app/store/store";
import ReactMarkdown from "react-markdown";
import CollapsibleText from "@/components/commonComponents/collapsibleText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RfpDecoder() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadData, setUploadData] = useState<any>(null);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [questions, setQuestions] = useState<string[]>([""]);
  const userData = Store((state: any) => state.users);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setExtractedData([]); // Reset previous data

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
        await handleUpload(selectedFile); // Automatically upload when selected
      }
    }
  };

  // Handle file upload
  const handleUpload = async (selectedFile: File) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      setIsUploading(true);
      setError("");

      console.log("Uploading file...");
      const uploadResponse = await postWithFile(
        "api/upload-pdf/",
        formData,
        userData?.data?.access_token
      );

      if (!uploadResponse.ok) throw new Error("Upload failed");
      const uploadResult = await uploadResponse.json();
      setUploadData(uploadResult.data);
      setQuestions([])
      console.log("Upload Success:", uploadResult);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to upload PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle extraction process
  const handleExtractData = async () => {
    if (!uploadData) {
      setError("No uploaded file found. Please upload a PDF first.");
      return;
    }

    const extractPayload = {
      url: uploadData.url,
      file_name: uploadData.file_name,
      org_file_name: uploadData.orig_file_name,
      file_size: uploadData.file_size,
      pages: uploadData.pages,
      labels: questions.filter(q => q.trim() !== ""),
    };

    try {
      setIsExtracting(true);
      setError("");

      console.log("Extracting data with payload:", extractPayload);
      const extractResponse = await postApi(
        "api/extract-pdf/",
        extractPayload,
        userData?.data?.access_token
      );

      if (!extractResponse.ok) throw new Error("Extraction failed");
      const extractResult = await extractResponse.json();
      setExtractedData(extractResult.extracted_data);
      setQuestions([])
      console.log("Extraction Success:", extractResult);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to extract data. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle adding a new question (Max 5)
  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, ""]);
    }
  };

  // Handle removing a question
  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
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
            <h2 className="font-semibold text-xl">RFP Triage</h2>
            <p className="text-sm">
            Quickly reviews and takes out all the key information from RFPs/Client Requirements, helping users focus on the best opportunities.
              </p>
            <Card className="mt-2">
              <CardHeader
                className={`flex flex-col items-center p-4 ${isDragging ? 'bg-blue-100' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                >
                <UploadCloud className="w-16 h-16 text-gray-400 mb-6" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                {/* {!file ? (
                  <Label
                    htmlFor="pdf-upload"
                    className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      "Upload PDF Document"
                    )}
                  </Label>
                ) : (
                  <button
                    onClick={() => setFile(null)}
                    className="bg-red-500 hover:bg-red-600 text-sm text-white py-2 px-4 rounded"
                  >
                    Change Document
                  </button>
                )} */}
                {isUploading ? (
                  // Show loader while uploading
                  <div className="flex items-center gap-2 bg-gray-300 text-gray-600 text-sm py-2 px-4 rounded">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </div>
                ) : !file ? (
                  // Show Upload button if no file is selected
                  <Label
                    htmlFor="pdf-upload"
                    className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer"
                  >
                    Upload PDF Document
                  </Label>
                ) : (
                  // Show "Change Document" button if a file is uploaded
                  <button
                    onClick={() => setFile(null)}
                    className="bg-red-500 hover:bg-red-600 text-sm text-white py-2 px-4 rounded"
                  >
                    Change Document
                  </button>
                )}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {!error && uploadData && (
                  <div className="mt-2 text-center">
                    <p className="text-xs mb-2">Uploaded: {uploadData.orig_file_name}</p>
                    <p className="text-xs mb-2">Size: {uploadData.file_size} KB</p>
                    <p className="text-xs mb-2">Pages: {uploadData.pages}</p>
                    <div className="mt-4">
                      {questions.map((question, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <Input
                            type="text"
                            value={question}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[index] = e.target.value;
                              setQuestions(newQuestions);
                            }}
                            className="border p-2 rounded w-full"
                            placeholder={`Question ${index + 1}`}
                          />
                          {questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(index)}
                              className="ml-2 text-red-500"
                            >
                              ✖
                            </button>
                          )}
                        </div>
                      ))}
                      {questions.length < 5 && (
                        <button
                          onClick={addQuestion}
                          className="bg-gray-200 hover:bg-gray-300 text-sm text-black py-1 px-3 rounded mt-2"
                        >
                          + Add Question ({questions.length}/5)
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleExtractData}
                      disabled={isExtracting}
                      className="bg-green-500 hover:bg-green-600 text-sm text-white py-2 px-4 rounded disabled:bg-gray-400 mt-4"
                    >
                      {isExtracting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Extracting...
                        </div>
                      ) : (
                        "Start Extraction"
                      )}
                    </button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {extractedData?.length > 0 && (
                  <div className="mt-6 p-6 rounded-lg border-t">
                    <h2 className="text-lg font-semibold mb-4">Extracted Results</h2>
                    <div className="overflow-x-auto p-4 rounded">
                      <table className="min-w-full border dark:border-gray-300">
                        <thead>
                          <tr className=" border-b dark:border-gray-300">
                            <th className="py-2 px-4 border-r dark:border-gray-300">#</th>
                            <th className="py-2 px-4 border-r dark:border-gray-300">Title</th>
                            <th className="py-2 px-4 dark:border-gray-300">Extracted Information</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractedData.map((item, index) => (
                            <tr key={index} className="border-b dark:border-gray-300">
                              <td className="py-2 px-4 border-r font-medium  dark:border-gray-300">{index + 1}</td>
                              <td className="py-2 px-4 border-r font-medium  dark:border-gray-300">{item.title}</td>
                              <td className="py-2 px-4 text-sm dark:text-white whitespace-normal">
                                <div className="prose prose-sm max-w-none">
                                  {item.message.length > 300 ? (
                                    <CollapsibleText text={item.message} />
                                  ) : (
                                    <ReactMarkdown>{item.message}</ReactMarkdown>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-300 mt-6"></div>

                <div className="mt-6 p-6 rounded-lg">
                  <h2 className="text-sm font-semibold mb-2">Note</h2>
                  <p>
                    Please ensure that your document is in PDF format and the maximum document size is 15 MB.
                  </p>
                </div>
                <div className="mt-6 p-6 rounded-lg bg-white shadow dark:bg-gray-700">
                  <h2 className="text-lg font-semibold mb-4">Extraction Labels</h2>
                  <ul className="text-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 list-disc pl-5">
                    <li className="break-words">Solicitation Number</li>
                    <li className="break-words">Due Date And Time</li>
                    <li className="lg:col-span-1 break-words">Language Requirements</li>
                    <li className="break-words">Security Clearance</li>
                    <li className="break-words">Work Location</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}