"use client";

import { useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { safeFetch } from "@/lib/safe-fetch";
import { getErrorMessage } from "@/lib/utils";
import {
  DepContext,
  type Cocktail as ApiCocktailResponse,
} from "@/components/context/dep-provider";
import { Modal } from "@/components/ui/custom/modal";
import { CreateCocktailForm } from "@/components/ui/custom/create-cocktail-form";
import { CocktailCard } from "@/components/ui/custom/cocktail-card";
import { Hero } from "@/components/ui/custom/hero";

const FormSchema = z.object({
  mixers: z.array(z.object({ value: z.string(), label: z.string() })),
  suggestMixers: z.boolean().optional(),
  spirits: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  moment: z.string().optional(),
  cost: z.coerce.number().optional(),
  complexity: z.string().optional(),
  tools: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  hasShaker: z.boolean().optional(),
});

type ApiCocktailRequest = {
  mixers: string[];
  suggest_mixers?: boolean;
  size?: string;
  cost?: number;
  complexity?: string;
  required_tools?: string[];
  previous_recipes?: string[];
  moment?: string;
  has_shaker?: boolean;
  base_ingredients?: string[];
};

// function for adding a `<span>` to a word from a string
// Pour your cocktail -> <span>Pour</span> your cocktail
function wrapKeywords(text: string) {
  const keywords = ['pour', 'strain', 'top off', 'shake', 'muggle', 'garnish'];

  const keywordMap = new Map(keywords.map((k) => [k.toLowerCase(), k]));

  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

  return text.replace(regex, (match) => {
    const keyword = keywordMap.get(match.toLowerCase());
    const id = keyword ? keyword.replaceAll(" ", "-").toLowerCase() : match; // First letter of the first word
    
    return `<span id="${id}">${match}</span>`;
  });
}

function wrapSteps(steps: ApiCocktailResponse["steps"]) {
  return steps.map((step) => {
    return {
      ...step,
      description: wrapKeywords(step.description),
    };
  });
}

export default function Home() {
  const [cocktail, setCocktail] = useState<{
    actual?: ApiCocktailResponse;
    prev?: ApiCocktailResponse[];
    prevFormValues?: z.infer<typeof FormSchema>;
    prevRecipes?: string[];
  }>();
  const [retry, setRetry] = useState<{
    modalOpen: boolean;
  }>({ modalOpen: false });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { idxdb, refs } = useContext(DepContext);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hasShaker: true,
      suggestMixers: true,
    },
  });

  async function createCocktail(
    details: z.infer<typeof FormSchema>,
    isRetry: boolean
  ) {
    setLoading(true);
    try {
      const body: ApiCocktailRequest = {
        mixers: details.mixers.map((m) => m.value),
        suggest_mixers: details.suggestMixers,
        cost: details.cost,
        complexity: details.complexity,
        required_tools: details.tools?.map((t) => t.value),
        moment: details.moment,
        has_shaker: details.hasShaker,
        base_ingredients: details.spirits?.map((s) => s.value) || [],
        ...(isRetry && { previous_recipes: cocktail?.prevRecipes || [] }),
      };

      const res = await safeFetch<ApiCocktailResponse>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/cocktail/create`,
        init: {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        },
        schema: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          steps: z.array(
            z.object({ index: z.string(), description: z.string() })
          ),
          is_alcoholic: z.boolean(),
          size: z.string(),
          cost: z.number(),
          complexity: z.string(),
          required_ingredients: z.array(z.string()),
          required_tools: z.array(z.string()),
          base_ingredients: z.array(z.string()),
        }),
      });

      idxdb?.cocktails.add(res);

      const parsedSteps = wrapSteps(res.steps);
      const response = {
        ...res,
        steps: parsedSteps,
      };

      setCocktail((prev) => ({
        actual: response,
        prevRecipes: [...(prev?.prevRecipes || []), res.id],
        prevFormValues: form.getValues(),
      }));
    } catch (err: unknown) {
      const msg = getErrorMessage(err);

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>, isRetry: boolean) {
    createCocktail(data, isRetry);
  }

  function handleResetValues() {
    setCocktail((prev) => ({
      ...prev,
      actual: undefined,
    }));
    form.reset();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const actualValuesAreEqual =
      JSON.stringify(form.getValues()) ===
      JSON.stringify(cocktail?.prevFormValues);

    if (actualValuesAreEqual) {
      setRetry((prev) => ({ ...prev, modalOpen: true }));
    } else {
      form.handleSubmit((vals) => onSubmit(vals, false))();
    }
  }

  function scrollSmoothToForm() {
    refs?.form.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <section
        id="hero"
        role="banner"
      >
        <Hero onCTAClick={scrollSmoothToForm} />
      </section>
      <section
        id="form"
        className="flex min-h-screen flex-col items-center md:p-24 p-2 mt-10"
        ref={refs?.form}
      >
        {!cocktail?.actual ? (
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="w-2/3 space-y-6"
            >
              <Modal
                isOpen={retry.modalOpen}
                title="Do you want to retry with the previous values?"
                onCancel={() => {
                  setRetry((prev) => ({ ...prev, modalOpen: false }));
                }}
                onSubmit={() => {
                  setRetry((prev) => ({ ...prev, modalOpen: false }));
                  form.handleSubmit((vals) => onSubmit(vals, true))();
                }}
                continueBtnProps={{
                  label: "Retry with the same values",
                }}
              >
                <p>Or maybe you want to change some values?</p>
              </Modal>
              <CreateCocktailForm
                control={form.control}
                isLoading={loading}
              />
            </form>
          </Form>
        ) : (
          <>
            <CocktailCard cocktail={cocktail.actual} />
            <Button
              onClick={handleResetValues}
              variant="outline"
              className="w-full mt-4"
            >
              Start Over
            </Button>
          </>
        )}
      </section>
    </main>
  );
}
