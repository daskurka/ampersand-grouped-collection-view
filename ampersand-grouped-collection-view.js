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

        this.itemViews = [];
        this.groupViews = [];

        this.listenTo(this.collection, 'add', this.addViewForModel);
        this.listenTo(this.collection, 'sort', this.renderAll);
        this.listenTo(this.collection, 'remove', this.renderAll);
        this.listenTo(this.collection, 'refresh reset', this.renderAll);

        this.currentGroup = null;
        this.currentGroupView = null;
        this.lastModel = null;
    },

    remove: function () {
        this.removeAllViews();
        View.prototype.remove.call(this);
    },

    removeAllViews: function () {
        _.invoke(this.itemViews, 'remove');
        _.invoke(this.groupViews, 'remove');
        this.itemViews = [];
        this.groupViews = [];
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

        if (!this.currentGroup || !this.lastModel || !this.groupsWith(model, this.lastModel, this.currentGroup)) {
            var group = this.prepareGroup(model, this.currentGroup);
            var groupView = new this.groupView(_({
                model: group
            }).extend(this.groupViewOptions));
            groupView.render();
            this.el.appendChild(groupView.el);
            this.currentGroup = group;
            this.currentGroupView = groupView;
            this.groupViews.push(groupView);
        }

        var view = new this.itemView(_({
            containerEl: this.currentGroupView.containerEl,
            model: model
        }).extend(this.itemViewOptions));
        view.render();
        this.itemViews.push(view);

        var groupEl = this.currentGroupView.groupEl || this.currentGroupView.el;
        groupEl.appendChild(view.el);
        this.lastModel = model;
    },

    renderAll: function () {
        var self = this;

        this.lastModel = null;
        this.currentGroup = null;
        this.currentGroupView = null;

        this.removeAllViews();

        this.collection.each(function (model) {
            self.addViewForModel(model);
        });
    }
});
