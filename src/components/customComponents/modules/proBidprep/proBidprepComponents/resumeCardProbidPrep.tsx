import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { RiCloseFill } from "react-icons/ri";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Fullscreen, FullscreenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResumeCardProbidPrep = forwardRef(({ onPromptChange, setIsResumeFile, isFileUploaded, isReset }: any, ref) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [text, setText] = useState('');
  const [counter, setCounter] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
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

  useEffect(() => {
    console.log('isReset', isReset);
    if (isReset) {
      setText('');
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isReset]);

  useImperativeHandle(ref, () => ({
    resetFields() {
      setText('');
      setCounter(0);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }));



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
      setIsResumeFile(true);
      if (onPromptChange) {
        onPromptChange(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setText(''); // Clear the text area
    setCounter(0); // Reset word counter
    setIsResumeFile(false);
    if (onPromptChange) {
      onPromptChange(null);
    }
  };

  return (
    <Card
      className={`card p-2 rounded-3xl shadow-md flex flex-col h-100 ${isFullScreen ? "full-screen" : ""
        }`}
    >
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-xl font-semibold">Projects / Resume</h2>
          <div className="flex gap-4 items-center">
            <div>Words {counter}</div>

            <button
              onClick={toggleFullScreen}
              className="toggle-fullscreen-btn"
            >
              {isFullScreen ? <RiCloseFill size={30} /> : <Fullscreen />}
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
            placeholder="Enter Your Project"
            value={text}
            onChange={handleChange}
          >
          </textarea>
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
        <Button className="bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 px-4 rounded cursor-pointer" onClick={handleButtonClick}>Upload Resume</Button>
      </CardContent>
    </Card >
  );
});

export default ResumeCardProbidPrep;
