---
name: ecommerce-frontend-skill
description: Use when designing or building an e-commerce storefront — homepage, collection/product listing pages, product detail pages (PDP), cart, or checkout. Extends general frontend design practice with commerce-specific architecture, conversion mechanics, and rules for avoiding the "generic AI storefront" look. Pair with the frontend-design skill for typography, color, and restraint principles; use this skill for what's specific to selling things.
---

# E-commerce Frontend Skill

A storefront has a job a marketing site doesn't: someone has to trust it enough to type a card number into it. Distinctive art direction that hides the price, buries the buy button, or makes checkout a maze isn't a good store — it's a beautiful bounce rate. This skill is about hitting both halves at once: a store nobody mistakes for a template, that still converts like one built by people who've shipped commerce before.

## Two failure modes

Calibrate against both, not just one.

**The template store.** Centered hero copy over a product photo with a dark overlay, a "Shop Now" button, a three-icon row underneath (truck / shield / headset: "Free Shipping," "Secure Checkout," "24/7 Support"), a grid of identical white product cards, a countdown timer that resets on refresh, a testimonial carousel with stock headshots and five stars each. This is the default output of every theme marketplace, and it's also what an unguided model reaches for — the training data is full of it.

**The gallery that forgot to sell.** The opposite failure, and the one that distinctive-design advice can accidentally cause: a striking hero with no visible price, a "buy" action that's a ghost-outline button nobody's eye lands on, product photography so artistic you can't tell what the object is, a checkout that demands an account before it asks for a card. Commerce has non-negotiables — see "What can't move" below — and no amount of art direction should displace them.

## Ground it in the product, not the template

Where general frontend design practice says to ground a page in its subject, for commerce that subject is a physical (or digital) thing someone is about to own. Palette, type, and photography direction should come from the object itself: a knife brand, a skincare brand, and a sneaker brand shouldn't converge on the same beige-and-serif look just because they're all "premium DTC." Pull the accent color from the product photography rather than picking a fashionable hex first. If real photography doesn't exist yet, specify the shoot direction as part of the design plan — angle, light quality, backdrop, color grade, whether hands or context appear in frame — with the same precision as a type scale.

## Page architecture

Each page type has one job. Don't let a page try to do two.

