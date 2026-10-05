// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GallerySection } from "@/components/GallerySection";
import { gallery } from "@/content/gallery";

const withPhotos = {
  ...gallery,
  photos: [
    { tag: "wedding" as const, src: "/images/gallery/wedding.jpg", alt: { en: "Head table at a wedding" } },
    { tag: "gift-basket" as const, src: "/images/gallery/basket.jpg", alt: { en: "A gift basket" } },
  ],
};

describe("GallerySection (GALLERY_EMPTY_STATE)", () => {
  it("renders nothing at all with no photos", () => {
    const { container } = render(<GallerySection gallery={{ ...gallery, photos: [] }} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders each photo with its alt text and tag caption", () => {
    render(<GallerySection gallery={withPhotos} instagram={undefined} />);
    expect(screen.getByRole("region", { name: "Moments we've made" })).toBeTruthy();
    expect(screen.getByAltText("Head table at a wedding")).toBeTruthy();
    expect(screen.getByText("Gift basket")).toBeTruthy();
  });

  it("shows the Instagram link only when the URL is set", () => {
    const { rerender } = render(<GallerySection gallery={withPhotos} instagram={undefined} />);
    expect(screen.queryByRole("link", { name: /instagram/i })).toBeNull();
    rerender(<GallerySection gallery={withPhotos} instagram="https://instagram.com/example" />);
    expect(screen.getByRole("link", { name: /instagram/i }).getAttribute("href")).toBe("https://instagram.com/example");
  });
});
