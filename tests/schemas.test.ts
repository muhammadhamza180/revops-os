import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

describe('JSON Webhook Schemas Validation', () => {
  let ajv: Ajv;
  const schemasDir = path.join(__dirname, '../webhooks/schemas');

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
  });

  test('should validate lead-ingestion.schema.json with valid payload', () => {
    const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'lead-ingestion.schema.json'), 'utf8'));
    const validate = ajv.compile(schema);

    const validPayload = {
      source: 'web_funnel',
      contact: {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+15550199001',
        email: 'john.doe@example.com',
      },
      property: {
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        asking_price: 350000,
        estimated_arv: 450000,
        seller_urgency: 'high_30d',
      },
    };

    const isValid = validate(validPayload);
    expect(isValid).toBe(true);
  });

  test('should reject lead-ingestion payload with missing required fields', () => {
    const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'lead-ingestion.schema.json'), 'utf8'));
    const validate = ajv.compile(schema);

    const invalidPayload = {
      source: 'web_funnel',
      // missing contact and property
    };

    const isValid = validate(invalidPayload);
    expect(isValid).toBe(false);
  });

  test('should validate tc-handoff.schema.json with valid payload', () => {
    const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'tc-handoff.schema.json'), 'utf8'));
    const validate = ajv.compile(schema);

    const validPayload = {
      deal_id: 'deal_123',
      deal_type: 'wholesale_assignment',
      seller_contact: {
        first_name: 'Alice',
        phone: '+15550199002',
        email: 'alice@example.com',
      },
      purchase_price: 250000,
      contract_date: '2026-09-02',
      closing_date: '2026-09-23',
      document_links: {
        executed_purchase_agreement: 'https://storage.example.com/psa_123.pdf',
      },
    };

    const isValid = validate(validPayload);
    expect(isValid).toBe(true);
  });

  test('should validate dispo-reblast.schema.json with valid payload', () => {
    const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'dispo-reblast.schema.json'), 'utf8'));
    const validate = ajv.compile(schema);

    const validPayload = {
      deal_id: 'deal_123',
      reason: 'emd_timeout_breach',
      target_tier: 'TIER_2_HOT',
      deal_packet: {
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        asking_price: 275000,
        estimated_arv: 450000,
        packet_url: 'https://storage.example.com/packet_123.pdf',
      },
    };

    const isValid = validate(validPayload);
    expect(isValid).toBe(true);
  });
});
