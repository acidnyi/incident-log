import { Component, Host, Prop, h, EventEmitter, Event } from '@stencil/core';;
import '@material/web/textfield/filled-text-field';
import '@material/web/select/filled-select';
import '@material/web/select/select-option';
import '@material/web/icon/icon';
import '@material/web/divider/divider';
import '@material/web/button/filled-button';
import '@material/web/button/filled-tonal-button';
import '@material/web/button/outlined-button';

@Component({
  tag: 'incident-editor',
  styleUrl: 'incident-editor.css',
  shadow: true,
})
export class IncidentEditor {
  @Prop() entryId!: string;

  @Prop() apiBase: string = '/api';

  @Event({ eventName: 'editor-closed' })
  editorClosed!: EventEmitter<string>;

  render() {
    return (
      <Host>
        <h2>Editor incidentu</h2>

        <div class="editor-card">
          <div class="form-grid">
            <md-filled-text-field label="Typ incidentu">
              <md-icon slot="leading-icon">report</md-icon>
            </md-filled-text-field>

            <md-filled-text-field label="Miesto vzniku">
              <md-icon slot="leading-icon">location_on</md-icon>
            </md-filled-text-field>

            <md-filled-text-field label="Dátum a čas vzniku" type="datetime-local">
              <md-icon slot="leading-icon">schedule</md-icon>
            </md-filled-text-field>

            <md-filled-select label="Úroveň závažnosti">
              <md-icon slot="leading-icon">priority_high</md-icon>
              <md-select-option value="low">
                <div slot="headline">Nízka</div>
              </md-select-option>
              <md-select-option value="medium">
                <div slot="headline">Stredná</div>
              </md-select-option>
              <md-select-option value="high">
                <div slot="headline">Vysoká</div>
              </md-select-option>
              <md-select-option value="critical">
                <div slot="headline">Kritická</div>
              </md-select-option>
            </md-filled-select>

            <md-filled-select label="Stav riešenia">
              <md-icon slot="leading-icon">task_alt</md-icon>
              <md-select-option value="new">
                <div slot="headline">Nový</div>
              </md-select-option>
              <md-select-option value="in-progress">
                <div slot="headline">V riešení</div>
              </md-select-option>
              <md-select-option value="closed">
                <div slot="headline">Uzatvorený</div>
              </md-select-option>
            </md-filled-select>

            <md-filled-text-field label="Prílohy">
              <md-icon slot="leading-icon">attach_file</md-icon>
            </md-filled-text-field>

            <md-filled-text-field class="full-width" label="Popis udalosti" type="textarea">
              <md-icon slot="leading-icon">description</md-icon>
            </md-filled-text-field>

            <md-filled-text-field class="full-width" label="Vyšetrovacia správa" type="textarea">
              <md-icon slot="leading-icon">article</md-icon>
            </md-filled-text-field>

            <md-filled-text-field class="full-width" label="Poznámky" type="textarea">
              <md-icon slot="leading-icon">notes</md-icon>
            </md-filled-text-field>
          </div>

          <md-divider></md-divider>

          <div class="actions">
            <md-filled-tonal-button
              id="delete"
              onClick={() => this.editorClosed.emit("delete")}
            >
              <md-icon slot="icon">archive</md-icon>
              Archivovať / odstrániť
            </md-filled-tonal-button>

            <span class="stretch-fill"></span>

            <md-outlined-button
              id="cancel"
              onClick={() => this.editorClosed.emit("cancel")}
            >
              Zrušiť
            </md-outlined-button>

            <md-filled-button
              id="confirm"
              onClick={() => this.editorClosed.emit("store")}
            >
              <md-icon slot="icon">save</md-icon>
              Uložiť
            </md-filled-button>
          </div>
        </div>
      </Host>
    );
  }
}
