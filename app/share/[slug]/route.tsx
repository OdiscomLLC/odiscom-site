import { ImageResponse } from "next/og";
import { services } from "@/lib/services";

const cards: Record<string, { title: string; label: string; detail: string }> = {
  company: { title: "Site acquisition.\nEngineering.\nConstruction.", label: "THE ODISCOM TEAM", detail: "Fiber / OSP · Wireless & DAS · Network facilities" },
  projects: { title: "The work behind\nour capabilities.", label: "SELECTED PROJECT EXPERIENCE", detail: "TDS · Zayo · AmeriCloud · Horrocks · Stratis · SQUAN · D4" },
  das: { title: "Engineering\nfor indoor\ncoverage.", label: "AMERICLOUD DAS PROJECTS", detail: "Municipal · Government · Commercial facilities" },
  about: { title: "Engineering experience.\nA broader\ndelivery team.", label: "ABOUT ODISCOM", detail: "Established 2015 · League City, Texas" },
  ...Object.fromEntries(Object.entries(services).map(([slug, service]) => [slug, { title: service.name, label: "ODISCOM SERVICES", detail: service.headline }])),
};

export const dynamic = "force-static";
export function generateStaticParams() { return Object.keys(cards).map(slug => ({ slug })); }

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = cards[slug];
  if (!card) return new Response("Not found", { status: 404 });
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", background: "#0f3f3b", color: "white", fontFamily: "sans-serif", position: "relative", padding: "52px 64px", flexDirection: "column" }}>
    <div style={{ position: "absolute", right: -110, top: -110, width: 500, height: 500, border: "2px solid #427b75", borderRadius: "50%", display: "flex" }} />
    <div style={{ position: "absolute", right: -30, top: -30, width: 340, height: 340, border: "2px solid #427b75", borderRadius: "50%", display: "flex" }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ fontSize: 38, fontWeight: 700, letterSpacing: 4 }}>ODISCOM</div><div style={{ fontSize: 20, color: "#c1e9df" }}>odiscom.com</div></div>
    <div style={{ display: "flex", marginTop: 40, fontSize: 16, letterSpacing: 3, color: "#9ce4d2" }}>{card.label}</div>
    <div style={{ display: "flex", marginTop: 20, maxWidth: 980, fontSize: card.title.length > 45 ? 62 : 72, fontWeight: 700, lineHeight: 1.08, whiteSpace: "pre-wrap", letterSpacing: -2 }}>{card.title}</div>
    <div style={{ display: "flex", marginTop: "auto", paddingTop: 24, borderTop: "1px solid #427b75", fontSize: 22, color: "#d4e9e3" }}>{card.detail}</div>
    <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 8, display: "flex", background: "#78d9bf" }} />
  </div>, { width: 1200, height: 630 });
}
