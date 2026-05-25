import { newSpecPage } from '@stencil/core/testing';
import { IncidentApp } from '../incident-app';

describe('incident-app', () => {
  it('renders editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/entry/@new`,
      components: [IncidentApp],
      html: `<incident-app base-path="/"></incident-app>`,
    });

    page.win.navigation = new EventTarget();

    const child = page.root.shadowRoot.firstElementChild;

    expect(child.tagName.toLocaleLowerCase()).toEqual('incident-editor');
  });

  it('renders list', async () => {
    const page = await newSpecPage({
      url: `http://localhost/incident-log/`,
      components: [IncidentApp],
      html: `<incident-app base-path="/incident-log/"></incident-app>`,
    });

    page.win.navigation = new EventTarget();

    const child = page.root.shadowRoot.firstElementChild;

    expect(child.tagName.toLocaleLowerCase()).toEqual('incident-list');
  });
});