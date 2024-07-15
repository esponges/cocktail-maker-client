/* eslint-disable max-len */
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Cocktail } from "../../context/dep-provider";
import { Modal } from "./modal";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Tip = {
  keyword: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  type?: "short" | "video";
};

// todo: this could probably be better in a database?
const tips: Record<string, Tip> = {
  pour: {
    keyword: "pour",
    text: "Pour ingredients smoothly and steadily into a measuring cup or directly into the glass. For precision, use a jigger or measured pourers.",
    videoUrl: "https://youtube.com/embed/2MGKv3auWZA?si=1YnUCh3Gt6_zT0xlJjyjXw",
  },
  strain: {
    keyword: "strain",
    text: "Use a Hawthorne strainer or fine mesh strainer to remove ice and any solid ingredients. Hold the strainer firmly against the shaker or mixing glass and pour smoothly into the serving glass.",
    videoUrl: "https://www.youtube.com/embed/NctwYmQSNHU?si=Nr8trbASySPd_EIe",
  },
  top: {
    keyword: "top",
    text: "Gently add ice to fill the glass. For clear cocktails, use large, clear ice cubes. For frothy drinks, crushed ice works well. Always handle ice with a clean scoop or tongs.",
  },
  shake: {
    keyword: "shake",
    text: "Place ingredients in a shaker with ice. Seal tightly and shake vigorously for 10-15 seconds or until the outside of the shaker frosts. This aerates the drink and ensures thorough mixing and chilling.",
    videoUrl: "https://www.youtube.com/embed/VRhQKnvli14?si=aIeY0o4tzzDtPTef",
  },
  muddle: {
    keyword: "muddle",
    text: "Place ingredients in the bottom of a glass or shaker. Use a muddler to gently press and twist, releasing flavors without over-crushing. For herbs, a light touch is best; for fruits, apply more pressure.",
  },
  garnish: {
    keyword: "garnish",
    text: "Add a finishing touch to enhance appearance and aroma. For citrus slices, notch and perch on the glass rim. For herbs, lightly slap between palms to release oils before adding. Always use fresh, high-quality garnishes.",
    videoUrl: "https://www.youtube.com/embed/BB0JM8LTuoo?si=qTFYdVcef96DRxiB",
  },
  fill: {
    keyword: "fill",
    text: "Add ice to the glass, leaving about 1/2 inch of space at the top. For long drinks, fill to the brim. Use appropriate ice: cubes for most cocktails, crushed for juleps or swizzles.",
  },
  serve: {
    keyword: "serve",
    text: "Present the drink immediately after preparation. If serving with ice, ensure the glass is chilled to maintain temperature. For hot cocktails, pre-warm the glass with hot water.",
  },
};

const Tooltip = ({
  className,
  children,
  word,
}: {
  className?: string;
  children: React.ReactNode;
  word: string;
}) => {
  const [modal, openModal] = useState<{ open: boolean; data?: Tip }>({
    open: false,
  });
  const handleClick = (keyword: string) => {
    openModal({ open: true, data: tips[keyword] });
  };

  return (
    <>
      <Modal
        isOpen={modal.open}
        onClose={() => openModal({ open: false })}
        title={modal.data?.keyword}
        // className={modal?.data?.videoUrl ? "h-[25rem]" : ""}
        className={cn(className, modal?.data?.videoUrl ? "h-[25rem]" : "")}
      >
        <div>
          {modal.data?.text ? <p>{modal.data?.text}</p> : null}
          {modal.data?.imageUrl ? (
            <Image
              src={modal.data?.imageUrl}
              alt={modal.data?.keyword}
              width={200}
              height={200}
            />
          ) : null}
          {modal.data?.videoUrl ? (
            <iframe
              src={modal.data?.videoUrl}
              className="h-full mx-auto my-4"
              title="YouTube video player"
              allow={`accelerometer; autoplay; clipboard-write; 
                encrypted-media; gyroscope; picture-in-picture; web-share
                `}
              allowFullScreen
            ></iframe>
          ) : null}
        </div>
      </Modal>
      <span
        onClick={() => handleClick(word)}
        className="underline cursor-help"
        title={`Tool: ${word}`}
      >
        {children}
      </span>
    </>
  );
};

function wrapKeywordsWithTooltip(text: string): React.ReactNode[] {
  const keywords = [
    "pour",
    "strain",
    "top off",
    "shake",
    "muggle",
    "garnish",
    "fill",
    "serve",
  ];

  const keywordMap = new Map(keywords.map((k) => [k.toLowerCase(), k]));
  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const keyword = keywordMap.get(match[0].toLowerCase()) || match[0];
    const id = keyword.replaceAll(" ", "-").toLowerCase();

    parts.push(
      <Tooltip
        key={`${id}-${match.index}`}
        word={keyword}
      >
        {match[0]}
      </Tooltip>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function wrapSteps(steps: Cocktail["steps"]) {
  return steps.map((step) => ({
    ...step,
    description: wrapKeywordsWithTooltip(step.description),
  }));
}

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
  const parsedSteps = useMemo(() => {
    const steps = wrapSteps(cocktail.steps);

    return steps.map((step) => {
      return (
        <li
          key={step.index}
          className="my-4"
        >
          {step.description}
        </li>
      );
    });
  }, [cocktail.steps]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cocktail.name}</CardTitle>
        <CardDescription>{cocktail.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <b>Ingredients:</b> {cocktail.required_ingredients.join(", ")}
        </p>
        <p>
          <b>Cost:</b> {cocktail.cost}
        </p>
        <p>
          <b>Complexity:</b> {cocktail.complexity}
        </p>
        {cocktail.required_tools?.length ? (
          <p>
            <b>Tools:</b> {cocktail.required_tools.join(", ")}
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        {/* steps */}
        <ol className="list-decimal list-inside">
          <h3 className="font-bold">Steps</h3>
          {parsedSteps}
        </ol>
      </CardFooter>
    </Card>
  );
}
