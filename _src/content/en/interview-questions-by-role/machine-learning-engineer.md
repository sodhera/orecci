---
title: "Machine learning engineer interview questions and example answers"
description: "ML engineer interview questions on taking a model to production, monitoring drift, a project that failed and ML system design, with example answers."
answer: "Machine learning engineer interviews focus less on algorithms and more on getting models to work in real systems. Expect to describe taking a model to production, how you monitor it for drift, a project that didn't work, and an ML system design question. Answer with the business goal, the simplest baseline, your design choices, and how you measured success after launch."
breadcrumb: "Machine learning engineer"
updated: 2026-10-22
practice_heading: "Practice an ML system design round out loud"
practice_prompt: "Interview me for a machine learning engineer role. Ask me to design a recommendation system for an online bookstore, then push me on data, metrics, latency and monitoring."
questions:
  - Tell me about a model you took to production. What was hard?
  - How do you know a model is still working after launch?
  - How would you detect and handle data drift?
  - Tell me about an ML project that didn't work.
  - Design a recommendation system for an online store.
  - How do you choose between a simple model and a complex one?
  - How do offline metrics relate to the business result?
  - How do you make training reproducible?
  - How would you explain a model's mistake to a product manager?
  - How do you decide when a model needs retraining?
related:
  - /speaking-coach/interview-questions-by-role/data-scientist/
  - /speaking-coach/interview-questions-by-role/data-engineer/
  - /speaking-coach/interview-questions-by-role/software-engineer/
  - /speaking-coach/interview-questions/tell-me-about-a-time-you-failed/
---
## What ML engineer interviews test beyond the math

Most ML engineering loops include coding, some ML fundamentals, an ML system design round and behavioral questions about past projects. The theme across them is production: can you make a model useful, reliable and maintainable, not just accurate in a notebook? Interviewers often hire the candidate who says "we started with a simple baseline" over the one who lists the newest architectures.

## Taking a model to production

"Tell me about a model you took to production." Tell it in this order, in about two to three minutes:

1. **The business goal:** what decision the model supports. "Flag likely fraudulent orders before shipping."
2. **The baseline:** what existed before, like rules or nothing, and its performance.
3. **The model and why:** the simplest thing that beat the baseline enough.
4. **The production path:** how it's served (batch scores or real-time), latency limits, feature consistency between training and serving.
5. **The launch:** shadow mode, A/B test or gradual rollout, and the business result.
6. **What was hard:** usually data, not modeling.

> Example answer: "We wanted to catch fraudulent orders before they shipped. The rules system caught about half of known fraud. I trained a gradient-boosted model on order and account features, which did much better offline. The hard part was serving: three features were calculated differently in our training data than in the live system, so live scores were worse. I moved feature logic into one shared library used by both. We ran the model in shadow mode for two weeks, compared it to the rules, then turned it on for 10 percent of orders before full rollout."

The training-serving mismatch is a classic. If you have a story like it, use it.

## Monitoring drift

"How do you know the model still works?" Show you monitor at several levels.

| What to watch | Example |
| --- | --- |
| Input data | Feature distributions, missing values, new categories appearing |
| Predictions | Share of positive predictions, score distribution over time |
| Outcomes | Accuracy or precision once true labels arrive, which may take days or weeks |
| Business metric | Chargebacks, click-through, revenue, support tickets |
| System health | Latency, errors, model version in use |

> Example answer: "For the fraud model, labels arrived weeks later as chargebacks, so I couldn't wait for accuracy. I monitored input drift on the top features and the daily share of flagged orders. When the flag rate jumped one week, we found a new payment method the model hadn't seen. We added it as a feature and retrained. Since then retraining runs monthly, and also whenever drift crosses a threshold."

## A project that didn't work

This shows honesty and judgment. Pick one where you learned something specific, not a disguised success.

> Example answer: "I spent six weeks on a deep learning model to predict customer churn. It beat our simple model offline by a small margin, but it was slow, hard to explain, and the retention team couldn't act on its predictions because it gave no reasons. We shipped the simpler model with clear top reasons per customer instead. My lesson: I now ask how predictions will be used before I pick a model, and I set a 'good enough' target at the start."

The general version of this question is [tell me about a time you failed](/speaking-coach/interview-questions/tell-me-about-a-time-you-failed/).

## The ML system design round

"Design a recommendation system for an online bookstore." Use a steady structure out loud:

1. **Clarify the goal and metric:** more purchases? Discovery of new authors? What's the online metric?
2. **Data:** what interactions you have, cold start for new users and new books.
3. **Candidate generation, then ranking:** a cheap step to narrow millions of books to hundreds, then a better model to order them.
4. **Serving:** latency budget, precomputed versus real-time.
5. **Evaluation:** offline metrics first, then an A/B test on the business metric.
6. **Risks:** feedback loops, popularity bias, monitoring.

Say your trade-offs out loud: "I'd start with a popularity baseline and simple collaborative filtering, because it's quick to ship and gives us a benchmark." For thinking aloud in technical rounds, see the [technical interview guide](/speaking-coach/interviews/technical-interview/).

## How to practice

Tell your production story out loud with a timer, then have someone ask "Why not a simpler model?" and "How did you know it worked?" Speaking Coach's interviewer follows up on what you actually said, and you can add your CV so it asks about your real projects.

## Questions people ask

### How is an ML engineer interview different from a data scientist interview?

ML engineer interviews focus more on production: serving, pipelines, monitoring and code quality. Data scientist interviews focus more on analysis, experiments and statistics. The [data scientist questions](/speaking-coach/interview-questions-by-role/data-scientist/) page covers that side.

### How much math will they ask?

Usually fundamentals: bias and variance, overfitting, evaluation metrics, and how common models work. Explain them in plain words with an example.

### What if my project never reached production?

Say so, and explain what would have been needed: serving, monitoring, retraining. Showing you know the path counts.

### Should I talk about large language models?

If the role involves them, yes, with the same discipline: the use case, a baseline, how you evaluated it and what it cost to run.
