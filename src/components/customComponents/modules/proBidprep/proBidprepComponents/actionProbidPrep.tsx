import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import Link from "next/link";

const actionProbidPrep = () => {
  return (
    <>
      {/* <div className=""> */}
        <div className="bg-card mt-4 p-6 rounded-md">
          <h2 className="text-xl font-semibold">Action</h2>

          <div className="flex gap-2 items-center mt-6 mb-6">
            <div className="w-full">
              <Select>
                <SelectTrigger className="w-[100%]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>analyze</SelectLabel> */}
                    <SelectItem value="apple">Apple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Link href="">
                <Send className="bg-blue-600 px-2 py-2 rounded-sm size-12"/>
              </Link>
            </div>

          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default actionProbidPrep;
