"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { CalendarIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import moment from "moment";
import { getApi, patchApi, postApi, postWithFile, resumeUpload } from "@/lib/services/apiService";
import { AlertDialog } from "../../../ui/alert-dialog";
// import ConfirmationModal from "../../../common-component/confirmationModal";
import { useRouter } from "next/navigation";

import CreatableSelect from "react-select/creatable";
import ReactSelect from "react-select";
import countries from "world-countries";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { PhoneInput } from "@/components/commonComponents/phone-input";
import { SimpleDatePicker } from "@/components/commonComponents/simpleDatePicker";
import CurrencySelect from "@/components/commonComponents/currencyComponent";
import { toast } from "@/hooks/use-toast";
import { Store } from "@/app/store/store";
import ConfirmationModal from "@/components/commonComponents/confirmationModal";
interface DatePickerProps {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

interface CardWrapperProps {
  children: ReactNode;
  onDelete: () => void;
  canDelete: boolean;
}

interface ExperienceFieldsProps {
  data: any;
  onChange: (data: any) => void;
  onDelete: () => void;
  canDelete: boolean;
}

interface EducationFieldsProps {
  data: any;
  onChange: (data: any) => void;
  onDelete: () => void;
  canDelete: boolean;
}

interface CertificationFieldsProps {
  data: any;
  onChange: (data: any) => void;
  onDelete: () => void;
  canDelete: boolean;
}

const clearanceOptions = [
  { value: "Reliability Status", label: "Reliability Status" },
  { value: "Secret", label: "Secret" },
  { value: "Top Secret", label: "Top Secret" },
  { value: "Enhanced Reliability", label: "Enhanced Reliability" },
  { value: "Secret with NATO", label: "Secret with NATO" },
  { value: "Top Secret with CI", label: "Top Secret with CI" },
  { value: "Top Secret with SI/TK", label: "Top Secret with SI/TK" },
  {
    value: "Top Secret with Special Intelligence (TS/SI)",
    label: "Top Secret with Special Intelligence (TS/SI)",
  },
  { value: "Enhanced Top Secret (ETS)", label: "Enhanced Top Secret (ETS)" },
  {
    value: "Enhanced Top Secret with Special Intelligence (ETS/SI)",
    label: "Enhanced Top Secret with Special Intelligence (ETS/SI)",
  },
  {
    value: "Enhanced Top Secret with NATO (ETS/NATO)",
    label: "Enhanced Top Secret with NATO (ETS/NATO)",
  },
  {
    value: "Enhanced Top Secret with CI (ETS/CI)",
    label: "Enhanced Top Secret with CI (ETS/CI)",
  },
  { value: "Protected A", label: "Protected A" },
  { value: "Protected B", label: "Protected B" },
  { value: "Confidential", label: "Confidential" },
  { value: "Secret Restricted", label: "Secret Restricted" },
  { value: "Top Secret Restricted", label: "Top Secret Restricted" },
  {
    value: "Designated Organization Screening (DOS)",
    label: "Designated Organization Screening (DOS)",
  },
  {
    value: "Critical Nuclear Weapon Information (CNWDI)",
    label: "Critical Nuclear Weapon Information (CNWDI)",
  },
  {
    value: "Controlled Goods Program (CGP)",
    label: "Controlled Goods Program (CGP)",
  },
  { value: "NATO Cosmic Top Secret", label: "NATO Cosmic Top Secret" },
  { value: "NATO Secret UE", label: "NATO Secret UE" },
  { value: "NATO Secret", label: "NATO Secret" },
  { value: "NATO Confidential", label: "NATO Confidential" },
];

interface TagInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  dropdownOptions?: { value: string; label: string }[]; // Optional dropdown options
  isMulti?: boolean; // Optional for multiple select
  isClearable?: boolean; // Optional for clearable select
  isSearchable?: boolean; // Optional for searchable select
}

const TagInput = ({
  id,
  label,
  placeholder,
  value = [], // Default to empty array
  onChange,
  dropdownOptions = [], // Default to empty array if not provided
  isMulti = true, // Defaults to multi-select for tag input
  isClearable = true, // Defaults to clearable
  isSearchable = true, // Defaults to searchable select
}: TagInputProps) => {
  const handleChange = (newValue: any) => {
    if (newValue) {
      const tags = newValue?.map((option: any) => option.value);
      onChange(tags); // Update tags
    } else {
      onChange([]); // No tags selected
    }
  };

  const handleCreate = (inputValue: string) => {
    onChange([...value, inputValue]); // Add the new tag to the list
  };

  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
      borderColor: "hsl(var(--border))",
      "&:hover": {
        borderColor: "hsl(var(--border-hover))",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
    }),
    option: (provided: any, state: { isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "hsl(var(--accent))"
        : "hsl(var(--background))",
      color: state.isFocused
        ? "hsl(var(--accent-foreground))"
        : "hsl(var(--foreground))",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    indicatorSeparator: () => ({
      display: "none", // This removes the vertical bar before the dropdown indicator
    }),
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {dropdownOptions && dropdownOptions.length > 0 ? (
        <CreatableSelect
          id={id}
          isMulti={isMulti}
          isClearable={isClearable}
          isSearchable={isSearchable}
          placeholder={placeholder}
          value={value.map((tag) => ({
            value: tag,
            label: tag.charAt(0).toUpperCase() + tag.slice(1),
          }))}
          onChange={handleChange}
          styles={selectStyles}
          options={dropdownOptions}
          noOptionsMessage={() => null}
          className="text-sm"
        />
      ) : (
        <CreatableSelect
          id={id}
          isMulti
          placeholder={placeholder}
          value={value.map((tag) => ({ value: tag, label: tag }))}
          onChange={handleChange}
          styles={selectStyles}
          onCreateOption={handleCreate}
          noOptionsMessage={() => null}
          components={{
            DropdownIndicator: () => null,
          }}
          className="text-sm"
        />
      )}
    </div>
  );
};

