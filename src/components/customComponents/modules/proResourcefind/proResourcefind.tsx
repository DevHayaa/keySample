"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, UserCheck, XCircle, FileText, UploadCloud, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postWithFile } from "@/lib/services/apiService";
import { Store } from "@/app/store/store";
import { toast } from "@/hooks/use-toast";

export default function ProResourceFind() {
    const [searchCriteria, setSearchCriteria] = useState({
        jobTitle: "",
        technology: "",
        businessFunction: "",
        experience: "",
    });
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [noResultsMessage, setNoResultsMessage] = useState<string>("");
    const [candidates, setCandidates]: any = useState([]);
    const [loading, setLoading] = useState(false);
    const [extractedData, setExtractedData] = useState<any[]>([]);
    const [progress, setProgress] = useState(0); // Progress state
    const [error, setError] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const userData = Store((state: any) => state.users);
    const [isDragging, setIsDragging] = useState(false);

    // Mock data for testing
    const mockCandidates = [
        {
            id: 1,
            name: "Moiz Syed",
            jobTitle: "IBM Mainframe Developer",
            technology: "IBM Mainframe",
            businessFunction: "Government IT",
            experience: "6 years",
            matchScore: 83,
            mismatches: ["Business Function: Finance instead of Government"],
        },
        {
            id: 2,
            name: "John Doe",
            jobTitle: "Software Engineer",
            technology: "Java, React",
            businessFunction: "Finance",
            experience: "8 years",
            matchScore: 72,
            mismatches: ["Technology: Java instead of IBM Mainframe"],
        },
    ];

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            setCandidates(mockCandidates);
            setLoading(false);
        }, 1000); // Simulating API call
    };

    const handleUpload = async (selectedFile: File) => {
        setLoading(true);
        setProgress(0);
        setCandidates([]);
        setNoResultsMessage("");
        // Simulating progress bar using an interval
        let interval = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 10 : prev)); // Max out at 90% until upload completes
        }, 1000);

        const formData = new FormData();
        formData.append("pdf_file", selectedFile);

        try {
            setError("");

            console.log("Uploading file...");
            const uploadResponse = await postWithFile(
                "applicant/match-job/",
                formData,
                userData?.data?.access_token
            );

            if (!uploadResponse.ok) throw new Error("Upload failed");

            const result = await uploadResponse.json();
            console.log("Upload Success:", result);

            // console.log("Upload Success:", await uploadResponse.json());

            clearInterval(interval); // Stop the progress bar update
            setProgress(100); // Set to 100% once upload is complete
            setTimeout(() => setLoading(false), 500); // Hide loader after short delay

            if (result.matched_applicants === "No relevant applicant found") {
                setNoResultsMessage("No relevant applicant found in the Database.");
                setCandidates([]); // Ensure table is hidden
                return
            }

            setCandidates(result.matched_applicants);

            setLoading(false);
        } catch (err) {
            clearInterval(interval); // Stop progress updates if error occurs
            console.error("API Error:", err);
            setError("Failed to upload PDF. Please try again.");
            setLoading(false);
        }
    };

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
        <div className="px-6 h-screen overflow-auto ">
            <div className="text-card-foreground items-center">
                <div className="items-center gap-4">
                    <div className="w-full mt-4">
                        <h2 className="font-semibold text-xl">Pro Resource Find</h2>
                        <p className="text-sm">
                            Precision Matching for Optimal Talent Selection.
                        </p>
                        <div className="space-y-4">

                            <Card className=" p-6 shadow-lg mt-2">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <Search className="mr-2" /> Search Candidates
                                </h2>
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
                                        <Button
                                            className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer"
                                            onClick={handleButtonClick}
                                            disabled={loading}
                                        >
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
                                    </CardContent>
                                </Card>
                                {/* <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="text"
                                        placeholder="Job Title or Labour Category"
                                        className="p-2 border rounded"
                                        value={searchCriteria.jobTitle}
                                        onChange={(e) => setSearchCriteria({ ...searchCriteria, jobTitle: e.target.value })}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Specific Technology"
                                        className="p-2 border rounded"
                                        value={searchCriteria.technology}
                                        onChange={(e) => setSearchCriteria({ ...searchCriteria, technology: e.target.value })}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Business Function Area"
                                        className="p-2 border rounded"
                                        value={searchCriteria.businessFunction}
                                        onChange={(e) => setSearchCriteria({ ...searchCriteria, businessFunction: e.target.value })}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Experience (e.g. 5+ years)"
                                        className="p-2 border rounded"
                                        value={searchCriteria.experience}
                                        onChange={(e) => setSearchCriteria({ ...searchCriteria, experience: e.target.value })}
                                    />
                                </div> */}
                                {/* <button
                                    onClick={handleSearch}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Search
                                </button> */}
                            </Card>

                            {/* Matching Candidates Table */}
                            {/* <Card className="p-6 shadow-lg overflow-auto">
                                <h2 className="text-xl font-semibold mb-4">Matching Candidates</h2>
                                {loading ? (
                                    <p className="text-center text-gray-500">Loading candidates...</p>
                                ) : candidates.length > 0 ? (
                                    <table className="w-full border-collapse border">
                                        <thead>
                                            <tr >
                                                <th className="border p-2">Name</th>
                                                <th className="border p-2">Job Title</th>
                                                <th className="border p-2">Technology</th>
                                                <th className="border p-2">Experience</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map((candidate: any, index: number) => (
                                                <>
                                                    <tr className="border">
                                                        <td className="border p-2">{candidate.name}</td>
                                                        <td className="border p-2">{candidate.job_title}</td>
                                                        <td className="border p-2">{candidate.technology}</td>
                                                        <td className="border p-2">{candidate.experiences}</td>
                                                        
                                                    </tr>
                                                    {candidate.mismatches?.length > 0 && (
                                                        <tr>
                                                            <td colSpan={5}>
                                                                <table className="w-full">
                                                                    {candidate.mismatches.map((mismatch: any, index: any) => (
                                                                        <tr key={index}>
                                                                            <td className="text-red-500 p-2" colSpan={5}>{mismatch}</td>
                                                                        </tr>
                                                                    ))}
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center text-gray-500">No candidates found.</p>
                                )}
                            </Card> */}

                            {candidates.length > 0 && (
                                <Card className="p-6 shadow-lg overflow-auto">
                                    <h2 className="text-xl font-semibold mb-4">Matching Candidates</h2>
                                    {loading ? (
                                        <p className="text-center text-gray-500">Loading candidates...</p>
                                    ) : (
                                        <table className="w-full border-collapse border">
                                            <thead>
                                                <tr>
                                                    <th className="border p-2">Name</th>
                                                    <th className="border p-2">Job Title</th>
                                                    <th className="border p-2">Technology</th>
                                                    <th className="border p-2">Experience Year</th>
                                                    <th className="border p-2">Matching Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {candidates.map((candidate: any, index: number) => (
                                                    <>
                                                        <tr className="border">
                                                            <td className="border p-2">{candidate.name}</td>
                                                            <td className="border p-2">{candidate.job_title}</td>
                                                            <td className="border p-2">{candidate.skills}</td>
                                                            <td className="border p-2">{candidate.experience_years}</td>
                                                            <td className="border p-2">{candidate.matching_score}</td>
                                                        </tr>
                                                        {candidate.mismatched_info?.length > 0 && (
                                                            <tr>
                                                                <td colSpan={4}>
                                                                    <table className="w-full">
                                                                        <td className="p-2" colSpan={4}>{candidate.mismatched_info}</td>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </Card>
                            )}
                            {noResultsMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                                    <strong className="font-bold">No Results:</strong>
                                    <span className="block sm:inline"> {noResultsMessage}</span>
                                </div>
                            )}

                            {/* Mismatch Analysis */}
                            {/* <Card className="p-6 shadow-lg">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <XCircle className="mr-2 text-red-500" /> Mismatch Report
                                </h2>
                                {candidates.length > 0 ? (
                                    <ul className="list-disc pl-6">
                                        {candidates.map((candidate: any) =>
                                            candidate.mismatches.map((mismatch: any, index: any) => (
                                                <li key={index} className="text-red-500">{`${candidate.name}: ${mismatch}`}</li>
                                            ))
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-500">No mismatches found.</p>
                                )}
                            </Card> */}

                            {/* Recommended Candidates */}
                            {/* <Card className="p-6 shadow-lg">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FileText className="mr-2 text-blue-500" /> Recommended Candidates
                                </h2>
                                {candidates.length > 0 ? (
                                    <ul className="list-disc pl-6">
                                        {candidates
                                            .filter((candidate: any) => candidate.matchScore > 80)
                                            .map((candidate: any) => (
                                                <li key={candidate.id} className="text-green-500 font-semibold">
                                                    {candidate.name} ({candidate.matchScore}% match)
                                                </li>
                                            ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-500">No recommendations available.</p>
                                )}
                            </Card> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
