import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Fullscreen } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ResultCardProbidPrep = ({ content }: { content: any }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Word count calculation
  const words = content.data ? content.data.split(/\s+/).filter((word: any) => word.length > 0) : [];
  const wordCount = words.length;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    // **Title Section**
    doc.setFillColor(41, 128, 185); // Blue Background
    doc.rect(10, 10, 190, 10, "F"); // Rectangle for Title Background
    doc.setTextColor(255, 255, 255); // White Text
    doc.setFontSize(14);
    doc.text("Proreshape - Result Report", 15, 17); // Title Text

    // **Main Content Settings**
    doc.setTextColor(0, 0, 0); // Black Text
    doc.setFontSize(12);
    const marginLeft = 15;
    const marginTop = 30;
    const maxWidth = 180;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 7; // Line spacing
    let cursorY = marginTop;

    // **Insert the Main Content (Markdown Response)**
    doc.setFontSize(12);

    doc.text("Analysis Result:", marginLeft, cursorY);
    cursorY += lineHeight;


    const textLines = doc.splitTextToSize(content.data || "No content available.", maxWidth);
    textLines.forEach((line: any) => {
      if (cursorY + lineHeight > pageHeight - 20) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, marginLeft, cursorY);
      cursorY += lineHeight;
    });

    cursorY += 10;

    // **Experience Section**

    doc.text("Experience:", marginLeft, cursorY);
    cursorY += lineHeight;


    doc.text(`Years: ${content.experience?.no_of_experience_in_years || "N/A"}`, marginLeft, cursorY);
    cursorY += lineHeight;
    doc.text(`Months: ${content.experience?.no_of_experience_in_months || "N/A"}`, marginLeft, cursorY);
    cursorY += 10;

    // **Mandatory Criteria Not Met**
    if (content.not_met_mandatory) {

      doc.setTextColor(0, 0, 0);
      doc.text("Not Met - Mandatory Criteria:", marginLeft, cursorY);
      cursorY += lineHeight;


      doc.setTextColor(0, 0, 0);
      const mandatoryLines = doc.splitTextToSize(content.not_met_mandatory, maxWidth);
      mandatoryLines.forEach((line: any) => {
        if (cursorY + lineHeight > pageHeight - 20) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(line, marginLeft, cursorY);
        cursorY += lineHeight;
      });
      cursorY += 10;
    }

    // **Rated Criteria Not Met**
    if (content.not_met_rated) {

      doc.setTextColor(0, 0, 0);
      doc.text("Not Met - Rated Criteria:", marginLeft, cursorY);
      cursorY += lineHeight;


      doc.setTextColor(0, 0, 0);
      const ratedLines = doc.splitTextToSize(content.not_met_rated, maxWidth);
      ratedLines.forEach((line: any) => {
        if (cursorY + lineHeight > pageHeight - 20) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(line, marginLeft, cursorY);
        cursorY += lineHeight;
      });
      cursorY += 10;
    }

    // **Mandatory & Rated Criteria Scores**
    doc.text("Criteria Scores:", marginLeft, cursorY);
    cursorY += lineHeight;

    doc.text(`Mandatory Criteria Met: ${content.mandatory_criteria || "0.00%"}`, marginLeft, cursorY);
    cursorY += lineHeight;
    doc.text(`Rated Criteria Met: ${content.rated_criteria || "0.00%"}`, marginLeft, cursorY);
    cursorY += 10;

    // **Save PDF**
    doc.save("Result.pdf");
  };


  return (
    <Card className={`card rounded-3xl flex flex-col h-100 ${isFullScreen ? "full-screen" : ""}`}>
      <CardHeader>
        <div className="flex justify-between flex-wrap items-center">
          <h2 className="text-xl font-semibold">Result</h2>
          <div className="flex gap-4 items-center">
            <div>Words: {wordCount}</div>
            <button onClick={toggleFullScreen} className="toggle-fullscreen-btn">
              {isFullScreen ? <RiCloseFill size={30} /> : <Fullscreen />}
            </button>
            <button onClick={exportToPDF} className="bg-blue-500 text-white px-3 py-1 rounded-md">
              Export PDF
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
      
        <div className="p-4 border rounded-md whitespace-pre-wrap">
          {/* {content.data || "No content available."} */}
          <ReactMarkdown>{content.data}</ReactMarkdown>
        </div>
       

      </CardContent>
    </Card>
  );
};

export default ResultCardProbidPrep;
