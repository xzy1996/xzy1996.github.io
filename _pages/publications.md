---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if site.author.googlescholar %}
  <div class="wordwrap"><strong>You can also find my articles on</strong> <a href="{{site.author.googlescholar}}" target="_blank"><strong>my Google Scholar profile</strong></a>{: .colorchangeonly}.</div>
{% endif %}

------

{% include base_path %}
{% capture written_year %}'None'{% endcapture %}
{% for post in site.publications reversed %}
  <p>{% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
  {% if year != written_year %}
    <h2 id="{{ year | slugify }}"><font color="#000000" ><strong>{{ year }}</strong></font></h2>
  {% capture written_year %}{{ year }}{% endcapture %}
  {% endif %}</p>
  {% include archive-single.html %}
{% endfor %}
