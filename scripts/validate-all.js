const fs = require('fs');
const path = require('path');

console.log('=== Running Enterprise GHL RevOps Mesh Repository Validation ===');

const baseDir = path.join(__dirname, '..');
let errorCount = 0;

function checkFile(relPath) {
  const fullPath = path.join(baseDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${relPath}`);
    errorCount++;
    return false;
  }
  console.log(`✅ Found file: ${relPath}`);
  return true;
}

// 1. Check Core Assets & Topologies
checkFile('assets/ghl-topology.svg');

// 2. Check Blueprints
checkFile('blueprints/01-acquisitions/pipelines.json');
checkFile('blueprints/01-acquisitions/smart-lists.json');
checkFile('blueprints/01-acquisitions/scoring-automations.json');
checkFile('blueprints/02-transaction-coordination/deal-routing-trees.json');
checkFile('blueprints/02-transaction-coordination/risk-triggers.json');
checkFile('blueprints/02-transaction-coordination/document-slots.json');
checkFile('blueprints/03-dispositions/buyer-scoring.json');
checkFile('blueprints/03-dispositions/emd-countdown-sla.json');
checkFile('blueprints/03-dispositions/deal-packet-broadcast.json');

// 3. Check Campaigns & Audit Count
const campaignFiles = [
  'campaigns/high-frequency-0-7d.json',
  'campaigns/short-nurture-8-45d.json',
  'campaigns/long-nurture-45-105d.json',
  'campaigns/reactivation-blitz-120d.json',
  'campaigns/ghosted-recovery-72h.json',
  'campaigns/no-phone-email-drips.json'
];

let totalCampaigns = 0;
for (const file of campaignFiles) {
  if (checkFile(file)) {
    const data = JSON.parse(fs.readFileSync(path.join(baseDir, file), 'utf8'));
    if (data.campaigns && Array.isArray(data.campaigns)) {
      totalCampaigns += data.campaigns.length;
      console.log(`   -> ${file}: ${data.campaigns.length} campaigns`);
    }
  }
}
console.log(`📊 Total Lifecycle Campaigns: ${totalCampaigns}`);
if (totalCampaigns < 125) {
  console.error(`❌ Campaign count (${totalCampaigns}) is below required 125!`);
  errorCount++;
} else {
  console.log(`✅ Campaign inventory requirement satisfied (>= 125 campaigns).`);
}

// 4. Check Schemas & Handlers
checkFile('webhooks/schemas/lead-ingestion.schema.json');
checkFile('webhooks/schemas/lead-scoring.schema.json');
checkFile('webhooks/schemas/tc-handoff.schema.json');
checkFile('webhooks/schemas/dispo-reblast.schema.json');
checkFile('webhooks/handlers/types.ts');
checkFile('webhooks/handlers/scoring-engine.ts');
checkFile('webhooks/handlers/sla-escalation-cron.ts');
checkFile('webhooks/handlers/emd-timer-worker.ts');
checkFile('webhooks/handlers/deal-router.ts');

// 5. Check SOPs
checkFile('sops/SOP-01-SNAPSHOT-PROVISIONING.md');
checkFile('sops/SOP-02-CUSTOM-FIELDS-VALUES.md');
checkFile('sops/SOP-03-PIPELINE-ROUTING.md');
checkFile('sops/SOP-04-SMART-LISTS-QUEUES.md');
checkFile('sops/SOP-05-WEBHOOK-INTEGRATIONS.md');
checkFile('sops/SOP-06-ROLE-PERMISSIONS-ISOLATION.md');

// 6. Check Docs & Meta
checkFile('docs/ARCHITECTURE.md');
checkFile('docs/SCORING_MATHEMATICS.md');
checkFile('docs/SLA_MONITORING.md');
checkFile('README.md');
checkFile('LICENSE');
checkFile('package.json');
checkFile('tsconfig.json');

if (errorCount > 0) {
  console.error(`\n❌ Validation failed with ${errorCount} error(s).`);
  process.exit(1);
} else {
  console.log('\n🌟 All repository files and structures validated successfully!');
}
