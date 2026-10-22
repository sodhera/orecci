# Cybersecurity analyst interview questions and how to answer them

Cybersecurity analyst interviews ask you to walk through an incident step by step, respond to a reported phishing email, explain a risk to a non-technical executive, and show how you keep up with new threats. Answer with a clear sequence of what you check and why, what you contain first, and the business impact in plain words.

By the Speaking Coach team at Sodhera Intelligence. Updated 2026-10-22. Source: https://www.orecci.com/speaking-coach/interview-questions-by-role/cybersecurity-analyst/

## What security interviewers are scoring

Security analyst interviews are about judgment under uncertainty. You rarely have all the facts during an alert, so interviewers want to see how you reason: what you check first, when you escalate, what you contain, and how you explain it to people who don't speak security. Technical depth matters, but a clear, calm process often matters more.

Many candidates name frameworks. Fewer can walk through an actual Tuesday afternoon alert. Do the second.

## The incident walk-through

"Tell me about an incident you worked on," or "Walk me through investigating this alert." Use a sequence you can say out loud:

1. **Triage:** is this real? What triggered it, which asset, which user, how important is that system?
2. **Scope:** is it one machine or more? Search for the same indicator across your logs.
3. **Contain:** isolate the host, disable the account, block the domain. Say what you'd do first and why.
4. **Investigate:** how did it get in, what did it touch, is anything still there?
5. **Recover:** clean or rebuild, reset credentials, monitor.
6. **Learn:** what detection or control would have stopped it sooner?

Interviewers may also ask which framework you follow. NIST's incident response guidance was revised in April 2025 (SP 800-61 Rev. 3), which now ties incident response to the wider Cybersecurity Framework 2.0. Knowing the current version is a small signal that you stay current.

> Example answer: "We got an alert for a login to a finance user's account from a country we don't operate in, a few minutes after a normal login from the office. I checked whether the user was traveling. They weren't. I disabled the session, forced a password reset, and checked the account's activity: it had created an inbox rule forwarding invoices to an outside address. I removed the rule, searched for the same rule across all mailboxes and found one more. Afterwards we required phishing-resistant multi-factor sign-in for finance first."

## Phishing response

"An employee reports a phishing email. What do you do?" Then the follow-up: "Ten people clicked the link."

| Step | What to say |
| --- | --- |
| Thank the reporter | Reporting is behavior you want more of |
| Analyze | Sender, headers, links and attachments in a safe environment |
| Find all copies | Search mail for the same sender or subject; remove them |
| Block | The sender, domain and URLs at the mail gateway and proxy |
| If people clicked | Check who entered credentials or ran something; reset passwords, revoke sessions, check those devices |
| Communicate | A short, blame-free note to staff; update awareness training if a pattern shows |

> Example line for the follow-up: "Clicking alone is less serious than entering credentials or running a file, so first I'd sort the ten into those three groups using proxy and sign-in logs, and act on the riskiest group first."

## Explaining risk to leadership

Executives don't want CVE numbers. They want impact, likelihood, cost and a decision.

> Example answer: "I'd say: 'A flaw in our customer portal lets an attacker get in without a password, and attacks using it are already public. If someone gets in, they could see customer records, which means notification costs and lost trust. Patching needs two hours of downtime on Saturday night. I recommend we do it this weekend; the alternative is to take the login page offline until we can.'"

Notice the structure: what it is, why now, the impact in business terms, your recommendation, and an alternative. The guide on [explaining complex ideas simply](/speaking-coach/guides/how-to-explain-things-simply/) has more on this.

If asked about a recommendation that was rejected, show maturity: you documented the risk, the owner accepted it in writing, and you added monitoring.

## Staying current

"How do you stay current?" Name specific habits, not just "I read a lot." Mention the vendor advisories for tools you use, a few security news sources or podcasts, a home lab where you test what you read about, and capture-the-flag exercises or training platforms. Give one recent example of something you learned and tried. The general version is [how do you stay up to date in your field](/speaking-coach/interview-questions/how-do-you-stay-up-to-date-in-your-field/).

## How to practice

Talk through one incident out loud in under three minutes, then explain it again to someone with no security background in one minute. Speaking Coach can play a skeptical executive who pushes back on cost, which is good practice for the leadership question.

## Questions people ask

### Do I need certifications to become a cybersecurity analyst?

Many entry-level postings ask for one, but hands-on experience such as a home lab, capture-the-flag events or IT support work also counts. Talk about what you have actually done.

### What if I've never worked a real incident?

Use a lab exercise or a training scenario and say so honestly. Walk through it with the same steps you'd use in real life.

### What's the difference between an event and an incident?

An event is anything observable, like a login or a blocked connection. An incident is an event, or group of events, that harms or threatens the organization and needs a response.

### How technical will the interview be?

Expect basics like networking, logs, common attacks and how to read an alert, plus scenarios. Senior roles go deeper into detection engineering, forensics or architecture.

---
Speaking Coach on the App Store: https://apps.apple.com/app/id6767124039
Speaking Coach on Google Play: https://play.google.com/store/apps/details?id=com.sodhera.speakingcoach
