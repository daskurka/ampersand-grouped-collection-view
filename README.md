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
var View = require('ampersand-view');
var GroupedCollectionView = require('ampersand-grouped-collection-view');


var view = new GroupedCollectionView({
    el: someDOMElement,
    collection: messagesCollection,

    itemView: View.extend({
        template: '<div><p data-hook="msg-body"></p><span data-hook="msg-time"><span></div>',
        bindings: {
            'model.body': {
                type: 'text'
                hook: 'msg-body'
            },
            'model.timestamp': {
                type: 'text',
                hook: 'msg-time'
            }
        }
    }),
    groupView: View.extend({
        template: '<div><img data-hook="avatar"/><ul data-hook="messages"></ul></div>',
        bindings: {
            'model.avatar': {
                type: 'attribute',
                name: 'src',
                hook: 'avatar'
            }
        },
        render: function () {
            this.renderWithTemplate();
            // The `groupEl` property is special for group views. If provided, item
            // views will be appended there instead of on the root element for the
            // group view.
            this.cacheElements({
                groupEl: '[data-hook=messages]'
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
