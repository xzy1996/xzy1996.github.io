---
layout: archive
title: "Patents"
permalink: /patents/
author_profile: true
---

<div class="wordwrap"><font color="#FF0000"><strong>My patent can be found in the</strong></font> <a href="https://pss-system.cponline.cnipa.gov.cn/conventionalSearch" target="_blank"><strong>patent search section of the State Intellectual Property Office of China</strong>.</a></div>

{% include base_path %}

{% for post in site.patents reversed %}
  {% include archive-single.html %}
{% endfor %}
