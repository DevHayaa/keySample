"use client";

import BookOne from "@/components/customComponents/modules/bookOne/bookOne";
import Navbar from "@/components/commonComponents/navbar";
import { AppSidebar } from "@/components/commonComponents/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Footer from "@/components/commonComponents/footer";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage({ children }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay (like fetching data)
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Reduced delay to 1.5 seconds
  }, []);

  return (

    <div className="relative w-screen h-screen flex flex-col">
      {/* <SidebarProvider> */}
        <div className="flex w-full h-full">
          {/* <AppSidebar /> */}
          <div className="flex flex-1 flex-col overflow-hidden relative">
            <Navbar />

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center  z-50 backdrop-blur-none">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-gray-800 dark:text-gray-300" />
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                    Loading ...
                  </p>
                </div>
              </div>
            )}

            {/* Main Dashboard Content */}
            {!loading && <>
              <BookOne/>
            </>
            }
          </div>
        </div>
      {/* </SidebarProvider> */}
    </div>

  );
}