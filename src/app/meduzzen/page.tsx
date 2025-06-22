import React from "react";
import MeduzzenAssistantPage from "@/pages/MeduzzenChatPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding Assistant",
  description: "Meduzzen AI Internship chatbot",
};

export default function MeduzzenChatPage() {
  return <MeduzzenAssistantPage />;
}
