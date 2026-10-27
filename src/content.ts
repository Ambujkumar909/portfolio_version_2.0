// Single source of truth for every word on the site.
// Everything here is traceable to new design/PORTFOLIO_BRIEF.md §6 or the résumé.

export const PERSON = {
  name: 'Ambuj Kumar',
  title: 'AI Systems Architect · Generative AI / LLM Engineer · Technology Consultant',
  location: 'Jaipur, India',
  email: 'ambujkr8@gmail.com',
  phone: '+91 93343 17502',
  tel: '+919334317502',
  github: 'https://github.com/Ambujkumar909',
  githubLabel: 'github.com/Ambujkumar909',
  linkedin: 'https://www.linkedin.com/in/ambuj-kumar-swe/',
  linkedinLabel: 'linkedin.com/in/ambuj-kumar-swe',
  resume: '/resume.pdf',
} as const;

export const NAV = [
  { id: 'work', n: '01', label: 'Work' },
  { id: 'about', n: '02', label: 'About' },
  { id: 'experience', n: '03', label: 'Record' },
  { id: 'index', n: '04', label: 'Index' },
  { id: 'stack', n: '05', label: 'Stack' },
  { id: 'contact', n: '06', label: 'Contact' },
] as const;

export const ABOUT = {
  lead: 'I start from the business problem, work out what it costs today, then build the system that removes it.',
  body: [
    'I design and build complete enterprise software on my own: the data model, the backend, the interface, the deployment, and the production operation after launch.',
    'Most of it replaces a licensed product with one the company owns. I fine-tune and deploy LLMs, design data platforms, and have shipped systems in supply chain, IT operations, finance, retail and security.',
  ],
  current: { degree: 'B.Tech, Electronics & Communication', school: 'LNMIIT', years: '2024 – 2028', base: 'Jaipur, India' },
};

// ── Flagship systems + case studies ───────────────────────────────────────

export type ArchNode = { id: string; label: string; sub?: string; x: number; y: number; accent?: boolean };
/** Every project page shares this shape; flagships add card metrics and an architecture diagram. */
export type Case = {
  slug: string;
  name: string;
  full: string;
  kicker: string; // "Replaces → …"
  pitch: string;
  stack: string[];
  role: string;
  context: string;
  cost: string[];
  built: string[];
  decisions: { title: string; body: string }[];
  outcome: { value: string; label: string }[];
  outcomeNote?: string[];
  link?: { href: string; label: string };
  // architecture diagram on a 1000 × 520 canvas
  arch?: { nodes: ArchNode[]; edges: [string, string, string?][] };
};
export type Flagship = Case & {
  slug: 'itsm' | 'aether' | 'velocity' | 'recon-os';
  metrics: { value: string; label: string }[];
  arch: NonNullable<Case['arch']>;
};

// TODO(ambuj): confirm "role" wording per project.
const ROLE = 'Designed and built end to end';

