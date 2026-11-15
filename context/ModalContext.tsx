"use client";

import React, { createContext, useContext, useState } from "react";
import { Service, Project } from "@/types";

export interface ModalContextType {
  isConsultationOpen: boolean;
  preselectedService: string;
  openConsultationModal: (serviceName?: string) => void;
  closeConsultationModal: () => void;

  isEnquiryOpen: boolean;
  enquiryPackage: string;
  openEnquiryModal: (packageName?: string) => void;
  closeEnquiryModal: () => void;

  previewImage: { url: string; title?: string; alt?: string } | null;
  openImagePreview: (img: { url: string; title?: string; alt?: string }) => void;
  closeImagePreview: () => void;

  galleryProject: Project | null;
  openProjectGallery: (project: Project) => void;
  closeProjectGallery: () => void;

  activeServiceModal: Service | null;
  openServiceDetailsModal: (service: Service) => void;
  closeServiceDetailsModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  isConsultationOpen: false,
  preselectedService: "",
  openConsultationModal: () => {},
  closeConsultationModal: () => {},
  isEnquiryOpen: false,
  enquiryPackage: "",
  openEnquiryModal: () => {},
  closeEnquiryModal: () => {},
  previewImage: null,
  openImagePreview: () => {},
  closeImagePreview: () => {},
  galleryProject: null,
  openProjectGallery: () => {},
  closeProjectGallery: () => {},
  activeServiceModal: null,
  openServiceDetailsModal: () => {},
  closeServiceDetailsModal: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState("");

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryPackage, setEnquiryPackage] = useState("");

  const [previewImage, setPreviewImage] = useState<{ url: string; title?: string; alt?: string } | null>(null);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);

  return (
    <ModalContext.Provider
      value={{
        isConsultationOpen,
        preselectedService,
        openConsultationModal: (serviceName = "") => {
          setPreselectedService(serviceName);
          setIsConsultationOpen(true);
        },
        closeConsultationModal: () => setIsConsultationOpen(false),

        isEnquiryOpen,
        enquiryPackage,
        openEnquiryModal: (packageName = "") => {
          setEnquiryPackage(packageName);
          setIsEnquiryOpen(true);
        },
        closeEnquiryModal: () => setIsEnquiryOpen(false),

        previewImage,
        openImagePreview: (img) => setPreviewImage(img),
        closeImagePreview: () => setPreviewImage(null),

        galleryProject,
        openProjectGallery: (project) => setGalleryProject(project),
        closeProjectGallery: () => setGalleryProject(null),

        activeServiceModal,
        openServiceDetailsModal: (service) => setActiveServiceModal(service),
        closeServiceDetailsModal: () => setActiveServiceModal(null),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  return useContext(ModalContext);
}
