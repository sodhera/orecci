---
title: "Data scientist interview questions and how to answer them"
description: "What data scientist interviews ask out loud: explaining a model to non-experts, a failed project, choosing metrics and designing an experiment, with examples."
answer: "Beyond coding rounds, data scientist interviews ask you to explain a model to someone non-technical, talk through a project that failed, choose the right metric for a product question, and design an experiment. Answer like a case: restate the goal, say your assumptions, give a structure, then commit to a choice and its trade-offs."
breadcrumb: "Data scientist"
updated: 2026-10-22
practice_heading: "Practice a metrics case out loud"
practice_prompt: "Interview me for a data scientist role. Ask how I would measure the success of a new recommendations feature, then push on my choice of metric."
questions:
  - Explain a model you built to someone with no technical background.
  - Tell me about a data science project that failed.
  - How would you measure the success of a new feature?
  - How would you design an A/B test for a change to our checkout page?
  - What would you do if the test results were not statistically significant?
  - How do you choose between a simple model and a more complex one?
  - Tell me about a time your analysis changed a business decision.
  - How do you handle missing or messy data?
  - How would you explain precision and recall to a product manager?
  - What would you do if a stakeholder wanted a different answer than your data showed?
related:
  - /speaking-coach/interview-questions-by-role/data-analyst/
  - /speaking-coach/interview-questions-by-role/machine-learning-engineer/
  - /speaking-coach/interviews/case-interview/
  - /speaking-coach/guides/how-to-explain-things-simply/
  - /speaking-coach/interview-questions/tell-me-about-a-time-you-explained-something-complex/
---
## The spoken rounds matter more than people think

Data science loops usually include coding or SQL, statistics, and one or more spoken rounds: product sense, a case, and a behavioral interview. The spoken rounds are where many strong technical candidates lose, because they jump into methods before agreeing what the question is. The habits from a [case interview](/speaking-coach/interviews/case-interview/) help: clarify, structure, commit.

## Explaining a model to non-experts

*"Explain a model you built to someone with no technical background."* The interviewer is playing your future stakeholder. Start with the decision the model supports, not the algorithm.

Example answer (details are illustrative):

> "We wanted the support team to call customers before they cancelled. I built a model that gives every customer a score each week for how likely they are to leave in the next month. It learns from customers who left before: things like logging in less, more support tickets, and a recent price increase. The team got a list of the top 200 each Monday. It's not a crystal ball. About a third of the people on the list really were about to leave, which was far better than calling at random, and that was good enough to save the team's time."

The explanation never says "gradient boosting." If they want the method, they'll ask. The [guide to explaining things simply](/speaking-coach/guides/how-to-explain-things-simply/) covers the technique.

## A project that failed

Choose a failure where the lesson is about judgment, not a bug.

Example answer:

> "I spent two months on a demand forecasting model for our warehouses that beat the old method on paper. It never got used. I'd built it with the analytics team, but the planners who'd use it didn't trust a number they couldn't explain, and it arrived as a file, not in the tool they worked in. What I do now is sit with the end users in week one, ship a simple version into their workflow early, and only add complexity once they're using it."

## Choosing metrics

*"How would you measure the success of a new recommendations feature?"* Structure out loud:

1. **Goal.** What's the feature for? More purchases, more discovery, more time well spent?
2. **Primary metric.** One number that moves if the goal is met, such as purchases per active user from recommendations.
3. **Guardrails.** What must not get worse: overall revenue, returns, page load time.
4. **Counter-metric.** How it could look good while being bad, such as clicks rising because people can't find what they searched for.
5. **Decision.** "If the primary metric rises and guardrails hold, ship."

Commit to a choice. Listing ten metrics without picking one sounds like avoiding the question.

## Experiment design

*"Design an A/B test for a new checkout page."*

| Part | What to say |
| --- | --- |
| Hypothesis | "A single-page checkout will increase completed orders." |
| Unit | Randomize by user, not by session, so people see one version |
| Primary metric | Checkout completion rate |
| Guardrails | Average order value, payment errors, refunds |
| Sample and duration | Size it for the smallest lift worth shipping; run full weeks |
| Pitfalls | Peeking early, novelty effects, other launches overlapping |
| Decision rule | Agreed before launch |

If they ask what you'd do with a non-significant result, don't call it a failure. Say what the confidence interval rules out, whether the test had enough power, and whether a segment result is worth a follow-up test rather than a ship decision.

## Mistakes to avoid

- Naming algorithms before restating the problem.
- Answering a product question with "it depends" and stopping there.
- Telling a failure story where the cause was someone else.
- Giving accuracy as the only metric for an imbalanced problem.

## How to prepare

1. Prepare two project stories: one that shipped and changed a decision, one that didn't. Know the business result for each.
2. Practice explaining each to a non-technical friend in under two minutes.
3. Do three metric cases out loud with a timer, committing to one primary metric each time.
4. Rehearse with someone who pushes back on your metric. Speaking Coach's interviewer follows up on what you actually said, and you can add your CV so it asks about your real projects.

## Questions people ask

### How much statistics will they ask about?

Usually enough to check hypothesis testing, confidence intervals, power and common pitfalls. Explain the idea in words before any formula.

### Should I think out loud in case questions?

Yes. Say your assumptions and structure as you go so the interviewer can redirect you. Silence for a minute, then an answer, is harder to score.

### What if I don't know the company's product well?

Ask two clarifying questions about the goal and the users, state your assumptions, and continue. That's what they'd want on the job too.

### How do I talk about a model that underperformed?

Say what you expected, what happened, how you found out and what you changed. Interviewers want to see you measure honestly.

### How long should a behavioral answer be?

About 90 seconds to two minutes, with the business result included. Leave technical depth for their follow-up.
