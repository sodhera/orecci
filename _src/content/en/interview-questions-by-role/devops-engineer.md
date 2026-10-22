---
title: "DevOps engineer interview questions and how to answer them"
description: "DevOps engineer interview questions on an outage you handled, CI/CD pipelines, on-call and getting developers to change process, with example answers."
answer: "DevOps interviews ask you to tell an outage story, design or critique a CI/CD pipeline out loud, describe how you run on-call without burning people out, and explain how you got developers to adopt a new process. Answer with a clear timeline, the trade-offs you weighed, the numbers you tracked, and what changed afterwards so it didn't happen again."
breadcrumb: "DevOps engineer"
updated: 2026-10-22
practice_heading: "Practice your outage story under questioning"
practice_prompt: "Interview me for a DevOps engineer role. Ask me to walk you through a production outage I handled, then dig into my timeline and what I changed afterwards."
questions:
  - Tell me about an outage you handled. Walk me through the timeline.
  - How did you find the root cause?
  - Design a CI/CD pipeline for a web service. What stages would it have?
  - How do you make deployments safe to roll back?
  - How do you run on-call so it's sustainable?
  - What do you put in a postmortem?
  - Tell me about a time you convinced developers to change how they work.
  - What metrics do you use to judge delivery performance?
  - How do you manage secrets in a pipeline?
  - How would you reduce a slow build from 40 minutes?
related:
  - /speaking-coach/interview-questions-by-role/software-engineer/
  - /speaking-coach/interview-questions-by-role/network-engineer/
  - /speaking-coach/interview-questions/tell-me-about-a-time-you-persuaded-someone/
  - /speaking-coach/interviews/technical-interview/
sources:
  - Postmortem culture, Google SRE book | https://sre.google/sre-book/postmortem-culture/
  - DORA's software delivery performance metrics | https://dora.dev/guides/dora-metrics/
---
## What DevOps interviewers are really testing

DevOps sits between systems and people. Expect a technical design round (often a pipeline or infrastructure question at a whiteboard) and one or more conversations about incidents and teamwork. In both, interviewers want to hear how you think under pressure and how you change things without being anyone's boss.

The tool list on your CV gets you the interview. The stories get you the job.

## The outage story

"Tell me about an outage you handled" is almost guaranteed. Tell it as a timeline, in under three minutes, then let them dig.

1. **Impact first:** what broke, for whom, for how long. "Checkout errors for about 30 percent of users for 40 minutes."
2. **Detection:** how you found out. An alert, or a customer? (If a customer, say so; it leads to your fix.)
3. **Your role:** incident lead, on-call responder, or helper.
4. **Mitigation before root cause:** what you did to stop the bleeding, like rolling back or failing over.
5. **Root cause:** what actually happened.
6. **What changed:** the follow-up actions that were actually completed.

> Example answer: "At 2 a.m. our error rate alert fired for the payments API. I was on call. Within ten minutes I saw it started right after a config deploy, so I rolled it back, and errors dropped in about five minutes. The root cause was a connection pool setting that was fine in staging but too low for production traffic. Afterwards we added a canary stage that sends 5 percent of traffic to new config first, and an alert on pool saturation. We haven't had that class of incident since."

Separating mitigation from root cause is what makes an incident story sound senior. So is a postmortem without blame: Google's SRE book describes blameless postmortems as finding contributing causes without blaming any individual or team.

## Talking through a CI/CD pipeline

"Design a pipeline for a web service" is a conversation. Say the stages and, for each, why it's there.

| Stage | What to say about it |
| --- | --- |
| Build | Reproducible, pinned dependencies, built once and promoted, not rebuilt per environment |
| Fast tests | Unit tests and linting under a few minutes, so developers get quick feedback |
| Security checks | Dependency and secret scanning, image scanning |
| Deploy to staging | Same artifact, same infrastructure code as production |
| Production rollout | Canary or blue-green, with automatic rollback on error-rate alerts |
| After deploy | Smoke tests, dashboards, and an easy way to roll back |

Then mention the trade-off you'd watch: more gates make releases safer but slower. If they ask how you'd measure the pipeline's success, the DORA metrics are a common shared language: change lead time, deployment frequency, failed deployment recovery time, change fail rate and deployment rework rate.

## On-call

"How do you run on-call sustainably?" Talk about both systems and people.

- Alerts that require action. If an alert can be ignored, delete or fix it.
- Runbooks for the top alerts, so a tired engineer at 3 a.m. isn't guessing.
- A rotation big enough that nobody is on call too often, with a clear escalation path.
- Reviewing pages each week and treating noisy alerts as bugs.

> Example answer: "When I joined, the on-call engineer got about 40 pages a week and most were noise. I tracked every page for a month, deleted or tuned the ones nobody acted on, and wrote runbooks for the top five. Pages dropped to a handful a week, and people stopped swapping out of on-call."

## Convincing developers to change process

This is a persuasion question. Developers resist new process when it slows them down. Show that you made the new way the easy way.

> Example answer: "Teams were deploying by hand from their laptops, and two outages came from that. Instead of writing a policy, I built a pipeline template that made deploying faster than the manual way, and migrated one willing team first. Their deploys went from about an hour to a few minutes, and they showed it at the engineering demo. Within two months most teams had asked to move, and only then did we turn off laptop deploys."

The general version is [tell me about a time you persuaded someone](/speaking-coach/interview-questions/tell-me-about-a-time-you-persuaded-someone/).

## How to practice

Say your outage story out loud with a timer, then have someone ask "Why didn't you catch it in staging?" and "What would you do differently?" Speaking Coach's interviewer follows up on what you actually said, which is where incident stories usually fall apart. For whiteboard rounds, the [technical interview guide](/speaking-coach/interviews/technical-interview/) covers thinking out loud.

## Questions people ask

### What if I've never led an incident?

Talk about one you helped with, and be clear about your part. Then say what you'd do as the lead, step by step.

### How technical should my answers be?

Start at a level a manager could follow, then go deep when asked. Interviewers want both clarity and depth.

### Should I talk about specific tools?

Yes, but tie each one to a reason. "We used Terraform so every environment was built the same way" beats a list of logos.

### What's the best question to ask a DevOps interviewer?

Ask how many pages the on-call rotation gets a week, and what the last postmortem changed. The answers tell you a lot about the team.
