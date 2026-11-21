import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import ManageServicesTable from "@/components/WebComponents/Admin/Services/ManageServicesTable";
import { GetAllServices } from "@/library/Action/Services";

export const metadata: Metadata = {
  title: "Manage Services . FixMate Admin",
};

const AdminServicesPage = async () => {
  const services = await GetAllServices();

  return (
    <div className="space-y-6 p-4">
      <Card className="border border-border/70 bg-card/90 shadow-xs">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">All Services</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <ManageServicesTable services={services} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServicesPage;
