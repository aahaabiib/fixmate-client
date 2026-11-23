"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2, Mail, Trash2, UserCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload-image";
import { formatDate } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/constants";
import { useApiData } from "@/hooks/use-api-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/empty-state";

const PHONE_REGEX = /^[0-9+\-\s()]{6,20}$/;

function Avatar({ src, name, className = "size-24" }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={`${className} rounded-full object-cover object-top`} />;
  }
  return (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-orange-500/15 text-3xl font-bold text-orange-500`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function AvatarUpload({ value, name, onChange, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Photo uploaded. Click Save changes to apply.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar src={value} name={name} />
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 className="size-6 animate-spin text-white" />
          </span>
        )}
      </div>

      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFile}
          disabled={disabled || uploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="mr-2 size-4" />
          {value ? "Change photo" : "Upload photo"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || uploading}
            onClick={() => onChange("")}
            className="block text-red-500 hover:text-red-600"
          >
            <Trash2 className="mr-2 inline size-4" />
            Remove
          </Button>
        )}
        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP or GIF. Max 5MB.</p>
      </div>
    </div>
  );
}

function ProfileEditor({ profile, onSaved }) {
  const { refetch } = authClient.useSession();

  const [saved, setSaved] = useState(profile);
  const [values, setValues] = useState({
    name: profile.name,
    phone: profile.phone,
    area: profile.area,
    bio: profile.bio,
    image: profile.image,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const dirty = Object.keys(values).some((k) => values[k] !== saved[k]);

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e = {};
    const name = values.name.trim();
    if (name.length < 2) e.name = "Name must be at least 2 characters";
    if (name.length > 60) e.name = "Name is too long";
    if (values.phone.trim() && !PHONE_REGEX.test(values.phone.trim()))
      e.phone = "Enter a valid phone number";
    if (values.area.length > 100) e.area = "Area is too long (max 100)";
    if (values.bio.length > 300) e.bio = "Bio is too long (max 300)";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSaving(true);
    try {
      const res = await apiFetch("/api/users/profile", {
        method: "PATCH",
        body: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          area: values.area.trim(),
          bio: values.bio.trim(),
          image: values.image,
        },
      });

      setSaved(res.user);
      setValues({
        name: res.user.name,
        phone: res.user.phone,
        area: res.user.area,
        bio: res.user.bio,
        image: res.user.image,
      });

      // session abar load koro, tahole navbar ar top bar nijei update hobe
      await refetch({ query: { disableCookieCache: true } });
      onSaved?.();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Summary card */}
      <div className="h-fit rounded-2xl border bg-card p-6 text-center">
        <div className="flex justify-center">
          <Avatar src={saved.image} name={saved.name} className="size-85" />
        </div>
        <h2 className="mt-4 text-lg font-bold">{saved.name}</h2>
        <span className="mt-1 inline-block rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium capitalize text-orange-600 dark:text-orange-400">
          {ROLE_LABEL?.[saved.role] ?? saved.role}
        </span>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Mail className="size-4" /> <span className="truncate">{saved.email}</span>
        </p>
        {saved.createdAt && (
          <p className="mt-1 text-xs text-muted-foreground">
            Member since {formatDate(saved.createdAt)}
          </p>
        )}
        {saved.bio && <p className="mt-4 text-sm text-muted-foreground">{saved.bio}</p>}
      </div>

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6 lg:col-span-2"
      >
        <div>
          <Label className="mb-3 block">Profile photo</Label>
          <AvatarUpload
            value={values.image}
            name={values.name}
            onChange={(url) => set("image", url)}
            disabled={saving}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={values.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={saved.email} readOnly disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="01XXXXXXXXX"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
            <Input
              id="area"
              placeholder="e.g. Dhanmondi, Dhaka"
              value={values.area}
              onChange={(e) => set("area", e.target.value)}
            />
            {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Tell us a little about yourself"
              value={values.bio}
              onChange={(e) => set("bio", e.target.value)}
            />
            <p className="text-right text-xs text-muted-foreground">{values.bio.length}/300</p>
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
          </div>
        </div>

        <Button
          type="submit"
          disabled={saving || !dirty}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </div>
  );
}

export default function ProfileForm() {
  const { data, error, loading, reload } = useApiData("/api/users/profile");

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-[28rem] rounded-2xl lg:col-span-2" />
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <EmptyState
        icon={UserCircle}
        title="Could not load your profile"
        description={typeof error === "string" ? error : error?.message}
      >
        <Button onClick={reload}>Try again</Button>
      </EmptyState>
    );
  }

  return <ProfileEditor profile={data.user} />;
}