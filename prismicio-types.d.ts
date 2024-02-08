// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };

type HomePageDocumentDataSlicesSlice =
  | TeamSectionSlice
  | TestimonialsSectionSlice
  | HeroBannerSlice;

/**
 * Content for Home Page documents
 */
interface HomePageDocumentData {
  /**
   * Slice Zone field in *Home Page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<HomePageDocumentDataSlicesSlice> /**
   * Meta Description field in *Home Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: home_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */;
  meta_description: prismic.KeyTextField;

  /**
   * Meta Image field in *Home Page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>;

  /**
   * Meta Title field in *Home Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: home_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField;
}

/**
 * Home Page document from Prismic
 *
 * - **API ID**: `home_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomePageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<HomePageDocumentData>,
    "home_page",
    Lang
  >;

/**
 * Item in *test → group*
 */
export interface TestDocumentDataGroupItem {
  /**
   * image field in *test → group*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: test.group[].image
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>;

  /**
   * text field in *test → group*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: test.group[].text
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  text: prismic.RichTextField;

  /**
   * link field in *test → group*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: test.group[].link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  link: prismic.LinkField;

  /**
   * linkToMedia field in *test → group*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: test.group[].linktomedia
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  linktomedia: prismic.LinkToMediaField;
}

type TestDocumentDataSlicesSlice =
  | TestimonialsSectionSlice
  | TeamSectionSlice
  | HeroBannerSlice;

/**
 * Content for test documents
 */
interface TestDocumentData {
  /**
   * group field in *test*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: test.group[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  group: prismic.GroupField<Simplify<TestDocumentDataGroupItem>>;

  /**
   * image field in *test*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: test.image
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>;

  /**
   * link field in *test*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: test.link
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  link: prismic.LinkField;

  /**
   * linkToMedia field in *test*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: test.linktomedia
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  linktomedia: prismic.LinkToMediaField;

  /**
   * Slice Zone field in *test*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: test.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<TestDocumentDataSlicesSlice>;
}

/**
 * test document from Prismic
 *
 * - **API ID**: `test`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type TestDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<TestDocumentData>, "test", Lang>;

/**
 * Content for Theme documents
 */
interface ThemeDocumentData {
  /**
   * Logo field in *Theme*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: theme.logo
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  logo: prismic.ImageField<never>;

  /**
   * Main color field in *Theme*
   *
   * - **Field Type**: Color
   * - **Placeholder**: *None*
   * - **API ID Path**: theme.main_color
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#color
   */
  main_color: prismic.ColorField;
}

/**
 * Theme document from Prismic
 *
 * - **API ID**: `theme`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ThemeDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<Simplify<ThemeDocumentData>, "theme", Lang>;

export type AllDocumentTypes = HomePageDocument | TestDocument | ThemeDocument;

/**
 * Primary content in *HeroBanner → Primary*
 */
export interface HeroBannerSliceDefaultPrimary {
  /**
   * Title field in *HeroBanner → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: Enter a big bold title
   * - **API ID Path**: hero_banner.primary.title
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  title: prismic.TitleField;

  /**
   * Subtitle field in *HeroBanner → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Enter a short subtitle
   * - **API ID Path**: hero_banner.primary.subtitle
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  subtitle: prismic.RichTextField;

  /**
   * CTA Button Label field in *HeroBanner → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Enter button text
   * - **API ID Path**: hero_banner.primary.button_label
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  button_label: prismic.KeyTextField;

  /**
   * CTA Button Link field in *HeroBanner → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Add link for the button
   * - **API ID Path**: hero_banner.primary.button_link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  button_link: prismic.LinkField;

  /**
   * Hero Image field in *HeroBanner → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: hero_banner.primary.hero_image
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  hero_image: prismic.ImageField<never>;
}

/**
 * Default variation for HeroBanner Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation of the hero banner with title, subtitle, button and image
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type HeroBannerSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<HeroBannerSliceDefaultPrimary>,
  never
>;

/**
 * Primary content in *HeroBanner → Primary*
 */
export interface HeroBannerSliceWithoutImagePrimary {
  /**
   * Title field in *HeroBanner → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: Enter a big bold title
   * - **API ID Path**: hero_banner.primary.title
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  title: prismic.TitleField;

  /**
   * Subtitle field in *HeroBanner → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Enter a short subtitle
   * - **API ID Path**: hero_banner.primary.subtitle
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  subtitle: prismic.RichTextField;

  /**
   * CTA Button Label field in *HeroBanner → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Enter button text
   * - **API ID Path**: hero_banner.primary.button_label
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  button_label: prismic.KeyTextField;

  /**
   * CTA Button Link field in *HeroBanner → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Add link for the button
   * - **API ID Path**: hero_banner.primary.button_link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  button_link: prismic.LinkField;
}

/**
 * Without Image variation for HeroBanner Slice
 *
 * - **API ID**: `withoutImage`
 * - **Description**: Default variation of the hero banner with title, subtitle, button and image
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type HeroBannerSliceWithoutImage = prismic.SharedSliceVariation<
  "withoutImage",
  Simplify<HeroBannerSliceWithoutImagePrimary>,
  never
>;

/**
 * Slice variation for *HeroBanner*
 */
type HeroBannerSliceVariation =
  | HeroBannerSliceDefault
  | HeroBannerSliceWithoutImage;

/**
 * HeroBanner Shared Slice
 *
 * - **API ID**: `hero_banner`
 * - **Description**: The Hero Banner is made of a big bold title, a short subtitle, a CTA button, and a hero image.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type HeroBannerSlice = prismic.SharedSlice<
  "hero_banner",
  HeroBannerSliceVariation
>;

/**
 * Primary content in *TeamSection → Primary*
 */
export interface TeamSectionSliceDefaultPrimary {
  /**
   * Section Title field in *TeamSection → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: Our Team
   * - **API ID Path**: team_section.primary.section_title
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  section_title: prismic.TitleField;
}

/**
 * Primary content in *TeamSection → Items*
 */
export interface TeamSectionSliceDefaultItem {
  /**
   * Name field in *TeamSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Name of the team member
   * - **API ID Path**: team_section.items[].name
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  name: prismic.KeyTextField;

  /**
   * Position field in *TeamSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Position of the team member
   * - **API ID Path**: team_section.items[].position
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  position: prismic.KeyTextField;

  /**
   * Profile Picture field in *TeamSection → Items*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: team_section.items[].profile_picture
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  profile_picture: prismic.ImageField<never>;
}

/**
 * Default Variation variation for TeamSection Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation displaying team members with their names, positions, and profile pictures.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type TeamSectionSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<TeamSectionSliceDefaultPrimary>,
  Simplify<TeamSectionSliceDefaultItem>
>;

/**
 * Primary content in *TeamSection → Primary*
 */
export interface TeamSectionSliceDarkPrimary {
  /**
   * Section Title field in *TeamSection → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: Our Team
   * - **API ID Path**: team_section.primary.section_title
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  section_title: prismic.TitleField;
}

/**
 * Primary content in *TeamSection → Items*
 */
export interface TeamSectionSliceDarkItem {
  /**
   * Name field in *TeamSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Name of the team member
   * - **API ID Path**: team_section.items[].name
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  name: prismic.KeyTextField;

  /**
   * Position field in *TeamSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Position of the team member
   * - **API ID Path**: team_section.items[].position
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  position: prismic.KeyTextField;

  /**
   * Profile Picture field in *TeamSection → Items*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: team_section.items[].profile_picture
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  profile_picture: prismic.ImageField<never>;
}

/**
 * dark variation for TeamSection Slice
 *
 * - **API ID**: `dark`
 * - **Description**: Default variation displaying team members with their names, positions, and profile pictures.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type TeamSectionSliceDark = prismic.SharedSliceVariation<
  "dark",
  Simplify<TeamSectionSliceDarkPrimary>,
  Simplify<TeamSectionSliceDarkItem>
>;

/**
 * Slice variation for *TeamSection*
 */
type TeamSectionSliceVariation = TeamSectionSliceDefault | TeamSectionSliceDark;

/**
 * TeamSection Shared Slice
 *
 * - **API ID**: `team_section`
 * - **Description**: The Team Section is made of a card for each team member, each card contains a name, a position, and a profile picture.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type TeamSectionSlice = prismic.SharedSlice<
  "team_section",
  TeamSectionSliceVariation
>;

/**
 * Primary content in *TestimonialsSection → Primary*
 */
export interface TestimonialsSectionSliceDefaultPrimary {
  /**
   * Section Title field in *TestimonialsSection → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Enter the title for the testimonials section
   * - **API ID Path**: testimonials_section.primary.section_title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  section_title: prismic.KeyTextField;
}

/**
 * Primary content in *TestimonialsSection → Items*
 */
export interface TestimonialsSectionSliceDefaultItem {
  /**
   * Name field in *TestimonialsSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: testimonials_section.items[].name
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  name: prismic.KeyTextField;

  /**
   * Position field in *TestimonialsSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: testimonials_section.items[].position
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  position: prismic.KeyTextField;

  /**
   * Company field in *TestimonialsSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: testimonials_section.items[].company
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  company: prismic.KeyTextField;

  /**
   * Quote field in *TestimonialsSection → Items*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Enter the testimonial quotation
   * - **API ID Path**: testimonials_section.items[].quote
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  quote: prismic.RichTextField;
}

/**
 * Default Variation variation for TestimonialsSection Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default variation displaying a collection of testimonials.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type TestimonialsSectionSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<TestimonialsSectionSliceDefaultPrimary>,
  Simplify<TestimonialsSectionSliceDefaultItem>
>;

/**
 * Primary content in *TestimonialsSection → Primary*
 */
export interface TestimonialsSectionSliceDarkPrimary {
  /**
   * Section Title field in *TestimonialsSection → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Enter the title for the testimonials section
   * - **API ID Path**: testimonials_section.primary.section_title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  section_title: prismic.KeyTextField;
}

/**
 * Primary content in *TestimonialsSection → Items*
 */
export interface TestimonialsSectionSliceDarkItem {
  /**
   * Name field in *TestimonialsSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: testimonials_section.items[].name
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  name: prismic.KeyTextField;

  /**
   * Position field in *TestimonialsSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: testimonials_section.items[].position
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  position: prismic.KeyTextField;

  /**
   * Company field in *TestimonialsSection → Items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: testimonials_section.items[].company
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  company: prismic.KeyTextField;

  /**
   * Quote field in *TestimonialsSection → Items*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Enter the testimonial quotation
   * - **API ID Path**: testimonials_section.items[].quote
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  quote: prismic.RichTextField;
}

/**
 * dark variation for TestimonialsSection Slice
 *
 * - **API ID**: `dark`
 * - **Description**: Default variation displaying a collection of testimonials.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type TestimonialsSectionSliceDark = prismic.SharedSliceVariation<
  "dark",
  Simplify<TestimonialsSectionSliceDarkPrimary>,
  Simplify<TestimonialsSectionSliceDarkItem>
>;

/**
 * Slice variation for *TestimonialsSection*
 */
type TestimonialsSectionSliceVariation =
  | TestimonialsSectionSliceDefault
  | TestimonialsSectionSliceDark;

/**
 * TestimonialsSection Shared Slice
 *
 * - **API ID**: `testimonials_section`
 * - **Description**: Displays a list of testimonials, each one contains a name, a position, a company, and a quote.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type TestimonialsSectionSlice = prismic.SharedSlice<
  "testimonials_section",
  TestimonialsSectionSliceVariation
>;

declare module "@prismicio/client" {
  interface CreateClient {
    (
      repositoryNameOrEndpoint: string,
      options?: prismic.ClientConfig,
    ): prismic.Client<AllDocumentTypes>;
  }

  namespace Content {
    export type {
      HomePageDocument,
      HomePageDocumentData,
      HomePageDocumentDataSlicesSlice,
      TestDocument,
      TestDocumentData,
      TestDocumentDataGroupItem,
      TestDocumentDataSlicesSlice,
      ThemeDocument,
      ThemeDocumentData,
      AllDocumentTypes,
      HeroBannerSlice,
      HeroBannerSliceDefaultPrimary,
      HeroBannerSliceWithoutImagePrimary,
      HeroBannerSliceVariation,
      HeroBannerSliceDefault,
      HeroBannerSliceWithoutImage,
      TeamSectionSlice,
      TeamSectionSliceDefaultPrimary,
      TeamSectionSliceDefaultItem,
      TeamSectionSliceDarkPrimary,
      TeamSectionSliceDarkItem,
      TeamSectionSliceVariation,
      TeamSectionSliceDefault,
      TeamSectionSliceDark,
      TestimonialsSectionSlice,
      TestimonialsSectionSliceDefaultPrimary,
      TestimonialsSectionSliceDefaultItem,
      TestimonialsSectionSliceDarkPrimary,
      TestimonialsSectionSliceDarkItem,
      TestimonialsSectionSliceVariation,
      TestimonialsSectionSliceDefault,
      TestimonialsSectionSliceDark,
    };
  }
}