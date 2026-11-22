"use client";

import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import Image from "next/image";
import type { ICreateServiceFormData } from "@/library/type";
import {
  Clock,
  DollarSign,
  Info,
  Mail,
  MapPin,
  PlusCircle,
  ShieldAlert,
  Upload,
  User,
  Wrench,
  X,
  CheckCircle2,
  Store,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceCategory, ServiceMode } from "@/library/type";
import { GettingSessionFromClient } from "@/library/GettingSessions/GetSessionClient";
import Link from "next/link";
import { AddService } from "@/library/Action/Services";
import { useRouter } from "next/navigation";
import { getTokenFromClient } from "@/library/Action/GettingTokens/GettingTokenFromClient";

const CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES: {
  value: ServiceMode;
  label: string;
  icon: typeof Home;
  desc: string;
}[] = [
  {
    value: "Home Visit",
    label: "Doorstep Home Visit",
    icon: Home,
    desc: "You visit the customer's home or office to repair.",
  },
  {
    value: "Shop Drop-off",
    label: "Shop Drop-off",
    icon: Store,
    desc: "Customer brings or ships the device to your repair shop.",
  },
];

interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
  basePrice?: string;
  estimatedDuration?: string;
  serviceMode?: string;
  serviceArea?: string;
  image?: string;
}

