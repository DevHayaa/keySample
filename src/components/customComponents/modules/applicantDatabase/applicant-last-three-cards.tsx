import { useState } from "react"
import { Menu, Search, ChevronDown, ChevronUp, DollarSign, Share2, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function ApplicantLastThreeCards({ applicantData, loading }: any) {
  const [openCards, setOpenCards] = useState({
    generalInfo: true,
    socialConnections: true,
    categorySkills: true,
  })

  const toggleCard = (card: keyof typeof openCards) => {
    setOpenCards(prev => ({ ...prev, [card]: !prev[card] }))
  }


  
  const renderCard = (
    title: string,
    icon: React.ReactNode,
    cardKey: keyof typeof openCards,
    content: React.ReactNode
  ) => (
    <Card className={openCards[cardKey] ? "" : "h-[60px]"}>
      <CardHeader className={`flex flex-row items-center justify-between space-y-0  ${!openCards[cardKey] ? 'h-[60px] py-0' : ''}`}>
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
          {/* {icon} */}
          <span className={openCards[cardKey] ? "" : "text-base"}>{title}</span>
        </CardTitle>

      </CardHeader>
      {openCards[cardKey] && <CardContent className="card px-5 pb-5">{content}</CardContent>}
    </Card>
  )

  const ReadMoreText = ({ text, maxLength = 100 }: { text: string; maxLength?: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (text.length <= maxLength) {
      return <span>{text}</span>; // If the text is short, show it entirely.
    }

    return (
      <span>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:underline ml-1"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      </span>
    );
  };

  return (
    <div className="flex  w-full flex-col">
      <main className="">
        <div className="grid gap-4 lg:grid-cols-3">
          {renderCard(
            "General Information",
            <DollarSign className="h-6 w-6" />,
            "generalInfo",
            <dl className="grid grid-cols-1 gap-2  sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Currency</p>
                <p className="text-sm text-muted-foreground capitalize" >{applicantData?.currency ? applicantData?.currency : 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Pay Rate</p>
                <p>
                  <span className="text-sm text-muted-foreground capitalize">
                    Min: {applicantData?.expected_min_pay_rate ? applicantData?.expected_min_pay_rate : 'Not Specified'}, Max: {applicantData?.expected_max_pay_rate ? applicantData?.expected_max_pay_rate : 'Not Specified'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Annual Salary</p>
                <p>
                  <span className="text-sm text-muted-foreground capitalize">
                    Min: {applicantData?.expected_min_annual_rate ? applicantData?.expected_min_annual_rate : 'Not Specified'}, Max: {applicantData?.expected_max_annual_rate ? applicantData?.expected_max_annual_rate : 'Not Specified'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm text-muted-foreground break-words">
                  {applicantData?.notes ? (
                    <ReadMoreText text={applicantData.notes} />
                  ) : (
                    "Not Specified"
                  )}
                </p>
              </div>

            </dl>
          )}
          {renderCard(
            "Social Connections",
            <Share2 className="h-6 w-6" />,
            "socialConnections",
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">LinkedIn</p>
                <p className="text-sm text-muted-foreground capitalize break-words">{applicantData?.linkedin ? applicantData?.linkedin : 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Twitter</p>
                <p className="text-sm text-muted-foreground capitalize break-words">{applicantData?.twitter ? applicantData?.twitter : 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Other</p>
                <p className="text-sm text-muted-foreground capitalize break-words">{applicantData?.Other ? applicantData?.Other : 'Not Specified'}</p>
              </div>
            </dl>
          )}
          {renderCard(
            "Category & Skills",
            <Briefcase className="h-6 w-6" />,
            "categorySkills",
            <dl className="grid grid-cols-1 gap-2  sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Labour Category</p>
                {
                  applicantData?.labor_category?.length ?
                    applicantData?.labor_category?.map((labourCat: any, i: number) => {
                      return (
                        <p className="text-sm text-muted-foreground capitalize" key={i}>{labourCat}</p>
                      )
                    })
                    :
                    <p className="text-sm text-muted-foreground capitalize">Not Specified</p>
                }
              </div>
              <div>
                <p className="text-sm font-medium">Skills</p>
                {
                  applicantData?.skills?.length ?
                    applicantData?.skills?.map((skill: any, i: number) => {
                      return (
                        <p className="text-sm text-muted-foreground capitalize" key={i}>{skill}</p>
                      )
                    })
                    :
                    <p className="text-sm text-muted-foreground capitalize">Not Specified</p>
                }
              </div>
            </dl>
          )}
        </div>
      </main>
    </div>
  )
}