var _ = require('underscore');
var View = require('ampersand-view');


module.exports = View.extend({
    template: '<div></div>',

    initialize: function (spec) {
        this.itemView = spec.itemView;
        this.itemViewOptions = spec.itemViewOptions || {};
        this.groupView = spec.groupView;
        this.groupViewOptions = spec.groupViewOptions || {};
        this.groupsWith = spec.groupsWith;
        this.prepareGroup = spec.prepareGroup;
        this.template = spec.template || this.template;

        this.collection = spec.collection;

        this.listenTo(this.collection, 'add', this.addViewForModel);
        this.listenTo(this.collection, 'sort', this.renderAll);
        this.listenTo(this.collection, 'remove', this.renderAll);
        this.listenTo(this.collection, 'refresh reset', this.renderAll);

        this.currentGroup = null;
        this.lastModel = null;
    },

    render: function () {
        this.renderWithTemplate();
        this.renderAll();
        return this;
    },

    addViewForModel: function (model) {
        if (!this.rendered) {
            return;
        }

        if (model === this.lastModel) {
            return;
        }

        if (!this.currentGroup || !this.lastModel || !this.groupsWith(model, this.lastModel)) {
            var group = new this.groupView(_({
                model: this.prepareGroup(model)
            }).extend(this.groupViewOptions));
            group.render();
            this.el.appendChild(group.el);
            this.currentGroup = group;
        }

        var view = new this.itemView(_({
            containerEl: this.currentGroup.containerEl,
            model: model
        }).extend(this.itemViewOptions));
        view.render();

        var groupEl = this.currentGroup.groupEl || this.currentGroup.el;
        groupEl.appendChild(view.el);
        this.lastModel = model;
    },

    renderAll: function () {
        var self = this;

        this.lastModel = null;
        this.currentGroup = null;

        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }

        this.collection.each(function (model) {
            self.addViewForModel(model);
        });
    }
});
