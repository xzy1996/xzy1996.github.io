---
layout: archive
title: "Patents"
permalink: /patents/
author_profile: true
---

<div class="wordwrap"><font color="#FF0000"><strong>My patent can be found in the</strong></font> <a href="https://pss-system.cponline.cnipa.gov.cn/conventionalSearch" target="_blank"><strong>patent search section of the State Intellectual Property Office of China</strong>.</a></div>

{% include base_path %}
{% capture written_Degree_of_participation %}'None'{% endcapture %}
{% for post in site.patents reversed %}
  {% if post.participation == 'Principal Inventor' %}
  <p>{% capture Degree_of_participation %}{{ post.participation }}{% endcapture %}
  {% if Degree_of_participation != written_Degree_of_participation %}
    <font color="#000000" ><strong>{{ Degree_of_participation }}</strong></font>
  {% capture written_Degree_of_participation %}{{ Degree_of_participation }}{% endcapture %}
  {% endif %}</p>
  {% include archive-single.html %}
  {% endif %}
{% endfor %}
