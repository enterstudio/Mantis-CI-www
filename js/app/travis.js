define([
  'jquery',
  'ember',
  'app/utils',
  'app/app',
  'jquery-cookie'
], function ($, Ember, utils, App) {
  "use strict";

  var bootstrap = function () {

    // handle error
    Ember.onerror = function (error) {
      utils.error('Ember Error:');
      utils.logObject(error);
    };

    Ember.RecordArray.reopen({
      _replace         : function (index, removedCount, records) {
        var record, _i, _len;
        if (!this.bufferedRecords) {
          this.bufferedRecords = [];
        }
        if (!this.get('content')) {
          for (_i = 0, _len = records.length; _i < _len; _i++) {
            record = records[_i];
            if (!this.bufferedRecords.contains(record)) {
              this.bufferedRecords.pushObject(record);
            }
          }
          records = [];
        }
        if (removedCount || records.length) {
          return this._super(index, removedCount, records);
        }
      },
      contentDidChange : function () {
        var content, record, _i, _len, _ref;
        if ((content = this.get('content')) && this.bufferedRecords && this.bufferedRecords.length) {
          _ref = this.bufferedRecords;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            record = _ref[_i];
            if (!content.contains(record)) {
              content.pushObject(record);
            }
          }
          this.bufferedRecords = [];
        }
      }.observes('content')
    });

    //>>excludeStart('distBuildExclude', pragmas.distBuildExclude);
    // Ember.LOG_BINDINGS = true;
    //>>excludeEnd('distBuildExclude');

    // jQuery ready - DOM loaded
    $(document).ready(function () {
      if (window.device) {
        // bind click events for anchor[rel=external] elements to redirect to PhoneGap InAppBrowser syntax
        $(document).on('click', 'a[rel=external]', function () {
          utils.debug('click handler on devices fired for: ' + $(this).attr('href'));
          window.open($(this).attr('href'), '_system');
          return false;
        });
      }
      //kickstart the Ember app
      utils.debug('travis::bootstrap:> calling App.start');
      App.start();
    });

  };

  return { bootstrap : bootstrap };
});
