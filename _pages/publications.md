---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if site.author.googlescholar %}
  <div class="wordwrap"><font color="#FF0000"><strong>You can also find my articles on</strong></font> <a href="{{site.author.googlescholar}}" target="_blank"><strong>my Google Scholar profile</strong></a>.</div>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
