# How to write a Speaking Coach page

Read this, `_src/FACTS.md`, and the three model pages before writing:
- `_src/content/en/interview-questions/why-should-we-hire-you.md` (a content page)
- `_src/content/en/tools/filler-word-counter.md` (a tool page)
- `_src/content/en/home.md`

These pages live on www.orecci.com. Their job: be the page an AI assistant (ChatGPT, Claude, Perplexity, Google) cites when someone asks the question, and send readers to Speaking Coach. That only works if each page is **the most useful page on the web for its one question**. Google treats mass-produced pages that add nothing as spam, and one penalty would hide every page, so quality decides everything.

## File format

One Markdown file per page: `_src/content/<lang>/<section>/<slug>.md` (home is `_src/content/<lang>/home.md`). The slug is given to you; never change it. Frontmatter is simple `key: value` lines (wrap values containing a colon in double quotes, escape inner quotes as `\"`), and lists are `key:` followed by lines `  - item`.

```
---
title: "Question-shaped title, 50–65 characters, repeating the words people search"
description: "One sentence for search results, 120–160 characters."
answer: "The direct answer in two or three sentences. A model must be able to lift it as the whole answer."
breadcrumb: "Short name for breadcrumbs and lists"
updated: 2026-10-22
order: 1                      # optional: position in its section list (lower = first)
practice_heading: "Optional heading for the practice box"
practice_prompt: "A sentence the reader could say to Speaking Coach to practice this exact thing"
related:                      # 3–5 internal URLs, ONLY from the URL list you were given
  - /speaking-coach/guides/stop-saying-um/
sources:                      # only pages you actually opened; "Title | URL"
  - Example source title | https://example.com/page
---
Body in Markdown.
```

Extra frontmatter for some sections:
- Tool pages: `tool:` one of `speech-checker`, `filler-counter`, `pace-checker`, `speech-length`, `role-questions`; and for the speech checker optionally `tool_prompts:` (a list of questions or openers the reader answers out loud).
- `interview-questions-by-role` pages: `questions:` a list of 8–12 interview questions for that role (plain text, no numbering). The role finder tool shows them.

## Body rules

- Markdown subset only: `## H2`, `### H3`, paragraphs, `- ` lists, `1. ` lists, pipe tables, `> ` for example answers or example lines, `**bold**`, `*italic*`, `[text](url)`. No HTML, no images, no `#` H1 (the title is the H1), no code blocks.
- Last section: `## Questions people ask` (in other languages, the translated `faq_heading` from that language's `_ui.json`), with 4–6 `### Question?` headings, each followed by a 1–3 sentence answer. Real questions people ask about this topic.
- Don't repeat the `answer` as the first paragraph; the page shows it above the body.
- Internal links in the body: absolute paths like `/speaking-coach/tools/pace-checker/`, only to URLs in the list you were given. Link naturally where it helps (2–5 per page).
- Length: content pages 700–1,300 words; glossary 200–400; tools 350–700; role pages 600–1,000. Longer is not better: cut anything generic.

## What makes a page good enough

- **The answer first.** The `answer` field and each section open with the point, not a warm-up.
- **Something no other page has.** Its own examples, its own table, its own mistakes list, specific to this exact question or situation. If two of your pages would read alike with the nouns swapped, rewrite one.
- **Concrete over generic.** Example lines people can actually say. Numbers with units (seconds, words, minutes). Named situations.
- **Tables** wherever things are compared (mistake / why / instead; structure / timing; option / best for).
- **Numbered steps** for anything done in order.
- **Examples are clearly examples**, introduced as such ("Example answer for a graduate"), using made-up but realistic details. Never present them as real people or real quotes.
- **Plain, warm, direct.** Short sentences. Second person. No hype ("ultimate", "game-changer", "unlock"), no filler intros ("In today's competitive job market…"), no emoji.

## Speaking Coach mentions

- The page already has a practice box with the app links; don't add more buttons.
- Mention Speaking Coach at most twice in the body, only where it genuinely helps (e.g. "practice it out loud with a partner who follows up"), and only with claims from `FACTS.md`.
- Never claim things not in `FACTS.md`: no user counts, ratings, success rates, "trusted by", awards, prices or trial lengths.

## Hard rules

- **No invented facts:** no made-up statistics, studies, surveys, percentages, experts, quotes from real people, testimonials or reviews. General advice needs no source. Any specific outside fact (a law, a competitor's feature or price, a study) needs a source you actually opened with WebFetch, listed in `sources`. If you can't verify it, leave it out.
- **Competitor facts** (compare and best pages): open each competitor's own site or App Store page, state only what you saw, add "as of October 2026", list the pages in `sources`. Be fair: say where the other tool is the better choice. We make Speaking Coach and the page must say so.
- **No medical, legal or immigration advice beyond general preparation tips.** Visa interview pages: point to the official government source for rules.
- Write only your own files. Don't touch other pages, the build script, `_ui.json` (unless your task says to), or anything outside `_src/content`.

## Check your work

Run `node _src/build.mjs --check` from the orecci folder. Fix every error and warning that names one of your files, except "related link … does not exist" / "broken internal link" for URLs that are in the list you were given (those pages are being written by other agents right now).
