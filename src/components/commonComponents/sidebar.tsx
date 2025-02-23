import {
  Activity,
  AudioWaveform,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Command,
  GalleryVerticalEnd,
  HelpCircle,
  Home,
  Inbox,
  LogOut,
  MessageSquare,
  PieChart,
  Search,
  Settings,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState, useEffect } from "react";
import { url } from "inspector/promises";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const data = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  sidebarItems: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Activity,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  navMain: [
    {
      title: "Books",
      url: "#",
      icon: MessageSquare,
      isActive: true,
      items: [
        {
          title: "RFP Triage",
          url: "/rfp-decoder",
        },
        {
          title: "Pro Bid Step 1",
          url: "/pro-bid",
        },
        {
          title: "Pro Reshape",
          url: "/pro-reshape",
        },
        {
          title: "Pro Resource Find",
          url: "/pro-resource-find",
        },
        {
          title: "Pro Bid Prep",
          url: "/pro-bid-prep",
        },
        {
          title: "Applicant Database",
          url: "/applicant-database",
        },
        {
          title: "RFP List",
          url: "/rfp-list",
        },
      ],
    },
  ],
};

export function AppSidebar() {
  const [isCollapsed] = useState(true); // Always keep collapsed
  const [activeIndex, setActiveIndex] = useState(null); // Track active dropdown
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    setMounted(true); // Set mounted to true after the component is mounted
  }, []);

  useEffect(() => {
    if (mounted) {
      // Highlight the active link based on the current route
      const activeItemIndex: any = data.navMain.findIndex((item) =>
        item.items.some((subItem) => subItem.url === pathName)
      );
      setActiveIndex(activeItemIndex);
    }
  }, [pathName, mounted]);

  const toggleDropdown = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle the active index
  };

  if (!mounted) {
    return null; // Render nothing until the component is mounted
  }

  return (
    <Sidebar
      collapsible="none" // Disable collapse behavior
      className="sidebar-bg border-r lg:flex text-card-foreground shadow-sm"
    >
      {/* Hide Sidebar Content */}
      <div className="hidden"> 
        {/* SidebarContent ko hide kardiya */}
      </div>

      {/* Always Show SidebarRail (Icons Only) */}
      <SidebarRail />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="gap-4 data-[state=open]: data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Link legacyBehavior href="/home">
                    <Image
                      width={40}
                      height={20}
                      src="/image/avatar.png"
                      alt=""
                    />
                  </Link>

                  <div className="grid text-left text-sm leading-tight">
                    <Link legacyBehavior href="/home">
                      <div className="flex items-center gap-2">

                        <a href="" className="text-2xl font-semibold">
                          Haya's World
                        </a>
                        {/* <span className="p-1 fot bg-white text-black font-bold rounded">BETA</span> */}
                      </div>
                    </Link>
                    {/* <span ><span className="text-sm text-gray-400">Powered by </span> BNR360</span> */}
                  </div>

                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-2 px-3 py-3">
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <Link href="/home">
                <SidebarMenuButton tooltip="Home" className={pathName === "/home" ? "bg-gray-200 dark:bg-black" : ""}>
                  <Home className="h-4 w-4 mr-2" />
                  <span className="sidebar-items-font font-medium text-sm">Home</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                asChild
                open={activeIndex === index}
                onOpenChange={() => toggleDropdown(index)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className={activeIndex === index ? "bg-gray-200 dark:bg-black" : ""}>
                      {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                      <span className="sidebar-items-font">{item.title}</span>           
                      <ChevronDown className={`ml-auto transition-transform duration-200 ${activeIndex === index ? "rotate-180" : ""
                        }`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.items && (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url} className={pathName === subItem.url ? "bg-gray-200 dark:bg-black" : ""}>
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
            <SidebarMenuItem>
              {data.sidebarItems.map((item, index) => (
                <Collapsible key={index}>
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title} className={`text-sm flex items-center px-2 py-2 transition-all ${pathName === item.url ? "bg-gray-200 dark:bg-black" : ""}`}>
                      <item.icon className="h-4 w-4 mr-2 transition-transform duration-200 ease-in-out group-hover:scale-110" />
                      <span className="sidebar-items-font">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </Collapsible>
              ))}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg"></AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold"></span>
                    <span className="truncate text-xs"></span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg"></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight"></div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuGroup></DropdownMenuGroup>
                <DropdownMenuSeparator className="block sm:hidden" />
                <DropdownMenuItem className="block sm.hidden">
                  <div className="flex gap-2 items-center">
                    <UserCircle className="w-4 h-4" />
                    <Link href="/profile-settings" className="text-sm">
                      View Profile
                    </Link>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex sm:hidden">
                  <LogOut className="w-4 h-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
