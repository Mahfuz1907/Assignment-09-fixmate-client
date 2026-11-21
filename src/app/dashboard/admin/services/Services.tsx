"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import ManageServicesTable from "@/components/WebComponents/Admin/Services/ManageServicesTable";
import { GetAllServices } from "@/library/Action/Services";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { IService } from "@/library/type";

const Services = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [query, setQuery] = useState<string>("approvalStatus=pending");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchServices = async () => {
      const res = await GetAllServices(query);
      setServices(res);
    };

    fetchServices();
  }, [query, refreshTrigger]);

  const handleTabChange = (value: string) => {
    if (value === "") setQuery("");
    else setQuery(`approvalStatus=${value}`);
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
