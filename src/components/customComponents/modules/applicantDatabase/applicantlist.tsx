"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Search,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteApi, getApi, postApi } from "@/lib/services/apiService";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Pagination from "@/components/commonComponents/paginationComponent";
import { toast } from "@/hooks/use-toast";
import { Store } from "@/app/store/store";

const searchOptions = [
  { value: "clearance", label: "Clearance Level" },
  { value: "education", label: "Education" },
  { value: "certification", label: "Certification" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "placed", label: "Placed" },
  { value: "idle", label: "Idle" },
];

interface Applicant {
  id: string;
  first_name: string;
  last_name: string;
  title: string[] | null;
  email_1: string;
  work_phone: string | null;
  home_phone: string | null;
  clearance_level: string[] | null;
  status: string | null;
  ownership: {
    first_name: string;
    last_name: string;
  };
  app_id: number;
}

export default function Applicantlist() {
  const userData = Store((state: any) => state.users);
  const [applicantData, setApplicantData] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    clearance: [] as string[],
    education: [] as string[],
    certification: [] as string[],
  });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId]: any = useState(0);
  const router = useRouter();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change for next and previous buttons
  const handleNextPage = () => {
    if (page < Math.ceil(totalItems / itemsPerPage)) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const getApplicant = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getApi(
        `applicant/applicants/?page=${page}&page_size=${itemsPerPage}`,
        userData?.data?.access_token
      );
      const data = await res.json();
     
      setApplicantData(data.results);
      setTotalItems(data.count);
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
  }, [itemsPerPage, page, userData?.data?.access_token]);

  useEffect(() => {

    if (userData?.data?.access_token) {

      getApplicant();
    }

  }, [getApplicant]);

  //   const search = async () => {
  //     console.log(statusFilter);

  //     setLoading(true);

  //     if (searchValue.trim() === "") {
  //       getApplicant();
  //     } else {
  //       const fullName = searchValue.trim(); // remove leading and trailing spaces
  //       const nameParts = fullName.split(" "); // split the full name into parts

  //       // Initialize searchObj
  //       const searchObj: any = {};

  //       if (nameParts.length >= 2) {
  //         // If the name has more than two parts, treat the first part as first name and the last part as last name
  //         const firstName = nameParts[0]; // The first word is the first name
  //         const lastName = nameParts[nameParts.length - 1]; // The last word is the last name
  //         searchObj.first_name = firstName;
  //         searchObj.last_name = lastName;
  //       }
  //       // If only one word is provided, search for both first and last name
  //       else if (nameParts.length === 1) {
  //         const name = nameParts[0];
  //         searchObj.first_name = name;
  //         searchObj.last_name = name; // Search for the same value in both fields
  //       }

  //       // Add status and filters if they exist
  //       if (statusFilter.length) {
  //         searchObj["status"] = statusFilter;
  //       }
  //       if (filters?.certification?.length) {
  //         searchObj["certification"] = filters?.certification;
  //       }
  //       if (filters?.clearance?.length) {
  //         searchObj["clearance"] = filters?.clearance;
  //       }
  //       if (filters?.education?.length) {
  //         searchObj["education"] = filters?.education;
  //       }

  //       try {
  //         if (!userData?.user?.organization?.id) {
  //           throw new Error("User organization data is missing");
  //         }

  //         const res = await postApi(
  //           `organization/${userData.user.organization.id}/applicants/conditional-search-api/?page=${page}&page_size=${itemsPerPage}`,
  //           searchObj,
  //           userData.token
  //         );

  //         const data = await res.json();

  //         if (!data.data) {
  //           throw new Error(JSON.stringify(data.error) || "Search failed");
  //         }

  //         console.log("search data", data);

  //         setApplicantData(data.data.results);
  //         setTotalItems(data.data.count);
  //       } catch (e) {
  //         console.error(e);
  //         toast({
  //           title: "Error",
  //           description:
  //             e instanceof Error
  //               ? e.message
  //               : "An unknown error occurred during search",
  //           variant: "error",
  //         });
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     if (searchValue.trim() !== "") {
  //       setPage(1);
  //     }
  //   }, [searchValue]);

  //   const clearAllFilters = () => {
  //     setSearchValue("");
  //     setStatusFilter([]);
  //     setFilters({
  //       clearance: [],
  //       education: [],
  //       certification: [],
  //     });
  //     getApplicant();
  //   };

  const addTag = (category: keyof typeof filters, tag: string) => {
    if (tag.trim()) {
      setFilters((prev) => ({
        ...prev,
        [category]: [...prev[category], tag.trim()],
      }));
    }
  };

  const removeTag = (category: keyof typeof filters, tag: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((t) => t !== tag),
    }));
  };

  const isFiltersApplied =
    Object.values(filters).some((arr) => arr.length > 0) ||
    searchValue !== "" ||
    statusFilter.length > 0;

  //   const onDelete = async () => {
  //     await deleteApi(
  //       `organization/${userData.user.organization.id}/applicants/${selectedApplicantId}`,
  //       userData.token
  //     )
  //       .then((res: any) => {
  //         console.log("res", res);
  //         if (res) {
  //           toast({
  //             title: `Success`,
  //             description: "Applicant deleted Successfully!",
  //           });
  //           setOpenModal(false);
  //           getApplicant();
  //         }
  //       })
  //       .catch((e: any) => {
  //         console.log(e);
  //         setOpenModal(false);
  //         return e;
  //       });
  //   };

  //   const errorHandling = (res: any) => {
  //     const errorDetails = res.error;
  //     if (Array.isArray(errorDetails)) {
  //       // Handle array of error messages
  //       errorDetails.forEach((message: string) => {
  //         toast({
  //           title: "Error",
  //           description: message,
  //           variant: "error",
  //         });
  //       });
  //     } else if (
  //       typeof errorDetails === "object" &&
  //       Object.keys(errorDetails).length > 0
  //     ) {
  //       for (const [field, messages] of Object.entries(errorDetails)) {
  //         if (Array.isArray(messages)) {
  //           messages.forEach((message: string) => {
  //             toast({
  //               title: `Error`,
  //               description: message,
  //               variant: "error",
  //             });
  //           });
  //         }
  //       }
  //     } else {
  //       toast({
  //         title: "Error",
  //         description: "An unknown error occurred",
  //         variant: "error",
  //       });
  //     }
  //   };

  return (
    <div className="flex  w-full flex-col bg-muted/40 overflow-auto">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="flex-1 space-y-4 p-4 md:p-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Applicant Database
            </h2>
            <div className="flex items-center space-x-2">
              <Link href="/applicant-database/add-applicant">
                <Button className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer">
                  <PlusCircle className="mr h-4 w-4" />
                  <span className="max-xxs:hidden" >Add Applicant</span>
                </Button>
              </Link>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Applicants Overview</CardTitle>
              <CardDescription>
                Manage and track applicants through the hiring process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 overflow-x-auto">
                <div className="flex space-y-2 gap-2 max-lg:flex-col md:space-x-2 md:space-y-0">

                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      placeholder="Search Applicant Name..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          // search();
                        }
                      }}
                      className="pl-8"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="">
                        Search by
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[300px] p-4">
                      {searchOptions.map((option) => (
                        <div key={option.value} className="mb-4">
                          <h3 className="mb-2 text-sm font-medium">
                            {option.label}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {filters[
                              option.value as keyof typeof filters
                            ].map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="gap-1"
                              >
                                {tag}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                  onClick={() =>
                                    removeTag(
                                      option.value as keyof typeof filters,
                                      tag
                                    )
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <Input
                            placeholder={`Add ${option.label}`}
                            className="mt-2"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addTag(
                                  option.value as keyof typeof filters,
                                  e.currentTarget.value
                                );
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>


                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="" variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {statusOptions.map((statusOption) => (
                        <DropdownMenuCheckboxItem
                          key={statusOption.value}
                          checked={statusFilter.includes(statusOption.value)}
                          onCheckedChange={(checked) =>
                            setStatusFilter(
                              checked
                                ? [...statusFilter, statusOption.value]
                                : statusFilter.filter(
                                  (item) => item !== statusOption.value
                                )
                            )
                          }
                        >
                          {statusOption.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* <Button onClick={search}>Search</Button> */}


                  {/* {isFiltersApplied && (
                    <Button onClick={clearAllFilters} variant="outline">
                      Clear All
                    </Button>
                  )} */}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile Phone</TableHead>
                      <TableHead>Clearance Level</TableHead>
                      <TableHead>Status</TableHead>
                      {/* <TableHead>Ownership</TableHead> */}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? Array(itemsPerPage)
                        .fill(0)
                        .map((_, index) => (
                          <TableRow key={index}>
                            {Array(9)
                              .fill(0)
                              .map((_, cellIndex) => (
                                <TableCell key={cellIndex}>
                                  <Skeleton className="h-6 w-full" />
                                </TableCell>
                              ))}
                          </TableRow>
                        ))
                      : applicantData.map(
                        (applicant: Applicant, applicantIndex: number) => (
                          <TableRow key={applicant.id}>
                            <TableCell>{(page - 1) * itemsPerPage + applicantIndex + 1}</TableCell>
                            {/* <TableCell>{applicant.app_id}</TableCell> */}
                            <TableCell
                              className="cursor-pointer"
                              onClick={() => {
                                router.push(
                                  `/applicant-database/applicant-overview/${applicant.id}`
                                );
                              }}
                            >{`${applicant.first_name} ${applicant.last_name}`}</TableCell>
                            {/* <TableCell>{applicant.title.join(", ")}</TableCell> */}
                            <TableCell>
                              {applicant?.title?.length
                                ? applicant.title.slice(0, 4).join(", ") +
                                (applicant.title.length > 4 ? ", ..." : "")
                                : "N/A"}
                            </TableCell>

                            <TableCell>{applicant.email_1}</TableCell>
                            <TableCell>
                              {applicant.home_phone || "N/A"}
                            </TableCell>
                            <TableCell>
                              {applicant?.clearance_level?.length
                                ? applicant.clearance_level
                                  .slice(0, 4)
                                  .join(", ") +
                                (applicant.clearance_level.length > 4
                                  ? ", ..."
                                  : "")
                                : "N/A"}
                            </TableCell>

                            <TableCell>
                              <Badge
                                className={`capitalize ${applicant.status === "active"
                                  ? "bg-green-100 text-green-800" // Green for Active
                                  : applicant.status === "placed"
                                    ? "bg-blue-100 text-blue-800" // Blue for Placed
                                    : applicant.status === "idle"
                                      ? "bg-yellow-100 text-yellow-800" // Yellow for Idle
                                      : "bg-gray-100 text-gray-800" // Gray for any unknown status
                                  }`}
                              >
                                {applicant.status || "N/A"}
                              </Badge>
                            </TableCell>

                            {/* <TableCell>{`${applicant.ownership?.first_name} ${applicant.ownership?.last_name}`}</TableCell> */}
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      router.push(
                                        `/applicant-database/edit-applicant/${applicant.id}`
                                      )
                                    }
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setSelectedApplicantId(applicant.id);
                                      setOpenModal(true);
                                    }}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
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
        </main>
      </div>
      {/* <ConfirmationModal
        title={"DELETE APPLICANT?"}
        firstLine={"Are you sure you want to delete the selected APPLICANT(s)?"}
        secondLine={"Record once deleted cannot be restored back!"}
        firstBtnText={"Cancel"}
        secondBtnText={"Delete"}
        openModal={openModal}
        isCancel={setOpenModal}
        isConfirm={onDelete}
      /> */}
    </div>
  );
}
