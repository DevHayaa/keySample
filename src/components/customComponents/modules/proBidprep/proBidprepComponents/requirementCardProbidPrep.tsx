import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
// Adjust based on your Shad imports

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Fullscreen, FullscreenIcon } from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";
import { RiCloseFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";

const RequirementCardProbidPrep = forwardRef(({ onPromptChange, setIsRequirementFile, isFileUploaded }: any, ref) => {
  const [isFullScreenTwo, setIsFullScreenTwo] = useState(false);
  const [text, setText] = useState("");
  const [counter, setCounter] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleFullScreens = () => {
    setIsFullScreenTwo(!isFullScreenTwo);
  };

  const handleChange = (e: any) => {
    const inputText = e.target.value;
    setText(inputText);


    const words = inputText.trim().split(/\s+/).filter((word: any) => word.length > 0);
    setCounter(words.length);

    if (onPromptChange) {
      onPromptChange(inputText);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setText(''); // Clear the text area
      setCounter(0); // Reset word counter
      setIsRequirementFile(true);
      if (onPromptChange) {
        onPromptChange(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setText(''); // Clear the text area
    setCounter(0); // Reset word counter
    setIsRequirementFile(false);
    if (onPromptChange) {
      onPromptChange(null);
    }
  };

  useImperativeHandle(ref, () => ({
    resetFields() {
      setText('');
      setUploadedFile(null);
      setCounter(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }));

  return (
    <Card
      className={`card p-2 rounded-3xl flex flex-col h-full ${isFullScreenTwo ? "full-screen-requirement" : ""
        }`}
    >
      <CardHeader>
        <div className="flex flex-wrap justify-between h-full items-center">
          <h2 className="text-xl font-semibold">Matrices/Requirements</h2>
          <div className="flex gap-4 items-center">
            <div>Words {counter}</div>
            <button onClick={toggleFullScreens} className="">
              {isFullScreenTwo ? <RiCloseFill size={30} /> : <Fullscreen />}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isFileUploaded && (
          <textarea
            className="text-area p-2"
            name=""
            id=""
            placeholder="Enter Your Requirement"
            value={text}
            onChange={handleChange}
          ></textarea>
        )}
        {uploadedFile && (
          <div className="flex items-center mt-2">
            <span className="mr-2">{uploadedFile.name}</span>
            <button onClick={handleRemoveFile} className="text-red-500">
              <RiCloseFill size={20} />
            </button>
          </div>
        )}
        <input
          type="file"
          id="resumeFile"
          name="resumeFile"
          ref={fileInputRef}
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer" onClick={handleButtonClick}>Upload Requirement</Button>
      </CardContent>
    </Card>
  );
});

export default RequirementCardProbidPrep;
