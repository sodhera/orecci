---
title: "Data analyst interview questions and how to answer them"
description: "Data analyst interview questions on walking through an analysis, explaining findings to non-technical managers, dirty data and SQL or Excel, answered out loud."
answer: "Data analyst interviews ask you to walk through an analysis from question to decision, explain a finding to someone who doesn't read charts, describe how you handled messy data and talk through a SQL query or spreadsheet in plain words. The skill being tested is explanation: lead with the business question and the answer, then show only as much method as the listener needs."
breadcrumb: "Data analyst"
updated: 2026-10-22
practice_heading: "Explain a finding to a manager who doesn't read charts"
practice_prompt: "Play a sales manager with no data background. I'm a data analyst explaining why repeat purchases dropped last quarter. Ask me plain questions."
questions:
  - Walk me through an analysis you did from start to finish.
  - How would you explain a finding to a manager with no technical background?
  - Tell me about a time you worked with messy or incomplete data.
  - How do you check that your numbers are right before you share them?
  - Talk me through how you would write a query to find our top customers last month.
  - What's the difference between a LEFT JOIN and an INNER JOIN, in plain words?
  - How do you use Excel or spreadsheets in your work?
  - Tell me about a time your analysis changed a decision.
  - Tell me about a time a stakeholder disagreed with your findings.
  - How do you decide which chart to use?
  - How do you prioritize several data requests at once?
related:
  - /speaking-coach/interview-questions/tell-me-about-a-time-you-used-data-to-make-a-decision/
  - /speaking-coach/interview-questions-by-role/data-scientist/
  - /speaking-coach/interview-questions-by-role/business-analyst/
  - /speaking-coach/guides/how-to-explain-things-simply/
  - /speaking-coach/interviews/technical-interview/
---
## The job is explaining, so the interview is too

A data analyst's work only matters once someone understands it and acts on it. That's why so much of the interview is spoken: walking through your work, explaining it to a pretend manager, narrating a query. Interviewers notice quickly whether you start with the business question or with the tools.

A simple rule for every answer here: **question, answer, how you know, what happened**. Method comes third, not first.

## Walking through an analysis end to end

Use six beats and keep it to about two minutes:

1. **The business question.** "Why did repeat orders drop 12% in the spring?"
2. **The data.** Where it came from and how big it was.
3. **The cleaning.** One sentence on what was wrong and what you fixed.
4. **The analysis.** What you compared, and why that comparison.
5. **The finding.** One sentence, with a number.
6. **What happened.** The decision someone made because of it.

Example answer (made-up details):

> "Our marketing lead asked why repeat orders had dropped. I pulled 18 months of orders from our warehouse tables, about 400,000 rows. Some customers had two accounts, so I merged them on email first. I compared repeat rates by first-order month and by the discount code used. The drop was almost all customers whose first order used a 40% welcome code: they came back at about half the rate of everyone else. Marketing cut the welcome discount to 15% for new campaigns and added a second-order offer instead."

## Explaining a finding to a non-technical manager

Interviewers may role-play this. Lead with the decision, use one number and one comparison, and stop.

| Too technical | Plain |
| --- | --- |
| "The cohort analysis shows a statistically significant decline in 90-day retention." | "Customers who joined in March came back less than any other month." |
| "There's a strong negative correlation between delivery time and NPS." | "When delivery takes more than five days, customers rate us much lower." |
| "The model's coefficient for region was significant." | "The west region is the main reason the total went down." |

Then offer the detail rather than forcing it: "I can show you how I split it by region if that's useful." See [how to explain complex ideas simply](/speaking-coach/guides/how-to-explain-things-simply/) for more.

## Dirty data

Everyone has dirty data stories. What separates answers is how you *checked*, and whether you told people what you changed.

> "A weekly sales dashboard suddenly showed one store doubling its revenue. Before reporting it I checked the raw rows and found every transaction from that store had been loaded twice after a system migration. I removed the duplicates using the transaction ID, flagged it to the data engineering team and added a row-count check that alerts us if a store's daily count jumps more than 50%. I also added a note on the dashboard for that week so nobody compared against the bad numbers."

Common problems worth naming if they come up: duplicates, missing values, inconsistent formats (dates, currencies, spelling of the same city), and definitions that differ between teams, such as what counts as an "active" customer.

## Talking through SQL or Excel

When asked to explain a query out loud, narrate it in the order you'd *think* it, not the order you'd type it:

> "I'd start from the orders table and keep only last month's completed orders. I'd join to customers on customer ID so I have their names. Then I'd group by customer, sum the order value, sort from highest to lowest and take the top ten. I'd check for refunds, because a big order that was refunded shouldn't count."

That last sentence is the one that gets you hired: it shows you think about the data, not only the syntax. For Excel, describe what you built and why: "I used a pivot table to split returns by product, then XLOOKUP to bring in the supplier for each product."

## Mistakes to avoid

- **Starting with tools.** "I used Python, pandas and Tableau" before saying what the question was.
- **No result.** If nobody acted on your analysis, say what you'd recommend and why it wasn't used.
- **Over-claiming cause.** Say "linked to" unless you tested cause.
- **Silent thinking.** In a talk-through, a long silence reads as stuck. Narrate your thinking even when unsure.

Practice the "explain it to a manager" answer out loud, because written explanations rarely survive a real listener's questions. Speaking Coach can play the manager and ask follow-ups on what you actually said.

## Questions people ask

### Will a data analyst interview include a live SQL test?

Often, either live or as a take-home. Even when it's written, you may be asked to explain your query afterwards, so practice saying it out loud.

### How much statistics do I need to talk about?

Enough to explain averages versus medians, sample sizes and why correlation isn't cause. Use plain words first and the term second.

### What if my past analysis didn't change anything?

Say what you found, what you recommended and why it wasn't acted on. Interviewers value an honest account of how decisions really get made.

### How is a data analyst interview different from a data scientist one?

Analyst interviews focus on SQL, spreadsheets, dashboards and explaining results. Data scientist interviews add modeling and statistics. See [data scientist interview questions](/speaking-coach/interview-questions-by-role/data-scientist/).
