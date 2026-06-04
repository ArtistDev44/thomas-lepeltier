---
title: "Annexe des compte-rendus"
date: Last Modified
layout: "page.njk"
permalink: "/comptes-rendus/index.html"
---

<ol>
{%- for rapport in collections.Rapports -%}
  <li><a href="{{ rapport.data.permalink }}">{{ rapport.data.title }} - {{rapport.data.date.toLocaleString( undefined, { year: 'numeric' })}}</a></li>
  <div class="tags-container">
    {% for tag in rapport.data.tags %}
      <a href="/{{ tag | slugify }}"><span slot="tag" class="button">{{ tag }}</span>
      </a>
{% endfor %}
  </div>
{%- endfor -%}
</ol>
