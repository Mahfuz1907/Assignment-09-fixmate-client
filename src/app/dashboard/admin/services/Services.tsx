"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import ManageServicesTable from "@/components/WebComponents/Admin/Services/ManageServicesTable";
import { GetAllServices } from "@/library/Action/Services";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { IService } from "@/library/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getTokenFromClient } from "@/library/Action/GettingTokens/GettingTokenFromClient";

const Services = () => {
  const [services, setServices] = useState<IService[]>([]);
  // const [query, setQuery] = useState<string>("approvalStatus=pending");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("approvalStatus") ?? "pending";

  const [query, setQuery] = useState<string>(
    currentStatus ? `approvalStatus=${currentStatus}` : "",
  );

  useEffect(() => {
    const fetchServices = async () => {
      const token = await getTokenFromClient();
      const res = await GetAllServices(query, token as string);
      setServices(res);
    };

    fetchServices();
  }, [query, refreshTrigger]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "") {
      params.delete("approvalStatus");
      setQuery("");
    } else {
      params.set("approvalStatus", value);
      setQuery(`approvalStatus=${value}`);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="space-y-6 p-4">
      <Card className="border border-border/70 bg-card/90 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">All Services</CardTitle>
          <Tabs
            defaultValue="pending"
            orientation="horizontal"
            onValueChange={handleTabChange}
          >
            <TabsList>
              <TabsTrigger value="">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="overflow-auto">
          <ManageServicesTable
            services={services}
            setRefreshTrigger={setRefreshTrigger}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
