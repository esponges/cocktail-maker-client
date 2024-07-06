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

export function CocktailCard({ cocktail }: Props) {
  return (
    <Card>
    <CardHeader>
      <CardTitle>{cocktail.name}</CardTitle>
      <CardDescription>{cocktail.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>
        <b>Ingredients:</b>{" "}
        {cocktail.required_ingredients.join(", ")}
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
        {cocktail.steps.map((step, index) => (
          <li
            key={index}
            className="my-4"
          >
            {step.description}
          </li>
        ))}
      </ol>
    </CardFooter>
  </Card>
  );
}
