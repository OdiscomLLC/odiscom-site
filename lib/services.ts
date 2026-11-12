export type Service = {
  name: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  groups: { title: string; items: string[] }[];
  deliverables: string[];
  inputs: string;
  related: string[];
};

export const services: Record<string, Service> = {
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
      { title: "Field data & engineering", items: ["Pole inventories, attachment information and field-data reconciliation", "Pole-loading analysis and clearance review", "Make-ready recommendations and engineering documentation"] },
      { title: "Utility applications", items: ["Joint-use application drawings and clearance exhibits", "Pole and attachment schedules supporting utility submissions", "Utility comments, revised exhibits and resubmittal coordination"] },
      { title: "Review & production support", items: ["PE review and signed/sealed packages within the assigned scope", "OTMR letters and supporting documentation where applicable", "Repeatable package production for ongoing broadband programs"] },
    ],
    deliverables: ["Pole data and attachment schedules", "Loading and clearance review documentation", "Make-ready and utility application packages", "Review responses and revised submittals"],
    inputs: "Send the utility standards, pole list, field records, proposed attachments and submission requirements.",
    related: ["fiber", "permitting", "towers"],
  },
  "fiber-facilities": {
    name: "Fiber Huts, ILAs & POPs",
    headline: "Engineer the facilities behind the fiber network.",
    description: "Long-haul and regional fiber networks depend on buildable equipment sites as well as routes. Odiscom supports ILA, hut, POP and cabinet facilities from site due diligence through coordinated civil, structural and electrical drawings.",
    image: "/images/construction/construction-crew.jpg", imageAlt: "Infrastructure construction site",
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
    headline: "Engineering for towers, mounts and foundations.",
    description: "Odiscom evaluates telecommunications structures and develops engineering packages for modifications and new equipment. Jacob Goralski, P.E., leads the engineering team, connecting structural findings with practical site and construction requirements.",
    image: "/images/Towers/South_Tower.jpg", imageAlt: "Telecommunications tower structure",
    groups: [
      { title: "Structural analysis", items: ["Tower and equipment-support structural assessments", "Mount analysis and modification engineering", "Foundation review and design within the project scope"] },
      { title: "Data & design", items: ["Existing-drawing, loading and field-data review", "Coordination of mapping or additional investigation where needed", "Modification drawings and structural details"] },
      { title: "Owner & construction support", items: ["Engineering due diligence for infrastructure portfolios", "Equipment-change and construction clarification support", "Technical findings and repair/modification recommendations"] },
    ],
    deliverables: ["Structural analysis reports", "Mount and foundation engineering", "Modification drawings and details", "Technical due-diligence summaries"],
    inputs: "Share the structure inventory, existing drawings and analyses, proposed equipment loading, field information and required deliverables.",
    related: ["wireless", "joint-use", "construction"],
  },
  "civil-electrical": {
    name: "Civil & Electrical Engineering",
    headline: "Coordinate the site, the structure and the power.",
    description: "Odiscom develops the civil, structural and electrical components of telecommunications infrastructure projects. Our team coordinates facility layouts and discipline interfaces so permit and construction packages describe the same build.",
    image: "/images/construction/construction-crew.jpg", imageAlt: "Civil infrastructure construction work",
    groups: [
      { title: "Civil & site engineering", items: ["Site and access layouts, grading and drainage", "Erosion-control and site-development drawings", "Utility layouts and survey/geotechnical coordination"] },
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
      { title: "Specialist coordination", items: ["Survey and geotechnical scopes coordinated with qualified providers", "Environmental and NEPA/FCC review coordination as applicable", "Agency, utility, property-owner and engineering-team interfaces"] },
      { title: "Program & owner support", items: ["Engineering production support and staff augmentation", "Scope, deliverable, schedule and issue tracking", "Technical due diligence, drawing QA/QC and construction-closeout coordination"] },
    ],
    deliverables: ["Application packages and permit exhibits", "Comment-response and submission tracking", "Program status and issue registers", "Coordinated engineering and closeout records"],
    inputs: "Share the project geography, agencies, scope matrix, current applications, delivery standards and milestones.",
    related: ["site-acquisition", "fiber", "construction"],
  },
};