const DatePicker = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
}: DatePickerProps) => {
  // Track the popover's open state
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    // Call the onChange handler for updating the selected date
    onChange(date);
    // Close the popover when a date is selected
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const FieldWrapper = ({
  label,
  required = false,
  children,
}: FieldWrapperProps) => (
  <div className="flex flex-col space-y-2">
    <Label>
      {label}
      {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
  </div>
);

const CardWrapper = ({ children, onDelete, canDelete }: CardWrapperProps) => (
  <Card className="w-full mb-4 max-w-[850px] p-4 relative">
    <CardContent className="pt-6 space-y-4 overflow-y-auto max-h-[540px]">
      <div className="grid gap-4 space-y-4">{children}</div>
    </CardContent>
    {canDelete && (
      <div className="absolute top-4 right-4">
        <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
          <X className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    )}
  </Card>
);

const ExperienceFields = ({
  data,
  onChange,
  onDelete,
  canDelete,
}: ExperienceFieldsProps) => (
  <CardWrapper onDelete={onDelete} canDelete={canDelete}>
    <div className="grid gap-4 sm:grid-cols-2">
      <FieldWrapper label="Position Title">
        <Input
          id="title"
          placeholder="Enter position title"
          value={data.title || ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </FieldWrapper>
      <FieldWrapper label="Employer">
        <Input
          id="company_name"
          placeholder="Enter employer"
          value={data.company_name || ""}
          onChange={(e) => onChange({ ...data, company_name: e.target.value })}
        />
      </FieldWrapper>
    </div>
    <FieldWrapper label="Project">
      <Input
        id="project"
        placeholder="Enter project name"
        value={data.project || ""}
        onChange={(e) => onChange({ ...data, project: e.target.value })}
      />
    </FieldWrapper>
    <div className="grid gap-4 sm:grid-cols-2">
      <SimpleDatePicker
        id="start_date"
        label="Start Date"
        value={data.start_date ? new Date(data.start_date) : undefined}
        onchange={(date) =>
          onChange({ ...data, start_date: moment(date).format("YYYY-MM-DD") })
        }
      />
      <div className="space-y-2">
        <SimpleDatePicker
          id="end_date"
          label="End Date"
          value={data.end_date ? new Date(data.end_date) : undefined}
          onchange={(date) =>
            onChange({ ...data, end_date: moment(date).format("YYYY-MM-DD") })
          }
          disabled={data.is_present}
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_present"
            checked={data.is_present || false}
            onCheckedChange={(checked) =>
              onChange({
                ...data,
                is_present: checked,
                end_date: checked ? null : data.end_date,
              })
            }
          />
          <Label htmlFor="is_present">Present</Label>
        </div>
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <FieldWrapper label="Country">
        <Input
          id="country"
          placeholder="Enter country"
          value={data.country || ""}
          onChange={(e) => onChange({ ...data, country: e.target.value })}
        />
      </FieldWrapper>
      <FieldWrapper label="State/Province">
        <Input
          id="province"
          placeholder="Enter state/province.. "
          value={data.province || ""}
          onChange={(e) => onChange({ ...data, province: e.target.value })}
        />
      </FieldWrapper>
      <FieldWrapper label="City">
        <Input
          id="city"
          placeholder="Enter city"
          value={data.city || ""}
          onChange={(e) => onChange({ ...data, city: e.target.value })}
        />
      </FieldWrapper>
    </div>
    {/* New Skills Experience Field */}
    <div className="mt-4">
      <Label>Skills & Experience</Label>
      {data.applicant_skills?.map((skill: any, index: any) => (
        <div key={index} className="flex gap-4 items-center mt-2">
          <Input
            placeholder="Skill Name"
            value={skill.skill || ""}
            onChange={(e) => {
              const updatedSkills = [...data.applicant_skills];
              updatedSkills[index].skill = e.target.value;
              onChange({ ...data, applicant_skills: updatedSkills });
            }}
          />
          <Input
            type="number"
            placeholder="Years of Experience"
            min="0"
            value={skill.years_of_experience || ""}
            onChange={(e) => {
              const updatedSkills = [...data.applicant_skills];
              updatedSkills[index].years_of_experience = parseInt(e.target.value, 10) || 0;
              onChange({ ...data, applicant_skills: updatedSkills });
            }}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              const updatedSkills = data.applicant_skills.filter((_: any, i: number) => i !== index);
              onChange({ ...data, applicant_skills: updatedSkills });
            }}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="mt-2 w-full"
        onClick={() => {
          const updatedSkills = [...(data.applicant_skills || []), { skill: "", years_of_experience: 0 }];
          onChange({ ...data, applicant_skills: updatedSkills });
        }}
      >
        Add Skill
      </Button>
    </div>
  </CardWrapper>
);

const EducationFields = ({
  data,
  onChange,
  onDelete,
  canDelete,
}: EducationFieldsProps) => {
  const eduFileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    eduFileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Perform the upload logic here, e.g., sending the file to the server.
      const uploadedFile = files[0];
      console.log("Uploaded file:", uploadedFile);
      // Add your file upload handling logic here
      // Example: Update the form data with the file information
      onChange({ ...data, file: uploadedFile });
    }
  };

  return (
    <CardWrapper onDelete={onDelete} canDelete={canDelete}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldWrapper label="Education Level">
          <Select
            onValueChange={(value) => onChange({ ...data, degree: value })}
            value={data.degree ?? ""}
          >
            <SelectTrigger id="degree">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high_school">High School</SelectItem>
              <SelectItem value="associate">Associate Degree</SelectItem>
              <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
              <SelectItem value="masters">Master&apos;s Degree</SelectItem>
              <SelectItem value="doctorate">Doctorate</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Awarding Institute">
          <Input
            id="awarding_institute"
            placeholder="Enter institute name"
            value={data.awarding_institute || ""}
            onChange={(e) =>
              onChange({ ...data, awarding_institute: e.target.value })
            }
          />
        </FieldWrapper>
      </div>
      <FieldWrapper label="Program">
        <Input
          id="degree_program"
          placeholder="Enter program name"
          value={data.degree_program || ""}
          onChange={(e) =>
            onChange({ ...data, degree_program: e.target.value })
          }
        />
      </FieldWrapper>
      <div className="grid gap-4 sm:grid-cols-2">
        <SimpleDatePicker
          id="start_date"
          label="Start Date"
          value={data.start_date ? new Date(data.start_date) : undefined}
          onchange={(date) =>
            onChange({ ...data, start_date: moment(date).format("YYYY-MM-DD") })
          }
        />
        <div className="space-y-2">
          <SimpleDatePicker
            id="end_date"
            label="End Date"
            value={data.end_date ? new Date(data.end_date) : undefined}
            onchange={(date) =>
              onChange({ ...data, end_date: moment(date).format("YYYY-MM-DD") })
            }
            disabled={data.is_present}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_present"
              checked={data.is_present || false}
              onCheckedChange={(checked) =>
                onChange({
                  ...data,
                  is_present: checked,
                  end_date: checked ? null : data.end_date,
                })
              }
            />
            <Label htmlFor="is_present">Present</Label>
          </div>
        </div>
      </div>
      <FieldWrapper label="Country">
        <Input
          id="country"
          placeholder="Enter country"
          value={data.country || ""}
          onChange={(e) => onChange({ ...data, country: e.target.value })}
        />
      </FieldWrapper>
    </CardWrapper>
  );
};

const CertificationFields = ({
  data,
  onChange,
  onDelete,
  canDelete,
}: CertificationFieldsProps) => (
  <CardWrapper onDelete={onDelete} canDelete={canDelete}>
    {/* <div className="flex items-center space-x-2 mb-4">
      <Button variant="outline" size="sm">
        <Upload className="mr-2 h-4 w-4" />
        Upload
      </Button>
      <span className="text-sm text-muted-foreground">Upload certificate</span>
    </div> */}
    <div className="grid gap-4 sm:grid-cols-2">
      <FieldWrapper label="Certificate Title">
        <Input
          id="certification_title"
          placeholder="Enter certificate title"
          value={data.certification_title || ""}
          onChange={(e) =>
            onChange({ ...data, certification_title: e.target.value })
          }
        />
      </FieldWrapper>
      <FieldWrapper label="Awarding Institute">
        <Input
          id="awarding_institute"
          placeholder="Enter institute name"
          value={data.awarding_institute || ""}
          onChange={(e) =>
            onChange({ ...data, awarding_institute: e.target.value })
          }
        />
      </FieldWrapper>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <SimpleDatePicker
        id="start_date"
        label="Start Date"
        value={data.start_date ? new Date(data.start_date) : undefined}
        onchange={(date) =>
          onChange({ ...data, start_date: moment(date).format("YYYY-MM-DD") })
        }
      />
      <div className="space-y-2">
        <SimpleDatePicker
          id="end_date"
          label="End Date"
          value={data.end_date ? new Date(data.end_date) : undefined}
          onchange={(date) =>
            onChange({ ...data, end_date: moment(date).format("YYYY-MM-DD") })
          }
          disabled={data.is_present}
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_present"
            checked={data.is_present || false}
            onCheckedChange={(checked) =>
              onChange({
                ...data,
                is_present: checked,
                end_date: checked ? null : data.end_date,
              })
            }
          />
          <Label htmlFor="is_present">Present</Label>
        </div>
      </div>
    </div>
  </CardWrapper>
);

export default function AddApplicant({ applicantId }: any) {
  //   const userData = useAppSelector((state) => state.auth.userData);
  const userData = Store((state: any) => state.users);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("experience");
  const [hydrated, setHydrated] = useState(false);
  const tabItems = [
    { value: "experience", label: "Experience" },
    { value: "education", label: "Education" },
    { value: "certification", label: "Certification" },

  ];

  const [formData, setFormData]: any = useState({
    first_name: "",
    last_name: "",
    title: [] as string[],
    email_1: "",
    status: "",
    clearance_level: [] as string[],
    home_phone: "",
    work_phone: "",
    referred_by: null,
    email_2: "",
    address: "",
    incorporation_name: "",
    employment_status: "",
    source: "",
    currency: "",
    expected_min_pay_rate: null,
    expected_max_pay_rate: null,
    expected_min_annual_rate: null,
    expected_max_annual_rate: null,
    notes: "",
    linkedin: "",
    twitter: "",
    Other: "",
    labor_category: [] as string[],
    skills: [] as string[],
    applicant_work: [
      {
        title: "",
        company_name: "",
        project: "",
        start_date: null,
        end_date: null,
        country: "",
        province: "",
        city: "",
        is_present: false,

      },
    ],
    applicant_education: [
      {
        degree: "",
        awarding_institute: "",
        degree_program: "",
        start_date: null,
        end_date: null,
        country: "",
        is_present: false,
      },
    ],
    applicant_certificate: [
      {
        certification_title: "",
        awarding_institute: "",
        start_date: null,
        end_date: null,
        is_present: false,
      },
    ],
  });

  const [openModal, setOpenModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [Referredby, setReferredby]: any = useState(null);
  const handleContentChange = (reason: any) => {
    // setContent(reason);
    setFormData((preValue: any) => ({
      ...preValue,
      notes: reason,
    }));
  };
  const router = useRouter();

  const getApplicant = async (applicantId: number) => {
    await getApi(
      `applicant/applicants/${applicantId}/`,
      userData?.data?.access_token
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res) {

        } else {

          setNewData(res);
        }

      })
      .catch((e) => {
        console.log(e);
        return e;
      });
  };


  useEffect(() => {
    setHydrated(true); // Ensures we use Zustand's state only after hydration
  }, []);

  useEffect(() => {

    if (hydrated && userData?.data?.access_token && applicantId) {
      getApplicant(applicantId)
    }
  }, [hydrated]);


  const setResumeParser = (data: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      first_name: data?.first_name || data.basic_info?.first_name || "",
      last_name: data?.last_name || data.basic_info?.last_name || "",
      title: data?.basic_info?.title
        ? Array.isArray(data?.basic_info.title)
          ? data?.basic_info.title
          : [data?.basic_info.title]
        : Array.isArray(data?.title)
          ? data.title
          : [],
      email_1: data?.email_1 || data.basic_info?.email_1 || "",
      status: data?.status || "",
      clearance_level: data?.basic_info?.clearance_level
        ? Array.isArray(data?.basic_info.clearance_level)
          ? data?.basic_info.clearance_level
          : [data?.basic_info.clearance_level]
        : Array.isArray(data?.clearance_level)
          ? data.clearance_level
          : [],
      home_phone: data?.home_phone || data.basic_info?.home_phone || "",
      work_phone: data?.work_phone || data.basic_info?.work_phone || "",
      referred_by: data?.referred_by?.id || null,
      email_2: data?.email_2 || data.basic_info?.email_2 || "",
      add: data?.add || "",
      address: data?.address || data.basic_info?.address || "",
      incorporation_name: data?.incorporation_name || "",
      employment_status: data?.employment_status ?? "",
      source: data?.source || "",
      currency: data?.currency || "",
      expected_min_pay_rate: data?.expected_min_pay_rate || null,
      expected_max_pay_rate: data?.expected_max_pay_rate || null,
      expected_min_annual_rate: data?.expected_min_annual_rate || null,
      expected_max_annual_rate: data?.expected_max_annual_rate || null,
      notes: data?.notes || "",
      linkedin: data?.linkedin || "",
      twitter: data?.twitter || "",
      Other: data?.Other || "",
      labor_category: data?.basic_info?.labor_category
        ? Array.isArray(data?.basic_info.labor_category)
          ? data?.basic_info.labor_category
          : [data?.basic_info.labor_category]
        : Array.isArray(data?.labor_category)
          ? data.labor_category
          : [],

      skills: Array.isArray(data?.skills) ? data.skills : [data?.skills ?? ""],
      applicant_work: data?.works?.map((work: any) => ({
        title: work.position_held || "",
        company_name: work.company_name || "",
        // id: work.id || null,
        project: work.project_name || "",
        start_date: null,
        end_date: null,
        is_present: false,
      })) || formData.works,
      applicant_education: data?.educations?.map((education: any) => ({
        degree: education.degree ? "" : "",
        // id: education.id || null,
        awarding_institute: education.awarding_institute || "",
        degree_program: education.degree_program || "",
        start_date: null,
        end_date: null,
        country: education.country || "",
      })) || formData.educations,
      applicant_certificate: data?.certificates?.map((certificate: any) => ({
        certification_title: certificate.title || "",
        // id: certificate.id || null,
        awarding_institute: certificate.awarding_institute || "",
        start_date: null,
        end_date: null,
        is_present: false,
      })) || formData.certificates,
    }));

    setNewReferredby(data);

    setPhoneNumber(data.home_phone ?? data.basic_info?.home_phone);
    setphoneNumberWork(data.work_phone ?? data.basic_info?.work_phone);
  };


  const setNewData = (data: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      first_name: data?.first_name || data.basic_info?.first_name || "",
      last_name: data?.last_name || data.basic_info?.last_name || "",
      title: data?.basic_info?.title
        ? Array.isArray(data?.basic_info.title)
          ? data?.basic_info.title
          : [data?.basic_info.title]
        : Array.isArray(data?.title)
          ? data.title
          : [],
      email_1: data?.email_1 || data.basic_info?.email_1 || "",
      status: data?.status || "",
      clearance_level: data?.basic_info?.clearance_level
        ? Array.isArray(data?.basic_info.clearance_level)
          ? data?.basic_info.clearance_level
          : [data?.basic_info.clearance_level]
        : Array.isArray(data?.clearance_level)
          ? data.clearance_level
          : [],
      home_phone: data?.home_phone || data.basic_info?.home_phone || "",
      work_phone: data?.work_phone || data.basic_info?.work_phone || "",
      referred_by: data?.referred_by?.id || null,
      email_2: data?.email_2 || data.basic_info?.email_2 || "",
      add: data?.add || "",
      address: data?.address || data.basic_info?.address || "",
      incorporation_name: data?.incorporation_name || "",
      employment_status: data?.employment_status ?? "",
      source: data?.source || "",
      currency: data?.currency || "",
      expected_min_pay_rate: data?.expected_min_pay_rate || null,
      expected_max_pay_rate: data?.expected_max_pay_rate || null,
      expected_min_annual_rate: data?.expected_min_annual_rate || null,
      expected_max_annual_rate: data?.expected_max_annual_rate || null,
      notes: data?.notes || "",
      linkedin: data?.linkedin || "",
      twitter: data?.twitter || "",
      Other: data?.Other || "",
      labor_category: data?.basic_info?.labor_category
        ? Array.isArray(data?.basic_info.labor_category)
          ? data?.basic_info.labor_category
          : [data?.basic_info.labor_category]
        : Array.isArray(data?.labor_category)
          ? data.labor_category
          : [],

      skills: Array.isArray(data?.skills) ? data.skills : [data?.skills ?? ""],
      applicant_work: data?.applicant_work
        ? data.applicant_work.map((work: any) => ({
          title: work.title || "",
          id: work.id || null,
          company_name: work.company_name || "",
          project: work.project || "",
          start_date: work.start_date ? moment(work.start_date).format("YYYY-MM-DD") : null,
          end_date: work.end_date ? moment(work.end_date).format("YYYY-MM-DD") : null,
          country: work.country || "",
          province: work.province || "",
          city: work.city || "",
          is_present: work.is_present || false,
          applicant_skills: work.skills_experience
            ? work.skills_experience.map((skill: any) => ({
              skill: skill.skill || "",
              years_of_experience: skill.years_of_experience || 0,
            }))
            : [],

        }))
        : prevState.applicant_work,

      // Education
      applicant_education: data?.applicant_education
        ? data.applicant_education.map((education: any) => ({
          degree: education.degree || "",
          id: education.id || null,
          awarding_institute: education.awarding_institute || "",
          degree_program: education.degree_program || "",
          start_date: education.start_date ? moment(education.start_date).format("YYYY-MM-DD") : null,
          end_date: education.end_date ? moment(education.end_date).format("YYYY-MM-DD") : null,
          country: education.country || "",
          is_present: education.is_present || false,
        }))
        : prevState.applicant_education,

      // Certifications
      applicant_certificate: data?.applicant_certificate
        ? data.applicant_certificate.map((certificate: any) => ({
          certification_title: certificate.certification_title || "",
          id: certificate.id || null,
          awarding_institute: certificate.awarding_institute || "",
          start_date: certificate.start_date ? moment(certificate.start_date).format("YYYY-MM-DD") : null,
          end_date: certificate.end_date ? moment(certificate.end_date).format("YYYY-MM-DD") : null,
          is_present: certificate.is_present || false,
        }))
        : prevState.applicant_certificate,

    }));

    setNewReferredby(data);

    setPhoneNumber(data.home_phone ?? data.basic_info?.home_phone);
    setphoneNumberWork(data.work_phone ?? data.basic_info?.work_phone);
  };

  const setNewReferredby = (data: any) => {
    console.log("officer", data);

    if (data) {
      if (data?.referred_by?.type === "Company") {
        setReferredby({
          id: data.id ? data.id : data?.referred_by?.id || "",
          comp_id: data.comp_id
            ? data.comp_id
            : data?.referred_by?.comp_id || "",
          name: data.company_name
            ? data.company_name
            : data?.referred_by?.company_name || "",
        });
      } else {
        setReferredby({
          id: data.id ? data.id : data?.referred_by?.id || "",
          cont_id: data.cont_id
            ? data.cont_id
            : data?.referred_by?.cont_id || "",
          name: data.name ? data.name : data?.referred_by?.name || "",
        });
      }
    } else {
      setReferredby(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleTagInputChange = (id: string, value: string[]) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleArrayChange = (id: string, index: number, value: any) => {
    setFormData((prev: any) => {
      const newArray = [...(prev[id as keyof typeof prev] as any[])];
      newArray[index] = value;
      return { ...prev, [id]: newArray };
    });
  };

  const handleArrayAdd = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [id]: [...(prev[id as keyof typeof prev] as any[]), {}],
    }));
  };

  const handleArrayRemove = (id: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [id]: (prev[id as keyof typeof prev] as any[]).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };


  const onSubmit = async () => {

    if (!formData.first_name) {
      toast({
        title: "Enter Information",
        description: "Please First Name Field!!",
        variant: "error",
        duration: 1000
      });
      return;
    }

    if (!formData.last_name) {
      toast({
        title: "Enter Information",
        description: "Please Last Name Field!!",
        variant: "error",
        duration: 1000
      });
      return;
    }

    if (!validateEmail(formData.email_1)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address!",
        variant: "error",
        duration: 1000
      });
      return;
    }

    console.log(formData);

    // Remove `referred_by` if it's null
    if (!formData.referred_by) {
      delete formData.referred_by;
      setReferredby(null);
    }

    const updatedFormData = {
      ...formData,
      home_phone: phoneNumber ?? "",
      work_phone: phoneNumberWork ?? "",
    };
    try {
      setIsLoading(true);
      const apiUrl = `applicant/applicants/`;
      const method = applicantId ? patchApi : postApi;
      const response = await method(
        applicantId ? `${apiUrl}${applicantId}/` : apiUrl,
        updatedFormData,
        userData?.data?.access_token
      );
      const res = await response.json();

      if (!res.data) {
        handleError(res);
        setIsLoading(false)
        return;
      }

      const finalApplicantId = applicantId || res.data.id; // Use existing ID or the new ID from POST response

      // Success toast notification
      toast({
        title: "Success",
        description: applicantId
          ? "Applicant updated successfully!"
          : "Applicant added successfully!",
        duration: 1000
      });
      setIsLoading(false);

      // Redirect to the overview page with the applicant ID
      router.push(`/applicant-database/applicant-overview/${finalApplicantId}`);
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "An error occurred while saving data.",
        variant: "destructive",
        duration: 1000
      });
      setIsLoading(false)
    }
  };

  // useEffect(() => {
  //   if (applicantId) {
  //     getApplicant(applicantId).catch((error) => {
  //       console.error("Error fetching applicant data:", error);
  //       // Handle error and prevent null errors
  //     });
  //   }
  // }, [applicantId]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    const formData = new FormData();
    let fileCount = 0;
    for (const file of Array.from(files)) {
      formData.append(`file`, file);
      fileCount++;
    }
    try {
      setIsParsingResume(true);
      const response = await resumeUpload(
        `applicant/resume-parser/`,
        formData,
        userData?.data?.access_token
      );
      console.log("response", response);
      if (!response) {
        throw new Error("Failed to upload file(s)");
      } else {
        toast({
          title: "File(s) Uploaded",
          description: `${fileCount} file(s) uploaded successfully.`,
          duration: 1000
        });
        console.log("response", response);
        setResumeParser(response?.data);
        setIsParsingResume(false);
      }
    } catch (error) {
      console.error("Error uploading file(s):", error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload file(s). Please try again.`,
        variant: "destructive",
        duration: 1000
      });
      setIsParsingResume(false);
    }
    // Reset the file input to allow the same file to be selected again
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleError = (res: any) => {
    const errorDetails = res.error;
    if (Array.isArray(errorDetails)) {
      errorDetails.forEach((message: string) => {
        toast({
          title: "Error",
          description: message,
          variant: "error",
          duration: 1000
        });
      });
    } else if (
      typeof errorDetails === "object" &&
      Object.keys(errorDetails).length > 0
    ) {
      for (const [field, messages] of Object.entries(errorDetails)) {
        if (Array.isArray(messages)) {
          messages.forEach((message: string) => {
            toast({
              title: `Error`,
              description: message,
              variant: "error",
              duration: 1000
            });
          });
        }
      }
    } else {
      toast({
        title: "Error",
        description: "An unknown error occurred",
        variant: "error",
        duration: 1000
      });
    }
  };

  const reset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      title: [],
      email_1: "",
      status: "",
      clearance_level: [],
      home_phone: "",
      work_phone: "",
      referred_by: "",
      email_2: "",
      address: "",
      incorporation_name: "",
      employment_status: "",
      source: "",
      currency: "",
      expected_min_pay_rate: null,
      expected_max_pay_rate: null,
      expected_min_annual_rate: null,
      expected_max_annual_rate: null,
      notes: "",
      linkedin: "",
      twitter: "",
      Other: "",
      labor_category: [],
      skills: [],
      applicant_work: [
        {
          title: "",
          company_name: "",
          project: "",
          start_date: null,
          end_date: null,
          country: "",
          province: "",
          city: "",
          is_present: false,
        },
      ],
      applicant_education: [
        {
          degree: "",
          awarding_institute: "",
          degree_program: "",
          start_date: null,
          end_date: null,
          country: "",
          is_present: false,
        },
      ],
      applicant_certificate: [
        {
          certification_title: "",
          awarding_institute: "",
          start_date: null,
          end_date: null,
          is_present: false,
        },
      ],
    });
    setPhoneNumber("");
    setphoneNumberWork("");
    setReferredby(null);
    setResetModal(false);
  };

  type CountryOption = {
    value: string;
    label: string;
    code: string;
    flag: string;
  };

  const countryOptions: CountryOption[] = countries
    .map((country) => ({
      value: country.cca2,
      label: country.name.common,
      code: country.idd.root + (country.idd.suffixes?.[0] || ""),
      flag: country.flag,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
      borderColor: "hsl(var(--border))",
      "&:hover": {
        borderColor: "hsl(var(--border-hover))",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
    }),
    option: (provided: any, state: { isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "hsl(var(--accent))"
        : "hsl(var(--background))",
      color: state.isFocused
        ? "hsl(var(--accent-foreground))"
        : "hsl(var(--foreground))",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    countryOptions.find((country) => country.value === "") || null
  );

  // Handle phone number change and validate
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setPhoneNumber(newNumber);
    validatePhoneNumber(newNumber, selectedCountry?.value); // Validate with country code
  };

  const validatePhoneNumber = (number: string, countryCode?: any) => {
    if (number && countryCode) {
      const fullNumber = `${selectedCountry?.code}${number}`;
      const isValid = isValidPhoneNumber(fullNumber, countryCode);
      setIsPhoneValid(isValid);
      return isValid;
    } else {
      setIsPhoneValid(false);
      return false;
    }
  };

  const [phoneNumberWork, setphoneNumberWork]: any = useState(null);

  return (
    <>
      {isParsingResume ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-none">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-gray-800 dark:text-gray-300" />
            <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
              Parsing Resume...
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 overflow-y-auto">
          <form className="container max-w-4xl mx-auto p-4 maximum-width ">
            <h1 className="text-3xl font-bold mb-6">
              {applicantId ? "Edit" : "Add"} Applicant
            </h1>
            <div className="space-y-6">
              <Button className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer" type="button" onClick={handleUploadClick}>
                <Upload className="mr-2 h-4 w-4 capitalize" /> Upload Resume
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                multiple={false}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldWrapper label="First Name" required>
                      <Input
                        id="first_name"
                        placeholder="Enter first name"
                        required
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </FieldWrapper>
                    <FieldWrapper label="Last Name" required>
                      <Input
                        id="last_name"
                        placeholder="Enter last name"
                        required
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </FieldWrapper>
                    <div className="grid gap-2 sm:col-span-2">
                      <TagInput
                        id="title"
                        label="Job Title"
                        placeholder="Enter job title and press Enter"
                        value={formData.title}
                        onChange={(value) => handleTagInputChange("title", value)}
                      />
                    </div>
                    <FieldWrapper label="Primary Email" required>
                      <Input
                        id="email_1"
                        type="email"
                        placeholder="Enter primary email"
                        required
                        value={formData.email_1}
                        onChange={handleInputChange}
                      />
                    </FieldWrapper>
                    <FieldWrapper label="Status">
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                        value={formData.status}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="placed">Placed</SelectItem>
                          <SelectItem value="idle">Idle</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldWrapper>
                    <div className="space-y-1">
                      <label className="mb-1 text-sm font-medium">
                        Primary Phone
                      </label>
                      <PhoneInput
                        placeholder="Enter your phone number"
                        value={phoneNumber || ""}
                        onChange={(value) => {
                          setPhoneNumber(value);
                        }}
                      />
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <TagInput
                        id="clearance_level"
                        label="Security Clearance Level"
                        placeholder="Enter clearance level and press Enter"
                        dropdownOptions={clearanceOptions}
                        value={formData.clearance_level}
                        onChange={(value) =>
                          handleTagInputChange("clearance_level", value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full ">
                <CardHeader>
                  <CardTitle>Professional Background</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <Tabs defaultValue="experience" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="experience" className="w-full">
                        Experience
                      </TabsTrigger>
                      <TabsTrigger value="education" className="w-full">
                        Education
                      </TabsTrigger>
                      <TabsTrigger value="certifications" className="w-full">
                        Certifications
                      </TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                      <TabsContent
                        className="mt-0 space-y-4"
                        value="experience"
                      >
                        {formData?.applicant_work?.map((work: any, index: any) => (
                          <ExperienceFields
                            key={index}
                            data={work}
                            onChange={(data) =>
                              handleArrayChange("applicant_work", index, data)
                            }
                            onDelete={() => handleArrayRemove("applicant_work", index)}
                            canDelete={formData.applicant_work.length > 1}
                          />
                        ))}
                        <Button
                          type="button"
                          onClick={() => handleArrayAdd("applicant_work")}
                          variant="outline"
                          className="w-full"
                        >
                          Add More
                        </Button>
                      </TabsContent>
                      <TabsContent
                        className="mt-0 space-y-4"
                        value="education"
                      >
                        {formData?.applicant_education?.map((education: any, index: any) => (
                          <EducationFields
                            key={index}
                            data={education}
                            onChange={(data) =>
                              handleArrayChange("applicant_education", index, data)
                            }
                            onDelete={() => handleArrayRemove("applicant_education", index)}
                            canDelete={formData.applicant_education.length > 1}
                          />
                        ))}
                        <Button
                          type="button"
                          onClick={() => handleArrayAdd("applicant_education")}
                          variant="outline"
                          className="w-full"
                        >
                          Add More
                        </Button>
                      </TabsContent>
                      <TabsContent
                        className="mt-0 space-y-4"
                        value="certifications"
                      >
                        {formData?.applicant_certificate?.map(
                          (certificate: any, index: any) => (
                            <CertificationFields
                              key={index}
                              data={certificate}
                              onChange={(data) =>
                                handleArrayChange("applicant_certificate", index, data)
                              }
                              onDelete={() =>
                                handleArrayRemove("applicant_certificate", index)
                              }
                              canDelete={formData.applicant_certificate.length > 1}
                            />
                          )
                        )}
                        <Button
                          type="button"
                          onClick={() => handleArrayAdd("applicant_certificate")}
                          variant="outline"
                          className="w-full"
                        >
                          Add More
                        </Button>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldWrapper label="Secondary Email">
                      <Input
                        id="email_2"
                        type="email"
                        placeholder="Enter secondary email"
                        value={formData.email_2}
                        onChange={handleInputChange}
                      />
                    </FieldWrapper>
                    <FieldWrapper label="Work Phone">
                      <PhoneInput
                        placeholder="Enter your phone number"
                        value={phoneNumberWork}
                        onChange={(value) => {
                          setphoneNumberWork(value);
                        }}
                      />
                    </FieldWrapper>
                    <div className="grid gap-2 sm:col-span-2">
                      <FieldWrapper label="Address">
                        <Input
                          id="address"
                          placeholder="Enter address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </FieldWrapper>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                      <FieldWrapper label="Incorporation Name">
                        <Input
                          id="incorporation_name"
                          placeholder="Enter incorporation name"
                          value={formData.incorporation_name}
                          onChange={handleInputChange}
                        />
                      </FieldWrapper>
                    </div>
                    <FieldWrapper label="Employment Status">
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("employment_status", value)
                        }
                        value={formData.employment_status}
                      >
                        <SelectTrigger id="employment_status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="incorporation">
                            Incorporation
                          </SelectItem>
                          <SelectItem value="term_employee">
                            Term Employee
                          </SelectItem>
                          <SelectItem value="permanent_employee">
                            Permanent Employee
                          </SelectItem>
                          <SelectItem value="unsure">Unsure</SelectItem>
                          <SelectItem value="sole_proprietor">
                            Sole Proprietor
                          </SelectItem>
                          <SelectItem value="third_party">Third Party</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldWrapper>
                    <FieldWrapper label="Source">
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("source", value)
                        }
                        value={formData.source}
                      >
                        <SelectTrigger id="source">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="corporate_website">
                            Corporate Website
                          </SelectItem>
                          <SelectItem value="linkedIn">LinkedIn</SelectItem>
                          <SelectItem value="indeed">Indeed</SelectItem>
                          <SelectItem value="partner_owned_resumes">
                            Partner Owned Resumes
                          </SelectItem>
                          <SelectItem value="third_party">Third Party</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldWrapper>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldWrapper label="Currency">
                      <CurrencySelect
                        onValueChange={(value: any) =>
                          handleSelectChange("currency", value)
                        }
                        value={formData.currency}
                      />
                    </FieldWrapper>
                    <div className="grid gap-2">
                      <FieldWrapper label="Expected Daily Salary">
                        <div className="flex gap-2">
                          <Input
                            id="expected_min_pay_rate"
                            type="number"
                            min="0"
                            placeholder="Min"
                            value={
                              formData.expected_min_pay_rate
                                ? formData.expected_min_pay_rate
                                : ""
                            }
                            onChange={handleInputChange}
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
                            }
                          />
                          <Input
                            id="expected_max_pay_rate"
                            type="number"
                            min="0"
                            placeholder="Max"
                            value={
                              formData.expected_max_pay_rate
                                ? formData.expected_max_pay_rate
                                : ""
                            }
                            onChange={handleInputChange}
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
                            }
                          />
                        </div>
                      </FieldWrapper>
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <FieldWrapper label="Expected Annual Salary">
                        <div className="flex gap-2">
                          <Input
                            id="expected_min_annual_rate"
                            type="number"
                            min="0"
                            placeholder="Min"
                            value={
                              formData.expected_min_annual_rate
                                ? formData.expected_min_annual_rate
                                : ""
                            }
                            onChange={handleInputChange}
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
                            }
                          />
                          <Input
                            id="expected_max_annual_rate"
                            type="number"
                            min="0"
                            placeholder="Max"
                            value={
                              formData.expected_max_annual_rate
                                ? formData.expected_max_annual_rate
                                : ""
                            }
                            onChange={handleInputChange}
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
                            }
                          />
                        </div>
                      </FieldWrapper>
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <FieldWrapper label="Notes">
                        <textarea
                          id="notes"
                          placeholder="Enter notes...."
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          className=" w-full p-2 border border-gray-300 rounded dark:bg-black dark:text-white dark:border-gray-700"
                          rows={5}
                        />
                      </FieldWrapper>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Connections</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="grid gap-4">
                    <FieldWrapper label="LinkedIn">
                      <Input
                        id="linkedin"
                        placeholder="Enter LinkedIn URL"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                      />
                    </FieldWrapper>
                    <FieldWrapper label="Twitter">
                      <Input
                        id="twitter"
                        placeholder="Enter Twitter URL"
                        value={formData.twitter}
                        onChange={handleInputChange}
                      />
                    </FieldWrapper>
                    <FieldWrapper label="Other">
                      <Input
                        id="Other"
                        placeholder="Enter other social media URL"
                        value={formData.Other}
                        onChange={handleInputChange}
                      />
                    </FieldWrapper>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category & Skills</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="grid gap-4">
                    <TagInput
                      id="labor_category"
                      label="Labour Category"
                      placeholder="Enter category and press Enter"
                      value={formData.labor_category}
                      onChange={(value) =>
                        handleTagInputChange("labor_category", value)
                      }
                    />
                    <TagInput
                      id="skills"
                      label="Skills"
                      placeholder="Enter skill and press Enter"
                      value={formData.skills}
                      onChange={(value) => handleTagInputChange("skills", value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetModal(true)}
              >
                Reset
              </Button>
              <Button
                onClick={() => (applicantId ? setOpenModal(true) : onSubmit())}
                type="button"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : applicantId ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
      <ConfirmationModal
        title={"Update Changes"}
        firstLine={"Are you sure you want to save your changes?"}
        secondLine={"The changes you made will be permanently saved."}
        firstBtnText={"Cancel"}
        secondBtnText={"Update"}
        openModal={openModal}
        isCancel={setOpenModal}
        isConfirm={onSubmit}
      />
      <ConfirmationModal
        title={"Reset Changes"}
        firstLine={"Are you sure you want to reset the changes you made?"}
        secondLine={"Changes you made will not be saved!"}
        firstBtnText={"Cancel"}
        secondBtnText={"Reset"}
        openModal={resetModal}
        isCancel={setResetModal}
        isConfirm={reset}
      />
    </>
  );
}

