import React, { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import {
  findFirstSidebarItemLink,
  useDocById,
} from "@docusaurus/plugin-content-docs/client";
import isInternalUrl from "@docusaurus/isInternalUrl";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";
import type { PropSidebarItemCategory } from "@docusaurus/plugin-content-docs";

function CardContainer({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx("card padding--lg", styles.cardContainer)}
    >
      {children}
    </Link>
  );
}

function CardLayout({
  href,
  icon,
  title,
  description,
  image,
  imageDark,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  image?: string;
  imageDark?: string;
}) {
  return (
    <CardContainer href={href}>
      {image && (
        <div className={styles.cardImage}>
          <img src={image + (imageDark ? "#gh-light-mode-only" : "")} />
          {imageDark && <img src={imageDark + "#gh-dark-mode-only"} />}
        </div>
      )}
      <div className={styles.cardColumn}>
        <h2 className={clsx("text--truncate", styles.cardTitle)} title={title}>
          {!image ? icon : ""} {title}
        </h2>
        {description && (
          <p
            className={clsx("text--truncate", styles.cardDescription)}
            title={description}
          >
            {description}
          </p>
        )}
      </div>
    </CardContainer>
  );
}

function CardCategory({ item }: { item: PropSidebarItemCategory }) {
  const href = findFirstSidebarItemLink(item);
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }

  return (
    <CardLayout
      href={href}
      icon="🗃️"
      title={item.label}
      description={item.description ?? ""}
    />
  );
}

function CardLink({ item }) {
  const icon = isInternalUrl(item.href) ? "📄️" : "🔗";
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={doc?.description}
      image={useBaseUrl(item.customProps?.doc_card_image)}
      imageDark={useBaseUrl(item.customProps?.doc_card_image_dark)}
    />
  );
}

export default function DocCard({ item }) {
  switch (item.type) {
    case "link":
      return <CardLink item={item} />;
    case "category":
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
