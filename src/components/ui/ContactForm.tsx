"use client";

import { FormEvent, useState } from "react";

import { Button } from "./Button";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
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

      const data = await response.json();

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
    <form onSubmit={handleSubmit} className="w-[80%] space-y-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
              className="h-14 w-full border border-black/20 bg-transparent px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-black focus:bg-black/[0.02]"
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
              className="h-14 w-full border border-black/20 bg-transparent px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-black focus:bg-black/[0.02]"
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
            rows={7}
            className="min-h-[60px] w-full resize-y border border-black/20 bg-transparent px-4 py-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-black focus:bg-black/[0.02]"
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
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
          <p className="text-sm text-green-700">
            Your message was sent successfully.
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-700">{errorMessage}</p>
        )}
      </div>
    </form>
  );
}