"use client";

import { useState } from "react";
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

import { mixers, spirits, moment, complexity, tools } from "@/lib/form-options";
import { safeFetch } from "@/lib/safe-fetch";
import { getErrorMessage } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import IdxDbWrapper from "@/components/ui/layouts/idxdb";
import { initDB } from "@/lib/idxdb";

const FormSchema = z.object({
  mixers: z.array(z.object({ value: z.string(), label: z.string() })),
  spirits: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  moment: z.string().optional(),
  cost: z.coerce.number().optional(),
  complexity: z.string().optional(),
  tools: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

type Cocktail = {
  // id: string;
  name: string;
  description: string;
  steps: {
    index: number;
    description: string;
  }[];
  is_alcoholic: boolean;
  mixers: string[];
  size: string;
  cost: number;
  complexity: string;
  required_ingredients: string[];
  required_tools: string[];
};

export default function Home() {
  const [cocktail, setCocktail] = useState<Cocktail>({
    name: "Tropical Birthday Fizz",
    description: `A bold and complex cocktail that combines the flavors of lemon, rum, 
    and whisky for a unique and sophisticated sipping experience.`,
    steps: [
      {
        index: 1,
        description:
          "In a cocktail shaker, muddle the lemon juice, rum, and whisky together until well combined.",
      },
      {
        index: 2,
        description:
          "Add ice to the shaker and shake vigorously for 10-15 seconds.",
      },
      {
        index: 3,
        description: "Strain the mixture into a chilled cocktail glass.",
      },
      {
        index: 4,
        description: "Top with ginger beer and a splash of simple syrup.",
      },
      {
        index: 5,
        description: "Garnish with a lemon twist.",
      },
    ],
    is_alcoholic: true,
    mixers: ["lemon juice", "pineapple juice", "simple syrup", "soda water"],
    size: "Unknown",
    cost: 5,
    complexity: "Medium",
    required_tools: ["jigger", "strainer", "shaker"],
    required_ingredients: ["lemon juice", "pineapple juice", "rum"],
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  async function createCocktail(details: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const body = {
        ...details,
        mixers: [
          ...details.mixers.map((m) => m.value),
          ...(details.spirits?.map((s) => s.value) || []),
        ],
        required_tools: details.tools?.map((t) => t.value),
      };

      delete body.tools;
      delete body.spirits;

      const res = await safeFetch<Cocktail>({
        input: `${process.env.NEXT_PUBLIC_API_URL}/cocktail/create`,
        init: {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        },
        schema: z.object({
          // id: z.string(),
          steps: z.array(
            z.object({ index: z.number(), description: z.string() })
          ),
          name: z.string(),
          description: z.string(),
          is_alcoholic: z.boolean(),
          mixers: z.array(z.string()),
          size: z.string(),
          cost: z.number(),
          complexity: z.string(),
          required_ingredients: z.array(z.string()),
          required_tools: z.array(z.string()),
        }),
      });

      setCocktail(res);
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createCocktail(data);
  }

  return (
    <IdxDbWrapper>
      <button onClick={() => initDB()}>Create</button>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {!cocktail ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <fieldset disabled={loading}>
                <FormField
                  control={form.control}
                  name="spirits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spirits</FormLabel>
                      <MultipleSelector
                        maxSelected={3}
                        onChange={(value) => {
                          console.log(value);
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
                      <FormItem>
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
                            console.log(value);
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
                  name="moment"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                  defaultValue={complexity[0].value}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complexity</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a complexity" />
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
                    <FormItem>
                      <FormLabel>Tools</FormLabel>
                      <MultipleSelector
                        maxSelected={5}
                        onChange={(value) => {
                          console.log(value);
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
                <CardTitle>{cocktail.name}</CardTitle>
                <CardDescription>{cocktail.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  <b>Ingredients:</b> {cocktail.required_ingredients.join(", ")}
                </p>
                <p>
                  <b>Mixers:</b> {cocktail.mixers.join(", ")}
                </p>
                <p>
                  <b>Cost:</b> {cocktail.cost}
                </p>
                <p>
                  <b>Complexity:</b> {cocktail.complexity}
                </p>
                <p>
                  <b>Tools:</b> {cocktail.required_tools.join(", ")}
                </p>
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
          </>
        )}
      </main>
    </IdxDbWrapper>
  );
}
