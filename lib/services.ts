export type Service = {
  name: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  groups: { title: string; items: string[] }[];
  deliverables: string[];
  inputs: string;
  related: string[];
};

export const services: Record<string, Service> = {
  environmental: {
    name: "NEPA, SHPO & Environmental Coordination",
    headline: "NEPA and SHPO packages that support telecom site development.",
    description: "Odiscom supports telecom environmental review with NEPA screening and review packages, SHPO and historic-preservation review coordination, archaeological investigation coordination, and FCC or NTIA environmental documentation within the assigned scope. We connect the operator, qualified specialists and engineering team around the site information and required deliverables.",
    image: "/images/illustrations/telecom-site-review.webp", imageAlt: "Illustration of engineers reviewing a rural wireless site", imageCaption: "Concept illustration · not a completed Odiscom project",
    groups: [
      { title: "NEPA & agency documentation", items: ["Telecom NEPA screening and environmental-review packages", "FCC environmental documentation and supporting site information", "NTIA categorical-exclusion documentation support where applicable"] },
      { title: "Historic & cultural resources", items: ["SHPO and Section 106 historic-preservation review coordination where required", "Archaeological investigation and report coordination with qualified specialists", "Site exhibits, information requests and review-comment tracking"] },
      { title: "Project coordination", items: ["Define the applicable review scope with the operator and specialist team", "Reconcile site layouts, access and ground-disturbance information", "Track outstanding documents and responses through the assigned review milestones"] },
    ],
    deliverables: ["NEPA screening and review packages", "FCC / NTIA environmental documentation within scope", "Coordinated archaeology and historic-review inputs", "Site exhibits and review-status tracking"],
    inputs: "Send the site location, proposed work and ground disturbance, available environmental records, funding or agency requirements, and schedule. We will define the reviews and responsible providers for your assignment.",
    related: ["site-acquisition", "towers", "permitting"],
  },
  "tower-mapping": {
    name: "Tower Mapping, Audits & Inspections",
    headline: "Understand the structure before the next equipment change.",
    description: "Odiscom scopes tower mapping, audits, inspection support and foundation investigation for tower owners, operators and engineering partners. We coordinate qualified field providers and turn available measurements, photographs and condition records into the inputs needed for engineering review and infrastructure due diligence.",
    image: "/images/illustrations/telecom-site-review.webp", imageAlt: "Concept illustration of a tower site and ground-based engineering review", imageCaption: "Concept illustration · field and engineering scopes are defined per assignment",
    groups: [
      { title: "Structure & equipment mapping", items: ["Full tower and structural mapping packages", "Member, connection, equipment and cable information needed for the assigned analysis", "Rooftop, platform and grain-elevator mapping coordinated to suit the structure"] },
      { title: "Audits & field investigations", items: ["Tower audits and condition-documentation scopes", "TIA inspection packages within the contracted requirements", "Foundation mapping, geotechnical investigation and specialist field coordination"] },
      { title: "Engineering handoff", items: ["Reconcile field records against existing drawings and equipment inventories", "Identify missing information and engineering follow-up items", "Connect mapping and inspection findings to structural analysis or modification design"] },
    ],
    deliverables: ["Mapping measurements, photographs and field records", "Defined audit and inspection reports", "Foundation and investigation inputs", "Engineering handoff and open-item summaries"],
    inputs: "Send the site inventory, structure types and heights, access requirements, existing records, proposed loading and the intended use of the mapping or audit. Field-provider and engineering responsibilities are established in the proposal.",
    related: ["towers", "wireless", "site-acquisition"],
  },
  "traffic-control": {
    name: "Traffic Control & MOT Plans",
    headline: "Plan the work zone around the route, crossing and access.",
    description: "Odiscom prepares traffic-control and maintenance-of-traffic (MOT) drawing packages for telecom and utility projects. We coordinate the work area, construction sequence, pedestrian access and roadway interfaces with the assigned jurisdiction and project requirements.",
    image: "/images/Fiber/trenching_pic.jpg", imageAlt: "Utility corridor construction work",
    groups: [
      { title: "Work-zone layouts", items: ["Traffic-control plans for fiber routes and utility work", "Roadway, intersection and crossing work-zone exhibits", "Pedestrian routing and flagging requirements documented within scope"] },
      { title: "Permit coordination", items: ["MOT and TCP sheets aligned with the permit drawing package", "Jurisdiction comments and plan revisions", "Signed and sealed engineering review where required and within scope"] },
      { title: "Construction interfaces", items: ["Work sequence, access and staging information from the construction team", "Route-based or location-specific packages", "Coordination of roadway and utility permit requirements"] },
    ],
    deliverables: ["Traffic-control and MOT plan sheets", "Roadway and crossing work-zone exhibits", "Permit-review responses and revised plans", "Coordinated construction drawing packages"],
    inputs: "Send the route or work locations, roadway jurisdiction, construction method, work duration and sequence, available plans and permit requirements.",
    related: ["fiber", "permitting", "construction"],
  },
  fiber: {
    name: "Fiber & OSP Engineering",
    headline: "Fiber plans that connect the route to the field.",
    description: "Odiscom engineers aerial and underground fiber networks and produces the drawing packages that support permitting and construction. Engage our team for FTTH mainline and drops, route development, or recurring OSP production support.",
    image: "/images/Fiber/trenching_pic.jpg", imageAlt: "Underground fiber infrastructure work",
    groups: [
      { title: "Routes & field data", items: ["Corridor and route development for urban and rural networks", "Fielding, staking information and existing-condition reconciliation", "Aerial and underground constructability reviews"] },
      { title: "Design & drawing production", items: ["FTTH mainline, distribution and drop drawing packages", "Conduit, bore-crossing, handhole and cabinet layouts", "CAD/GIS coordination, construction notes and material quantities"] },
      { title: "Permits through closeout", items: ["Utility and public ROW application drawings", "Reviewer comments, revisions and resubmittals", "Construction RFIs, field redlines and record-drawing support"] },
    ],
    deliverables: ["Route sheets and construction drawing sets", "Permit exhibits and application packages", "Bills of materials and quantity reconciliation", "Drawing revisions and record packages"],
    inputs: "Share the route or service area, available field data, owner standards, required deliverables and target schedule.",
    related: ["joint-use", "construction", "permitting"],
  },
  construction: {
    name: "Wireline Construction & Delivery",
    headline: "Connect the engineering package to the construction team.",
    description: "Odiscom brings together A&E and construction capabilities for fiber, wireless, tower and utility infrastructure. Odiscom LLC provides engineering and construction-phase technical support; Odiscom Construction LLC provides construction services.",
    image: "/images/Fiber/trenching_pic.jpg", imageAlt: "Trenching for underground infrastructure",
    groups: [
      { title: "Aerial & underground fiber", items: ["Scope aerial fiber placement and underground conduit and cable installation with Odiscom Construction", "Coordinate directional-bore crossings, handholes, access and restoration requirements", "Align routes, quantities, permit conditions and field constraints before mobilization"] },
      { title: "Construction delivery", items: ["Work-package planning, estimating support and schedule coordination", "Crew, subcontractor, utility and project-stakeholder coordination", "Field issue tracking, quality documentation and progress reporting within the contracted scope"] },
      { title: "Engineering & closeout", items: ["RFI responses, design clarifications and construction drawing revisions", "Field redlines, quantity reconciliation and record drawings", "Coordination of installation, testing and turnover documentation requirements"] },
    ],
    deliverables: ["Defined construction scope and work packages", "Construction-phase engineering responses", "Field change and progress documentation", "Redlines, record drawings and closeout packages"],
    inputs: "Send the plans, route or site locations, bid requirements, quantities and schedule. Our team will coordinate the engineering and construction scope with the appropriate Odiscom company.",
    related: ["fiber", "fiber-facilities", "civil-electrical"],
  },
  "site-acquisition": {
    name: "Site Acquisition & Due Diligence",
    headline: "Find the site. Understand the constraints. Move it forward.",
    description: "Odiscom supports property acquisition and site development for wireless and fiber infrastructure, including towers, equipment huts, ILAs and POP facilities. Our site-acquisition work connects property discussions with engineering feasibility and permitting requirements.",
    image: "/images/Towers/South_Tower.jpg", imageAlt: "Telecommunications infrastructure site",
    groups: [
      { title: "Search & candidates", items: ["Search-area and KMZ review, candidate identification and comparisons", "Property-owner and broker outreach and site-access coordination", "Preliminary site fit, access, utilities and zoning feasibility"] },
      { title: "Property & due diligence", items: ["Lease and purchase negotiation support", "Title, easement, access and utility-corridor coordination", "Survey, geotechnical and environmental work coordinated with qualified providers"] },
      { title: "Entitlements & handoff", items: ["Landowner, jurisdiction and utility communication", "Zoning and permit-package coordination", "Candidate summaries, site exhibits and acquisition-status tracking for engineering and construction handoff"] },
    ],
    deliverables: ["Candidate comparisons and feasibility summaries", "Site layouts and property/easement exhibits", "Due-diligence and acquisition-status tracking", "Coordinated entitlement and engineering handoff packages"],
    inputs: "Send the search area, network or equipment requirements, site criteria, acquisition approach and target in-service date.",
    related: ["fiber-facilities", "wireless", "permitting"],
  },
  "joint-use": {
    name: "Joint Use & Make Ready",
    headline: "Turn pole data into a coordinated attachment package.",
    description: "Odiscom supports aerial fiber programs with pole data, engineering review and utility application packages. We connect field observations, loading and clearance requirements with the documentation needed for attachment review.",
    image: "/images/Towers/South_Tower.jpg", imageAlt: "Vertical telecommunications infrastructure",
    groups: [
      { title: "Field data & engineering", items: ["Pole data collection, attachment inventories, photographs and viability grading", "Pole-loading analysis and clearance review", "Make-ready recommendations and engineering documentation"] },
      { title: "Utility applications", items: ["Joint-use application drawings and clearance exhibits", "Pole and attachment schedules supporting utility submissions", "Utility comments, revised exhibits and resubmittal coordination"] },
      { title: "Review & production support", items: ["PE review and signed/sealed packages within the assigned scope", "OTMR letters and supporting documentation where applicable", "Repeatable package production for ongoing broadband programs"] },
    ],
    deliverables: ["Pole data and attachment schedules", "Loading and clearance review documentation", "Make-ready and utility application packages", "Review responses and revised submittals"],
    inputs: "Send the utility standards, pole list, field records, proposed attachments and submission requirements.",
    related: ["fiber", "permitting", "towers"],
  },
  "fiber-facilities": {
    name: "Fiber-Optic ILA Huts, Shelters & POPs",
    headline: "Fiber-optic ILA huts, engineered from the site up.",
    description: "Odiscom provides fiber-optic ILA hut, shelter, POP and cabinet site engineering for long-haul and regional networks. Our experience includes Zayo and D4 Communications / Arcadian fiber-facility programs, from property due diligence through coordinated civil, foundation and electrical drawing packages.",
    image: "/images/illustrations/fiber-ila-facility.webp", imageAlt: "Concept illustration of a fiber-optic ILA hut with utility and site infrastructure", imageCaption: "Concept illustration · not a completed Odiscom project",
    groups: [
      { title: "Site development", items: ["Candidate fit, access and equipment-layout studies", "Survey and geotechnical coordination", "Property, access and utility easement exhibits"] },
      { title: "Multidisciplinary engineering", items: ["Hut, cabinet and equipment foundations", "Grading, drainage, erosion control and access layouts", "Electrical service, generator, grounding and utility interfaces"] },
      { title: "Permits & construction", items: ["Coordinated site and construction drawing packages", "Agency and utility comments and revisions", "Construction clarifications and record-drawing support"] },
    ],
    deliverables: ["Due-diligence summaries and site plans", "Civil, structural and electrical drawing packages", "Permit exhibits and agency response packages", "Construction revisions and facility record drawings"],
    inputs: "Share the site or search area, hut/equipment specifications, power requirements, owner standards and deployment schedule.",
    related: ["site-acquisition", "civil-electrical", "construction"],
  },
  wireless: {
    name: "Wireless & DAS A&E",
    headline: "Wireless engineering, inside the building and across the network.",
    description: "Odiscom supports DAS and in-building wireless programs alongside carrier, WISP and tower infrastructure. Our A&E team coordinates site conditions, antenna and equipment layouts, cabling pathways, power and structural requirements in construction drawing packages.",
    image: "/images/Towers/South_Tower.jpg", imageAlt: "Wireless tower and telecommunications equipment",
    groups: [
      { title: "DAS & in-building wireless", items: ["Engineering site walks and existing-condition documentation", "Antenna, telecom-room, equipment-rack and cabling layouts coordinated with the RF design team", "Fiber, coax, GPS, power and grounding interfaces for construction documents"] },
      { title: "Wireless sites & upgrades", items: ["Tower, rooftop and ground-equipment layouts", "Carrier upgrades and equipment modifications", "Structural, foundation, electrical and mounting-system coordination"] },
      { title: "Permitting & construction", items: ["Permit and construction drawing packages for carriers, venues and delivery partners", "PE review, drawing QA/QC and owner-standard reconciliation", "Venue and jurisdiction comments, construction RFIs and drawing revisions"] },
    ],
    deliverables: ["DAS design-walk and existing-condition records", "Antenna, equipment and cabling layout drawings", "Electrical, grounding and coordinated construction documents", "Permit responses and construction drawing revisions"],
    inputs: "Send the venue or site information, RF design or system requirements, carrier standards, equipment scope, available drawings and schedule.",
    related: ["site-acquisition", "towers", "civil-electrical"],
  },
  towers: {
    name: "Tower & Structural Engineering",
    headline: "Cell tower structural analysis, mount analysis and foundation engineering.",
    description: "Odiscom provides telecom tower structural analysis, antenna-mount analysis, foundation engineering and modification drawings. Jacob Goralski, P.E., leads engineering review for new equipment, existing structures and coordinated tower-site packages. Our experience includes Nextlink assignments and D4 Communications’ Rancho Mission Viejo wireless facilities.",
    image: "/images/Towers/South_Tower.jpg", imageAlt: "Telecommunications tower structure",
    groups: [
      { title: "Structural analysis", items: ["Cell tower structural analysis and proposed antenna/radio loading reviews", "Antenna-mount analysis and modification engineering", "Tower and equipment-foundation analysis and design", "Self-supporting tower, monopole and equipment-support scopes"] },
      { title: "Data & design", items: ["Tower mapping, audits and inspection inputs coordinated with qualified field providers", "Existing-drawing, loading and field-data review", "Modification drawings, structural details and rigging-plan engineering within scope"] },
      { title: "Owner & construction support", items: ["Engineering due diligence for infrastructure portfolios", "Equipment-change and construction clarification support", "Technical findings and repair/modification recommendations"] },
    ],
    deliverables: ["Structural analysis reports", "Mount and foundation engineering", "Modification drawings and details", "Technical due-diligence summaries"],
    inputs: "Share the structure inventory, existing drawings and analyses, proposed equipment loading, field information and required deliverables.",
    related: ["tower-mapping", "wireless", "joint-use"],
  },
  "civil-electrical": {
    name: "Civil & Electrical Engineering",
    headline: "Coordinate the site, the structure and the power.",
    description: "Odiscom develops the civil, structural and electrical components of telecommunications infrastructure projects. Our team coordinates facility layouts and discipline interfaces so permit and construction packages describe the same build.",
    image: "/images/construction/construction-crew.jpg", imageAlt: "Civil infrastructure construction work",
    groups: [
      { title: "Civil & site engineering", items: ["Site and access layouts, grading and drainage", "Hydrology, hydraulics, stormwater management and detention scopes", "Erosion-control and site-development drawings", "Utility layouts and survey/geotechnical coordination"] },
      { title: "Structures & foundations", items: ["Equipment, hut and cabinet foundations", "Support structures and mounting details", "Structural interfaces with site and equipment plans"] },
      { title: "Electrical & utility interfaces", items: ["Electrical service and equipment-power layouts", "Generator and grounding design coordination", "Power-provider information, service requirements and permit comments"] },
    ],
    deliverables: ["Coordinated site and civil plans", "Foundation and structural details", "Electrical and grounding drawings", "Agency responses and construction clarifications"],
    inputs: "Send the site survey or available base information, equipment specifications, geotechnical information, power needs and jurisdiction requirements.",
    related: ["fiber-facilities", "towers", "permitting"],
  },
  permitting: {
    name: "Permitting & Program Services",
    headline: "Keep applications, engineering and project decisions moving together.",
    description: "Odiscom coordinates the documentation and stakeholders behind telecom delivery. We support operators, engineering firms and prime contractors with permitting, field-data coordination and defined production or program-management scopes.",
    image: "/images/construction/construction-crew.jpg", imageAlt: "Infrastructure project delivery",
    groups: [
      { title: "Permits & agencies", items: ["Municipal, county, transportation and public ROW permit packages", "Railroad and utility-crossing documentation and coordination", "Application tracking, reviewer responses and resubmittals"] },
      { title: "Specialist coordination", items: ["Survey, FAA 1A documentation, geotechnical and field scopes coordinated with qualified providers", "NEPA, SHPO, archaeology and FCC/NTIA environmental documentation coordination as applicable", "Traffic-control and MOT plans coordinated with roadway permit packages"] },
      { title: "Program & owner support", items: ["Engineering production support and staff augmentation", "Scope, deliverable, schedule and issue tracking", "Technical due diligence, drawing QA/QC and construction-closeout coordination"] },
    ],
    deliverables: ["Application packages and permit exhibits", "Comment-response and submission tracking", "Program status and issue registers", "Coordinated engineering and closeout records"],
    inputs: "Share the project geography, agencies, scope matrix, current applications, delivery standards and milestones.",
    related: ["environmental", "traffic-control", "site-acquisition"],
  },
};
