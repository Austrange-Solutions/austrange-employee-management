import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters long")
    .max(100, "Current password must be less than 100 characters"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long")
    .max(100, "New password must be less than 100 characters"),
});
function ChangePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    setIsSubmitting(true);
    console.log("Form submitted with data:", data);
    const { currentPassword, newPassword } = data;

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to change password");
      }
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      // Handle error (e.g., show a toast notification)
    } finally {
      setIsSubmitting(false);
    } // Handle password change logic here
  };
  return <div>
    
  </div>;
}

export default ChangePassword;
