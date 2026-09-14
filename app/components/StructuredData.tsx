import React from "react";
import { SITE_URL } from "../lib/site";

// JSON-LD, so search engines read the site as a person and a business with a
// history rather than as a set of anonymous pages. Awards keep the qualifiers
// the recognition page gives them, so nothing here claims more than the site
// itself does.

const PROFILES = [
  "https://www.linkedin.com/in/grahaphics/",
  "https://x.com/grahaphics",
];

const Schema = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export function PersonSchema() {
  return (
    <>
      <Schema
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Graham Roberts",
          url: SITE_URL,
          image: `${SITE_URL}/GrahamRoberts_headshot_Gem.jpg`,
          jobTitle: "Design Leader",
          description:
            "Design leader specializing in information design, data visualization, and immersive experiences, and the founder of Grahaphics.",
          sameAs: PROFILES,
          worksFor: {
            "@type": "Organization",
            name: "Grahaphics",
            url: `${SITE_URL}/studio`,
          },
          knowsAbout: [
            "Information design",
            "Data visualization",
            "Immersive storytelling",
            "Augmented reality",
            "Virtual reality",
            "Spatial computing",
            "Visual journalism",
            "Design leadership",
          ],
          award: [
            "Museum of Modern Art permanent collection, 2025",
            "Pulitzer Prize for Feature Writing, team, 2013",
            "Edward R. Murrow Award for Innovation, 2016",
            "News & Documentary Emmy, New Approaches: Current News, 2020",
            "World Press Photo, First Prize in Immersive Storytelling, 2018",
            "Anthem Award, Gold in Diversity, Equity & Inclusion, 2022",
          ],
        }}
      />
      <Schema
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Graham Roberts",
          url: SITE_URL,
        }}
      />
    </>
  );
}

export function StudioSchema() {
  return (
    <Schema
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Grahaphics",
        url: `${SITE_URL}/studio`,
        image: `${SITE_URL}/opengraph-image.jpg`,
        description:
          "The independent practice of Graham Roberts: advisory, strategy sprints, working prototypes, and data visualization for teams with complex information to communicate.",
        email: "grahaphics@gmail.com",
        founder: { "@type": "Person", name: "Graham Roberts", url: SITE_URL },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Berkeley",
          addressRegion: "CA",
          addressCountry: "US",
        },
        areaServed: "Worldwide",
        sameAs: PROFILES,
        knowsAbout: [
          "Data visualization",
          "Information design",
          "Design leadership advisory",
          "AI and spatial experience strategy",
          "Interactive prototyping",
        ],
      }}
    />
  );
}
