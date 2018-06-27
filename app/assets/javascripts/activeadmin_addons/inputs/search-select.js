$(function() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  function applyAndNew(constructor, args) {
    function partial() {
      return constructor.apply(this, args);
    }
    if (typeof constructor.prototype === 'object') {
      partial.prototype = Object.create(constructor.prototype);
    }
    return partial;
  }

  // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
  function Template(template) {
    this.template = template;
  }

  Template.prototype.interpolate = function(params) {
    var names = Object.keys(params);
    var vals = Object.values(params);
    names.push('return `' + this.template + '`;');
    var generator = applyAndNew(Function, names);
    var func = generator();
    return func.apply(null, vals);
  };

  setupSearchSelect(document);

  $(document).on('has_many_add:after', function(event, container) {
    setupSearchSelect(container);
  });

  function setupSearchSelect(container) {
    $('.search-select-input, .search-select-filter-input, ajax-filter-input', container).each(function(i, el) {
      var element = $(el);
      var url = element.data('url');
      var fields = element.data('fields');
      var predicate = element.data('predicate');
      var displayName = element.data('display-name');
      var width = element.data('width');
      var responseRoot = element.data('response-root');
      var minimumInputLength = element.data('minimum-input-length');
      var order = element.data('order');
      var displayNameTemplateText = element.data('display-name-template');
      var displayTemplate;
      var displayTemplateSpecified = false;
      if (displayNameTemplateText.length > 0) {
        displayTemplate = new Template(displayNameTemplateText);
        displayTemplateSpecified = true;
      }
      var ransackScope = element.data('ransack-scope');
      var ransackScopeSpecified = false;
      if (ransackScope.length > 0) {
        ransackScopeSpecified = true;
      }

      var selectOptions = {
        width: width,
        minimumInputLength: minimumInputLength,
        placeholder: '',
        allowClear: true,
        ajax: {
          url: url,
          dataType: 'json',
          delay: 250,
          cache: true,
          data: function(params) {
            var query = { order: order };
            if (ransackScopeSpecified) {
              query.q = {};
              query.q[ransackScope] = params.term;
            } else {
              var textQuery = { m: 'or' };
              fields.forEach(function(field) {
                if (field == 'id') {
                  textQuery[field + '_eq'] = params.term;
                } else {
                  textQuery[field + '_' + predicate] = params.term;
                }
              });

              query.q = {
                groupings: [textQuery],
                combinator: 'and',
              };
            }

            return query;
          },
          processResults: function(data) {
            if (data.constructor == Object) {
              data = data[responseRoot];
            }

            return {
              results: jQuery.map(data, function(resource) {
                if (displayTemplateSpecified) {
                  resource[displayName] = displayTemplate.interpolate(resource);
                } else if (!resource[displayName]) {
                  resource[displayName] = 'No display name for id #' + resource.id.toString();
                }
                return {
                  id: resource.id,
                  text: resource[displayName].toString(),
                };
              }),
            };
          },
        },
      };

      $(el).select2(selectOptions);
    });
  }
});
