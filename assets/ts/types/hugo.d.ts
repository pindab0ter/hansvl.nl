export type HugoPage = {
  Date: string;
  Lastmod: string;
  PublishDate: string;
  ExpiryDate: string;
  Aliases: string[];
  BundleType: string;
  Description: string;
  Draft: boolean;
  IsHome: boolean;
  Keywords: null;
  Kind: string;
  Layout: string;
  LinkTitle: string;
  IsNode: boolean;
  IsPage: boolean;
  Path: string;
  Pathc: string;
  Slug: string;
  Lang: string;
  IsSection: boolean;
  Section: string;
  Sitemap: {
    ChangeFreq: string;
    Priority: number;
    Filename: string;
  };
  Type: string;
  Weight: number;
};