**Home.** Job: make the brand and category legible in one screen, then hand off. Full-bleed hero with real photography (not a stock lifestyle shot), one line that says what makes this specific and why now, one CTA. Follow with a single spotlighted product or collection — not a grid — then one moment of real substance (how it's made, who makes it, what problem it solves) before any grid appears. Reviews or press need specifics ("held up after 200 washes," not "Great quality!!") or they read as filler.

**Collection / PLP.** Job: let someone compare and choose quickly. A wall of identical cards is efficient but forgettable — break it every 8–12 products with a full-width editorial moment (a styling shot, a material close-up, a short brand note) so the page still feels art-directed at scroll depth. Keep photography treatment consistent across cards (same crop ratio, background, light); consistency reads as premium, variety reads as stock-photo soup. Filter and sort UI should be quiet and get out of the way — it's infrastructure, not a design opportunity.

**Product detail (PDP).** Job: answer "why this, why now, why here" fast enough that scrolling further is optional. Non-negotiables in the first viewport: product name, price, primary image, and the add-to-cart action, all visible together. Multiple angles plus at least one in-context shot. Variant selection (size, color) should be immediate and unambiguous — not a dropdown that hides what's out of stock until after you've picked it. One real paragraph on material or craft beats five generic bullet points. Surface specific, useful review sentences (fit, durability, true-to-color) over a bare star average. Cross-sell as "goes with" or "completes the set," tied to the actual product — not a generic "you might also like" with no framing.

**Cart.** Job: confirm the decision, remove friction, stop. Editable quantities inline, a visible running total, one considered upsell at most, a single clear path forward. Nothing changes price or adds a charge without the person doing it on purpose.

**Checkout.** Job: get out of the way. Guest checkout available, address autofill, correct mobile keyboard types per field (numeric for card and zip), a visible sense of how many steps remain. No cost should appear here that wasn't visible earlier — that one pattern (drip pricing) kills trust faster than any visual choice can rebuild it.

**Confirmation / post-purchase.** Often an afterthought, seen by 100% of paying customers. Worth one deliberate moment: confirm what happens next in concrete terms (a ship date, not "soon") rather than a bare "Thank you for your order."

## Commerce-specific originality levers

Where a store gets to look like itself instead of like every other store, without touching the mechanics above:

- **Price as typography, not an afterthought.** Pick a deliberate treatment — weight, tabular numerals, placement relative to the product name — and hold it constant everywhere it appears. Sale pricing should be honest: a real strikethrough of a real prior price, not an inflated "was" price invented to manufacture a discount.
- **Trust, stated specifically, placed contextually.** Replace the generic truck/shield/headset row with the actual facts, next to the decision they support: "Ships in 2 days" beside the shipping estimate, "Free returns within 30 days" beside the size selector — not a decorative icon strip floating apart from the decision it's meant to inform.
- **Real urgency only.** If you show stock counts or sale countdowns, they should reflect something true. Manufactured scarcity is easy to spot and it's the fastest way to make an otherwise distinctive design feel cheap.
- **Editorial rhythm inside commerce grids.** Product grids are where stores feel most templated. A spotlighted product at 2x card size, a full-bleed image breaking the grid periodically, or a short line of copy between rows does more for perceived craft than inventing a new card style.

## Motion, scoped to commerce

Fewer, more functional moments than a marketing site: a hover state on the product card (secondary-angle swap or a subtle zoom, not a spin gimmick), visible feedback on add-to-cart (the cart icon should acknowledge the action in view, without forcing a navigation), a cart drawer that slides rather than reloads the page. Skip decorative motion on the price and the buy button specifically — anything that delays or obscures the moment someone commits to buy is a conversion cost, not a delight.

## What can't move

Regardless of visual direction:

- Price and the primary buy action are visible together, without scrolling, on the PDP and any quick-view.
- No cost is revealed for the first time at the final checkout step.
- Every tap target on mobile (add to cart, variant selection, quantity, checkout) is comfortably thumb-sized — most commerce traffic is mobile, and it's where template stores still routinely beat art-directed ones.
- Contrast on price, CTA, and form text meets accessible minimums even when set over imagery.
- Real product photography is compressed and lazy-loaded; a beautiful hero that takes four seconds to paint loses people before they see it.

## Hard rules

- No centered hero text over a darkened stock photo as the *default* composition.
- No icon-row trust badges as the *only* trust signal — pair or replace with specific, contextual facts.
- No countdown timer or stock counter that isn't literally true.
- No newsletter popup before a real engagement signal (scroll depth, dwell time, or exit intent — never "immediately").
- No identical product grid running past ~12 items without an editorial break.
- No new charges introduced at the final checkout step.
- No account requirement gating checkout when guest checkout is feasible.

## Litmus checks

- Swap the logo: could this be any other store in the category? If yes, the art direction hasn't done its job.
- Can someone find the price and the buy button without scrolling or hunting?
- Is there at least one photo that's unmistakably *this* product, not a stand-in for "a product like this"?
- Would you type your card number in here without a second thought?
- Does the PDP earn the purchase on its own terms, without leaning on urgency tricks to close it?

## Pairing

Use this alongside a general frontend/visual-design skill for the underlying craft — typography pairing, token systems, a brainstorm → plan → critique loop, and calibration against generic "AI-generated" defaults (the cream-and-terracotta look, the near-black-with-one-accent look, the hairline-rule broadsheet look — all real, all overused). This skill assumes that judgment and adds what's specific to a store: the pages a purchase actually flows through, and the handful of mechanics that are load-bearing no matter how the page looks.