const AddServiceForm = () => {
  const session = GettingSessionFromClient();
  const sessionUser = session?.user;
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Smartphone");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [serviceMode, setServiceMode] = useState<ServiceMode>("Home Visit");
  const [serviceArea, setServiceArea] = useState("");
  const [syncedSessionKey, setSyncedSessionKey] = useState<string | null>(null);

  // Read-only technician info from session
  const [technicianName, setTechnicianName] = useState("Technician Pro");
  const [technicianEmail, setTechnicianEmail] = useState(
    "technician@fixmate.com",
  );

  // Image Upload State (file input as required, ImgBB flow)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  // Sync session details when loaded
  const currentSessionKey = sessionUser
    ? `${sessionUser.name ?? ""}|${sessionUser.email ?? ""}`
    : null;

  if (sessionUser && currentSessionKey !== syncedSessionKey) {
    setSyncedSessionKey(currentSessionKey);
    if (sessionUser.name) setTechnicianName(sessionUser.name);
    if (sessionUser.email) setTechnicianEmail(sessionUser.email);
  }

  // Image selection handler
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select an image file (PNG, JPG, WEBP).",
        }));
        toast.error("Please select a valid image file.");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 8MB.",
        }));
        toast.error("Image file must be under 8MB.");
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setErrors((prev) => ({ ...prev, image: undefined }));
      toast.success("Service banner selected!", { position: "top-center" });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Service title is required.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    if (!category) {
      newErrors.category = "Please select a valid category.";
    }

    if (!description.trim()) {
      newErrors.description = "Service description is required.";
    } else if (description.trim().length < 20) {
      newErrors.description =
        "Description should be at least 20 characters explaining what is included.";
    }

    const priceNum = Number(basePrice);
    if (!basePrice || isNaN(priceNum) || priceNum <= 0) {
      newErrors.basePrice =
        "Please enter a valid positive starting price (greater than 0).";
    }

    if (!estimatedDuration.trim()) {
      newErrors.estimatedDuration =
        "Please enter estimated duration (e.g., '1-2 hours', '1 day').";
    }

    if (!serviceArea.trim()) {
      newErrors.serviceArea =
        "Please specify the service area covered (e.g., 'Dhanmondi, Dhaka').";
    }

    if (!imageFile && !imagePreview) {
      newErrors.image = "Please upload a service banner image.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    // 1. Image upload to ImgBB if a file is selected
    let finalImageUrl =
      imagePreview ||
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758";

    if (imageFile) {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_IMGBB_KEY is missing.");
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data?.success || !data?.data?.url) {
        throw new Error(
          data?.error?.message || "Failed to upload image to ImgBB.",
        );
      }

      finalImageUrl = data.data.url;
    }

    // 2. Prepare payload matching ICreateServiceFormData & specification
    const newServiceData: ICreateServiceFormData = {
      title: title.trim(),
      category,
      description: description.trim(),
      image: finalImageUrl,
      basePrice: Number(basePrice),
      estimatedDuration: estimatedDuration.trim(),
      serviceMode,
      serviceArea: serviceArea.trim(),
      technicianName: technicianName.trim(),
      technicianEmail: technicianEmail.trim(),
      approvalStatus: "pending", // as required by assignment
      isAvailable: true, // as required by assignment
      createdAt: new Date().toISOString(),
    };

    // Console log all collected data as requested
    console.log("=== Add Service Form Data (Pending Admin Approval) ===");
    console.log(newServiceData);

    const token = await getTokenFromClient();
    const result = await AddService(newServiceData, token as string);
    console.log(result);

    if (result.ok || result.success || result.acknowledged) {
      toast.success("Service submitted! Waiting for admin approval.", {
        description:
          "Your listing will appear publicly once approved by an administrator.",
        position: "top-center",
      });
      router.push("/dashboard/technician/my-services");
    }
  };
  return (
    <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-sm backdrop-blur-xl">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Service Specification
            </CardTitle>
            <CardDescription className="text-xs">
              Fill in the details below. All fields marked with * are required.
            </CardDescription>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Clock className="size-3.5" />
            Auto Status: Pending
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* 1. Title & Category */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className="space-y-1.5 md:col-span-7">
              <Label htmlFor="service-title" className="text-xs font-semibold">
                Service Title <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Wrench className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  id="service-title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors((p) => ({ ...p, title: undefined }));
                  }}
                  placeholder="e.g. iPhone Screen Replacement or AC Master Jet Servicing"
                  className="h-11 rounded-xl pl-9 text-sm border-border/70 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
                />
              </div>
              {errors.title && (
                <p className="text-xs font-medium text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5 md:col-span-5">
              <Label
                htmlFor="service-category"
                className="text-xs font-semibold"
              >
                Category <span className="text-destructive">*</span>
              </Label>
              <select
                id="service-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as ServiceCategory);
                  if (errors.category)
                    setErrors((p) => ({ ...p, category: undefined }));
                }}
                className="flex h-11 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/60"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs font-medium text-destructive">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* 2. Service Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="service-description"
                className="text-xs font-semibold"
              >
                Service Description <span className="text-destructive">*</span>
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {description.length} characters (min 20)
              </span>
            </div>
            <Textarea
              id="service-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((p) => ({ ...p, description: undefined }));
              }}
              rows={3}
              placeholder="Detail what is included: parts used, warranty duration, tools, safety inspections, diagnostic steps..."
              className="rounded-xl border-border/70 text-sm focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
            />
            {errors.description && (
              <p className="text-xs font-medium text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          {/* 3. Base Price, Estimated Duration & Service Area */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Base Price */}
            <div className="space-y-1.5">
              <Label htmlFor="base-price" className="text-xs font-semibold">
                Starting Price ($ USD){" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  id="base-price"
                  type="number"
                  min="1"
                  step="any"
                  value={basePrice}
                  onChange={(e) => {
                    setBasePrice(e.target.value);
                    if (errors.basePrice)
                      setErrors((p) => ({ ...p, basePrice: undefined }));
                  }}
                  placeholder="45"
                  className="h-11 rounded-xl pl-9 text-sm border-border/70 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
                />
              </div>
              {errors.basePrice && (
                <p className="text-xs font-medium text-destructive">
                  {errors.basePrice}
                </p>
              )}
            </div>

            {/* Estimated Duration */}
            <div className="space-y-1.5">
              <Label
                htmlFor="estimated-duration"
                className="text-xs font-semibold"
              >
                Estimated Duration <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  id="estimated-duration"
                  value={estimatedDuration}
                  onChange={(e) => {
                    setEstimatedDuration(e.target.value);
                    if (errors.estimatedDuration)
                      setErrors((p) => ({
                        ...p,
                        estimatedDuration: undefined,
                      }));
                  }}
                  placeholder="e.g. 2-3 hours, 1 day"
                  className="h-11 rounded-xl pl-9 text-sm border-border/70 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
                />
              </div>
              {errors.estimatedDuration && (
                <p className="text-xs font-medium text-destructive">
                  {errors.estimatedDuration}
                </p>
              )}
            </div>

            {/* Service Area */}
            <div className="space-y-1.5">
              <Label htmlFor="service-area" className="text-xs font-semibold">
                Service Area <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  id="service-area"
                  value={serviceArea}
                  onChange={(e) => {
                    setServiceArea(e.target.value);
                    if (errors.serviceArea)
                      setErrors((p) => ({ ...p, serviceArea: undefined }));
                  }}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="h-11 rounded-xl pl-9 text-sm border-border/70 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
                />
              </div>
              {errors.serviceArea && (
                <p className="text-xs font-medium text-destructive">
                  {errors.serviceArea}
                </p>
              )}
            </div>
          </div>

          {/* 4. Service Mode Selection (Home Visit vs Shop Drop-off) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Service Delivery Mode <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SERVICE_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = serviceMode === mode.value;

                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setServiceMode(mode.value)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-500/40"
                        : "border-border/70 bg-card hover:border-amber-500/30 hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? "bg-amber-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-4.5" />
                    </div>
                    <div className="leading-tight">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                        <span>{mode.label}</span>
                        {isSelected && (
                          <CheckCircle2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {mode.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Service Image Upload (File Input per ImgBB Requirement) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">
                Service Banner Image (ImgBB){" "}
                <span className="text-destructive">*</span>
              </Label>
              <span className="text-[10px] text-muted-foreground">
                File upload only (PNG, JPG, WEBP &lt; 8MB)
              </span>
            </div>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                  errors.image
                    ? "border-destructive bg-destructive/5"
                    : "border-border hover:border-amber-500 hover:bg-muted/30"
                }`}
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-110">
                  <Upload className="size-6" />
                </div>
                <p className="mt-2 text-xs font-bold text-foreground">
                  Click to select service banner image
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  This banner will be shown on customer search cards and service
                  details.
                </p>
              </div>
            ) : (
              <div className="relative aspect-16/7 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted">
                <Image
                  src={imagePreview}
                  alt="Service Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-300">
                    Selected File
                  </span>
                  <p className="text-xs font-bold truncate max-w-xs">
                    {imageFile?.name || "Banner ready"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive transition-colors shadow-md"
                  title="Remove Image"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.image && (
              <p className="text-xs font-medium text-destructive">
                {errors.image}
              </p>
            )}
          </div>

          {/* 6. Technician Summary (Read-Only from Session) */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-3">
              <Info className="size-4 text-amber-500" />
              <span>Technician Ownership (From Session)</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Technician Name:
                </span>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-foreground">
                  <User className="size-3.5 text-muted-foreground" />
                  <span>{technicianName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Technician Email:
                </span>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-foreground">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <span className="truncate">{technicianEmail}</span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Copied automatically to identify service ownership. Read-only for
              security.
            </p>
          </div>

          {/* Notice regarding approval status */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p>
              Upon submission, this service will be saved with{" "}
              <strong className="text-foreground">
                approvalStatus: &apos;pending&apos;
              </strong>{" "}
              and <strong className="text-foreground">isAvailable: true</strong>
              . An administrator must approve it before it becomes visible on
              the public browse services page.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Link
              href="/dashboard/technician/my-services"
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto rounded-xl text-xs sm:text-sm font-semibold"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-6 font-semibold text-white shadow-md hover:from-amber-600 hover:to-orange-600 disabled:opacity-70 text-xs sm:text-sm cursor-pointer"
            >
              <PlusCircle className="mr-2 size-4" />
              Submit for Approval
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddServiceForm;
