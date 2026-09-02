import { routeDealByType } from '../webhooks/handlers/deal-router';
import { DealType } from '../webhooks/handlers/types';

describe('5 Deal-Type Routing Switchboard', () => {
  const dealTypes: DealType[] = [
    'wholesale_assignment',
    'novation',
    'creative_finance',
    'retail_mls',
    'joint_venture',
  ];

  test.each(dealTypes)('should correctly route %s with required slots and task chain', (type) => {
    const route = routeDealByType(type);
    expect(route.dealType).toBe(type);
    expect(route.pipelineId).toBeDefined();
    expect(route.targetClosingDays).toBeGreaterThan(0);
    expect(route.requiredDocumentSlots.length).toBeGreaterThanOrEqual(4);
    expect(route.initialTasks.length).toBeGreaterThanOrEqual(3);
  });

  test('should assign 21-day timeline to wholesale assignment', () => {
    const route = routeDealByType('wholesale_assignment');
    expect(route.targetClosingDays).toBe(21);
    expect(route.requiredDocumentSlots).toContain('assignment_agreement_buyer');
  });

  test('should assign 60-day timeline to novation', () => {
    const route = routeDealByType('novation');
    expect(route.targetClosingDays).toBe(60);
    expect(route.requiredDocumentSlots).toContain('limited_power_of_attorney');
  });

  test('should assign 30-day timeline and loan servicing to creative finance', () => {
    const route = routeDealByType('creative_finance');
    expect(route.targetClosingDays).toBe(30);
    expect(route.requiredDocumentSlots).toContain('subject_to_addendum');
  });
});
