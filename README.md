# ampersand-grouped-collection-view

Renders a collection of items that are clustered in groups, such as how chat messages can be displayed grouped by sender.

<!-- starthide -->
Part of the [Ampersand.js toolkit](http://ampersandjs.com) for building clientside applications.

<!-- endhide -->

## Install

```sh
npm install ampersand-grouped-collection-view
```

## Example

```javascript
var GroupedCollectionView = require('ampersand-grouped-collection-view');


var view = new GroupedCollectionView({
    itemView: View.extend({
        template: '<div><p role="message-body"></p><span role="message-timestamp"><span></div>',
        bindings: {
            'model.body': {
                type: 'text'
                role: 'message-body'
            },
            'model.timestamp': {
                type: 'text',
                role: 'message-timestamp'
            }
        }
    }),
    groupView: View.extend({
        template: '<div><img role="contact-avatar"/><ul role="messages"></ul></div>',
        bindings: {
            'model.avatar': {
                type: 'attribute',
                name: 'src',
                role: 'contact-avatar'
            }
        },
        render: function () {
            this.renderWithTemplate();
            // The `groupEl` property is special for group views. If provided, item
            // views will be appended there instead of on the root element for the
            // group view.
            this.cacheElements({
                groupEl: '[role=messages]'
            });
        }
    }),
    groupsWith: function (model, prevModel) {
        // Used to determine when a new group is needed.
        // Return `true` if `model` belongs to the same group
        // as `prevModel`.
        return model.sender.id === prevModel.sender.id;
    },
    prepareGroup: function (model) {
        // Prepare a Group model based on the Item model
        // that triggered the group's creation.
        return model.sender; 
    }
});
```
