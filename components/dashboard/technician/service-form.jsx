"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/image-upload";
import { SERVICE_CATEGORIES, SERVICE_MODES } from "@/lib/service-options";

// array of string ba array of object, dui rokom hole-i kaj korbe
const toOption = (o) =>
  typeof o === "string"
    ? { value: o, label: o }
    : { value: o.value, label: o.label ?? o.value };

const categoryOptions = SERVICE_CATEGORIES.map(toOption);
const modeOptions = SERVICE_MODES.map(toOption);

function Field({ label, htmlFor, error, children, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function ServiceForm({
  initial,
  user,
  submitLabel = "Submit",
  submitting = false,
  onSubmit,
}) {
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? "",
    serviceMode: initial?.serviceMode ?? "",
    basePrice: initial?.basePrice != null ? String(initial.basePrice) : "",
    estimatedDuration: initial?.estimatedDuration ?? "",
    serviceArea: initial?.serviceArea ?? "",
    description: initial?.description ?? "",
    image: initial?.image ?? "",
  });
  const [errors, setErrors] = useState({});

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e = {};
    if (values.title.trim().length < 3) e.title = "Title must be at least 3 characters";
    if (!values.category) e.category = "Please select a category";
    if (!values.serviceMode) e.serviceMode = "Please select a service mode";
    if (!(Number(values.basePrice) > 0)) e.basePrice = "Enter a price greater than 0";
    if (!values.estimatedDuration.trim()) e.estimatedDuration = "Enter estimated duration";
    if (!values.serviceArea.trim()) e.serviceArea = "Enter your service area";
    if (values.description.trim().length < 20)
      e.description = "Description must be at least 20 characters";
    if (!values.image) e.image = "Please upload a service image";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    onSubmit({
      title: values.title.trim(),
      category: values.category,
      serviceMode: values.serviceMode,
      basePrice: Number(values.basePrice),
      estimatedDuration: values.estimatedDuration.trim(),
      serviceArea: values.serviceArea.trim(),
      description: values.description.trim(),
      image: values.image,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Technician name" htmlFor="techName">
          <Input id="techName" value={user?.name ?? ""} readOnly disabled />
        </Field>
        <Field label="Technician email" htmlFor="techEmail">
          <Input id="techEmail" value={user?.email ?? ""} readOnly disabled />
        </Field>

        <Field label="Service title" htmlFor="title" error={errors.title} className="md:col-span-2">
          <Input
            id="title"
            placeholder="e.g. iPhone Screen Replacement"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>

        <Field label="Category" error={errors.category}>
          <Select value={values.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Service mode" error={errors.serviceMode}>
          <Select value={values.serviceMode} onValueChange={(v) => set("serviceMode", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              {modeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Base price (USD)" htmlFor="basePrice" error={errors.basePrice}>
          <Input
            id="basePrice"
            type="number"
            min="1"
            step="0.01"
            placeholder="50"
            value={values.basePrice}
            onChange={(e) => set("basePrice", e.target.value)}
          />
        </Field>

        <Field label="Estimated duration" htmlFor="duration" error={errors.estimatedDuration}>
          <Input
            id="duration"
            placeholder="e.g. 1-2 hours"
            value={values.estimatedDuration}
            onChange={(e) => set("estimatedDuration", e.target.value)}
          />
        </Field>

        <Field label="Service area" htmlFor="area" error={errors.serviceArea} className="md:col-span-2">
          <Input
            id="area"
            placeholder="e.g. Dhanmondi, Dhaka"
            value={values.serviceArea}
            onChange={(e) => set("serviceArea", e.target.value)}
          />
        </Field>

        <Field label="Description" htmlFor="description" error={errors.description} className="md:col-span-2">
          <Textarea
            id="description"
            rows={4}
            placeholder="Describe what you repair, what is included, warranty etc."
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        <Field label="Service image" error={errors.image} className="md:col-span-2">
          <ImageUpload
            value={values.image}
            onChange={(url) => set("image", url)}
            disabled={submitting}
            error={errors.image}
          />
        </Field>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="bg-orange-500 text-white hover:bg-orange-600"
      >
        {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}