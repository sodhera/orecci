---
title: "Web developer interview questions and how to answer them"
description: "Web developer interview questions on a site you built, performance and accessibility, client change requests and explaining tech to non-developers."
answer: "Web developer interviews, especially at agencies and small companies, ask you to walk through a site you built, explain how you made it fast and accessible, describe handling a client's late change requests, and explain a technical idea to someone who isn't a developer. Answer with what the site was for, the decisions you made, and numbers you measured."
breadcrumb: "Web developer"
updated: 2026-10-22
practice_heading: "Practice explaining your site to a non-developer"
practice_prompt: "You're a small business owner hiring a web developer. Ask me to walk you through a site I built and explain why it loads fast, in plain words. Stop me if I use jargon."
questions:
  - Walk me through a website you built from start to finish.
  - How do you make a site load fast?
  - How do you make sure a site is accessible?
  - A client asks for a big change a week before launch. What do you do?
  - Explain to me, as a non-developer, why our site is slow.
  - How do you decide between a CMS and a custom build?
  - Tell me about a bug that only appeared on the live site.
  - How do you handle SEO basics when you build a site?
  - How do you keep a client's site secure and updated?
  - How do you estimate how long a project will take?
related:
  - /speaking-coach/interview-questions-by-role/frontend-developer/
  - /speaking-coach/interview-questions-by-role/software-engineer/
  - /speaking-coach/interview-questions/tell-me-about-a-time-you-explained-something-complex/
  - /speaking-coach/guides/how-to-explain-things-simply/
sources:
  - Web Vitals, web.dev | https://web.dev/articles/vitals
  - Understanding SC 1.4.3 Contrast (Minimum), W3C WCAG 2.2 | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
---
## Who is interviewing you changes the answer

"Web developer" covers a lot: agency developers building many client sites, in-house developers maintaining a company site, freelancers, and people who do full stack work on small products. The interviewer is often not another developer. It might be an agency owner, a marketing manager or the founder. So two skills get tested at once: can you build it well, and can you explain it to people who pay for it?

Before you answer, think about who is asking. A technical lead wants your stack and trade-offs. A business owner wants to know the site will work, load fast and not break.

## Walking through a site you built

Pick a project where you made real decisions, and tell it in this order:

1. **Who it was for and what it had to do:** "A dental clinic that wanted online bookings and to show up in local search."
2. **What you chose and why:** the platform, the hosting, the key plugins or frameworks.
3. **One hard part:** a performance problem, an integration, a browser bug.
4. **The result:** load time, bookings, fewer support emails, or just "launched on time and still running a year later".

> Example answer: "A clinic needed bookings online and kept losing patients to a clunky phone line. I built it on a CMS their receptionist could edit, with a booking tool embedded on every service page. The hard part was the booking widget, which slowed the page badly on phones. I loaded it only when someone clicked 'Book', which brought the mobile load time down a lot. They now update their own opening hours without calling me."

## Performance and accessibility

These two questions show whether you build for real users. Use concrete targets.

| Topic | What to mention |
| --- | --- |
| Speed | Google's Core Web Vitals: content loads within 2.5 seconds (LCP), responds to input in 200 milliseconds or less (INP), layout shift of 0.1 or less (CLS) |
| Images | Right sizes, modern formats, lazy loading below the fold |
| Code | Less JavaScript, defer what isn't needed, cache static files |
| Contrast | WCAG 2.2 Level AA asks for at least 4.5:1 for normal text, 3:1 for large text |
| Structure | Real headings, labels on form fields, alt text, keyboard navigation |
| Testing | A screen reader pass, keyboard-only pass, and an automated checker |

> Example answer for accessibility: "I start with semantic HTML, because most problems come from divs pretending to be buttons. I check contrast against WCAG AA, label every form field, and tab through the whole site without a mouse. Automated checkers only catch some problems, so I also do a quick pass with a screen reader on the main pages."

Don't just list terms. Give one example of a fix you made and what it changed.

## Client changes late in a project

"The client wants a big change a week before launch." This checks whether you can protect the project without upsetting the client.

> Example answer: "First I'd find out why. Sometimes the real need is smaller than the request. Then I'd give them the choice in plain terms: 'We can add the members area, but it moves launch by two weeks and adds this much to the budget. Or we launch on time and add it in phase two.' I put the decision in an email so we both have it. Most clients pick phase two once they see the trade-off."

Mention how you prevent this: a clear scope document, a fixed number of revision rounds, and showing work early so surprises come sooner.

## Explaining tech to non-developers

"Explain why our site is slow" is often asked by a non-developer, as a test. Use an everyday comparison, then one action.

> Example answer: "Your homepage is like a shop that unloads every delivery truck before letting customers in. It loads big photos and several tracking scripts before showing anything. If we shrink the photos and load the extras after the page appears, people see the shop in about half the time."

Avoid acronyms unless they ask. For more on this, see [how to explain complex ideas simply](/speaking-coach/guides/how-to-explain-things-simply/) and [the interview question on explaining something complex](/speaking-coach/interview-questions/tell-me-about-a-time-you-explained-something-complex/).

## How to practice

Pick one site and say the walkthrough out loud in two minutes. Then explain one technical choice to a friend who doesn't code, and watch where they look lost. Speaking Coach's interviewer can play a non-technical client and follow up on whatever you said that wasn't clear.

## Questions people ask

### Do I need a portfolio as a web developer?

Yes, if you can. Two or three live sites, with a sentence on what you did on each, beat a long list. If work is under NDA, describe it and show personal projects.

### Will there be a coding test?

Often, especially for in-house roles: a take-home task or live exercise. Agencies sometimes ask you to talk through a past build instead.

### How do I answer "WordPress or custom code?"

Say it depends on who will edit the site, the budget and how unusual the features are. Then give an example of when you picked each.

### Is web developer different from front-end developer?

They overlap. Web developer roles often include the whole site, hosting and clients. The [front-end developer questions](/speaking-coach/interview-questions-by-role/frontend-developer/) page goes deeper on components and state.
