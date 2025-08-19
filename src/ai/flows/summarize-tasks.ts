'use server';

/**
 * @fileOverview Provides AI-powered task summarization.
 *
 * - summarizeTasks - Function to generate a summary of pending tasks.
 * - SummarizeTasksInput - The input type for the summarizeTasks function.
 * - SummarizeTasksOutput - The return type for the summarizeTasks function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    completed: z.boolean(),
    createdAt: z.string(),
});

const SummarizeTasksInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('The list of pending tasks to summarize.'),
});

export type SummarizeTasksInput = z.infer<typeof SummarizeTasksInputSchema>;

const SummarizeTasksOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the pending tasks.'),
});

export type SummarizeTasksOutput = z.infer<typeof SummarizeTasksOutputSchema>;

export async function summarizeTasks(input: SummarizeTasksInput): Promise<SummarizeTasksOutput> {
  return summarizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTasksPrompt',
  input: { schema: SummarizeTasksInputSchema },
  output: { schema: SummarizeTasksOutputSchema },
  prompt: `You are a productivity assistant. Your goal is to provide a concise, high-level summary of the user's pending tasks.
Do not list the tasks one by one. Instead, group them into categories or themes and provide a brief narrative.
For example: "You have a few marketing tasks to work on, as well as some personal errands like scheduling an appointment."
Keep the summary to 2-3 sentences.

Here are the pending tasks:
{{#each tasks}}
- **{{title}}**: {{description}}
{{/each}}
`,
});

const summarizeTasksFlow = ai.defineFlow(
  {
    name: 'summarizeTasksFlow',
    inputSchema: SummarizeTasksInputSchema,
    outputSchema: SummarizeTasksOutputSchema,
  },
  async (input) => {
    if (input.tasks.length === 0) {
      return { summary: 'No pending tasks to summarize.' };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
