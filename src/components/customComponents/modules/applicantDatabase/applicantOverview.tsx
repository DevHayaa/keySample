"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Phone,
    Mail,
    MapPin,
    User,
    Briefcase,
    Shield,
    FileText,
    Calendar,
    Globe,
    Flag,
    Users,
    UserCheck,
    ShieldCheck,
    Pencil,
    CheckCircle,
    FileSignature,
    Send,
    File,
    Edit,
    AlertTriangle,
    LinkIcon,
    Package2,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ApplicantLastThreeCards from "./applicant-last-three-cards";
import ApplicantBGInfo from "./applicant-bg-info";
// import ApplicantSubmissionPlacement from "./applicant-submission-placement";
// import ApplicantRef from "./applicant-ref";
// import ApplicantWorkflow from "../../applicant-workflow";
// import { useAppSelector } from "@/lib/redux/store";
import { getApi } from "@/lib/services/apiService";
// import { toast } from "@/hooks/use-toast";
import { Skeleton } from "../../../ui/skeleton";
import { Store } from "@/app/store/store";
import { toast } from "@/hooks/use-toast";
// import GenericNotes from "../../../common-component/generic-notes";
// import ApplicantFiles from "./applicant-files/applicant-files";
// import CandidateWorkflow from "./candidate-workflow/candidate-workflow-updated";
// import SubmissionsCard from "../../partner-&-client-tracking/companyOverview/SubmissionsCardComponent";

const tabItems = [
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
    { value: "notes", label: "Notes" },
    { value: "references", label: "References" },
    { value: "files", label: "Files" },
];

const sourceLabels: any = {
    referral: "Referral",
    corporate_website: "Corporate Website",
    linkedIn: "LinkedIn",
    indeed: "Indeed",
    partner_owned_resumes: "Partner Owned Resumes",
    third_party: "Third Party",
};



