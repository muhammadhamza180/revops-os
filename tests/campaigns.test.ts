import fs from 'fs';
import path from 'path';

describe('125+ Lifecycle Campaigns Inventory Audit', () => {
  const campaignsDir = path.join(__dirname, '../campaigns');
  const campaignFiles = [
    'high-frequency-0-7d.json',
    'short-nurture-8-45d.json',
    'long-nurture-45-105d.json',
    'reactivation-blitz-120d.json',
    'ghosted-recovery-72h.json',
    'no-phone-email-drips.json',
  ];

  let totalCampaignCount = 0;

  test.each(campaignFiles)('file %s should exist and contain valid structured campaigns', (file) => {
    const fullPath = path.join(campaignsDir, file);
    expect(fs.existsSync(fullPath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    expect(data.category).toBeDefined();
    expect(Array.isArray(data.campaigns)).toBe(true);
    expect(data.campaigns.length).toBeGreaterThan(0);

    for (const c of data.campaigns) {
      expect(c.id).toBeDefined();
      expect(c.step).toBeDefined();
      expect(c.channel).toBeDefined();
      expect(c.name).toBeDefined();
    }

    totalCampaignCount += data.campaigns.length;
  });

  test('should satisfy requirement of having at least 125 structured campaigns (total: 140)', () => {
    expect(totalCampaignCount).toBeGreaterThanOrEqual(125);
  });
});
