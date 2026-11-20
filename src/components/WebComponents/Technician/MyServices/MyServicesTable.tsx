"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  Loader2,
  MapPin,
  Pencil,
  PlusCircle,
  Trash2,
  TriangleAlert,
  Upload,
  Wrench,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  IService,
  ServiceApprovalStatus,
  ServiceCategory,
  ServiceMode,
} from "@/library/type";
import {
  DeleteService,
  EditService,
  UpdateAvailable,
} from "@/library/Action/Services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PRICE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES: ServiceMode[] = ["Home Visit", "Shop Drop-off"];

const STATUS_META: Record<
  ServiceApprovalStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  approved: {
    label: "Approved",
    badgeClass:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    badgeClass:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    badgeClass:
      "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    dotClass: "bg-rose-500",
  },
};

function StatusBadge({ status }: { status: ServiceApprovalStatus }) {
  const meta = STATUS_META[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1.5 rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-wider",
        meta.badgeClass,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </Badge>
  );
}

function AvailabilityIndicator({ service }: { service: IService }) {
  const [isAvailable, setIsAvailable] = useState(service.isAvailable);
  const router = useRouter();

  const handleAvailabilityChange = async (checked: boolean) => {
    setIsAvailable(checked);
    console.log(`${service.title} isAvailable:`, checked);
    const result = await UpdateAvailable(service._id as string, {
      isAvailable: checked,
    });

    if (result.acknowledged) {
      toast.success(
        `${service.title} is ${checked ? "available" : "not available"} now`,
        { position: "top-center" },
      );
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={isAvailable}
        onCheckedChange={handleAvailabilityChange}
        aria-label={`Toggle availability for ${service.title}`}
        className="data-checked:bg-emerald-500"
      />
      <span
        className={cn(
          "text-xs font-medium",
          isAvailable
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground",
        )}
      >
        {isAvailable ? "Available" : "Paused"}
      </span>
    </div>
  );
}

function ServiceThumb({
  service,
  className,
}: {
  service: IService;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(service.image) && !failed;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 64px, 56px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <Wrench className="size-5" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

interface EditServiceDialogProps {
  service: IService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditServiceDialog({
  service,
  open,
  onOpenChange,
}: EditServiceDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Smartphone" as ServiceCategory,
    description: "",
    image: "",
    basePrice: 0,
    estimatedDuration: "",
    serviceMode: "Home Visit" as ServiceMode,
    serviceArea: "",
    isAvailable: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [syncedServiceKey, setSyncedServiceKey] = useState<string | null>(null);
  const router = useRouter();

  const currentServiceKey = service
    ? `${service._id ?? ""}|${service.title ?? ""}|${service.image ?? ""}|${service.basePrice ?? ""}|${service.isAvailable ?? ""}`
    : null;

  if (service && currentServiceKey !== syncedServiceKey) {
    setSyncedServiceKey(currentServiceKey);
    setFormData({
      title: service.title || "",
      category: (service.category || "Smartphone") as ServiceCategory,
      description: service.description || "",
      image: service.image || "",
      basePrice: service.basePrice ?? 0,
      estimatedDuration: service.estimatedDuration || "",
      serviceMode: (service.serviceMode || "Home Visit") as ServiceMode,
      serviceArea: service.serviceArea || "",
      isAvailable: service.isAvailable ?? true,
    });
    setImageFile(null);
    setImagePreview(service.image || "");
  }

  if (!service) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (PNG, JPG, WEBP).");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image file must be under 8MB.");
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      toast.success("New banner image selected!", { position: "top-center" });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = imagePreview || formData.image || service.image || "";

    if (imageFile) {
      try {
        setIsUploading(true);
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
        if (!apiKey) {
          toast.error("ImgBB API key is missing in environment variables.");
          setIsUploading(false);
          return;
        }

        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: imgFormData,
          },
        );

        const data = await res.json();

        if (!res.ok || !data?.success || !data?.data?.url) {
          throw new Error(
            data?.error?.message || "Failed to upload image to ImgBB.",
          );
        }

        finalImageUrl = data.data.url;
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Image upload to ImgBB failed.";
        toast.error(errorMsg);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const { _id, ...restService } = service;

    const updatedData = {
      ...restService,
      ...formData,
      image: finalImageUrl,
      technicianName: service.technicianName,
      technicianEmail: service.technicianEmail,
    };

    console.log("Updated Service Data:", updatedData);
    onOpenChange(false);
    const result = await EditService(service._id as string, updatedData);
    console.log(result);
    if (result.acknowledged) {
      toast.success("Service updated successfully", { position: "top-center" });
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update service details. Technician name and email are read-only.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Read-only technician info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="technicianName"
                className="text-xs text-muted-foreground"
              >
                Technician Name (Read-only)
              </Label>
              <Input
                id="technicianName"
                value={service.technicianName || ""}
                disabled
                readOnly
                className="bg-muted text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="technicianEmail"
                className="text-xs text-muted-foreground"
              >
                Technician Email (Read-only)
              </Label>
              <Input
                id="technicianEmail"
                type="email"
                value={service.technicianEmail || ""}
                disabled
                readOnly
                className="bg-muted text-muted-foreground"
              />
            </div>
          </div>

          {/* Editable Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. iPhone Screen Replacement"
              required
            />
          </div>

          {/* Category & Service Mode */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => {
                  if (val) {
                    setFormData((prev) => ({
                      ...prev,
                      category: val as ServiceCategory,
                    }));
                  }
                }}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="serviceMode">Service Mode</Label>
              <Select
                value={formData.serviceMode}
                onValueChange={(val) => {
                  if (val) {
                    setFormData((prev) => ({
                      ...prev,
                      serviceMode: val as ServiceMode,
                    }));
                  }
                }}
              >
                <SelectTrigger id="serviceMode" className="w-full">
                  <SelectValue placeholder="Select Service Mode" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Base Price & Estimated Duration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="basePrice">Starting Price ($)</Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                step="any"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    basePrice: Number(e.target.value),
                  }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estimatedDuration">Estimated Duration</Label>
              <Input
                id="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedDuration: e.target.value,
                  }))
                }
                placeholder="e.g. 1-2 hours"
                required
              />
            </div>
          </div>

          {/* Service Area */}
          <div className="space-y-1.5">
            <Label htmlFor="serviceArea">Service Area</Label>
            <Input
              id="serviceArea"
              value={formData.serviceArea}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  serviceArea: e.target.value,
                }))
              }
              placeholder="e.g. Downtown, Uptown, Brooklyn"
              required
            />
          </div>

          {/* Service Image Upload & Prefilled Preview */}
          <div className="space-y-2">
            <Label>Service Banner Image</Label>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-border/80 bg-muted">
                <div className="relative h-44 w-full sm:h-52">
                  <Image
                    src={imagePreview}
                    alt="Service banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border/60 bg-card/90 px-3 py-2 backdrop-blur-xs">
                  <span className="truncate text-xs font-medium text-muted-foreground">
                    {imageFile ? imageFile.name : "Current service banner"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 text-xs"
                    >
                      Change image
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="mr-1 size-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 p-6 text-center transition-colors hover:border-amber-500/50 hover:bg-amber-500/5"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Upload className="size-5" />
                </div>
                <p className="mt-2 text-xs font-semibold">
                  Click to select service banner image
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  PNG, JPG or WEBP (Max 8MB). Uploads to ImgBB on save.
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your service, warranty, and what's included..."
              required
            />
          </div>

          {/* Availability switch */}
          <div className="flex items-center justify-between rounded-lg border border-border/70 p-3">
            <div className="space-y-0.5">
              <Label
                htmlFor="service-available"
                className="text-sm font-medium"
              >
                Availability
              </Label>
              <p className="text-xs text-muted-foreground">
                Set whether this service is currently available to customers.
              </p>
            </div>
            <Switch
              id="service-available"
              checked={formData.isAvailable}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isAvailable: checked }))
              }
              className="data-checked:bg-emerald-500"
            />
          </div>

          <DialogFooter className="mt-6 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="bg-amber-500 text-zinc-950 hover:bg-amber-400"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Uploading & Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ServiceActions({
  service,
  onEdit,
  onDelete,
}: {
  service: IService;
  onEdit: (service: IService) => void;
  onDelete: (service: IService) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Edit ${service.title}`}
        title="Edit service"
        onClick={() => onEdit(service)}
        className="rounded-lg border-border/70 text-muted-foreground transition-colors hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${service.title}`}
        title="Delete service"
        onClick={() => onDelete(service)}
        className="rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-orange-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
        <Wrench className="size-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-bold tracking-tight">
        No services listed yet
      </h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        Add your first repair service so customers can find you, compare prices
        and send requests.
      </p>
      <Button
        render={<Link href="/dashboard/technician/add-service" />}
        nativeButton={false}
        className="mt-5 h-10 gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-4 font-semibold text-zinc-950 shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)] hover:from-amber-300 hover:to-orange-500"
      >
        <PlusCircle className="size-4" aria-hidden="true" />
        Add your first service
      </Button>
    </div>
  );
}