export const FLAGSHIPS: Flagship[] = [
  {
    slug: 'itsm',
    name: 'ITSM',
    full: 'Endpoint fleet management',
    kicker: 'Replaces → Kaseya VSA',
    pitch: 'One browser console for every Windows and Mac machine: inventory, patching, live health and remote control.',
    metrics: [
      { value: '554', label: 'machines' },
      { value: '17', label: 'sites' },
      { value: '92.4%', label: 'patch compliance' },
    ],
    stack: ['Go 1.26', 'PostgreSQL 17', 'pgx', 'Next.js 16', 'React 19', 'Docker'],
    role: ROLE,
    context: "D'Decor Home Fabrics · 2026",
    cost: [
      'Hundreds of Windows and Mac machines were managed through a paid console, licensed per machine. Every laptop added to the fleet added to the bill.',
      'Benchmarked against Kaseya VSA and JP1 ITDM2 before a line was written.',
    ],
    built: [
      'A single static Go agent for Windows and macOS. It only dials out, runs only signed jobs, accepts only signed updates, and protects itself against tampering.',
      'One Go binary on the server, cut into six vertical modules: agents, identity, software, remote, security and monitoring.',
      'A browser console for inventory, patching, live health, remote shell and USB control.',
    ],
    decisions: [
      { title: 'Outbound-only agents', body: 'No machine on the fleet listens on a port. Each agent dials out to the server, so the fleet exposes nothing inbound.' },
      { title: 'Signed everything', body: 'The agent executes only work the server has signed, including its own updates.' },
      { title: 'One binary, six modules', body: 'Vertical modules keep each domain separate in code while shipping as one deployable: a distroless, non-root container with a strict Content Security Policy throughout.' },
      { title: 'Built past the fleet', body: 'Load-tested to 5,000 agents, about nine times the machines it runs today.' },
    ],
    outcome: [
      { value: '554', label: 'machines in production' },
      { value: '17', label: 'sites' },
      { value: '92.4%', label: 'patch compliance' },
      { value: '5,000', label: 'agents tested' },
    ],
    arch: {
      nodes: [
        { id: 'win', label: 'Windows agent', sub: 'static Go', x: 110, y: 130 },
        { id: 'mac', label: 'macOS agent', sub: 'static Go', x: 110, y: 390 },
        { id: 'tls', label: 'Signed channel', sub: 'outbound only', x: 390, y: 260 },
        { id: 'srv', label: 'Go server', sub: '6 vertical modules', x: 640, y: 260, accent: true },
        { id: 'pg', label: 'PostgreSQL 17', sub: 'pgx', x: 890, y: 400 },
        { id: 'ui', label: 'Console', sub: 'Next.js 16 · CSP', x: 890, y: 120 },
      ],
      edges: [['win', 'tls', 'jobs'], ['mac', 'tls', 'jobs'], ['tls', 'srv'], ['srv', 'pg'], ['ui', 'srv']],
    },
  },
  {
    slug: 'aether',
    name: 'Aether',
    full: 'Meetings, chat and calling',
    kicker: 'Replaces → Microsoft Teams',
    pitch: 'Meetings, chat and calling the company owns, engineered down to the bytes on the wire.',
    metrics: [
      { value: '3 B', label: 'per state change' },
      { value: '224 MB', label: 'vs 365 MB per call' },
      { value: '50,000', label: 'people, searched in µs' },
    ],
    stack: ['Go', 'WebRTC SFU', 'AV1 / Opus', 'SRTP', 'WebSockets', 'TURN relay', 'SQLite', 'Windows app'],
    role: ROLE,
    context: 'In-house alternative to Microsoft Teams',
    cost: [
      'Meetings, chat and calls ran on a licensed suite. Every conversation in the company depended on software it rented.',
    ],
    built: [
      'Video meetings with screen share, captions and reactions.',
      'Persistent chat with channels, groups and files; calling; scheduling; a company directory.',
      'Remote desktop control, only with consent. Shipped as a Windows desktop app.',
    ],
    decisions: [
      { title: 'A binary protocol', body: 'A state change costs 3 bytes on the wire against 172 as JSON. A heartbeat costs 1 byte. Measured on real packets.' },
      { title: 'Bandwidth as a budget', body: 'AV1 video, 60 ms Opus frames and pruned headers. A 4-person, 15-minute call sends 224 MB instead of 365 MB at the same quality.' },
      { title: 'Directory at index speed', body: 'Search over 50,000 people answered from an index in microseconds.' },
      { title: 'Secure by default', body: 'Argon2id for credentials, SRTP for media, a tamper-evident audit log.' },
    ],
    outcome: [
      { value: '3 B', label: 'state change (172 B as JSON)' },
      { value: '1 B', label: 'heartbeat' },
      { value: '−39%', label: 'bytes per call, same quality' },
      { value: '50,000', label: 'people in the directory index' },
    ],
    arch: {
      nodes: [
        { id: 'app', label: 'Desktop app', sub: 'Windows', x: 110, y: 260 },
        { id: 'ws', label: 'Signalling', sub: 'WebSockets · 3 B frames', x: 400, y: 110 },
        { id: 'turn', label: 'TURN relay', sub: 'NAT traversal', x: 400, y: 410 },
        { id: 'srv', label: 'Go server', sub: 'chat · calls · directory', x: 660, y: 110, accent: true },
        { id: 'sfu', label: 'WebRTC SFU', sub: 'AV1 / Opus · SRTP', x: 660, y: 410, accent: true },
        { id: 'db', label: 'SQLite', sub: 'audit log · Argon2id', x: 900, y: 110 },
      ],
      edges: [['app', 'ws'], ['ws', 'srv'], ['srv', 'db'], ['app', 'turn', 'media'], ['turn', 'sfu'], ['app', 'sfu']],
    },
  },
  {
    slug: 'velocity',
    name: 'Velocity',
    full: 'Visual analytics platform',
    kicker: 'Replaces → Alteryx Designer',
    pitch: 'The drag-and-drop analytics canvas, rebuilt for the browser and the server. No per-seat licence.',
    metrics: [
      { value: '12 → 1', label: 'tools to one query' },
      { value: '157', label: 'tools' },
      { value: '3', label: 'SQL engines for pushdown' },
    ],
    stack: ['Python', 'FastAPI', 'DuckDB', 'React', 'React Flow', 'scikit-learn', 'statsmodels', 'WeasyPrint', 'Docker'],
    role: ROLE,
    context: 'Browser and server replacement for Alteryx Designer',
    cost: [
      'Analytics workflows were built in a desktop product licensed per seat.',
      'Sharing a workflow, scheduling it and running it centrally is where teams feel that most.',
    ],
    built: [
      'The canvas analysts already know, in the browser: 157 tools on a React Flow graph.',
      'SQL pushdown to Postgres, MySQL and SQL Server; PDF reports and mail merge; ETS and ARIMA forecasting.',
      'Workflows are shared, scheduled and run centrally on the server.',
    ],
    decisions: [
      { title: 'Compile, then read', body: 'The whole canvas compiles into one DuckDB query before any data is read. A 12-tool pipeline costs one query, not twelve passes.' },
      { title: 'Push work to the source', body: 'When the data lives in Postgres, MySQL or SQL Server, the query runs there instead of moving the data.' },
      { title: 'Server first', body: 'Workflows run centrally, so a schedule does not depend on anyone’s laptop being open.' },
    ],
    outcome: [
      { value: '157', label: 'tools' },
      { value: '1', label: 'query per pipeline' },
      { value: '3', label: 'databases with pushdown' },
      { value: '0', label: 'per-seat licences' },
    ],
    arch: {
      nodes: [
        { id: 'canvas', label: 'Canvas', sub: 'React Flow · 157 tools', x: 110, y: 260 },
        { id: 'api', label: 'FastAPI', sub: 'schedules · sharing', x: 340, y: 260 },
        { id: 'cmp', label: 'Compiler', sub: 'canvas → 1 query', x: 560, y: 260, accent: true },
        { id: 'duck', label: 'DuckDB', sub: 'single execution', x: 780, y: 140 },
        { id: 'src', label: 'Postgres · MySQL · SQL Server', sub: 'pushdown', x: 780, y: 400 },
        { id: 'out', label: 'Reports', sub: 'WeasyPrint · mail merge', x: 930, y: 260 },
      ],
      edges: [['canvas', 'api'], ['api', 'cmp'], ['cmp', 'duck'], ['cmp', 'src', 'SQL'], ['duck', 'out']],
    },
  },
  {
    slug: 'recon-os',
    name: 'Recon OS',
    full: 'Marketplace reconciliation and revenue assurance',
    kicker: 'Verifies → marketplace settlements',
    pitch: 'Computes what a marketplace was allowed to charge under contract, then checks what it actually charged, line by line.',
    metrics: [
      { value: '1 month', label: 'of real files verified' },
      { value: '24', label: 'modules, one monolith' },
      { value: '0', label: 'engine changes per marketplace' },
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL 17', 'Temporal', 'MinIO', 'Next.js', 'Grafana'],
    role: ROLE,
    context: 'Revenue assurance for marketplace sellers',
    cost: [
      'Tools like Sellerboard and Unicommerce report the marketplace’s own figures. When the marketplace is wrong, the report is wrong with it.',
    ],
    built: [
      'An engine that computes the allowed charge for every line from the contract, then compares it with the actual charge.',
      'Multi-tenant with row-level isolation and a hash-chained audit log.',
      'A new marketplace is added with a connector spec and a rate card. The engine does not change.',
    ],
    decisions: [
      { title: 'Traceable by construction', body: 'Every figure traces to its source row, match score, contract clause and formula.' },
      { title: 'Honest about gaps', body: 'The report states what it could not verify instead of claiming completeness.' },
      { title: 'Connectors, not code', body: 'Marketplaces differ in data, not in logic. A connector spec and a rate card describe the difference.' },
      { title: 'Durable runs', body: 'Temporal orchestrates each reconciliation; raw files are kept in MinIO and results in PostgreSQL 17.' },
    ],
    outcome: [
      { value: '1 month', label: 'of real marketplace files' },
      { value: '24', label: 'modules' },
      { value: '0', label: 'engine changes per new marketplace' },
    ],
    outcomeNote: [
      'Surfaced returns that reached the warehouse but were never credited.',
      'Surfaced settlement rows that did not balance.',
    ],
    arch: {
      nodes: [
        { id: 'files', label: 'Marketplace files', sub: 'settlements · returns', x: 110, y: 140 },
        { id: 'card', label: 'Rate card', sub: 'contract terms', x: 110, y: 400 },
        { id: 'conn', label: 'Connector spec', sub: 'per marketplace', x: 340, y: 140 },
        { id: 'tmp', label: 'Temporal', sub: 'durable runs', x: 340, y: 400 },
        { id: 'eng', label: 'Recon engine', sub: '24 modules', x: 600, y: 260, accent: true },
        { id: 'pg', label: 'PostgreSQL 17', sub: 'row-level isolation', x: 880, y: 140 },
        { id: 'audit', label: 'Audit + reports', sub: 'hash chain · Next.js · Grafana', x: 880, y: 400 },
      ],
      edges: [['files', 'conn'], ['conn', 'eng'], ['card', 'tmp'], ['tmp', 'eng'], ['eng', 'pg'], ['eng', 'audit']],
    },
  },
];

// ── Every other project: same case-study template ─────────────────────────
// Facts from the résumé and each project's repo README. Sections with no data are omitted.

const DDECOR = "D'Decor Home Fabrics · 2026";

export const CASES: Case[] = [
  {
    slug: 'demand-forecasting', name: 'Demand Forecasting', full: 'Probable demand for ~21,000 SKUs',
    kicker: 'Replaces → judgement and last year’s sales',
    pitch: 'Gives planners a probable range of demand for every SKU, instead of a single guess.',
    stack: ['Python', 'LightGBM'], role: ROLE, context: DDECOR,
    cost: ['Planning for about 21,000 SKUs relied on judgement and prior-year sales.', 'A single number per SKU says nothing about how sure it is.'],
    built: ['LightGBM quantile models that predict a range of demand per SKU, not one point.', 'Bias tracking, so systematic over- or under-forecasting is visible.', 'Forecasts that feed the reorder optimizer directly.'],
    decisions: [
      { title: 'Ranges, not points', body: 'Quantile models give planners a low, likely and high figure, so stock decisions can match the risk.' },
      { title: 'Watch the bias', body: 'Forecast bias is tracked, so drift shows up in a report before it shows up in the warehouse.' },
    ],
    outcome: [{ value: '~21,000', label: 'SKUs forecast' }],
  },
  {
    slug: 'reorder-automation', name: 'Reorder Automation', full: 'Forecasts into orders',
    kicker: 'Replaces → manual replenishment',
    pitch: 'Turns demand forecasts into purchase and production orders that respect the factory’s real rules.',
    stack: ['Python'], role: ROLE, context: DDECOR,
    cost: ['Replenishment was triggered by hand when stock ran low.', 'Every order depended on someone noticing in time.'],
    built: ['An optimizer that converts forecasts into purchase and production orders.', 'Orders stay within safety stock and club small quantities to meet minimum order quantities.', 'Greige and beam routing and dye-lot rules are enforced, so every order is feasible on the floor.'],
    decisions: [
      { title: 'Rules as constraints', body: 'Safety stock, MOQ clubbing, greige/beam routing and dye lots are constraints inside the optimizer, not checks after the fact.' },
      { title: 'Forecast first', body: 'Orders start from expected demand, not from the moment stock runs out.' },
    ],
    outcome: [{ value: '4', label: 'planning rules enforced' }],
  },
  {
    slug: 'asset-vault', name: 'Asset Vault', full: 'Digital asset management',
    kicker: 'Modelled on → Pimcore DAM',
    pitch: 'One home for the brand’s photography, swatches and product records, searchable down to the text inside documents.',
    stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'BullMQ', 'Redis', 'Sharp', 'FFmpeg', 'React'], role: ROLE, context: 'Brand asset platform',
    cost: ['Pimcore’s asset engine is proven, but it is PHP, and it does not search inside PDF and Office files.'],
    built: ['A clean-room rebuild of Pimcore’s asset engine in NestJS and TypeScript: folder tree, upload, type resolution and storage.', 'Thumbnails and on-demand image variants with Sharp; video transcoding with FFmpeg on a BullMQ queue.', 'Per-language metadata with EXIF/IPTC extraction, versioning, a recycle bin and per-folder permissions.', 'Full-text search inside PDF and Office files.'],
    decisions: [
      { title: 'Modelled 1:1 on Pimcore', body: 'The architecture follows a proven DAM engine, so the hard design questions were already answered.' },
      { title: 'Heavy work off the request', body: 'Transcodes, image optimisation and previews run on an async BullMQ and Redis pipeline.' },
      { title: 'Storage-agnostic', body: 'Assets go to S3 or local disk behind one interface.' },
    ],
    outcome: [{ value: '6', label: 'engine modules' }],
  },
  {
    slug: 'pricelens', name: 'PriceLens', full: 'Competitive price intelligence',
    kicker: 'Verifies → marketplace prices',
    pitch: 'For every product on one of India’s largest fashion marketplaces, finds the exact same SKU on two rival fashion giants, proves the match, and shows the price gap.',
    stack: ['Next.js', 'Fastify', 'Node.js', 'Redis', 'Docker'], role: ROLE, context: 'Price intelligence for one of India’s largest fashion marketplaces',
    cost: ['The same style sells on three platforms under three titles, three colour names and sometimes three MRPs.', 'Pricing teams were flying blind.'],
    built: ['Paste any product link: PriceLens fetches it and matches the exact SKU on two rival fashion giants, live.', 'A full comparison of pricing and offers, specifications and content quality, with an AI decision summary and one-click links to verify each listing.', 'Excel and PDF exports filtered by category, brand and price band, leading with who is cheapest and the size of the gap.'],
    decisions: [
      { title: 'SKU-level or nothing', body: 'Matches are proven at the exact-SKU level, not “looks similar”, and every claim is one click from the live listing.' },
      { title: 'Pure HTTP', body: 'No headless browser anywhere in the stack. Data that cannot be read shows as “not available”, never as a guess.' },
      { title: 'Built for volume', body: 'Bulk import exercised at 10,000 rows, with jobs that survive a restart.' },
    ],
    outcome: [
      { value: '96%', label: 'exact-SKU precision, live audit' },
      { value: '3', label: 'marketplaces compared' },
      { value: '10,000', label: 'rows per bulk import, tested' },
    ],
  },
  {
    slug: 'spykar-iq', name: 'Spykar IQ', full: 'Inventory and sales intelligence',
    kicker: 'Retail → one view of stock',
    pitch: 'One view of stock for a national apparel chain, with answers in plain English.',
    stack: ['Next.js', 'React', 'Express', 'Node.js', 'PostgreSQL', 'SQL Server', 'Gemini'], role: ROLE, context: 'Built for Spykar Jeans',
    cost: ['Distributors, stores and warehouses each saw their own slice of stock.', 'Every question across the network needed someone who could write SQL.'],
    built: ['Real-time stock visibility from warehouses and distributors to company-owned and franchise stores.', 'A natural-language assistant on Gemini 2.5 Flash that turns a question into an optimised PostgreSQL query, runs it on live data and answers with a table.', 'Scheduled sync from the SQL Server ERP into PostgreSQL.'],
    decisions: [
      { title: 'Ask, don’t query', body: 'Questions like “top five colours sold during Diwali” are answered directly, without SQL.' },
      { title: 'The ERP stays the source', body: 'Data syncs from the ERP on a schedule, so analytics never load the system of record.' },
    ],
    outcome: [],
  },
  {
    slug: 'b2b-dealer-portal', name: 'B2B Dealer Portal', full: 'Order entry for channel partners',
    kicker: 'Stands in for → Salesforce B2B portal',
    pitch: 'Kept dealer orders flowing while the Salesforce B2B portal was down for maintenance.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'SQL Server'], role: ROLE, context: 'Salesforce B2B maintenance window',
    cost: ['When the Salesforce B2B portal went into maintenance, thousands of channel partners had nowhere to place orders.'],
    built: ['A standalone order-entry portal: dealers follow a link from a Salesforce pop-up and sign in with their dealer code.', 'An order form that mirrors the Salesforce layout, with a simpler flow than the portal it stood in for.', 'An admin export of every order line, synced back into Salesforce after maintenance.'],
    decisions: [
      { title: 'Familiar by design', body: 'The form mirrors the Salesforce layout, so dealers needed no training.' },
      { title: 'Built to hand back', body: 'Every order line is exported and marked synced once it is back in Salesforce.' },
    ],
    outcome: [{ value: '1000s', label: 'channel partners kept ordering' }],
  },
  {
    slug: 'whatsapp-marketing', name: 'WhatsApp Marketing Platform', full: 'Campaigns on WhatsApp, owned in-house',
    kicker: 'Replaces → Salesforce Marketing Cloud',
    pitch: 'Campaign messaging on WhatsApp, run on a platform the company owns instead of a licence.',
    stack: ['Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Baileys'], role: ROLE, context: 'In-house replacement for Salesforce Marketing Cloud',
    cost: ['Marketing messages ran through Salesforce Marketing Cloud, a licensed platform.'],
    built: ['A WhatsApp marketing platform built in-house to replace Salesforce Marketing Cloud.', 'Built on the same Baileys foundation as Sonar.'],
    decisions: [],
    outcome: [],
  },
  {
    slug: 'sonar', name: 'Sonar', full: 'WhatsApp order intake',
    kicker: 'Replaces → reading chats by hand',
    pitch: 'Every order message across dozens of customer WhatsApp groups, captured into one structured, auditable feed.',
    stack: ['Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Baileys'], role: ROLE, context: DDECOR,
    cost: ['Orders arrived in dozens of customer WhatsApp groups and were tracked by reading chats.'],
    built: ['Link WhatsApp devices by QR, set a watchlist of groups and numbers, and every message flows into a live dashboard, a searchable database and permanent per-chat archives.', 'Messages are captured in both directions, incoming and outgoing.', 'Self-healing connections, four-tier role-based access and a full audit trail.'],
    decisions: [
      { title: 'Observe only', body: 'Sonar never sends a message, read receipt or presence update. Like passive sonar, it listens without emitting.' },
      { title: 'Never miss a lead', body: 'Multiple sessions with auto-reconnect, so a dropped device does not mean a missed order.' },
      { title: 'Licensed offline', body: 'Ed25519-signed licence keys with enforced expiry that resists clock rollback.' },
    ],
    outcome: [
      { value: '4', label: 'tiers of role-based access' },
      { value: '0', label: 'messages sent, by design' },
    ],
  },
  {
    slug: 'cafeteria', name: 'Cafeteria Management', full: 'One scan, one meal',
    kicker: 'Replaces → coupons and registers',
    pitch: 'Every face scan at four cafeterias becomes one recorded meal, live.',
    stack: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Tailwind CSS'], role: ROLE, context: DDECOR,
    cost: ['Four cafeterias ran on coupons and registers.'],
    built: ['Each scan on the Hikvision face readers is one recorded meal: who ate, where and when.', 'A dashboard of meal-count trends and slots, a live wall of the latest scans, and reports with CSV export.', 'Monthly HR reports, with super admin, admin, HR manager and canteen manager roles.'],
    decisions: [
      { title: 'Roles in the database', body: 'Postgres row-level security on users and the audit log, on top of API role guards.' },
      { title: 'Re-check every request', body: 'Each request re-reads the user from the database, so a disabled account stops working at once.' },
      { title: 'An unremovable root', body: 'A database trigger guarantees the super-admin can never be deleted or demoted.' },
    ],
    outcome: [
      { value: '4', label: 'cafeterias' },
      { value: '1', label: 'scan = one meal' },
      { value: '4', label: 'access roles' },
    ],
  },
  {
    slug: 'hikcentral', name: 'HikCentral', full: 'Gate access dashboard',
    kicker: 'Unlocks → gate-access history',
    pitch: 'Makes the gate terminal’s history searchable in an instant, without taking live monitoring off the device.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'nginx', 'Docker'], role: ROLE, context: DDECOR,
    cost: ['The gate access terminal kept event history that could not be searched.'],
    built: ['A hybrid design: the device stays the source of truth for live monitoring, while Postgres keeps a continuously synced, fully indexed mirror.', 'Instant search by person, card or event across the full history.', 'Dockerised: Postgres, a Node/Express API that talks to the device, and nginx serving the interface.'],
    decisions: [
      { title: 'Live from the device, history from the mirror', body: 'Each question goes to the system best at answering it, and the mirror doubles as a durable backup.' },
      { title: 'Read-through photos', body: 'Event photos are proxied once and kept in Postgres.' },
    ],
    outcome: [],
  },
  {
    slug: 'pdfforge', name: 'PDFForge', full: 'Self-hosted PDF platform',
    kicker: 'Replaces → public PDF websites',
    pitch: 'Every PDF tool the staff need, on the company’s own server, with zero retention.',
    stack: ['FastAPI', 'Celery', 'Redis', 'OCRmyPDF', 'pikepdf', 'WeasyPrint', 'React', 'Vite'], role: ROLE, context: DDECOR,
    cost: ['Staff were uploading confidential documents to public PDF websites.', 'Every “free” online converter has the same price: your documents.'],
    built: ['36 tools for merge, split, compress, OCR and conversion, in one interface with a command palette.', 'A page editor that handles more than a thousand page thumbnails at 60 fps.', 'Zero retention. No document leaves the company.'],
    decisions: [
      { title: 'Sandboxed engines', body: 'Engines run with argument arrays, never a shell, under CPU and wall-time caps.' },
      { title: 'Two-stage validation', body: 'Magic-byte sniffing plus structural parsing stops polyglot files and zip bombs.' },
      { title: 'Encrypted at rest', body: 'AES-256-GCM with per-file keys and signed job tokens, so nobody can touch a job they did not create.' },
    ],
    outcome: [
      { value: '36', label: 'tools' },
      { value: '0', label: 'documents leave the company' },
      { value: '<200 KB', label: 'initial JavaScript, gzipped' },
    ],
  },
  {
    slug: 'nexus', name: 'Nexus', full: 'IT asset lifecycle management',
    kicker: 'IT ops → assign, return, scrap',
    pitch: 'Every device tracked from assignment to return to scrap.',
    stack: ['React', 'TypeScript', 'Node.js', 'Supabase'], role: ROLE, context: 'IT asset management',
    cost: [],
    built: ['Asset lifecycle tracking: assign, return and scrap.', 'Role-based access control and smart inventory filtering.', 'A strictly decoupled React and Node.js architecture for secure intranet deployment.'],
    decisions: [{ title: 'Intranet first', body: 'Frontend and API are fully decoupled, built to deploy securely inside the company network.' }],
    outcome: [],
  },
  {
    slug: 'voice-flow', name: 'Voice Flow', full: 'System-wide dictation',
    kicker: 'Productivity → dictation in any app',
    pitch: 'Hold a key, speak naturally, and finished text lands at the caret, in any app.',
    stack: ['Rust', 'Tokio', 'WebSockets', 'SQLite'], role: ROLE, context: 'Desktop app · macOS and Windows',
    cost: [],
    built: ['One shared Rust core holds all the logic, with thin native shells for macOS and Windows.', 'Identical behaviour on both platforms.', 'A soft heads-up display shows words appearing as you speak.'],
    decisions: [{ title: 'One core, two shells', body: 'The brain is written once in Rust; each operating system gets only a thin native layer.' }],
    outcome: [{ value: '2', label: 'platforms, one core' }],
  },
  {
    slug: 'cargo-loader', name: '3D Cargo Loader Pro', full: 'AI container-load planning',
    kicker: 'Replaces → planning loads by hand',
    pitch: 'Plans a container load in minutes, with a natural-language interface and a live 3D view.',
    stack: ['React', 'Three.js', 'Express', 'PostgreSQL', 'Prisma'], role: 'Founder & Lead Engineer', context: '3D Cargo Loader Pro · 2024 – present',
    cost: ['Planning a container load by hand is slow, and wasted space ships as cost.'],
    built: ['A deterministic packing engine with integer-millimetre arithmetic and strict collision checks.', 'A live 3D view with a clickable view cube and an axle-load readout.', 'A natural-language interface, with multi-tenant teams and roles.'],
    decisions: [
      { title: 'Integer maths', body: 'Every dimension is whole millimetres, so packing results are exact and repeatable.' },
      { title: 'Engine off the main thread', body: 'Packing runs in a Web Worker, so the 3D view stays smooth.' },
      { title: 'Modular monolith', body: 'Frontend, backend and a shared packing engine in one repository, with clear boundaries.' },
    ],
    outcome: [
      { value: 'Minutes', label: 'to plan a load' },
      { value: 'Finalist', label: 'ISF Junicorn, Dubai' },
    ],
    link: { href: 'https://arrangeurload.live', label: 'arrangeurload.live' },
  },
];

