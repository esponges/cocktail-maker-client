import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Cocktail } from "../../context/dep-provider";
import { useMemo } from "react";

type Props = {
  cocktail: Cocktail;
};

// todo: implement the real tooltip
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

/**
 * Parses the given HTML string, replaces spans with custom react element, and returns an array of elements.
 *
 * @param {string} htmlString - The HTML string to parse and replace spans.
 * @return {React.ReactNode[]} An array of elements with custom react element replacing spans.
 */
function parseAndReplaceSpans(htmlString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const spans = doc.body.querySelectorAll("span");

  let lastIndex = 0;
  const elements = [];

  spans.forEach((span, index) => {
    const textBefore = htmlString.substring(
      lastIndex,
      htmlString.indexOf(span.outerHTML, lastIndex)
    );

    if (textBefore) {
      elements.push(textBefore);
    }

    elements.push(
      <Tooltip
        key={index}
        word={span.id}
      >
        {span.textContent}
      </Tooltip>
    );

    lastIndex =
      htmlString.indexOf(span.outerHTML, lastIndex) + span.outerHTML.length;
  });

  if (lastIndex < htmlString.length) {
    elements.push(htmlString.substring(lastIndex));
  }

  return elements;
}

export function CocktailCard({ cocktail }: Props) {
  const parsedSteps = useMemo(() => {
    return cocktail.steps.map((step) => {
      return (
        <li
          key={step.description}
          className="my-4"
        >
          {parseAndReplaceSpans(step.description)}
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
