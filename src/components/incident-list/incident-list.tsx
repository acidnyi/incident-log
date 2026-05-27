import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Configuration, IncidentLogApi, Incident } from '../../api/incident-log';

@Component({
  tag: 'incident-list',
  styleUrl: 'incident-list.css',
  shadow: true,
})
export class IncidentList {
  @Event({ eventName: 'entry-clicked' })
  entryClicked!: EventEmitter<string>;

  @Event({ eventName: 'new-entry-clicked' })
  newEntryClicked!: EventEmitter<void>;

  @Prop() apiBase: string = '/api';

  @State() incidents: Incident[] = [];
  @State() errorMessage?: string;
  @State() isLoading = false;

  private getApi(): IncidentLogApi {
    return new IncidentLogApi(
      new Configuration({
        basePath: this.apiBase,
      }),
    );
  }

  private async getIncidentsAsync(): Promise<Incident[]> {
    this.isLoading = true;

    try {
      const response = await this.getApi().getIncidentsRaw();

      if (response.raw.status < 299) {
        return await response.value();
      }

      this.errorMessage = `Cannot retrieve list of incidents: ${response.raw.statusText}`;
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of incidents: ${err.message || 'unknown'}`;
    } finally {
      this.isLoading = false;
    }

    return [];
  }

  private async solveIncident(incident: Incident, event: MouseEvent) {
    event.stopPropagation();

    const updatedIncident: Incident = {
      ...incident,
      status: 'Uzatvorený' as any,
    };

    try {
      const response = await this.getApi().updateIncidentRaw({
        incidentId: incident.id,
        incident: updatedIncident,
      });

      if (response.raw.status < 299) {
        this.incidents = this.incidents.map(item =>
          item.id === incident.id ? updatedIncident : item,
        );
      }
    } catch (err: any) {
      this.errorMessage = `Nie je možné uzatvoriť incident: ${err.message || 'unknown'}`;
    }
  }

  private async deleteIncident(id: string, event: MouseEvent) {
    event.stopPropagation();

    if (!confirm('Naozaj chcete zmazať tento incident?')) {
      return;
    }

    try {
      const response = await this.getApi().deleteIncidentRaw({
        incidentId: id,
      });

      if (response.raw.status < 299) {
        this.incidents = this.incidents.filter(incident => incident.id !== id);
      }
    } catch (err: any) {
      this.errorMessage = `Nie je možné zmazať incident: ${err.message || 'unknown'}`;
    }
  }

  async componentWillLoad() {
    this.incidents = await this.getIncidentsAsync();
  }

  private severityClass(severity?: string): string {
    return `badge severity-${(severity || 'unknown').toLowerCase().replace(/\s+/g, '-')}`;
  }

  private statusClass(status?: string): string {
    return `badge status-${(status || 'unknown').toLowerCase().replace(/\s+/g, '-')}`;
  }

  render() {
    return (
      <Host>
        <section class="page-header">
          <div>
            <p class="eyebrow">Nemocničný bezpečnostný denník</p>
            <h2>Hlásenie incidentov a bezpečnostných udalostí</h2>
          </div>

          <md-filled-button onClick={() => this.newEntryClicked.emit()}>
            <md-icon slot="icon">add</md-icon>
            Nový incident
          </md-filled-button>
        </section>

        {this.errorMessage ? (
          <div class="error">{this.errorMessage}</div>
        ) : this.isLoading ? (
          <div class="empty">Načítavam incidenty...</div>
        ) : this.incidents.length === 0 ? (
          <div class="empty">
            <md-icon>verified</md-icon>
            <h3>Žiadne incidenty</h3>
            <p>Zatiaľ nebol nahlásený žiadny incident.</p>
          </div>
        ) : (
          <div class="incident-grid">
            {this.incidents.map(incident => (
              <article
                class="incident-card"
                onClick={() => this.entryClicked.emit(incident.id)}
              >
                <div class="card-icon">
                  <md-icon>report</md-icon>
                </div>

                <div class="card-content">
                  <div class="card-topline">
                    <span>{incident.id}</span>
                    <span>{new Date(incident.occurredAt).toLocaleString()}</span>
                  </div>

                  <h3>{incident.incidentType || 'Neurčený typ incidentu'}</h3>

                  <div class="badges">
                    <span class={this.severityClass(incident.severity)}>
                      {incident.severity}
                    </span>
                    <span class={this.statusClass(incident.status)}>
                      {incident.status}
                    </span>
                  </div>

                  <div class="incident-details">
                    <div>
                      <strong>Miesto</strong>
                      <span>{incident.location || 'Neuvedené'}</span>
                    </div>
                    <div>
                      <strong>Prílohy</strong>
                      <span>{incident.attachments?.join(', ') || 'Bez príloh'}</span>
                    </div>
                    <div class="full-width">
                      <strong>Popis udalosti</strong>
                      <span>{incident.description || 'Bez popisu'}</span>
                    </div>
                    <div class="full-width">
                      <strong>Poznámky</strong>
                      <span>{incident.notes || 'Bez poznámok'}</span>
                    </div>
                  </div>
                </div>

                <div class="card-actions">
                  <md-filled-tonal-button
                    onClick={(event: MouseEvent) => this.solveIncident(incident, event)}
                  >
                    <md-icon slot="icon">task_alt</md-icon>
                    Vyriešiť
                  </md-filled-tonal-button>

                  <md-filled-button
                    class="delete-button"
                    onClick={(event: MouseEvent) => this.deleteIncident(incident.id, event)}
                  >
                    <md-icon slot="icon">delete</md-icon>
                    Zmazať
                  </md-filled-button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Host>
    );
  }
}