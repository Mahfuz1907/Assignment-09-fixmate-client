"use client";

import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  Camera,
  Globe,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Sparkles,
  Upload,
  User,
  Wrench,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GettingSessionFromClient } from "@/library/GettingSessions/GetSessionClient";
import { toast } from "sonner";

interface ProfileFormValues {
  name: string;
  email: string;
  role: string;
  phone: string;
  area: string;
  bio: string;
  image: string;
}

export default function ProfilePage() {
  const session = GettingSessionFromClient();
  const sessionUser = session?.user;

  const [values, setValues] = useState<ProfileFormValues>({
    name: "Alex Morgan",
    email: "alex.morgan@fixmate.com",
    role: "customer",
    phone: "+880 1712-345678",
    area: "Dhanmondi, Dhaka",
    bio: "Passionate homeowner who loves keeping devices and home electronics running at peak performance.",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if session user arrives from client hook
  useEffect(() => {
    if (sessionUser) {
      setValues((prev) => ({
        ...prev,
        name: sessionUser.name || prev.name,
        email: sessionUser.email || prev.email,
        role: (sessionUser as { role?: string })?.role || prev.role,
        image: sessionUser.image || prev.image,
        phone: (sessionUser as { phone?: string })?.phone || prev.phone,
        area: (sessionUser as { area?: string })?.area || prev.area,
        bio: (sessionUser as { bio?: string })?.bio || prev.bio,
      }));
      if (sessionUser.image) {
        setImagePreview(sessionUser.image);
      }
    }
  }, [sessionUser]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB.");
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      toast.success("Profile photo selected! Save changes to apply.");
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = values.image;

      // ImgBB upload stub:
      if (selectedFile) {
        setIsUploadingImage(true);
        // User can later connect actual ImgBB API:
        // const formData = new FormData();
        // formData.append("image", selectedFile);
        // const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, { method: "POST", body: formData });
        // const data = await res.json();
        // finalImageUrl = data.data.url;
        finalImageUrl = imagePreview;
        setIsUploadingImage(false);
      }

      const updatedUserData = {
        name: values.name.trim(),
        email: values.email, // read-only
        role: values.role, // read-only
        phone: values.phone.trim(),
        area: values.area.trim(),
        bio: values.bio.trim(),
        image: finalImageUrl,
      };

      console.log("Updated Profile Data ready for BetterAuth:", updatedUserData);

      // Simulating network delay for smooth UI feedback
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Profile details updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTechnician = values.role === "technician";
  const isAdmin = values.role === "admin";

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
      {/* Glow highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-amber-400/10 blur-3xl"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
            <Sparkles className="size-3" />
            Account Settings
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your Profile
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage your personal information, contact address, and avatar.
          </p>
        </div>

        <Badge
          variant="outline"
          className="self-start sm:self-center uppercase tracking-wider font-semibold text-xs py-1 px-3 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        >
          {isTechnician ? (
            <span className="flex items-center gap-1.5">
              <Wrench className="size-3.5" /> Technician Account
            </span>
          ) : isAdmin ? (
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5" /> Admin Account
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" /> Customer Account
            </span>
          )}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {/* Avatar Upload Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-border/70 bg-muted/30 p-4 transition-colors hover:bg-muted/40">
          <div className="relative group">
            <Avatar className="size-20 sm:size-24 rounded-2xl ring-2 ring-amber-500/30 shadow-md">
              {imagePreview ? (
                <AvatarImage
                  src={imagePreview}
                  alt={values.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-lg font-bold text-white">
                {getInitials(values.name)}
              </AvatarFallback>
            </Avatar>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Upload profile picture"
            >
              <Camera className="size-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                Profile Photo
              </h3>
              <span className="text-[11px] text-muted-foreground">
                JPG, PNG or WEBP (max. 5MB)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Your photo is visible to {isTechnician ? "customers requesting service" : "technicians you book with"}.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 rounded-lg gap-1.5 text-xs font-semibold hover:border-amber-500/60"
              >
                <Upload className="size-3.5" />
                Upload New Image
              </Button>
              {imagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImagePreview("");
                    setSelectedFile(null);
                    setValues((p) => ({ ...p, image: "" }));
                  }}
                  className="h-8 rounded-lg text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-xs font-semibold">
              Full Name
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="profile-name"
                name="name"
                value={values.name}
                onChange={handleInputChange}
                required
                placeholder="Your full name"
                className="h-10 rounded-xl pl-9 text-sm border-border/70 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Email Address (Read-only as per specs) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-email" className="text-xs font-semibold">
                Email Address
              </Label>
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Shield className="size-2.5 text-amber-500" /> Read-only
              </span>
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="profile-email"
                name="email"
                value={values.email}
                disabled
                readOnly
                className="h-10 rounded-xl pl-9 text-sm bg-muted/60 text-muted-foreground border-border/60 cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-phone" className="text-xs font-semibold">
              Contact Phone
            </Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="profile-phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleInputChange}
                placeholder="+880 1700-000000"
                className="h-10 rounded-xl pl-9 text-sm border-border/70 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
              />
            </div>
          </div>

          {/* City / Area */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-area" className="text-xs font-semibold">
              City / Coverage Area
            </Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="profile-area"
                name="area"
                value={values.area}
                onChange={handleInputChange}
                placeholder="e.g. Mirpur, Dhaka"
                className="h-10 rounded-xl pl-9 text-sm border-border/70 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Account Role (Read-only as per specs) */}
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-role" className="text-xs font-semibold">
                Account Role
              </Label>
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Shield className="size-2.5 text-amber-500" /> Assigned by system
              </span>
            </div>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="profile-role"
                name="role"
                value={values.role.toUpperCase()}
                disabled
                readOnly
                className="h-10 rounded-xl pl-9 text-sm bg-muted/60 text-muted-foreground border-border/60 cursor-not-allowed select-none font-semibold capitalize"
              />
            </div>
          </div>

          {/* Bio / Experience (Useful for technicians & personalized for customers) */}
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-bio" className="text-xs font-semibold">
                About / Bio
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {values.bio.length} characters
              </span>
            </div>
            <Textarea
              id="profile-bio"
              name="bio"
              value={values.bio}
              onChange={handleInputChange}
              rows={3}
              placeholder={
                isTechnician
                  ? "Describe your repair skills, certified brands, and workshop experience..."
                  : "Share a little about yourself or preferred service requirements..."
              }
              className="rounded-xl border-border/70 text-sm focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Notice on Immediate Update */}
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p>
            Changes saved here will reflect across your navbar, bookings, and dashboard cards. Email and account roles can only be updated by platform administrators.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
          <Link
            href={
              isTechnician
                ? "/dashboard/technician"
                : isAdmin
                ? "/dashboard/admin"
                : "/dashboard/customer"
            }
            className="w-full sm:w-auto"
          >
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto rounded-xl text-xs sm:text-sm font-medium"
            >
              Go to Dashboard
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-orange-600 disabled:opacity-70 text-xs sm:text-sm cursor-pointer"
          >
            {isSubmitting || isUploadingImage ? (
              <>
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                Saving Changes…
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Profile Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
