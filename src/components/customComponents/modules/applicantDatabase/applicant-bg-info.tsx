'use client'

import { useState } from "react"
import {
    Award,
    Briefcase,
    Building,
    ChevronDown,
    ChevronUp,
    GraduationCap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "../../../ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tabItems = [
    { value: "experience", label: "Experience" },
    { value: "education", label: "Education" },
    { value: "certification", label: "Certification" },

]
const degreeOptions: any = {
    "high-school": "High School",
    "associate": "Associate Degree",
    "bachelor": "Bachelor's Degree",
    "master": "Master's Degree",
    "doctorate": "Doctorate"
};

export default function ApplicantBGInfo({ professionalBGData, loading }: any) {
    const [activeTab, setActiveTab] = useState("experience")

    return (
        <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-2xl font-semibold leading-none flex items-center">
                    Professional Background
                </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5 lg-grid grid-cols-3 ">
                <div className="full">
                    <div className="lg:hidden">
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a tab" />
                            </SelectTrigger>
                            <SelectContent>
                                {tabItems.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="hidden lg:grid grid-cols-3">
                            {tabItems.map((item) => (
                                <TabsTrigger key={item.value} value={item.value}>
                                    {item.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Work Experience */}
                        <TabsContent value="experience">
                            {loading ? (
                                <ul className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i} className="bg-muted p-3 rounded-md flex items-start">
                                            <Skeleton className="h-10 w-10 rounded-sm" />
                                            <div className="space-y-2">
                                                <Skeleton className="ms-4 h-6 w-48" />
                                                <Skeleton className="ms-4 h-4 w-48" />
                                                <Skeleton className="ms-4 h-4 w-20" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="space-y-4">
                                    {professionalBGData?.applicant_work?.map((job: any, index: number) => (
                                        <li key={index} className="bg-muted p-3 rounded-md flex items-start">
                                            <Building className="h-5 w-5 mr-3 mt-1 text-muted-foreground" />
                                            <div>
                                                <h3 className="font-semibold capitalize">{job.company_name || 'Not Specified'}</h3>
                                                <p className="text-sm text-muted-foreground capitalize">{job.title || ''}</p>
                                                <p className="text-xs text-muted-foreground">{job.start_date || ''} {job.is_present ? '/ Present' : (job.end_date ? '/ ' + job.end_date : '')}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </TabsContent>

                        {/* Education */}
                        <TabsContent value="education">
                            <ul className="space-y-4">
                                {professionalBGData?.applicant_education?.map((edu: any, index: number) => (
                                    <li key={index} className="bg-muted p-3 rounded-md flex items-start">
                                        <GraduationCap className="h-5 w-5 mr-3 mt-1 text-muted-foreground" />
                                        <div>
                                            <h3 className="font-semibold capitalize">{edu.degree || ''}</h3>
                                            <p className="text-sm text-muted-foreground">{edu.awarding_institute || ''}</p>
                                            <p className="text-sm text-muted-foreground">{edu.degree_program || ''}</p>
                                            <p className="text-xs text-muted-foreground">{edu.start_date || ''} {edu.is_present ? '/ Present' : (edu.end_date ? '/ ' + edu.end_date : '')}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </TabsContent>

                        {/* Certifications */}
                        <TabsContent value="certification">
                            <ul className="space-y-4">
                                {professionalBGData?.applicant_certificate?.map((cert: any, index: number) => (
                                    <li key={index} className="bg-muted p-3 rounded-md flex items-start">
                                        <Award className="h-5 w-5 mr-3 mt-1 text-muted-foreground shrink-0" />
                                        <div>
                                            <h3 className="font-semibold capitalize">{cert.certification_title || 'Not Specified'}</h3>
                                            <p className="text-sm text-muted-foreground">{cert.awarding_institute || ''}</p>
                                            <p className="text-xs text-muted-foreground">{cert.start_date || ''} {cert.is_present ? '/ Present' : (cert.end_date ? '/ ' + cert.end_date : '')}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    );
}


