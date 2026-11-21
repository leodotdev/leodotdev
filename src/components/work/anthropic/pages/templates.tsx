import { AboutDoc } from "@/components/work/anthropic/pages/templates/about"
import { CareersDoc } from "@/components/work/anthropic/pages/templates/careers"
import { NewsDoc } from "@/components/work/anthropic/pages/templates/news"
import { ModelDoc } from "@/components/work/anthropic/pages/templates/model"
import { ThreatIntelligenceDoc } from "@/components/work/anthropic/pages/templates/threat-intelligence"
import { EconomicFuturesDoc } from "@/components/work/anthropic/pages/templates/economic-futures"

// The Templates chapters of the Anthropic.com docs: whole pages of the site,
// built live from the organisms, one file each in ./templates/.

export const TEMPLATES: Record<string, () => React.ReactNode> = {
  about: AboutDoc,
  careers: CareersDoc,
  news: NewsDoc,
  model: ModelDoc,
  "threat-intelligence": ThreatIntelligenceDoc,
  "economic-futures": EconomicFuturesDoc,
}
