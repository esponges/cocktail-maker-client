"use client";

import { useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Checkbox } from "@/components/ui/checkbox";
import { mixers, spirits, moment, complexity, tools } from "@/lib/form-options";
import { safeFetch } from "@/lib/safe-fetch";
import { getErrorMessage } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  DepContext,
  type Cocktail as ApiCocktailResponse,
} from "@/components/context/dep-provider";
import { Modal } from "@/components/ui/modal";

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
  const { idxdb } = useContext(DepContext);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hasShaker: false,
      suggestMixers: true,
      // complexity: "Medium"
    },
  });

  async function createCocktail(details: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const body: ApiCocktailRequest = {
        mixers: details.mixers.map((m) => m.value),
        suggest_mixers: details.suggestMixers,
        // size: details.
        cost: details.cost,
        complexity: details.complexity,
        required_tools: details.tools?.map((t) => t.value),
        previous_recipes: cocktail?.prevRecipes || [],
        moment: details.moment,
        has_shaker: details.hasShaker,
        base_ingredients: details.spirits?.map((s) => s.value) || [],
      };

      const res = await safeFetch<ApiCocktailResponse>({
        input: `${process.env.NEXT_PUBLIC_API_URL}/cocktail/create`,
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

      setCocktail((prev) => ({
        actual: res,
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setCocktail(undefined);
    createCocktail(data);
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
      form.handleSubmit(onSubmit)();
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
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
                // handleResetValues();
              }}
              onSubmit={() => {
                setRetry((prev) => ({ ...prev, modalOpen: false }));
                form.handleSubmit(onSubmit)();
              }}
              continueBtnProps={{
                // props: { type: "submit" },
                label: "Retry with the same values",
              }}
            >
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                Or maybe you want to change some values?
              </p>
            </Modal>
            <fieldset disabled={loading}>
              <FormField
                control={form.control}
                name="spirits"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Spirits</FormLabel>
                    <MultipleSelector
                      maxSelected={3}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={loading}
                      defaultOptions={spirits}
                      placeholder="Select at least one..."
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                    <FormDescription>
                      Optional - Select up to 3 spirits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mixers"
                render={({ field: { onChange } }) => (
                  <>
                    <FormItem className="mt-4">
                      <FormLabel>Mixers *</FormLabel>
                      <MultipleSelector
                        maxSelected={3}
                        onMaxSelected={(maxLimit) => {
                          console.log(
                            `You have reached max selected: ${maxLimit}`
                          );
                        }}
                        disabled={loading}
                        onChange={(value) => {
                          onChange(value);
                        }}
                        defaultOptions={mixers}
                        placeholder="Select at least one..."
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                      />
                      <FormDescription>
                        You can select up to 3 mixers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="suggestMixers"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <div className="items-top flex space-x-2 mt-4">
                      <Checkbox
                        id="suggestMixers"
                        defaultChecked
                        onCheckedChange={field.onChange}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="suggestMixers"
                          className={`text-sm font-medium leading-none 
                          peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                        >
                          Allow extra mixers?
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Some cocktails might require extra mixers for the
                          perfect recipe. However, if you only want to use the
                          mixers you have selected, you can disable this and we
                          will find the best recipe for you.
                        </p>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="moment"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Moment</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a moment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {moment.map((item) => (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Optional - The moment or time of the cocktail
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                defaultValue={0}
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Cost</FormLabel>
                    <Input
                      type="number"
                      placeholder="Cost of the cocktail"
                      {...field}
                    />
                    <FormDescription>
                      Optional - The cost of the cocktail
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complexity"
                defaultValue={complexity[1].value}
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Complexity</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={complexity[1].value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {complexity.map((item) => (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Optional - The complexity of the cocktail
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tools"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Tools</FormLabel>
                    <MultipleSelector
                      maxSelected={5}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultOptions={tools}
                      placeholder="Select tools..."
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                    <FormDescription>
                      Optional - Select up to 5 tools that you want to use
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasShaker"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <div className="items-top flex space-x-2 mt-4">
                      <Checkbox
                        id="hasShaker"
                        onCheckedChange={field.onChange}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="hasShaker"
                          className={`text-sm font-medium leading-none 
                          peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                        >
                          Do you have a shaker?
                        </label>
                        <p className="text-sm text-muted-foreground">
                          The Shaker is probably the most important tool to
                          craft a cocktail. However, if you do not have one we
                          can still create a great cocktail for you!
                        </p>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center mt-4">
                {!loading ? (
                  <Button type="submit">Create Cocktail 🍸</Button>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>We are crafting your cocktail...</span>
                    <Spinner show />
                  </div>
                )}
              </div>
            </fieldset>
          </form>
        </Form>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{cocktail.actual.name}</CardTitle>
              <CardDescription>{cocktail.actual.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <b>Ingredients:</b>{" "}
                {cocktail.actual.required_ingredients.join(", ")}
              </p>
              <p>
                <b>Cost:</b> {cocktail.actual.cost}
              </p>
              <p>
                <b>Complexity:</b> {cocktail.actual.complexity}
              </p>
              {cocktail.actual.required_tools?.length ? (
                <p>
                  <b>Tools:</b> {cocktail.actual.required_tools.join(", ")}
                </p>
              ) : null}
            </CardContent>
            <CardFooter>
              {/* steps */}
              <ol className="list-decimal list-inside">
                <h3 className="font-bold">Steps</h3>
                {cocktail.actual.steps.map((step, index) => (
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
          <Button
            onClick={handleResetValues}
            variant="outline"
            className="w-full mt-4"
          >
            Start Over
          </Button>
        </>
      )}
    </main>
  );
}
