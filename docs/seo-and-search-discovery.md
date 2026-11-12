# Search and AI discovery — November 2026

## Buyer needs and public entry points

- `/bead`: engineering and project-delivery support for BEAD award recipients, ISPs, primes and subcontractors.
- `/services/fiber-facilities`: fiber-optic ILA hut, shelter, POP and cabinet site engineering.
- `/case-studies/fiber-ila-huts`: Zayo and D4 Communications / Arcadian facility experience.
- `/case-studies/d4-rancho-mission-viejo`: Bucker Way, Gavilan Ridge and Horton Way / Cow Camp Road A&E scopes.
- Construction site: `/bead` and `/services/fiber-huts` describe the separately contracted construction company’s work packages.

The fiber/facility case studies describe relevant project experience; their funding sources have not been verified as BEAD. The RMV page now includes the selected drawing excerpts after Jeff explicitly approved their public publication on November 11, 2026.

## Implemented foundations

Crawlable server-rendered content, distinct page descriptions and canonical URLs, sitemap entries, navigation and internal links, company contact information, Organization structured data, Service structured data on the BEAD page, explicit OAI-SearchBot access, and an IndexNow verification file and submission utility. No new training-bot preference was set.

`python3 scripts/submit-indexnow.py --site https://www.odiscom.com --key-file public/<key>.txt` submits the public sitemap URLs after the key is live. The same utility supports the construction domain. An accepted submission is receipt of URLs, not proof of indexing or placement.

## Next account-level work

Verify both domains in Google Search Console and Bing Webmaster Tools, submit their canonical sitemaps, inspect the new landing pages, and measure impressions/clicks for ILA hut engineering, BEAD engineering support, OSP design, joint use and permitting searches. Ownership and existing account setup remain unverified. Search Console submission was not claimed as complete.

Improve legitimate off-site authority through accurate company profiles, real partner links, relevant industry memberships and approved project references. No paid links, artificial mentions or thin duplicate location pages. Paid advertising would require a separate campaign decision and budget.

## Primary references

- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Google AI features and websites: https://developers.google.com/search/docs/appearance/ai-features
- OpenAI search crawler: https://developers.openai.com/api/docs/bots
- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- IndexNow protocol: https://www.indexnow.org/documentation
- NTIA BEAD program: https://www.ntia.gov/funding-programs/internet-all/broadband-equity-access-and-deployment-bead-program

Eligibility, indexing, rankings and AI citations are not guaranteed. Google does not require a special AI file or AI schema. OAI-SearchBot controls ChatGPT search discovery independently of the GPTBot training crawler.
