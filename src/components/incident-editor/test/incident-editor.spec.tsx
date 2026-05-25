import { newSpecPage } from '@stencil/core/testing';
import { IncidentEditor } from '../incident-editor';
import fetchMock from 'jest-fetch-mock';
import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
} from '../../../api/incident-log';

describe('incident-editor', () => {
  const sampleEntry: Incident = {
    id: 'INC-001',
    incidentType: 'Bezpečnostná udalosť',
    location: 'Urgentný príjem',
    occurredAt: new Date('2038-12-24T10:05:00.000Z'),
    description: 'Neoprávnený vstup do vyhradenej zóny.',
    severity: IncidentSeverity.Vysok,
    status: IncidentStatus.Nov,
    attachments: ['kamera-zaznam.mp4'],
    investigationReport: '',
    notes: 'Incident čaká na preverenie.',
  };

  const sampleIncidentTypes: IncidentType[] = [
    {
      code: 'security-breach',
      value: 'Bezpečnostná udalosť',
      typicalSeverity: IncidentSeverity.Vysok,
      description: 'Neoprávnený vstup alebo porušenie bezpečnostných pravidiel.',
    },
    {
      code: 'technical-incident',
      value: 'Technický incident',
      typicalSeverity: IncidentSeverity.Stredn,
      description: 'Výpadok alebo porucha technického zariadenia.',
    },
  ];

  const delay = async (milliseconds: number) =>
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), milliseconds);
    });

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('buttons shall be of different type', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleIncidentTypes), { status: 200 }],
    );

    const page = await newSpecPage({
      components: [IncidentEditor],
      html: `<incident-editor entry-id="INC-001" api-base="http://sample.test/api"></incident-editor>`,
    });

    await delay(300);
    await page.waitForChanges();

    let items: any = page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);

    items = page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(1);

    items = page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
  });

  it('first text field is incident id', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleIncidentTypes), { status: 200 }],
    );

    const page = await newSpecPage({
      components: [IncidentEditor],
      html: `<incident-editor entry-id="INC-001" api-base="http://sample.test/api"></incident-editor>`,
    });

    await delay(300);
    await page.waitForChanges();

    const items: any = page.root.shadowRoot.querySelectorAll('md-filled-text-field');

    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].getAttribute('value')).toEqual(sampleEntry.id);
  });
});