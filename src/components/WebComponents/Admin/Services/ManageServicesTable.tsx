"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UpdateStatus } from "@/library/Action/Services";
import { IService } from "@/library/type";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const statusBadge = (status: IService["approvalStatus"]) => {
  const colors = {
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/25",
    approved: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
    rejected:
      "bg-destructive-500/10 text-destructive-700 border-destructive-500/25",
  } as const;
  return (
    <Badge
      variant="outline"
      className={
        "rounded-full border px-2 py-0.5 text-xs font-medium " + colors[status]
      }
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const ManageServicesTable = ({ services }: { services: IService[] }) => {
  const [servicesData, setServicesData] = useState<IService[]>(services);
  const router = useRouter();

  const handleApproval = async (
    id: string,
    newStatus: "approved" | "rejected",
  ) => {
    const result = await UpdateStatus(id, { approvalStatus: newStatus });
    console.log(result);

    if (result.acknowledged) {
      toast.success(`Service ${newStatus}`);
      router.refresh();
    }

    setServicesData((prev) =>
      prev.map((svc) =>
        svc._id === id ? { ...svc, approvalStatus: newStatus } : svc,
      ),
    );
  };

  return (
    <Table className="w-full min-w-200">
      <TableHeader className="bg-muted/30">
        <TableRow>
          <TableHead className="w-40">Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Area</TableHead>
          <TableHead>Technician</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Available</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servicesData.map((svc) => (
          <TableRow
            key={svc._id}
            className="border-border/60 hover:bg-muted/30"
          >
            <TableCell className="font-medium">{svc.title}</TableCell>
            <TableCell>{svc.category}</TableCell>
            <TableCell className="max-w-xs truncate text-muted-foreground">
              {svc.description}
            </TableCell>
            <TableCell className="text-right font-medium text-foreground">
              ${svc.basePrice}
            </TableCell>
            <TableCell>{svc.estimatedDuration}</TableCell>
            <TableCell>{svc.serviceMode}</TableCell>
            <TableCell>{svc.serviceArea}</TableCell>
            <TableCell>{svc.technicianName}</TableCell>
            <TableCell>{statusBadge(svc.approvalStatus)}</TableCell>
            <TableCell>
              {svc.isAvailable ? (
                <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/25">
                  Yes
                </Badge>
              ) : (
                <Badge className="bg-destructive-500/10 text-destructive-700 border-destructive-500/25">
                  No
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {format(new Date(svc.createdAt), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="text-right">
              {svc.approvalStatus === "pending" && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={() => handleApproval(svc._id!, "approved")}
                    >
                      <Check className="mr-2 size-3 text-emerald-600" /> Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleApproval(svc._id!, "rejected")}
                    >
                      <X className="mr-2 size-3 text-destructive-600" /> Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ManageServicesTable;
