"use client";

import React from "react";
import { ConsultationModal } from "./ConsultationModal";
import { EnquiryModal } from "./EnquiryModal";
import { ProjectGalleryModal } from "./ProjectGalleryModal";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { ServiceDetailsModal } from "./ServiceDetailsModal";

export function GlobalModals({
  whatsappNumber = "7535942407",
  contactPerson = "Nidhi Sharma",
}: {
  whatsappNumber?: string;
  contactPerson?: string;
}) {
  return (
    <>
      <ConsultationModal whatsappNumber={whatsappNumber} contactPerson={contactPerson} />
      <EnquiryModal whatsappNumber={whatsappNumber} contactPerson={contactPerson} />
      <ProjectGalleryModal />
      <ImagePreviewModal />
      <ServiceDetailsModal />
    </>
  );
}
