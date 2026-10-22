---
title: "Network engineer interview questions and how to answer them"
description: "Network engineer interview questions on troubleshooting connectivity aloud, design choices, change windows and outages, with example answers to practice."
answer: "Network engineer interviews test whether you troubleshoot in a clear order and design with failure in mind. Expect to talk through a 'users can't reach a site' problem layer by layer, justify a design choice, describe how you run a change window safely, and tell the story of an outage. Say what you check, in what order, and what each result tells you."
breadcrumb: "Network engineer"
updated: 2026-10-22
practice_heading: "Practice troubleshooting out loud"
practice_prompt: "Interview me for a network engineer role. Tell me users in one office can't reach an internal app but the internet works, and make me troubleshoot it out loud. Ask what each result tells me."
questions:
  - Users in one branch can't reach an internal application. Walk me through how you troubleshoot.
  - A user can ping an IP address but not reach the site by name. What's wrong?
  - How would you design the network for a new office of 200 people?
  - Why would you choose one routing protocol over another?
  - How do you plan and run a change window?
  - What's your rollback plan if a change goes wrong?
  - Tell me about a network outage you handled.
  - How do you explain a network problem to a non-technical manager?
  - How do you make a design redundant without making it too complex?
  - How do you keep network documentation current?
related:
  - /speaking-coach/interview-questions-by-role/it-support/
  - /speaking-coach/interview-questions-by-role/devops-engineer/
  - /speaking-coach/interview-questions-by-role/cybersecurity-analyst/
  - /speaking-coach/interviews/technical-interview/
---
## What network interviews feel like

Network interviews are usually a mix of quick technical questions (subnetting, protocols, what a command shows) and longer scenarios where you talk through a problem. The scenarios matter most for mid-level and senior roles. Interviewers want to hear a method, not a memory test: a structured path from symptom to cause, and a sense of risk when you touch production.

Narrating your thinking is the whole job here. Silence makes the interviewer guess what you're doing.

## Talking through a connectivity issue

"Users in one branch can't reach an internal app, but the internet works." A strong answer narrows the problem before testing anything. Say your scope questions first, then move up the layers.

1. **Scope:** one user, one branch or everyone? Since when? Any changes today?
2. **Physical and link:** if the internet works, the link is up. Note that and move on.
3. **IP and routing:** can they reach the app's IP? Trace the path. Where does it stop?
4. **DNS:** does the name resolve, and to the right address?
5. **Firewall and policy:** is traffic from that branch's subnet allowed to the app?
6. **The application:** is it listening, and is it only failing for this site?

> Example answer: "Since the internet works from the branch, the WAN link is fine, so I'd skip the cabling. I'd ask whether anyone changed anything today, then try to reach the app by IP from a branch machine. If the IP works but the name doesn't, it's DNS, probably the branch is using a different resolver. If the IP fails, I'd run a traceroute to see where it dies. If it stops at our firewall, I'd check whether a rule changed for that branch's subnet. The interviewer usually tells me a result at each step, and I'd adjust."

The phrase "what does that rule out?" is your friend. Each test should remove possibilities.

## Network design choices

"How would you design a network for a new 200-person office?" Begin with requirements, not equipment.

| Ask about | Why it changes the design |
| --- | --- |
| What runs there: voice, video, labs, guests? | Segmentation and quality of service |
| How critical is uptime? | Redundant links, devices and power |
| Growth plans | Address space and switch capacity |
| Security and compliance needs | Firewall placement and access control |
| Who will run it day to day? | How complex you can afford to make it |

> Example line: "I'd keep it as simple as the uptime need allows. Two internet links from different providers, redundant core switches, separate networks for staff, guests, phones and printers, and wireless with a guest portal. I'd avoid anything the local IT person can't support at 2 a.m."

When asked "Why that protocol?", say the trade-off in one sentence, such as scale versus simplicity, or speed of convergence versus configuration effort, and when you'd choose differently.

## Change windows

"How do you run a change window?" Interviewers want to hear that you plan for failure.

> Example answer: "I write the change plan in advance: exact commands, how I'll verify each step, and a rollback for each step with a time limit. If it's not working by a set point, we roll back, no debate. I get it reviewed by a peer, notify the people affected, and take a config backup before I start. Afterwards I verify from the user side, not just the device, and note what happened in the ticket."

The rollback time limit is what makes this answer sound experienced. It shows you won't keep "trying one more thing" at 3 a.m.

## An outage story

Use a timeline: impact, detection, your actions, root cause, and what changed after. Keep it under three minutes. Separate the quick fix from the root cause, and be honest about mistakes.

> Example answer: "A firmware upgrade on a core switch caused a spanning tree change that took down two floors for about 25 minutes. I'd done the change, so I rolled it back first, then found the new firmware changed a default setting. We added a lab test for firmware upgrades and pinned that setting in our config template."

Owning a self-caused outage calmly is often stronger than a story where you were the hero. For more on that, see [tell me about a time you made a mistake](/speaking-coach/interview-questions/tell-me-about-a-time-you-made-a-mistake/).

## How to practice

Troubleshooting answers fall apart when someone interrupts with a result you didn't expect. Practice with a friend who says "The traceroute stops at the second hop. Now what?" Speaking Coach's interviewer follows up on what you actually said, so you can rehearse the scenario round. The [technical interview guide](/speaking-coach/interviews/technical-interview/) covers thinking aloud in general.

## Questions people ask

### How much theory will they ask?

Expect some: subnetting, common protocols, the layers and what common commands show. Senior roles focus more on design and judgment than definitions.

### Should I mention certifications?

Yes, briefly, with how you've used what you learned. A short real example beats a list of certificates.

### What if I don't know the answer to a technical question?

Say what you do know, how you'd find out, and don't guess confidently. Interviewers respect "I'd check the documentation for that default" more than a wrong answer said with certainty.

### How do I explain a network problem to a manager?

Start with impact and time to fix, then the cause in one plain sentence. Save the details for if they ask.