export const ALL_CASES: Case[] = [...FLAGSHIPS, ...CASES];

// ── Experience ────────────────────────────────────────────────────────────

export const EXPERIENCE = [
  {
    company: "D'Decor Home Fabrics",
    note: "India’s largest home-furnishing fabric manufacturer",
    role: 'AI & Systems Engineer',
    period: 'Jun – Aug 2026',
    place: 'Mumbai',
    rows: [
      { name: 'Demand Forecasting', problem: 'Planning for about 21,000 SKUs relied on judgement and prior-year sales.', built: 'LightGBM quantile models that give planners a probable demand range per SKU instead of a single estimate, with bias tracking.', slug: 'demand-forecasting' },
      { name: 'Reorder Automation', problem: 'Replenishment was triggered by hand when stock ran low.', built: 'An optimizer that turns forecasts into purchase and production orders within safety stock, MOQ clubbing, greige/beam routing and dye-lot rules.', slug: 'reorder-automation' },
      { name: 'ITSM', problem: 'Hundreds of Windows and Mac machines ran through a paid per-machine console.', built: 'A Go agent and browser console for inventory, patching and remote control. It now runs the entire fleet across 17 sites.', slug: 'itsm' },
      { name: 'Cafeteria Management', problem: 'Four cafeterias ran on coupons and registers.', built: 'Every scan on the Hikvision face readers is one recorded meal, with live counts, monthly HR reports and roles enforced in Postgres.', slug: 'cafeteria' },
      { name: 'HikCentral', problem: 'The gate access terminal kept event history that could not be searched.', built: 'A dashboard that mirrors it into Postgres for instant search by person, card or event, with live monitoring kept on the device.', slug: 'hikcentral' },
      { name: 'Sonar', problem: 'Orders arrived in dozens of customer WhatsApp groups and were tracked by reading chats.', built: 'A service that captures every order message across groups into one structured, auditable intake feed. Node.js, Baileys.', slug: 'sonar' },
      { name: 'PDFForge', problem: 'Staff were uploading confidential documents to public PDF websites.', built: 'A self-hosted platform with 36 tools for merge, split, compress, OCR and conversion, with zero retention. No document leaves the company.', slug: 'pdfforge' },
    ],
  },
  {
    company: '3D Cargo Loader Pro',
    note: 'AI logistics SaaS',
    role: 'Founder & Lead Engineer',
    period: '2024 – Present',
    place: 'Jaipur',
    link: { href: 'https://arrangeurload.live', label: 'arrangeurload.live' },
    rows: [
      { name: 'Load optimizer', problem: 'Planning a container load by hand is slow and wastes space.', built: 'A 3D container-load optimizer with a natural-language interface and a live 3D view. It plans a load in minutes.', slug: 'cargo-loader' },
      { name: 'ISF Junicorn', problem: 'Selected among the top early-stage ventures from dozens of countries.', built: 'Finalist, ISF Junicorn Competition, Dubai.' },
    ],
  },
];

