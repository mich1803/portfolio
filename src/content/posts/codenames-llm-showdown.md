---
title: "Codenames LLM Showdown: A Dive into the Early Days of Prompt Engineering and Agentic AI"
date: "2026-07-18"
author: "Michele Magrini"
description: "Revisiting Codenames-LLM, an early multi-agent experiment in prompt engineering, strategic language-model collaboration and model evaluation."
tags:
  - "Large Language Models"
  - "Prompt Engineering"
  - "Agentic AI"
  - "Multi-Agent Systems"
  - "Codenames"
external_url: "https://github.com/mich1803/Codenames-LLM"
---

For the first post on my blog, I wanted to take a step back in time and revisit my first collaborative AI project: **Codenames-LLM**, developed together with Francesco Marrocco as part of the Excellence Programme of our Bachelor's Degree in Mathematical Sciences for Artificial Intelligence.

The project began with a simple but ambitious goal: to build a capable AI agent that could play the board game *Codenames* using what was, at the time, the latest major development in artificial intelligence: **Large Language Models**.

We were supported by Antonio Norelli, a researcher and former Physics and Computer Science student at Sapienza University of Rome. At the time, he was working at the University of Oxford on the use of machine learning to help decipher whale communication.

Antonio had previously completed a thesis on building a strong AI player for the game *Othello*, following in the tradition of systems such as Deep Blue and AlphaGo, see [the related paper](https://doi.org/10.1109/TG.2022.3157345) for reference. That work was supervised by Alessandro Panconesi, who also supervised our Codenames project. 

## But What Is Codenames?

*Codenames* is a team-based word association game played with two opposing teams, typically referred to as red and blue. Each team has a Spymaster and one or more Operatives. At the start of the game, a grid of 25 words is laid out on the table. Each word corresponds to a hidden identity: some belong to the red team, some to the blue team, some are neutral, and one is the assassin.

Only the Spymasters can see the full mapping between words and their identities. Their goal is to guide their team to guess all of their assigned words before the opposing team does, while avoiding neutral words and, most importantly, the assassin, which causes an immediate loss if selected.

On each turn, the Spymaster gives a single-word clue followed by a number. The clue is intended to connect multiple words on the board that belong to their team, and the number indicates how many words are associated with that clue. For example, a clue like “Ocean 2” might suggest that two of the team’s words are related to the concept of the ocean.

The Operatives then discuss and make guesses, selecting words from the board one at a time. They can make up to the number of guesses indicated by the clue, plus one additional guess if they wish to take a risk based on previous clues. If they guess correctly, they can continue; if they select a neutral word or an opponent’s word, their turn ends immediately; if they select the assassin, the game ends in a loss.

Strategically, the Spymaster must balance ambition and safety. Giving a clue that connects many words can accelerate progress, but it also increases the risk of ambiguity and unintended associations. A more conservative clue may be safer but slower. The Operatives, on the other hand, must interpret the clue by considering semantic relationships, prior clues and guesses, and the overall context of the board. They must also decide when to stop guessing to avoid unnecessary risks.

The game therefore revolves around careful communication, shared understanding and the ability to reason about how others interpret language, making it a rich and challenging environment for both human players and AI systems. If you wanna try it online with your friends try [https://codenames.game/](https://codenames.game/)

## Why Codenames Was an Interesting LLM Challenge

At first glance, *Codenames* may look like a relatively simple word-association game. In practice, however, it requires several capabilities that were particularly interesting to study in language models:

- semantic association;
- contextual reasoning;
- ambiguity management;
- theory of mind;
- risk assessment;
- communication under strict constraints;
- cooperation between players with different roles.

The Spymaster must find a clue that connects several target words while avoiding words belonging to the opposing team and, most importantly, the assassin. The Operative must interpret that clue while attempting to reconstruct the Spymaster's intended reasoning.

This makes the game a natural environment for studying not only the linguistic knowledge of an LLM, but also its ability to reason, communicate intentions and collaborate with another agent.

## Prompt Engineering Before “Reasoning Models”

At the time, prompt engineering was still being explored as one of the main ways to improve the reliability and problem-solving abilities of language models.

Techniques such as **Chain-of-Thought prompting** encouraged a model to break a problem into intermediate reasoning steps before producing a final answer. Today, similar behaviours are often discussed more broadly under labels such as *reasoning*, *deliberation* or *test-time computation*. Back then, however, explicitly structuring the prompt was one of the most direct ways to investigate whether a model could move beyond superficial word associations.

*Codenames* gave us an interesting setting in which to test these ideas. A Spymaster could be asked to:

1. analyse the semantic relationships between the words on the board;
2. identify groups of related target words;
3. evaluate possible associations with neutral, opposing and assassin words;
4. compare several candidate clues;
5. select the clue with the best balance between coverage and risk.

Likewise, an Operative could be prompted to examine the clue, rank the most plausible words and explain the reasoning behind each guess.

The experiment was therefore not only about whether an LLM knew that two words were related. It was also about whether a carefully designed prompt could encourage the model to perform a more systematic and strategic analysis.

## An Early Experiment in Agentic AI

The project also explored a question that has since become central to agentic AI:

> Can multiple language-model agents collaborate effectively when each one has a different role, different information and a shared objective?

Instead of using a single model to solve the entire game, the framework assigned different responsibilities to different agents. One agent acted as the Spymaster, generating clues from the hidden board information, while another acted as the Operative, interpreting those clues without access to the complete state of the game.

This separation created a simple multi-agent system. The agents did not merely generate independent outputs: the decision made by one agent became the input and context for the next agent.

The setup allowed us to explore several questions:

- Could two agents develop an effective shared strategy?
- Could an Operative correctly infer the semantic reasoning of its Spymaster?
- Would agents based on the same model collaborate better than agents using different models?
- Could explicit reasoning prompts improve coordination?
- Would a model generate clues that were technically valid but difficult for another model to understand?
- Could an agent appropriately manage uncertainty and stop guessing before making a dangerous choice?

These questions feel very familiar today, when multi-agent workflows, tool-using systems and autonomous AI agents have become major areas of research and development. At the time, however, our project was a small-scale experiment in understanding whether collaboration between role-based LLM agents could produce behaviour that was more strategic than a sequence of isolated prompts.

Although we initially set out to create a genuinely capable Codenames player, the project gradually pivoted into something slightly different: a benchmark and a lighthearted technical blog post comparing some of the most advanced LLMs available at the time.

Unfortunately, we never published the original article. Research in this area was moving extraordinarily quickly, and our results risked becoming outdated almost as soon as we produced them. Around the same time we were running our experiments, similar ideas were already starting to appear elsewhere. For instance, a blog post on Medium explored an LLM-vs-LLM Codenames tournament ([https://medium.com/data-science/llm-vs-llm-codenames-tournament-f8170dd1c8fb](https://medium.com/data-science/llm-vs-llm-codenames-tournament-f8170dd1c8fb)), and more recently a related approach has even been formalised in a preprint ([https://arxiv.org/abs/2412.11373](https://arxiv.org/abs/2412.11373)). The pace of progress has only accelerated since then: even much of the structure of this portfolio and blog was written with the assistance of an AI coding agent.

Still, almost two years later, revisiting the project offers an interesting snapshot of what language models could and could not do at that point in time. It also captures an early stage in the evolution of ideas that are now widely associated with reasoning models, prompt orchestration and agentic AI.

It may also provide the starting point for a new experiment. We could rerun the same benchmark using the latest generation of models and evaluate how decisively they outperform their predecessors, not only in linguistic ability, but also in strategic reasoning, risk management and inter-agent coordination.

## How Does the Framework Work?

The repository is organised around a single Python module, `codenamesLLM.py`, with notebooks providing interactive, Colab and large-scale experimental entry points.

At the start of a game, `generate_board()` downloads an English or Italian word list, samples 25 unique words and assigns eight cards to red, seven to blue, one to the killer and the rest to neutral. Two representations are then created from the same state: the Spymaster prompt includes every word's hidden colour, while the Operatives receive only the remaining words. A parallel image dictionary renders either the concealed board or the colour-revealed Spymaster view.

The API layer provides one dispatch function for the model providers used in the experiments: OpenAI, Anthropic, Google, xAI and a Llama API. Provider-specific responses are normalised into Python dictionaries, with retry logic for malformed structured output. This allowed the game loop to switch models by name while keeping the role prompts and state representation fixed.

The Spymaster agent receives the coloured board and complete game history. Its system prompt explains the rules, requires a one-word clue and an integer, warns repeatedly against using a word already on the board and asks the model to reason about targets, opponents and the killer. With Chain-of-Thought enabled, the response also contains a `thought` field; without it, only `clue` and `number` are returned. The program independently checks whether the clue is on the board and asks again if it is invalid, while recording the violation as a **Clue in Board** error.

The Operative side supports either one agent or a discussion group. A solo Operative directly returns a word, optionally with explicit reasoning. In a group, each agent first writes a short independent idea. The agents then see the accumulated conversation and return three values: a message to their teammates, a flag saying whether they want another discussion round and a confidence score from -10 to 10 for every word still on the board. `vote_system()` sums those confidence dictionaries and selects the highest-scoring word. This cycle is repeated one guess at a time up to the Spymaster's number, unless a neutral or opposing card ends the turn or the killer ends the game.

`play_turn()` resolves the selected card, removes revealed words, updates the remaining-card counters and appends the clue and result to the shared history. `play_game()` alternates red and blue turns until one team reveals all its cards or hits the killer. `play_game_mixed_guessers()` follows the same state machine but allows each Operative seat to use a different model.

The notebooks wrap this core in three ways:

- `PlayGame_local.ipynb` and `PlayGame_colab.ipynb` configure credentials and run visible human or model matches;
- `PlayGame4Stats.ipynb` reads experiment configurations from spreadsheets, runs repeated tournaments and saves the winner, termination reason, rounds, history and Clue-in-Board counts after each game;
- the analysis cells aggregate red and blue results into win rates, card-completion and killer outcomes, average clue size, average correct guesses and rule violations.

This separation made the same engine useful as an interactive game, a transcript generator and a comparison harness. The complete implementation, notebooks and experiment data are available in the [Codenames-LLM repository](https://github.com/mich1803/Codenames-LLM).

## What Results Did We Obtain?

The report describes four related experiments: changing the number of collaborating Operatives, mixing different models within one Operative team, testing explicit reasoning prompts and running a model tournament. These were inference-only experiments with no fine-tuning. A typical game lasted about six minutes, and all compared agents were run through the same role structure.

### How many collaborating agents?

GPT-4o-mini teams with between one and five Operatives played 80 games per team. Three agents produced the strongest result:

| Operatives | Win rate | Wins (finish) | Win (killer) | Loss (killer) |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 46.25% | 14 | 23 | 17 |
| 2 | 48.75% | 19 | 20 | 23 |
| **3** | **60.00%** | **20** | **28** | **17** |
| 4 | 52.50% | 21 | 21 | 21 |
| 5 | 47.50% | 20 | 18 | 25 |

The pattern was not “more agents equals better reasoning.” Moving from one to three agents helped, but four and five introduced diminishing returns. The transcripts show why: extra agents supplied more interpretations, but they also created conflicting rankings, longer discussions and occasions on which a weak association gained support simply because several copies of the same model repeated it.

### Did mixed Operative teams help?

A three-agent mixed team composed of Grok-beta, Claude 3.5 Sonnet and GPT-4o, with Grok-beta as Spymaster, was tested against homogeneous three-agent teams. It won 43.75% against Claude, 43.75% against GPT-4o and 50% against Grok-beta. Diversity by itself therefore did not improve performance; the mixed agents were different, but they were still sharing the same guessing task and did not combine their strengths reliably.

Role specialisation was more successful. Grok-beta had been the most cautious high-performing Spymaster, while Claude Sonnet was the most accurate Operative. Pairing Grok as Spymaster with Claude as the Operative team achieved 75% against homogeneous Grok teams, 62.5% against GPT-4o and 56.25% against Claude. The useful lesson was not merely to add heterogeneous agents, but to assign models to the roles in which their behaviour was strongest.

### What did explicit reasoning change?

The clearest prompting result came from 100 games comparing two GPT-4o-mini Spymasters. Both were instructed to reason about the clue, but only the Chain-of-Thought condition provided enough output space to articulate the analysis before returning the clue.

| Spymaster prompt | Win rate | Wins by finishing cards | Losses through killer | Clue-in-Board violations |
| --- | ---: | ---: | ---: | ---: |
| Without written CoT | 39% | 13 | 28 | 71 |
| With written CoT | **61%** | **33** | **26** | **11** |

Explicit reasoning increased the win rate by 22 percentage points and reduced illegal clues dramatically. In this setting, the benefit was not only more elaborate semantic association. The additional deliberation helped the model follow a brittle negative constraint: check the complete board and do not repeat any visible word as the clue.

### Which models performed best?

The head-to-head tournament compared each model under the same roles and game conditions:

| Model | Win rate | Average requested guesses | Average correct guesses | Clue-in-Board errors |
| --- | ---: | ---: | ---: | ---: |
| Grok-beta | **66.67%** | 1.770 | 0.876 | 2 |
| Claude 3.5 Sonnet | 64.81% | 2.234 | **0.942** | 0 |
| GPT-4o | 59.26% | 2.120 | 0.850 | 1 |
| Gemini 1.5 Pro | 55.56% | 2.199 | 0.829 | 0 |
| GPT-4o Mini | 53.70% | 2.092 | 0.698 | 4 |
| Claude 3.5 Haiku | 50.00% | 2.871 | 0.639 | 0 |
| Gemini 1.5 Flash | 48.15% | 2.129 | 0.778 | 2 |
| GPT-3.5 Turbo | 42.59% | 2.804 | 0.697 | 2 |
| Llama 3.2 90B | 37.04% | 2.466 | 0.740 | 0 |
| Llama 3.2 11B | 22.22% | 2.863 | 0.469 | 51 |

Grok-beta achieved the highest win rate with relatively conservative clues. Claude 3.5 Sonnet followed closely, never copied a board word as its clue and obtained the highest average number of correct guesses per clue. At the other end, Llama 3.2 11B combined the lowest win rate with 51 rule violations. Across the tournament, success depended on a balance among semantic reach, restraint, structured-output reliability and compliance with the game's exact rules.

The results should be read as a snapshot of particular late-2024 model versions, prompts, providers and sample sizes, rather than as timeless model rankings. That is precisely what makes the experiment interesting to revisit: the framework recorded behavioural differences that a static question-answer benchmark would have missed, including how an agent's clue altered another agent's reasoning several calls later.

## Example Match

For last, we are showing two of the matches we played. You can find more on [https://github.com/mich1803/Codenames-LLM/tree/main/experiment_attempts](https://github.com/mich1803/Codenames-LLM/tree/main/experiment_attempts), or try it yourself with the notebook on the repo (if you have an API key for the models).

### Claude Haiku vs Claude Sonnet: When Consensus Makes You Less Intelligent

![The complete Claude Haiku versus Claude Sonnet Codenames board, with red, blue, neutral and assassin cards revealed.](./codenames-claude-haiku-vs-sonnet.png)

**Board legend:** 🔴 Red team · 🔵 Blue team · ⚪ Neutral · ⚫ Assassin


Red used Claude 3.5 Haiku as both Spymaster and its three Operatives; blue used Claude 3.5 Sonnet in the same three-Operative configuration. Red started with eight words, blue with seven.

<details class="game-transcript">
<summary>Open the full game</summary>

#### Turn 1 - Red: `BODY 4`

**Red Spymaster:**

> I need to carefully analyze the board and find a strategic clue that helps my team guess their RED words while avoiding the BLUE, KILLER, and NEUTRAL words. My RED words are: NET, KID, NOVEL, CHEST, LITTER, GLOVE, POUND, STREAM. I notice several words related to physical objects or locations. I want to create a clue that guides my team to multiple RED words without risking guessing the CHAIR (killer) or BLUE words. I'll look for a common theme or connection among the RED words.
>
> The RED Spymaster's clue is: **BODY (4)**.

**First guess - initial ideas:**

> **Red Guesser 0:** Hey team! For the clue "BODY", I see potential words like CHEST, GLOVE, and KID. I'm leaning towards CHEST first - it feels most directly related to "BODY". It's also nicely positioned and seems like a solid first guess. What do you all think? Need team input before making the final call.
>
> **Red Guesser 1:** Let's analyze the clue "BODY" carefully. I see potential good options like CHEST, KID, and BEAR. My initial instinct is CHEST because it directly relates to the body, and it seems to avoid enemy or neutral words. I suggest we first consider CHEST as our initial guess. It seems the safest and most direct interpretation of the clue. What do you all think?
>
> **Red Guesser 2:** Hey team! For the clue "BODY", I'm thinking about potential RED team words: CHEST looks promising; KID could relate to body; BEAR might connect (physical body). I'm leaning towards CHEST first. It seems most direct and safe. Thoughts?

**Discussion:**

> **Red Guesser 0:** I agree with team. CHEST seems like the strongest, most direct interpretation of 'BODY'. Let's go for CHEST.
>
> **Red Guesser 1:** I also support CHEST. Unanimous team decision seems strong.
>
> **Red Guesser 2:** I agree with CHEST. It's our unanimous first choice.

**Vote:** `CHEST` - 🔴 correct. Seven red cards remained.

**Second guess - initial ideas:**

> **Red Guesser 0:** Team, I'm thinking "KID" matches the clue "BODY" best - it represents a human body/person. It seems the most direct link. I suggest we start by guessing KID. It avoids risky words like CENTAUR or potentially enemy words. Thoughts?
>
> **Red Guesser 1:** Hey team! For the clue "BODY", I'm initially thinking GLOVE might connect, and maybe CHAIR could relate to body posture. KID could also potentially work. I'm leaning towards GLOVE first - it seems the most direct link to "body" as something worn on the body. What do you all think?
>
> **Red Guesser 2:** Hmm, potential RED words under "BODY" clue could be KID, GLOVE, or BEAR. I'm leaning towards KID since it's the most direct human-related term. But I'll wait to hear if my teammates have other insights before making a final suggestion.

**Discussion round 1:**

> **Red Guesser 0:** I still strongly support KID. Let's go with it for our first guess.
>
> **Red Guesser 1:** I agree KID seems safest. Let's guess KID.
>
> **Red Guesser 2:** I concur. KID seems like the safest and most direct interpretation of 'BODY'. Let's proceed with guessing KID.

The continue flags were `[True, True, False]`, so Guessers 0 and 1 spoke once more:

> **Red Guesser 0:** I recommend we go ahead and confirm KID as our first guess. Team consensus supports this.
>
> **Red Guesser 1:** I agree with the team. KID seems like the most direct interpretation of 'BODY'. Let's confirm this guess.

**Vote:** `KID` - 🔴 correct. Six red cards remained.

**Third guess - initial ideas:**

> **Red Guesser 0:** Initial thoughts: For the clue "BODY", I'm strongly considering "CHAIR" or "FLY" as potential targets. "CHAIR" relates to body posture, while "FLY" could connect to body movement. "BEAR" might also be a possibility, though less direct. I'd lean towards "CHAIR" first and ask teammates if they see any other connections.
>
> **Red Guesser 1:** Hey team! For the clue "BODY", I'm thinking our Spymaster wants us to focus on BEAR, GLOVE, or CHAIR. BEAR feels like the strongest connection - it's physical, has a body. I'd lean towards BEAR as my first guess. What do you all think? We should discuss and make sure we don't accidentally hit an enemy word or the assassin.
>
> **Red Guesser 2:** Hey team, for the clue "BODY", I'm immediately drawn to GLOVE as a potential match. It could represent a body part covering, and seems most directly connected to the clue. I'm leaning towards suggesting we start by guessing GLOVE. Thoughts?

**Discussion round 1:**

> **Red Guesser 0:** I agree with BEAR or GLOVE. Team consensus seems to be pointing towards one of these. Let's confirm.
>
> **Red Guesser 1:** I suggest BEAR. Strong connection to 'BODY', and we seem to have team consensus.
>
> **Red Guesser 2:** I'm in! GLOVE or BEAR both seem solid. I'll defer to team consensus.

The continue flags were `[True, True, False]`:

> **Red Guesser 0:** I agree with BEAR. Let's confirm and then vote.
>
> **Red Guesser 1:** I agree with BEAR. Strong physical/body connection. Let's go with it.

**Vote:** `BEAR` - 🔵 blue. Red's turn ended and blue was left with six cards.

#### Turn 2 - Blue: `GEOMETRY 4`

**Blue Spymaster:**

> Let's analyze the board carefully. First, I need to avoid using any words already on the board as clues. The blue words I need to help my team guess are: CIRCLE, FLUTE, CENTER, CHANGE, RAY, and PIN. I need to be careful about red words (NET, NOVEL, LITTER, GLOVE, POUND, STREAM) and especially the killer word (CHAIR). Looking at my blue words, I notice a potential connection between CIRCLE and CENTER through geometry. However, I should avoid any clues that might lead to RED words or the KILLER word. I see a potential connection between multiple blue words through mathematics/geometry: CIRCLE, CENTER, RAY, PIN could be connected. The safest approach would be to focus on the geometric aspect, linking multiple blue words while avoiding any confusion with red words or the killer word.
>
> The BLUE Spymaster's clue is: **GEOMETRY (4)**.

**First guess - initial ideas:**

> **Blue Guesser 0:** I think CIRCLE and CENTER seem strongly related to GEOMETRY. Let's discuss which one feels more confident to guess first.
>
> **Blue Guesser 1:** I think CIRCLE and CENTER are strong possibilities for GEOMETRY, since they're geometric concepts. Let's discuss which one feels more confident first?
>
> **Blue Guesser 2:** I think CIRCLE and CENTER seem strongly connected to GEOMETRY. GERMANY and GREECE could also fit but feel less direct. What do you all think?

**Discussion round 1:**

> **Blue Guesser 0:** I feel most confident about CIRCLE being correct since it's a fundamental geometric shape. CENTER is also related but less specific to geometry.
>
> **Blue Guesser 1:** I agree CIRCLE is more directly related to geometry than CENTER. CIRCLE is a fundamental geometric shape, while CENTER could have other meanings. I'd vote for CIRCLE first.
>
> **Blue Guesser 2:** I strongly agree with choosing CIRCLE first. The connection to GEOMETRY is strongest and most direct.

The continue flags were `[True, False, False]`:

> **Blue Guesser 0:** Since we all agree CIRCLE is the strongest choice, let's select it.

**Vote:** `CIRCLE` - 🔵 correct. Five blue cards remained.

**Second guess - initial ideas:**

> **Blue Guesser 0:** I think GERMANY could be related to GEOMETRY, as both start with "GEO". It's a possible connection to consider. What do you think, team?
>
> **Blue Guesser 1:** CENTER seems like a strong geometric connection. It's a key geometric concept related to circles and symmetry. Should we go for it?
>
> **Blue Guesser 2:** I think "CENTER" and "RAY" could be good candidates since they relate to geometry, with center being a key geometric concept and ray being a geometric line. I'd lean towards CENTER first. What do you all think?

**Discussion:**

> **Blue Guesser 0:** I agree with everyone. CENTER has the strongest geometric connection, being a fundamental concept in geometry. Let's go with that.
>
> **Blue Guesser 1:** I strongly agree with CENTER being our best choice. Clear geometric link and we seem to have team consensus.
>
> **Blue Guesser 2:** I agree with everyone that CENTER is our best choice. We have unanimous agreement.

**Vote:** `CENTER` - 🔵 correct. Four blue cards remained.

**Third guess - initial ideas:**

> **Blue Guesser 0:** I think GERMANY or GREECE could work since they have geometric patterns in their flags, but I'm leaning towards RAY since it's related to geometric angles. What do you all think?
>
> **Blue Guesser 1:** I think GERMANY or GREECE could be good guesses since they're related to geometry historically. Also RAY might fit as it's a geometric term. What do you all think?
>
> **Blue Guesser 2:** I believe GERMANY could be related to GEOMETRY due to its spelling similarity, or maybe RAY as it's used in geometric angles. What do you teammates think?

**Discussion round 1:**

> **Blue Guesser 0:** I'm strongly leaning towards RAY since it's a geometric term and we all seem to agree it's a strong possibility. Let's go with that first.
>
> **Blue Guesser 1:** I agree RAY seems like the strongest choice since it's directly related to geometry and angles, and we all seem to be in agreement.
>
> **Blue Guesser 2:** I strongly agree that RAY is our best choice. It's directly related to geometry, and we all seem to be on the same page.

The continue flags were `[True, False, False]`:

> **Blue Guesser 0:** Let's lock in RAY as our guess since we all agree it's the strongest connection to GEOMETRY.

**Vote:** `RAY` - 🔵 correct. Three blue cards remained.

**Fourth guess - initial ideas:**

> **Blue Guesser 0:** I believe "GERMANY" could be our word since it has strong geometric associations through precision engineering. What do you think, team?
>
> **Blue Guesser 1:** I believe GERMANY or GREECE could fit with GEOMETRY, as both are related to ancient mathematics and geometric discoveries. I'd lean towards GERMANY first. What do you think?
>
> **Blue Guesser 2:** GERMANY seems like a good option since it contains "geo" like geometry, but let's hear what others think about possible geometric connections.

**Discussion:**

> **Blue Guesser 0:** I strongly agree with GERMANY. All three of us have the same intuition, and the 'geo' connection plus Germany's reputation for precision engineering make it a solid choice.
>
> **Blue Guesser 1:** I completely agree with GERMANY. We have unanimous agreement and strong reasoning with the 'geo' connection.
>
> **Blue Guesser 2:** Everyone agrees on GERMANY. Let's lock in that guess!

**Vote:** `GERMANY` - ⚪ neutral. Blue's turn ended.

#### Turn 3 - Red: `ORDER 4`

**Red Spymaster:**

> Analyzing the board for the best strategy. Red team needs to guess: NET, NOVEL, LITTER, GLOVE, POUND, and STREAM. The board has several neutral words that could be potential connection points. I want to avoid CHAIR (killer) and any blue words like FLUTE, CHANGE, and PIN. My previous team's clues like BODY hint at a physical/human connection strategy. I'll look for a clue that connects multiple red words without risking dangerous guesses. The words NET, NOVEL, LITTER, GLOVE, POUND suggest a theme of structure, containment, or systematic organization. Words like 'system' or 'structure' might be too generic, so I'll choose a more precise clue that guides the team.
>
> The RED Spymaster's clue is: **ORDER (4)**.

**Initial ideas:**

> **Red Guesser 0:** Alright team, with the clue "ORDER" and looking at the board, I'm thinking MILITARY or DISCIPLINED might connect to words like AZTEC (structured civilization), EAGLE (military symbol), or CENTAUR (organized warrior). I'm leaning towards AZTEC first - who agrees? Our previous turns were CHEST and KID, so we need to be strategic.
>
> **Red Guesser 1:** Potential connection to ORDER: CHANGE might relate to organized process; FLUTE could suggest disciplined arrangement; PIN implies precision/placement; CHAIR could symbolize structured positioning. I'm leaning towards CHANGE as my first guess. It seems most aligned with "ORDER" concept. Thoughts?
>
> **Red Guesser 2:** Hmm, "ORDER" with 4... I see CHAIR and GLOVE might relate to organization or arrangement. STREAM could also connect to systematic flow. CHEST and KID were already guessed from our team, so we need to be careful not to repeat. Let's discuss which word feels most connected to "ORDER" for our strategy.

**Discussion round 1:**

> **Red Guesser 0:** I think AZTEC is still our best bet. It represents a structured civilization, which strongly connects to 'ORDER'. EAGLE also seems promising as a military/organized symbol.
>
> **Red Guesser 1:** I confirm CHANGE as our best ORDER-related word. It suggests systematic process and progression.
>
> **Red Guesser 2:** I recommend CHAIR as our next guess. It symbolizes structured positioning and fits the ORDER clue.

All three agents requested another round:

> **Red Guesser 0:** I strongly advocate for AZTEC. It represents a highly structured civilization that perfectly embodies 'ORDER'. Let's commit to this strategic choice.
>
> **Red Guesser 1:** CHANGE looks solid, but team seems divided. Need consensus.
>
> **Red Guesser 2:** Let's go with CHAIR. It symbolizes structured positioning and fits the ORDER clue.

**Vote:** `AZTEC` - ⚪ neutral. Red's turn ended.

#### Turn 4 - Blue: `MUSIC 3`

**Blue Spymaster:**

> Let me analyze the board carefully. First, I need to identify my team's words (BLUE): FLUTE, CHANGE, and PIN. I must avoid words that could lead to RED words (NET, NOVEL, LITTER, POUND, STREAM) or the KILLER word (CHAIR). The neutral words are FLY, CENTAUR, PASS, COLD, GREECE, SNOW, and EAGLE. Looking at the BLUE words, I could find a connection between them. 'FLUTE' is a musical instrument, 'CHANGE' could be related to music (changing notes), and 'PIN' could be related to fastening or securing things. A musical connection might work, but I need to be careful not to lead to other words. After checking that the word is not on the board, I'll use 'MUSIC' as my clue, connecting to FLUTE primarily, with potential connections to CHANGE (as in musical changes) and PIN (as in musical notation pins). I've double-checked, and 'MUSIC' is not on the board.
>
> The BLUE Spymaster's clue is: **MUSIC (3)**.

**First guess - initial ideas:**

> **Blue Guesser 0:** I think FLUTE is a very strong candidate since it's a musical instrument. Should we try that?
>
> **Blue Guesser 1:** I think FLUTE is our best choice here - it's a musical instrument and directly relates to the MUSIC clue. Should we try that?
>
> **Blue Guesser 2:** Looking at MUSIC clue, FLUTE seems like a very strong match since it's a musical instrument. I suggest we try FLUTE.

**Discussion:**

> **Blue Guesser 0:** Everyone agrees, let's go for FLUTE!
>
> **Blue Guesser 1:** Yes, I completely agree with everyone - FLUTE is the perfect choice for MUSIC!
>
> **Blue Guesser 2:** We all clearly agree on FLUTE - let's go for it!

**Vote:** `FLUTE` - 🔵 correct. Two blue cards remained.

**Second guess - initial ideas:**

> **Blue Guesser 0:** Looking at MUSIC clue, I think NOTE could be related since it's both a musical note and a NET (similar word). Should we try that?
>
> **Blue Guesser 1:** Since the clue is MUSIC, I think NOTE or STREAM could be relevant words here. NOTE could relate to musical notes, and STREAM nowadays often relates to music streaming. Let's discuss which seems more fitting.
>
> **Blue Guesser 2:** Since the clue is MUSIC, I'm thinking about words related to musical elements. "STREAM" could be like streaming music, but I'm not fully convinced. Let's hear what you all think about possible connections to MUSIC.

**Discussion round 1:**

> **Blue Guesser 0:** I agree with looking at both NET (like musical note) and STREAM (music streaming). Between the two, I'm leaning more towards NET now.
>
> **Blue Guesser 1:** I'm now more convinced about NET as well, since multiple teammates see the connection to musical notes. Should we go for it?
>
> **Blue Guesser 2:** I'm also convinced about NET now - the note/NET connection makes more sense than STREAM.

The continue flags were `[True, True, False]`:

> **Blue Guesser 0:** I agree, let's go with NET since we all see the connection to musical notes.
>
> **Blue Guesser 1:** Let's go for NET since we've all agreed on the musical note connection.

**Vote:** `NET` - 🔴 red. Blue's turn ended and red was left with five cards.

#### Turn 5 - Red: `PRINT 3`

**Red Spymaster:**

> Analyzing the board, I see several RED words: NOVEL, LITTER, GLOVE, POUND, and STREAM. My strategy needs to connect these words safely. I want to avoid CHAIR (the killer word) and be cautious of BLUE words like CHANGE and PIN. I notice words like STREAM and NOVEL might have a literary or movement-related connection. Words like POUND and GLOVE suggest something physical or concrete. I'll craft a clue that could link multiple RED words without risking blue or killer words.
>
> The RED Spymaster's clue is: **PRINT (3)**.

**First guess - initial ideas:**

> **Red Guesser 0:** Hey team! For PRINT, I'm thinking about NOVEL or STREAM. NOVEL seems more direct - it's related to printing books. STREAM is a bit of a stretch, but could connect to print streams. Let's discuss which feels safer. Any thoughts?
>
> **Red Guesser 1:** Hey team, I think the Spymaster's clue "PRINT" might relate to NOVEL or PASS. Both seem connected to printing or publishing. NOVEL is tempting, but we should discuss which word feels most likely. Thoughts?
>
> **Red Guesser 2:** Hey team, with the clue PRINT, I'm thinking NOVEL seems like the most likely target. It's related to printing/books, and we need to be careful since we've already had some misses. I'm leaning towards NOVEL as our first guess. What do you all think?

**Discussion:**

> **Red Guesser 0:** I agree with the team consensus. Let's go with NOVEL - it's the most direct connection to PRINT.
>
> **Red Guesser 1:** I concur with the team. NOVEL seems like our best bet for the PRINT clue.
>
> **Red Guesser 2:** I think we've already reached consensus on NOVEL. Let's go for it.

**Vote:** `NOVEL` - 🔴 correct. Four red cards remained.

**Second guess - initial ideas:**

> **Red Guesser 0:** The clue "PRINT" could relate to several words: CHANGE might mean printing money; PIN could connect to printing/pressing; GREECE might link to newspaper/press; STREAM could hint at printing flow. I'm leaning towards CHANGE as my first guess. It seems the most connected to the clue. Thoughts, team?
>
> **Red Guesser 1:** Hey team, with the clue "PRINT", I'm immediately thinking about PRESS or PAPER. From our board, I see CHANGE might connect to printing/press. However, we need to be cautious since we've already lost some moves. I recommend we discuss before I make a final guess. What do you all think?
>
> **Red Guesser 2:** Given the clue "PRINT" and our past history, I'm eyeing LITTER or PIN as potential targets. LITTER feels related to printing (newspapers, documents), while PIN could link to printing press. However, I'm cautious about PIN since it might be a trap. I recommend we discuss and carefully consider our choice before committing.

**Discussion round 1:**

> **Red Guesser 0:** I still think CHANGE is our best bet. 'Printing money' feels strongest. Let's go with it.
>
> **Red Guesser 1:** I agree with the team's sentiment towards CHANGE. Let's proceed with confidence.
>
> **Red Guesser 2:** I recommend LITTER as our most strategic choice. It aligns best with 'PRINT' and seems relatively low-risk.

The continue flags were `[True, False, True]`:

> **Red Guesser 0:** I maintain my conviction about CHANGE. Let's commit to this guess.
>
> **Red Guesser 2:** I suggest we vote on LITTER. It seems the safest and most aligned with 'PRINT'.

**Vote:** `CHANGE` - 🔵 blue. Red's turn ended and blue had one card left.

#### Turn 6 - Blue: `NEEDLE 1`

**Blue Spymaster:**

> Looking at the board, I need to help my team identify the BLUE word 'PIN' while avoiding the KILLER word 'CHAIR' and the RED words ('LITTER', 'GLOVE', 'POUND', 'STREAM'). First, let me analyze the words I absolutely cannot use in my clue to avoid instant loss: 'FLY', 'CENTAUR', 'CHAIR', 'PASS', 'COLD', 'LITTER', 'GLOVE', 'POUND', 'GREECE', 'STREAM', 'SNOW', 'EAGLE', 'PIN'. For the remaining BLUE word 'PIN', I need to think of a clue that would lead to it without risking other guesses. A PIN can be used to fasten things, but I need to be careful not to make my team think of 'STREAM' or other dangerous words. After careful consideration, I'll use 'NEEDLE' as my clue, as it's closely related to PIN but not present on the board, and I'll give the number 1 to keep it specific and safe.
>
> The BLUE Spymaster's clue is: **NEEDLE (1)**.

**Initial ideas:**

> **Blue Guesser 0:** I think PIN seems like a logical guess since it's directly related to NEEDLE. It's a straightforward connection.
>
> **Blue Guesser 1:** I think "PIN" could be our word since it's directly related to needle - it's a similar sharp, pointed object used for sewing or fastening.
>
> **Blue Guesser 2:** Looking at "NEEDLE" clue, PIN seems like the most logical connection since needles and pins are similar sharp objects used for sewing.

**Discussion:**

> **Blue Guesser 0:** I strongly agree with everyone - PIN is the clear choice here. Let's go for it.
>
> **Blue Guesser 1:** I completely agree with everyone. PIN is the obvious choice as it's directly related to NEEDLE.
>
> **Blue Guesser 2:** Absolutely agree with everyone - PIN is the clear and logical choice.

**Vote:** `PIN` - 🔵 correct. Blue revealed its final card and won after six turns.

</details>

#### Quick Considerations

The match is almost a miniature catalogue of multi-agent failure modes. The agents were excellent when the semantic link was direct: `BODY` led to CHEST and KID, `GEOMETRY` led to CIRCLE, CENTER and RAY, `MUSIC` led to FLUTE, and `NEEDLE` led to PIN. The problems began when the obvious answers were exhausted but the framework still expected another guess.

The title of this example comes from the fourth `GEOMETRY` guess. All three Sonnet Operatives independently mentioned GERMANY, then converted repetition into confidence: lexical similarity (`geo`), precision engineering and a vague historical connection gradually became “unanimous agreement and strong reasoning.” The discussion did not add evidence; it made the same weak association sound safer. The result was a neutral card.

The red team came even closer to catastrophe. Under `BODY`, one Haiku agent proposed CHAIR, the assassin, because of posture. Under `ORDER`, another again advocated CHAIR and repeated it in the second discussion round. The confidence-voting mechanism happened to select AZTEC instead, but consensus was not reliably tracking safety. Later, Sonnet's `MUSIC 3` overpromised: after the obvious FLUTE, the Operatives talked themselves into NET through its resemblance to “note,” giving red a card. Haiku made the symmetric error with `PRINT`, selecting the blue word CHANGE through “printing money.”

Sonnet ultimately won because its final clue became conservative when only one card remained. `NEEDLE 1` removed the need for negotiation and produced a clean, unanimous PIN. The broader lesson was that collaboration helped most when agents contributed genuinely different, grounded evidence. When they merely echoed one another, discussion could act as an amplifier for a bad first association.

### **Human vs GPT-4o Mini: The Spymaster Who Pointed Straight at the Assassin**

![The complete Human versus GPT-4o Mini Codenames board, with red, blue, neutral and assassin cards revealed.](./codenames-human-vs-gpt4o-mini.png)

**Board legend:** 🔴 Red team · 🔵 Blue team · ⚪ Neutral · ⚫ Assassin


The human controlled the red Spymaster and guesses. GPT-4o Mini controlled the blue Spymaster and three blue Operatives. Red started with eight cards and blue with seven.

<details class="game-transcript">
<summary>Open the full game</summary>

#### Turn 1 - Red: `WATER 2`

> **Human Red Spymaster:** WATER (2)
>
> **Human Red guess:** WHALE

**Result:** `WHALE` - 🔴 correct. Seven red cards remained.

> **Human Red guess:** GRASS

**Result:** `GRASS` - 🔵 blue. Red's turn ended and blue was left with six cards.

#### Turn 2 - Blue: `EXPLORE 3`

**Blue Spymaster:**

> I need to focus on providing a clue that relates to the BLUE words on the board without overlapping with any existing words, particularly avoiding BANK, which is the killer word. The BLUE words are ROME, CHEST, GERMANY, CRASH, MOUTH, and PIE. I will consider descriptive or related concepts that can lead my team to these words. My challenge is to convey a clue that encompasses multiple BLUE words but maintains clarity. A good approach might be to think about concepts that relate to things commonly associated with these words. For instance, both GERMANY and CHEST bring to mind concepts of exploration. ROME could relate to history or travel, while CRASH might connect to accidents, potentially invoked during discussions about risk during explorations. However, since PIE is a food item, I want to keep the clue broad, yet safe, that does not lead them to any RED words. Thus, I will consider using the clue ‘TRAVEL’, which can encompass both historical and modern contexts, referring to ROME, GERMANY, and other relevant associations without being too vague.
>
> The BLUE Spymaster's clue is: **EXPLORE (3)**.

**First guess - initial ideas:**

> **Blue Guesser 0:** Based on the clue "EXPLORE," I think of words related to travel or discovery. "ROME" could relate to exploring a famous city, and "DANCE" might connect to cultural exploration. Let's start with "ROME."
>
> **Blue Guesser 1:** For the clue EXPLORE, I think "ALIEN" relates to exploration. "DANCE" could also connect to exploring cultures. Let's start with "ALIEN" as our guess. What do you all think?
>
> **Blue Guesser 2:** For the clue "EXPLORE," I'm thinking of words related to adventure or travel. "DANCE" might suggest exploring cultures, and "ALIEN" could refer to exploring outer space. Let's start with "DANCE."

**Discussion round 1:**

> **Blue Guesser 0:** I believe we should start by guessing 'ROME' based on exploration of places. What do you think?
>
> **Blue Guesser 1:** I think we should go with 'ALIEN' first for exploration. It fits well. What does everyone else think?
>
> **Blue Guesser 2:** Let's focus on 'DANCE' since it relates to cultural exploration. Thoughts?

The continue flags were `[False, True, True]`:

> **Blue Guesser 1:** Let's go with 'ALIEN' since it fits the exploration theme. I support that guess.
>
> **Blue Guesser 2:** I still think 'DANCE' relates to cultural exploration, but 'ALIEN' is also a strong candidate for exploration. Let's prioritize based on what we all agree on.

**Vote:** `ROME` - 🔵 correct. Five blue cards remained.

**Second guess - initial ideas:**

> **Blue Guesser 0:** Thinking about "EXPLORE," I associate it with "DANCE" (exploring through movement) and "ALIEN" (exploring new worlds). Let's guess "ALIEN" first. What do you all think?
>
> **Blue Guesser 1:** For the clue "EXPLORE," I think of words like "ALIEN," as they often explore new worlds. "DANCE" could relate to exploring movement. What do you all think? Let's start with "ALIEN."
>
> **Blue Guesser 2:** For the clue "EXPLORE," I think "DANCE" could relate to exploring new experiences or cultures. "ALIEN" could also fit, as it often represents exploration. Let's consider "DANCE" first.

**Discussion:**

> **Blue Guesser 0:** I still think 'ALIEN' is our best guess. Let's go with that first.
>
> **Blue Guesser 1:** Let's guess 'ALIEN' first based on our discussion.
>
> **Blue Guesser 2:** I agree with guessing 'ALIEN' first based on our discussion.

**Vote:** `ALIEN` - 🔴 red. Blue's turn ended and red was left with six cards.

#### Turn 3 - Red: `DEMOCRACY 2`

> **Human Red Spymaster:** DEMOCRACY (2)
>
> **Human Red guess:** AMERICA

**Result:** `AMERICA` - 🔴 correct. Five red cards remained.

> **Human Red guess:** GERMANY

**Result:** `GERMANY` - 🔵 blue. Red's turn ended and blue was left with four cards.

#### Turn 4 - Blue: `TREASURE 3`

**Blue Spymaster:**

> I need to provide a clue that relates to the BLUE words while avoiding the RED, KILLER, and NEUTRAL words. The words associated with team BLUE are CHEST, CRASH, MOUTH, and PIE. I have to discard any clue that directly matches any of the words on the board to avoid an instant loss. The KILLER word is BANK, which I need to be especially cautious of, as guessing that would end the game immediately for my team. Considering the BLUE words, they relate to themes of money (CHEST), impact (CRASH), body (MOUTH), and food (PIE). I could go with something related to achieving success or gaining resources, like 'TREASURE,' which connects with CHEST and could hint at others. CHEST is a direct correlation for treasure, while CRASH could be interpreted as crashing into a treasure, MOUTH could suggest consumption, and PIE suggests a slice of resources. However, I want to be specific and avoid multiple interpretations. I decide on the clue 'TREASURE' with a number of '3' to highlight CHEST, CRASH, and PIE clearly without misleading my team.
>
> The BLUE Spymaster's clue is: **TREASURE (3)**.

**First guess - initial ideas:**

> **Blue Guesser 0:** Given the clue "TREASURE," I think we should consider words related to valuable items or hidden things. "CHEST" (as in treasure chest) stands out. "BANK" could also relate to treasure, but let's start with CHEST. What do you all think?
>
> **Blue Guesser 1:** For the clue "TREASURE," I think we should consider "CHEST" since treasure is often kept in a chest. "BANK" could relate to treasure, but I feel "CHEST" is stronger. What do you think?
>
> **Blue Guesser 2:** For the clue "TREASURE," I'm leaning towards "CHEST" as treasure is often stored there. "BANK" could also relate to treasure in terms of savings. Let's start with "CHEST." What do you think?

**Discussion:**

> **Blue Guesser 0:** I think we should go with CHEST first. Ready to guess?
>
> **Blue Guesser 1:** Let's go with CHEST first.
>
> **Blue Guesser 2:** Let's guess CHEST first.

**Vote:** `CHEST` - 🔵 correct. Three blue cards remained.

**Second guess - initial ideas:**

> **Blue Guesser 0:** For the clue "TREASURE," I think we should guess words related to valuables or discovery. "BANK," "BILL," and "GOLD" come to mind, but I don't see GOLD listed. I suggest we start with "BANK." What do you all think?
>
> **Blue Guesser 1:** For the clue "TREASURE," I think of words like "BANK" (where treasure is kept) and "BOND" (like government bonds). "DICE" could refer to gambling for treasure too. What do you all think?
>
> **Blue Guesser 2:** For "TREASURE," let's think of words like "BANK," which involves money, or "BOND," which can relate to value. "POST" might also connect to treasure maps. My top guess is "BANK." What do you think?

**Discussion round 1:**

> **Blue Guesser 0:** I agree with starting with 'BANK' as it closely relates to treasure. I also find 'BOND' worth considering. Let's go with 'BANK' first.
>
> **Blue Guesser 1:** I suggest we go with 'BANK' first. It closely relates to treasure.
>
> **Blue Guesser 2:** Let's guess 'BANK' since we all agree.

The continue flags were `[True, False, False]`:

> **Blue Guesser 0:** Let's guess 'BANK' first, we all agree.

**Vote:** `BANK` - ⚫ assassin. The game ended immediately and red won after four turns.

</details>

#### Quick Considerations

This loss began before the Operatives voted. The blue Spymaster explicitly identified BANK as the killer and wrote that it needed to be “especially cautious” of it. It nevertheless selected `TREASURE 3`, a clue with an extremely strong ordinary-language association to both CHEST and BANK. Its stated targets after CHEST - CRASH and PIE - were far weaker than the forbidden alternative it had already noticed.

The Operatives then behaved consistently with the clue they received. All three mentioned BANK during their first CHEST discussion, even though they correctly prioritised CHEST. On the second guess they independently ranked BANK first, and the extra discussion round only reinforced the choice. From their information set, this was not an inexplicable hallucination: the hidden danger came directly from the Spymaster's clue.

The match therefore separates two kinds of rule following. GPT-4o Mini successfully obeyed the surface constraint that the clue itself must not be a board word, but it failed the strategic constraint of choosing a clue whose likely interpretations avoid the assassin. The Spymaster had access to the relevant fact and even verbalised it; explicit analysis did not guarantee that the final action was consistent with that analysis.

The human team made the same general class of mistake on a smaller scale. `WATER 2` correctly found WHALE before donating GRASS to blue, and `DEMOCRACY 2` correctly found AMERICA before donating GERMANY. Ambitious multi-word clues increased coverage, but neither human nor model stopped after the safest answer. The difference is that the model's overreach ended the game because its clue pointed at the one word it was supposed to exclude above all others.

## What Results Would We Get Today?

**Coming soon...**
