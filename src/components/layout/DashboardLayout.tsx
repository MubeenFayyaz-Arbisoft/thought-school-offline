import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/teachers': 'Teachers',
  '/classes': 'Classes',
  '/subjects': 'Subjects',
  '/attendance': 'Attendance',
  '/fees': 'Fees',
  '/salary': 'Salary',
  '/notices': 'Notices',
  '/syllabus': 'Syllabus'
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const getBreadcrumbs = () => {
    const crumbs = [{ path: '/', label: 'Dashboard' }];
    
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ path: currentPath, label });
    });
    
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card shadow-sm">
            <div className="h-16 flex items-center px-6">
              <SidebarTrigger className="mr-4" />
              <Link to="/" className="flex-1 hover:opacity-80 transition-opacity">
                <h1 className="text-xl font-semibold text-foreground">
                  The Thoughts School and Academy
                </h1>
                <p className="text-sm text-muted-foreground">
                  School Management System
                </p>
              </Link>
            </div>
            
            {/* Breadcrumbs */}
            <div className="px-6 py-3 bg-muted/30">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={crumb.path}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="flex items-center gap-1">
                          {index === 0 && <Home className="h-4 w-4" />}
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <>
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path} className="flex items-center gap-1">
                              {index === 0 && <Home className="h-4 w-4" />}
                              {crumb.label}
                            </Link>
                          </BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}