// ── The wider body of work ────────────────────────────────────────────────

export const DOMAINS = ['Supply chain', 'IT ops', 'Finance', 'Retail', 'Security', 'Productivity'] as const;
export type Domain = (typeof DOMAINS)[number];
export type IndexItem = { name: string; line: string; domain: Domain; stack: string[]; slug: string };

// Stacks from the brief, the résumé and each project's repo manifests.
export const INDEX: IndexItem[] = [
  { name: 'ITSM', line: 'Endpoint fleet management for 554 machines across 17 sites', domain: 'IT ops', stack: ['Go', 'PostgreSQL', 'Next.js'], slug: 'itsm' },
  { name: 'Aether', line: 'Meetings, chat and calling; an in-house Microsoft Teams', domain: 'Productivity', stack: ['Go', 'WebRTC', 'AV1 / Opus'], slug: 'aether' },
  { name: 'Velocity', line: 'Visual analytics canvas that replaces Alteryx Designer', domain: 'Productivity', stack: ['Python', 'DuckDB', 'React Flow'], slug: 'velocity' },
  { name: 'Recon OS', line: 'Marketplace reconciliation that verifies every charge', domain: 'Finance', stack: ['Python', 'Temporal', 'PostgreSQL'], slug: 'recon-os' },
  { name: 'Demand Forecasting', line: 'Probable demand ranges for ~21,000 SKUs', domain: 'Supply chain', stack: ['Python', 'LightGBM'], slug: 'demand-forecasting' },
  { name: 'Reorder Automation', line: 'Forecasts into purchase and production orders', domain: 'Supply chain', stack: ['Python'], slug: 'reorder-automation' },
  { name: 'Asset Vault', line: 'Digital asset management with search inside PDF and Office files', domain: 'Retail', stack: ['NestJS', 'PostgreSQL', 'Prisma', 'BullMQ', 'Redis'], slug: 'asset-vault' },
  { name: 'PriceLens', line: 'Finds the exact same SKU across three of India’s fashion giants, with the price gap and a confidence score', domain: 'Retail', stack: ['Next.js', 'Fastify', 'Node.js', 'Redis', 'Docker'], slug: 'pricelens' },
  { name: 'Spykar IQ', line: 'One view of stock for a national apparel chain, queried in plain language', domain: 'Retail', stack: ['Next.js', 'Express', 'PostgreSQL', 'SQL Server', 'Gemini'], slug: 'spykar-iq' },
  { name: 'B2B Dealer Portal', line: 'Kept channel-partner orders flowing during Salesforce B2B maintenance', domain: 'Supply chain', stack: ['Node.js', 'Express', 'PostgreSQL', 'SQL Server'], slug: 'b2b-dealer-portal' },
  { name: 'WhatsApp Marketing Platform', line: 'An in-house replacement for Salesforce Marketing Cloud', domain: 'Retail', stack: ['Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Baileys'], slug: 'whatsapp-marketing' },
  { name: 'Sonar', line: 'Every WhatsApp order message in one auditable intake feed', domain: 'Supply chain', stack: ['Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Baileys'], slug: 'sonar' },
  { name: 'Cafeteria Management', line: 'Face-reader scans become recorded meals across four cafeterias', domain: 'Productivity', stack: ['React', 'Express', 'PostgreSQL', 'TypeScript'], slug: 'cafeteria' },
  { name: 'HikCentral', line: 'Searchable gate-access history, mirrored into Postgres', domain: 'Security', stack: ['Express', 'PostgreSQL', 'nginx', 'Docker'], slug: 'hikcentral' },
  { name: 'PDFForge', line: '36 self-hosted PDF tools with zero retention', domain: 'Security', stack: ['FastAPI', 'Celery', 'Redis', 'OCRmyPDF', 'React'], slug: 'pdfforge' },
  { name: 'Nexus', line: 'IT asset lifecycle management: assign, return, scrap, with role-based access', domain: 'IT ops', stack: ['React', 'TypeScript', 'Node.js', 'Supabase'], slug: 'nexus' },
  { name: 'Voice Flow', line: 'System-wide dictation for macOS and Windows', domain: 'Productivity', stack: ['Rust', 'Tokio', 'WebSockets', 'SQLite'], slug: 'voice-flow' },
  { name: '3D Cargo Loader Pro', line: 'Container loads planned in minutes, in a live 3D view', domain: 'Supply chain', stack: ['React', 'Three.js', 'Express', 'PostgreSQL', 'Prisma'], slug: 'cargo-loader' },
];

