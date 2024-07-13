import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Cocktail } from "../../context/dep-provider";

type Props = {
  cocktail: Cocktail;
};

const Tooltip = ({
  children,
  word,
}: {
  children: React.ReactNode;
  word: string;
}) => (
  <span
    style={{ textDecoration: "underline", cursor: "help" }}
    title={`Tool: ${word}`}
  >
    {children}
  </span>
);

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

export function CocktailCard({ cocktail }: Props) {
  const parsedSteps = useMemo(() => {
    const steps = wrapSteps(cocktail.steps);

    return steps.map((step) => {
      return (
        <li key={step.index} className="my-4">
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
