"use client";

import { FormEvent, useState } from "react";

import { Button } from "./Button";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const formStatusId = "contact-form-status";
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data: { message?: string; success?: boolean };
      try {
        data = await response.json();
      } catch {
        throw new Error(
          response.status === 429
            ? "Too many requests. Please try again later."
            : "Something went wrong."
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={status === "loading"}
      aria-describedby={status === "success" || status === "error" ? formStatusId : undefined}
      className="w-full md:w-[80%] space-y-2"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block tracking-[0.01em] text-foreground"
            >
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-14 w-full border border-foreground/60 bg-transparent px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block tracking-[0.01em] text-foreground"
            >
              Your email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-14 w-full border border-foreground/60 bg-transparent px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block tracking-[0.01em] text-foreground"
          >
            Say something...
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="min-h-[60px] w-full resize-y border border-foreground/60 bg-transparent px-4 py-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={status === "loading"}
          className="cursor-pointer"
          icon={
            <svg
                width="18"
                height="18"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                d="M1.75 6.5H11.25M6.5 1.75L11.25 6.5L6.5 11.25"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>
            }
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>

        {status === "success" && (
          <p
            id={formStatusId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm text-green-800 dark:text-green-300"
          >
            Your message was sent successfully.
          </p>
        )}

        {status === "error" && (
          <p
            id={formStatusId}
            role="alert"
            aria-atomic="true"
            className="text-sm text-red-800 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