// ── Capabilities ──────────────────────────────────────────────────────────

export const LANGUAGES = ['Python', 'Go', 'TypeScript', 'JavaScript', 'C', 'C++', 'SQL', 'Bash'];

export const ORBITS = [
  { name: 'AI / ML', tools: ['PyTorch', 'TensorFlow', 'scikit-learn', 'LightGBM', 'HuggingFace', 'PEFT (QLoRA / LoRA)', 'vLLM', 'LangChain', 'LangGraph', 'LlamaIndex', 'FAISS', 'RAG', 'Claude / Gemini / OpenAI APIs', 'Claude Code', 'OpenAI Codex', 'Google Antigravity'] },
  { name: 'Backend', tools: ['FastAPI', 'Flask', 'NestJS', 'Node.js', 'Express', 'Go net/http', 'REST', 'GraphQL', 'WebSockets', 'WebRTC', 'Celery', 'BullMQ', 'Temporal', 'JWT', 'OAuth 2.0', 'Argon2id'] },
  { name: 'Data', tools: ['PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DuckDB', 'Delta Lake', 'MinIO / S3', 'Spark', 'Trino', 'Airflow', 'Kafka', 'Debezium', 'Superset', 'Power BI'] },
  { name: 'Frontend', tools: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'React Flow', 'ECharts'] },
  { name: 'Infrastructure', tools: ['Docker', 'Docker Compose', 'nginx', 'GitHub Actions', 'AWS (EC2, S3)', 'Linux', 'Windows Services', 'Wireshark'] },
];

export const RECOGNITION = [
  { label: 'Finalist', title: 'ISF Junicorn Competition', detail: 'Dubai. Selected among the top early-stage ventures from dozens of countries, for 3D Cargo Loader Pro.' },
  { label: 'Education', title: 'B.Tech, Electronics & Communication Engineering', detail: 'LNMIIT Jaipur · 2024 – 2028' },
];
