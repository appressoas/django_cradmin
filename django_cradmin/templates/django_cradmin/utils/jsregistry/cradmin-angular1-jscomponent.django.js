{% comment %}
angular.module("{{ me.get_angularjs_appname }}", {{ me.get_angularjs_modules_json|safe }});
angular.bootstrap(document.querySelector("{{ me.get_target_domelement_selector }}"), ["{{ me.get_angularjs_appname }}"]);
{% endcomment %}
angular.bootstrap(document.querySelector("{{ me.get_target_domelement_selector }}"), {{ me.get_angularjs_modules_json|safe }});
