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

type Tip = {
  keyword: string;
  videoUrl?: string;
  text?: string;
  imageUrl?: string;
};

const tips: Record<string, Tip> = {
  pour: {
    keyword: "pour",
    text: "Pour into a cup or highball glass",
  },
  strain: {
    keyword: "strain",
    text: "Strain into a cocktail glass",
  },
  top: {
    keyword: "top",
    text: "Top with ice",
  },
  shake: {
    keyword: "shake",
    text: "Shake with ice",
    videoUrl:
      "https://www.youtube.com/watch?v=VRhQKnvli14&ab_channel=Liquor.com",
  },
  muggle: {
    keyword: "muggle",
    text: "Muddle with ice",
  },
  garnish: {
    keyword: "garnish",
    text: "Garnish with a slice of lemon",
  },
  fill: {
    keyword: "fill",
    text: "Fill with ice",
  },
  serve: {
    keyword: "serve",
    text: "Serve with ice",
  },
};

const Tooltip = ({
  children,
  word,
}: {
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
              width="560"
              height="315"
              src={modal.data?.videoUrl}
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