export default function ApplicantOverview({ applicantId }: any) {
    const [jobId, setJobId] = useState("");
    const [jobKey, setJobKey] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [applicant, setApplicant]: any = useState({});
    const [submision, setSubmision]: any = useState({});
    const [professionalBG, setProfessionalBG] = useState({});
    const [loading, setLoading] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const userData = Store((state: any) => state.users);
    const [isCompanyExpanded, setIsCompanyExpanded] = useState(true);
    const router = useRouter();
    const [submissionStatus, setSubmissionStatus] = useState("Not Specified");



    const formatSubmissionStatus = (status: any) => {
        if (!status) return "Not Specified";
        return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char: any) => char.toUpperCase());
    };

    const getSubmissionBadgeClass = (status: any) => {
        switch (status?.toLowerCase()) {
            case "accepting_candidates":
                return "bg-green-100 text-green-800"; // Green for "accepting_candidates"
            case "covered":
                return "bg-yellow-100 text-yellow-800"; // Yellow for "covered"
            case "no bid":
                return "bg-gray-100 text-gray-800"; // Gray for "no bid"
            case "placed":
                return "bg-blue-100 text-blue-800"; // Blue for "placed"
            case "lost":
                return "bg-red-100 text-red-800"; // Red for "lost"
            default:
                return "bg-gray-100 text-gray-800"; // Default styling for unknown statuses
        }
    };

    const getStatusBadgeClass = (status: any) => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800";
            case "submitted":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getApplicant = async () => {
        setLoading(true);
        try {

            const res = await getApi(
                `applicant/applicants/${applicantId}`, userData?.data?.access_token);
            const data = await res.json();

            console.log(data);

            setApplicant(data);
            setProfessionalBG(data);

        } catch (e) {
            console.error(e);
            toast({
                title: "Error",
                description:
                    e instanceof Error ? e.message : "An unknown error occurred",
                variant: "error",
                duration: 1000
            });
        } finally {
            setLoading(false);
        }
    }

    
    useEffect(() => {
        setHydrated(true); // Ensures we use Zustand's state only after hydration
    }, []);

    useEffect(() => {
      
        if (hydrated && userData?.data?.access_token) {
            getApplicant();
         }  // }    getProfessionalBG();
    }, [hydrated]);

   

    return (
        <div className=" p-4 lg:p-6 overflow-auto">
            <Breadcrumb className="py-2">
                <BreadcrumbList>
                    {/* <BreadcrumbItem>
                        <Link href="/dashboard">Home</Link>
                    </BreadcrumbItem> */}
                    {/* <BreadcrumbSeparator /> */}
                    <BreadcrumbItem>
                        <Link href="/applicant-database">Applicant Database</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href="/applicant-tracking">
                            Applicant ID: {applicant?.app_id}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize">{activeTab}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Applicant Overview
                    </CardTitle>
                    <Button variant="outline" size="icon" onClick={() =>
                        router.push(
                            `/applicant-database/edit-applicant/${applicant.id}`
                        )
                    }>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit job details</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex">

                        <div className="flex justify-between w-full max-lg:flex-col gap-4">
                            <Card className=" w-full">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="pt-2">Personal Information</CardTitle>
                                    {/* <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        router.push(
                                                            `/applicant-tracking/edit-applicant/${applicant.id}`
                                                        )
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Edit personal information
                                                    </span>
                                                </Button> */}
                                </CardHeader>
                                <CardContent className="grid gap-4 px-5 pt-4">
                                    {loading ? (
                                        <>
                                            <Skeleton className="h-8 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <div className="flex space-x-4">
                                                <Skeleton className="h-8 w-1/4" />
                                                <Skeleton className="h-8 w-1/4" />
                                            </div>
                                            <Skeleton className="h-10 w-full" />
                                            <Skeleton className="h-10 w-full" />
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center space-x-4"
                                                >
                                                    <Skeleton className="h-5 w-5 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-20" />
                                                        <Skeleton className="h-4 w-24" />
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div className="border-b pb-4">
                                                <h2 className="text-2xl font-bold text-primary capitalize break-all">
                                                    {`${applicant?.first_name ?? " "} ${applicant?.last_name ?? " "}`}
                                                </h2>
                                                <p className="text-sm text-muted-foreground mt-1 capitalize">
                                                    {applicant?.title?.length
                                                        ? applicant.title
                                                            .join(" | ")
                                                        : "Not Specified"}
                                                </p>
                                            </div>
                                            <div className="flex space-x-4">
                                                <div className="flex-1">
                                                    <Label>Application Status</Label>
                                                    <div
                                                        className={`mt-1 ${getStatusBadgeClass(
                                                            applicant?.status || ""
                                                        )} text-sm font-medium px-2.5 py-0.5 rounded-full w-fit capitalize`}
                                                    >
                                                        {applicant?.status || "Not Set"}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <Label>Submission Status</Label>
                                                    <div
                                                        className={`mt-1 text-sm font-medium px-2.5 py-0.5 rounded-full w-fit capitalize ${getSubmissionBadgeClass(
                                                            submissionStatus
                                                        )}`}
                                                    >
                                                        {formatSubmissionStatus(submissionStatus)}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="applicantId">Applicant ID</Label>
                                                <Input
                                                    id="applicantId"
                                                    value={`APP-${applicant?.app_id}`}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <Shield className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium">Security Clearance</p>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        {applicant?.clearance_level?.length
                                                            ? applicant.clearance_level
                                                                .join(", ")
                                                            : "Not Specified"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Application Date
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {applicant?.date_added
                                                            ? new Date(
                                                                applicant.date_added
                                                            ).toLocaleDateString()
                                                            : "Not Specified"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium">Skills</p>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        {applicant?.skills?.length
                                                            ? applicant.skills.join(", ")
                                                            : "Not Specified"}
                                                    </p>
                                                </div>
                                            </div>

                                        </>
                                    )}
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                    <div className="flex justify-between w-full max-lg:flex-col gap-4 pt-6">
                        <Card className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2 px-5 pb-5">
                                {loading ? (
                                    <>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="flex items-center space-x-4"
                                            >
                                                <Skeleton className="h-5 w-5 rounded-full" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-20" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center space-x-4">
                                            <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">Email</p>
                                                <p className="text-sm text-muted-foreground break-all">
                                                    {applicant?.email_1 || "Not Specified"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Home Phone</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {applicant?.home_phone || "Not Specified"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Work Phone</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {applicant?.work_phone || "Not Specified"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">Address</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {applicant?.address || "Not Specified"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Secondary Email
                                                </p>
                                                <p className="text-sm text-muted-foreground break-all">
                                                    {applicant?.email_2 || "Not Specified"}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Application Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-5 pb-5 md:flex">
                                {loading ? (
                                    <>
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="flex items-center space-x-4"
                                            >
                                                <Skeleton className="h-5 w-5 rounded-full" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-20" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center space-x-4">
                                            <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">Source</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {applicant?.source
                                                        ? sourceLabels[applicant.source]
                                                        : "Not Specified"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <User className="h-5 w-5 text-muted-foreground shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">Ownership</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {applicant?.ownership
                                                        ? `${applicant.ownership.first_name} ${applicant.ownership.last_name} (${applicant.ownership.email})`
                                                        : "Not assigned"}
                                                </p>
                                            </div>
                                        </div>
                                        {/* <div className="flex items-center space-x-4">
                                            <LinkIcon className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Referred by</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {applicant.referred_by?.company_name ||
                                                        "Not referred"}
                                                </p>
                                            </div>
                                        </div> */}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="w-full flex-col gap-2">
                        <div className="flex flex-col sm:gap-4 sm:py-4 py-4">
                            <main className="grid gap-6 md:grid-cols-2">
                                <ApplicantBGInfo
                                    professionalBGData={professionalBG}
                                    loading={loading}
                                />

                                <Card className="">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-2xl font-semibold leading-none flex items-center">
                                            Company Information
                                        </CardTitle>

                                    </CardHeader>

                                    <CardContent className="px-5 pb-5">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Incorporation Name
                                                </p>
                                                <p className="text-sm text-muted-foreground capitalize">
                                                    {applicant.incorporation_name
                                                        ? applicant.incorporation_name
                                                        : "Not Specified"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Contractor Status
                                                </p>
                                                <Badge>
                                                    {applicant.employment_status ===
                                                        "term_employee" && "Term Employee"}
                                                    {applicant.employment_status ===
                                                        "incorporation" && "Incorporation"}
                                                    {applicant.employment_status ===
                                                        "permanent_employee" && "Permanent Employee"}
                                                    {applicant.employment_status === "unsure" &&
                                                        "Unsure"}
                                                    {applicant.employment_status ===
                                                        "sole_proprietor" && "Sole Proprietor"}
                                                    {applicant.employment_status ===
                                                        "third_party" && "Third Party"}
                                                    {!applicant.employment_status &&
                                                        "Not Specified"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>

                                </Card>
                            </main>
                        </div>
                    </div>
                    <ApplicantLastThreeCards
                        applicantData={applicant}
                        loading={loading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