type MyServicesTableProps = {
  services: IService[];
  loadError?: boolean;
};

export function MyServicesTable({
  services,
  loadError = false,
}: MyServicesTableProps) {
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [deletingService, setDeletingService] = useState<IService | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleEdit = (service: IService) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (service: IService) => {
    setDeletingService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingService) {
      console.log("Delete Service Data:", deletingService);
      const result = await DeleteService(deletingService._id as string);
      console.log(result);

      if (result.acknowledged) {
        toast.success(`Service "${deletingService.title}" deleted.`, {
          position: "top-center",
        });
        router.refresh();
      }
    }
    setIsDeleteDialogOpen(false);
    setDeletingService(null);
  };

  const counts = {
    total: services.length,
    approved: services.filter(
      (service) => service.approvalStatus === "approved",
    ).length,
    pending: services.filter((service) => service.approvalStatus === "pending")
      .length,
    paused: services.filter((service) => !service.isAvailable).length,
  };

  const live = services.filter(
    (service) => service.approvalStatus === "approved" && service.isAvailable,
  ).length;

  return (
    <div className="space-y-5">
      {loadError ? (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-xs text-rose-700 dark:text-rose-300">
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <p>
            We couldn&apos;t reach the service API just now. Check the server
            and refresh the page.
          </p>
        </div>
      ) : null}

      {/* Listing panel */}
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FolderKanban className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-bold tracking-tight">All services</h2>
              <p className="text-[11px] text-muted-foreground">
                {counts.total} listing{counts.total === 1 ? "" : "s"} · {live}{" "}
                live on the marketplace
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="hidden gap-1.5 rounded-full border-border/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline-flex"
          >
            Technician
          </Badge>
        </div>

        {services.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden md:block">
              <Table className="min-w-205">
                <TableHeader>
                  <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Service
                    </TableHead>
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Starting price
                    </TableHead>
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Approval
                    </TableHead>
                    <TableHead className="h-11 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Availability
                    </TableHead>
                    <TableHead className="h-11 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow
                      key={service._id ?? `${service.title}-${index}`}
                      className="border-border/60 hover:bg-muted/40"
                    >
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ServiceThumb service={service} className="size-14" />
                          <div className="min-w-0">
                            <p
                              title={service.title}
                              className="max-w-[18rem] truncate text-sm font-semibold text-foreground"
                            >
                              {service.title}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                              <MapPin
                                className="size-3 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="max-w-[16rem] truncate">
                                {service.serviceArea || "Service area not set"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="rounded-full border-border/70 bg-muted/40 px-2.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {service.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-bold text-foreground">
                          {PRICE_FORMATTER.format(service.basePrice)}
                        </span>
                        <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                          starting
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <StatusBadge status={service.approvalStatus} />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <AvailabilityIndicator service={service} />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <ServiceActions
                          service={service}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border/60 md:hidden">
              {services.map((service, index) => (
                <article
                  key={service._id ?? `${service.title}-${index}`}
                  className="p-4"
                >
                  <div className="flex gap-3">
                    <ServiceThumb service={service} className="size-16" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
                          {service.title}
                        </p>
                        <StatusBadge status={service.approvalStatus} />
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          {service.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{service.serviceMode}</span>
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {PRICE_FORMATTER.format(service.basePrice)}
                          <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                            starting
                          </span>
                        </span>
                        <AvailabilityIndicator service={service} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="h-9 flex-1 gap-1.5 rounded-xl border-border/70 text-xs font-semibold"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service)}
                      className="h-9 flex-1 gap-1.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Edit Service Dialog */}
      <EditServiceDialog
        service={editingService}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete{" "}
              <strong className="font-semibold text-foreground">
                {deletingService?.title || "this service"}
              </strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MyServicesTable;
