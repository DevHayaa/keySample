


import actionProbidPrep from "./proBidprepComponents/actionProbidPrep";
import RequirementCardProbidPrep from "./proBidprepComponents/requirementCardProbidPrep";
import ResumeCardProbidPrep from "./proBidprepComponents/resumeCardProbidPrep";
import { Switch } from "@/components/ui/switch";
import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { getApi } from "@/lib/services/apiService";
import { Store } from "@/app/store/store";
import { Card } from "@/components/ui/card";
import ResultCardProbidPrep from "./proBidprepComponents/resultCardProbidPrep";
import BoxLoader from "@/components/commonComponents/boxLoader";
import { apiURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const postApi = async (url: string, options: any, token: any = null) => {
    const formData = new FormData();

    if (typeof options.requirements === 'string') {
        formData.append('requirements', options.requirements);
    } else {
        formData.append('requirements', options.requirements, options.requirements.name);
    }

    if (typeof options.projects === 'string') {
        formData.append('projects', options.projects);
    } else {
        formData.append('projects', options.projects, options.projects.name);
    }

    formData.append('prompt', options.prompt);

    try {
        return await fetch(`${apiURL}${url}`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`
            },
            body: formData,
        });
    } catch (error: any) {
        console.error('Error retrieving data:', error);
        throw new Error(error.message);
    }
};


const Probidprep = () => {
    const [isSingleCard, setIsSingleCard] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isResumeFile, setIsResumeFile] = useState(false);
    const [isRequirementFile, setIsRequirementFile] = useState(false);
    const [resumeCardData, setResumeCardData] = useState(null);
    const [requirementCardData, setRequirementCardData] = useState(null);
    const [resumeCardState, setResumeCardState] = useState({ text: '', counter: 0, uploadedFile: null });

    const resumeCardRef = useRef<any>(null);
    const requirementCardRef = useRef<any>(null);

    const toggleLayout = () => setIsSingleCard(!isSingleCard);
    const reset = () => {
        setIsRequirementFile(false);
        setIsResumeFile(false);
        setResumeCardData(null);
        setRequirementCardData(null);
        if (resumeCardRef.current) {
            resumeCardRef.current.resetFields();
        }
        if (requirementCardRef.current) {
            requirementCardRef.current.resetFields();
        }
    };


    const [resultCard, setResultCard]: any = useState(null); // State for result card
    const [loading, setLoading] = useState(false); // Loading state
    const [promptData, setPromptData]: any = useState()
    const [selectedPrompt, setSelectedPrompt] = useState("");
    const userData = Store((state: any) => state.users);

    const getPrompts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getApi(
                `api/prompt/?search=3`,
                userData?.data?.access_token
            );
            const data = await res.json();
            setPromptData(data.results);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [userData?.data?.access_token]);

    useEffect(() => {
        if (userData?.data?.access_token) {
            getPrompts();
        }
    }, [getPrompts]);

    const handleSubmit: any = async () => {

        setLoading(true); // Start loading
        setResultCard(null); // Reset result card
        if (!selectedPrompt) {
            return;
        }

        let data = {
            requirements: requirementCardData,
            projects: resumeCardData,
            prompt: selectedPrompt,
        };

        try {
            const res = await postApi("api/rewrite-resume/", data, userData?.data?.access_token);
            const getdata = await res.json();
            if (getdata.data) {
                setResultCard(getdata); // Update result card with API response
                setRequirementCardData(null)
                setResumeCardData(null)
                setIsRequirementFile(false)
                setIsResumeFile(false)
            }

        } catch (error) {
            console.error("Error fetching API:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        console.log('isReset', isReset);
    }, [isReset]);

    return (
        <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl">PRO-BID-PREP</h2>
                <div className="flex items-center gap-4">
                    <span className="text-sm">Include Requirements</span>
                    <Switch checked={isSingleCard} onCheckedChange={toggleLayout} />
                    <Button onClick={reset} size={'sm'}>Reset</Button>
                </div>
            </div>
            <p className="text-sm">
                Streamlines the proposal submission process by formatting documents precisely according to specific company requirements, ensuring each submission is polished and professional.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {isSingleCard ? (
                    <div className="w-full">
                        <ResumeCardProbidPrep
                            ref={resumeCardRef}
                            isReset={isReset}
                            onPromptChange={setResumeCardData}
                            setIsResumeFile={setIsResumeFile}
                            isFileUploaded={isResumeFile}
                        />
                    </div>
                ) : (
                    <>
                        <div className="h-full">
                            <RequirementCardProbidPrep
                                ref={requirementCardRef}
                                onPromptChange={setRequirementCardData}
                                setIsRequirementFile={setIsRequirementFile}
                                isFileUploaded={isRequirementFile}
                            />
                        </div>
                        <div className="h-full">
                            <ResumeCardProbidPrep
                                ref={resumeCardRef}
                                isReset={isReset}
                                onPromptChange={setResumeCardData}
                                setIsResumeFile={setIsResumeFile}
                                isFileUploaded={isResumeFile}
                            />
                        </div>
                    </>
                )}
            </div>
            <div>
                <div className="bg-card mt-4 p-4 space-y-2 rounded-3xl">
                    <h2 className="text-xl font-semibold">Action</h2>
                    <div className="flex gap-2 items-center ">
                        <div className="w-full">
                            <Select onValueChange={setSelectedPrompt}  >
                                <SelectTrigger className="w-[100%]" >
                                    <SelectValue placeholder="Select Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {promptData && Array.isArray(promptData) && promptData.map((item: any) => (
                                            <SelectItem key={item.id} value={item.prompt}>
                                                {item.title}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <button
                                className={`bg-blue-600 px-4 py-2 rounded-sm text-white flex items-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                onClick={handleSubmit}
                                disabled={loading || !selectedPrompt}
                            >
                                <Send className="bg-blue-600 px-2 py-2 rounded-sm size-8" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="rounded-md mt-6 shadow-md">
                    <BoxLoader />
                </div>
            ) : resultCard && (
                <div className="rounded-md mt-6 shadow-md">
                    <ResultCardProbidPrep content={resultCard} />

                </div>

            )}


        </div>
    );
};

export default Probidprep;
