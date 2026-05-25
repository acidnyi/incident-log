# incident-editor



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute  | Description | Type     | Default     |
| ---------------------- | ---------- | ----------- | -------- | ----------- |
| `apiBase`              | `api-base` |             | `string` | `'/api'`    |
| `entryId` _(required)_ | `entry-id` |             | `string` | `undefined` |


## Events

| Event           | Description | Type                  |
| --------------- | ----------- | --------------------- |
| `editor-closed` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [incident-app](../incident-app)

### Graph
```mermaid
graph TD;
  incident-app --> incident-editor
  style incident-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
